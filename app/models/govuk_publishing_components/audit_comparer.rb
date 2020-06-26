module GovukPublishingComponents
  class AuditComparer
    attr_reader :data, :gem_data

    def initialize(gem_data, results)
      @gem_data = gem_data
      @data = sort_results(results)
      @gem_data[:components_by_application] = get_components_by_application
    end

  private

    def prettify_key(key)
      key.to_s.gsub("_", " ").capitalize
    end

    def sort_results(results)
      data = []

      results.each do |result|
        @all_stylesheets = true if result[:components_in_stylesheets].include?("all")
        @all_print_stylesheets = true if result[:components_in_print_stylesheets].include?("all")
        @all_javascripts = true if result[:components_in_javascripts].include?("all")

        components_in_templates = include_any_components_within_components(result[:components_in_templates])
        components_in_stylesheets = result[:components_in_stylesheets]
        components_in_print_stylesheets = result[:components_in_print_stylesheets]
        components_in_javascripts = result[:components_in_javascripts]
        components_in_ruby = result[:components_in_ruby]
        missing_includes = missing_includes(components_in_templates, components_in_stylesheets, components_in_print_stylesheets, components_in_javascripts, components_in_ruby)

        missing_includes = highlight_missing_issues(missing_includes)

        data << {
          name: result[:name],
          application_found: result[:application_found],
          summary: [
            {
              name: "Components in templates",
              value: components_in_templates.flatten.uniq.sort.join(', '),
            },
            {
              name: "Components in stylesheets",
              value: components_in_stylesheets.join(', '),
            },
            {
              name: "Components in print stylesheets",
              value: components_in_print_stylesheets.join(', '),
            },
            {
              name: "Components in javascripts",
              value: components_in_javascripts.join(', '),
            },
            {
              name: "Components in ruby",
              value: components_in_ruby.join(', '),
            },
          ],
          missing_includes: missing_includes,
          warning_count: count_warnings(missing_includes)
        }
      end

      data
    end

    def include_any_components_within_components(components)
      @gem_data[:components_containing_components].each do |component|
        components << component[:sub_components] if components.include?(component[:component])
      end

      components.flatten.uniq.sort
    end

    def highlight_missing_issues(results)
      results.map do |key, value|
        {
          name: prettify_key(key),
          values: check_if_component_item_exists(value, key.to_s),
        }
      end
    end

    def check_if_component_item_exists(components, filetype)
      key = "components" if filetype == "not_in_templates"

      if filetype == "not_in_stylesheets"
        key = "component_stylesheets"
        override_warning = true if @all_stylesheets
      end

      if filetype == "not_in_print_stylesheets"
        key = "component_print_stylesheets"
        override_warning = true if @all_print_stylesheets
      end

      if filetype == "not_in_javascripts"
        key = "component_javascripts"
        override_warning = true if @all_javascripts
      end

      results = []
      if key # we don't check for ruby files
        components.each do |component|
          warning = false
          warning = true if @gem_data[key.to_sym].include? component unless override_warning
          results << {
            warning: warning,
            component: component,
          }
        end
      end

      results
    end

    def missing_includes(templates, stylesheets, print_stylesheets, javascripts, ruby)
      all = (templates.clone << stylesheets.clone << print_stylesheets.clone << javascripts.clone << ruby.clone).flatten.uniq
      all = all - ["all"]

      {
        not_in_templates: find_missing(templates, all),
        not_in_stylesheets: find_missing(stylesheets, all),
        not_in_print_stylesheets: find_missing(print_stylesheets, all),
        not_in_javascripts: find_missing(javascripts, all),
      }
    end

    def find_missing(needle, haystack)
      (haystack - needle).flatten.sort
    end

    def count_warnings(missing_includes)
      count = 0
      missing_includes.each do |include|
        include[:values].each do |value|
          count += 1 if value[:warning]
        end
      end

      count
    end

    def get_components_by_application
      results = []

      @gem_data[:component_listing].each do |component|
        found_in_applications = []

        @data.each do |application|
          name = application[:name]

          application[:summary].each do |item|
            found_in_applications << name if item[:value].include?(component[:name])
          end
        end

        results << {
          component: component[:name],
          count: found_in_applications.uniq.length,
          list: found_in_applications.uniq.join(', '),
        }
      end

      results
    end
  end
end
