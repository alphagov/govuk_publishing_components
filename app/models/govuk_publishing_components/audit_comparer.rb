module GovukPublishingComponents
  class AuditComparer
    attr_reader :data, :gem_data

    def initialize(gem_data, results)
      if gem_data[:gem_found]
        @gem_data = gem_data
        @data = sort_results(results)
        @gem_data[:components_by_application] = get_components_by_application
      end
    end

  private

    def prettify_key(key)
      key.to_s.gsub("_", " ").capitalize
    end

    def sort_results(results)
      data = []

      results.each do |result|
        templates = result[:components_found].find { |c| c[:location] == "templates" }
        stylesheets = result[:components_found].find { |c| c[:location] == "stylesheets" }
        print_stylesheets = result[:components_found].find { |c| c[:location] == "print_stylesheets" }
        javascripts = result[:components_found].find { |c| c[:location] == "javascripts" }
        ruby = result[:components_found].find { |c| c[:location] == "ruby" }

        @all_stylesheets = true if stylesheets[:components].include?("all")
        @all_print_stylesheets = true if print_stylesheets[:components].include?("all")
        @all_javascripts = true if javascripts[:components].include?("all")

        templates[:components] = include_any_components_within_components(templates[:components])

        warnings = []
        warnings << warn_about_missing_components(result[:components_found])
        warnings << warn_about_missing_assets(result[:components_found])
        warnings = warnings.flatten

        data << {
          name: result[:name],
          application_found: result[:application_found],
          summary: [
            {
              name: "Components in templates",
              value: templates[:components].flatten.uniq.sort.join(", "),
            },
            {
              name: "Components in stylesheets",
              value: stylesheets[:components].join(", "),
            },
            {
              name: "Components in print stylesheets",
              value: print_stylesheets[:components].join(", "),
            },
            {
              name: "Components in javascripts",
              value: javascripts[:components].join(", "),
            },
            {
              name: "Components in ruby",
              value: ruby[:components].join(", "),
            },
          ],
          warnings: warnings,
          warning_count: warnings.length,
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

    def create_warning(component, message)
      {
        component: component,
        message: message,
      }
    end

    def find_missing_items(first_group, second_group)
      warnings = []

      first_group.each do |first|
        first_location = first[:location]

        second_group.each do |second|
          second_location = second[:location]
          second_location = "code" if %w[templates ruby].include?(second_location)
          in_current = find_missing(second[:components].clone, first[:components].clone)

          next if second[:components].include?("all")

          in_current.each do |component|
            if @gem_data.include?("component_#{second_location}".to_sym)
              warnings << create_warning(component, "Included in #{first_location} but not #{second_location}") if @gem_data["component_#{second_location}".to_sym].include?(component)
            end
          end
        end
      end

      warnings
    end

    def warn_about_missing_assets(components)
      warnings = []

      code = components.select { |c| c[:location] == "templates" || c[:location] == "ruby" }
      code = [
        {
          location: "code",
          components: code.map { |c| c[:components] }.flatten.uniq.sort,
        },
      ]
      assets = components.select { |c| c[:location] == "stylesheets" || c[:location] == "print_stylesheets" || c[:location] == "javascripts" }

      warnings << find_missing_items(code, assets)
      warnings << find_missing_items(assets, code)
      warnings.flatten
    end

    def warn_about_missing_components(results)
      warnings = []

      results.each do |result|
        location = result[:location]
        result[:components].each do |component|
          warnings << create_warning(component, "Included in #{location} but component does not exist") if component_does_not_exist(component)
        end
      end

      warnings
    end

    def component_does_not_exist(component)
      !@gem_data[:component_code].include?(component) unless component == "all"
    end

    def find_missing(needle, haystack)
      (haystack - needle).flatten.sort
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
          list: found_in_applications.uniq.join(", "),
        }
      end

      results
    end
  end
end
