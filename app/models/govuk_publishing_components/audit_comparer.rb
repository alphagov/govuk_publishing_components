module GovukPublishingComponents
  class AuditComparer
    attr_reader :applications_data, :gem_data

    def initialize(gem_data, results)
      if gem_data[:gem_found]
        @applications_using_static = %w[
          collections
          email-alert-frontend
          feedback
          finder-frontend
          frontend
          government-frontend
          info-frontend
          licence-finder
          service-manual-frontend
          smart-answers
          whitehall
        ]

        @static_data = find_static(results)
        @gem_data = gem_data
        @applications_data = sort_results(results)
        @gem_data[:components_by_application] = get_components_by_application || []
      end
    end

  private

    # find static to check for global includes, reduce false warnings
    def find_static(results)
      results.each do |result|
        if result[:name] == "static" && result[:application_found] == true
          return clean_static(result)
        end
      end

      false
    end

    # turn static data into an object so locations can be easily referenced
    # should give object of form { "templates" => [], "stylesheets" => [] }
    def clean_static(data)
      Hash[data[:components_found].map { |d| [d[:location], d[:components]] }]
    end

    def prettify_key(key)
      key.to_s.gsub("_", " ").capitalize
    end

    def sort_results(results)
      data = []

      results.each do |result|
        if result[:application_found]
          application_uses_static = @applications_using_static.include?(result[:name])
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
          warnings << warn_about_style_overrides(result[:gem_style_references])
          warnings << warn_about_jquery_references(result[:jquery_references])
          warnings << check_for_assets_already_in_static(result[:components_found]) if @static_data && application_uses_static
          warnings = warnings.flatten

          summary = [
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
          ]

          data << {
            name: result[:name],
            application_found: result[:application_found],
            uses_static: application_uses_static,
            summary: summary,
            warnings: warnings,
            warning_count: warnings.length,
            gem_style_references: result[:gem_style_references],
            jquery_references: result[:jquery_references],
          }
        else
          data << {
            name: result[:name],
            application_found: result[:application_found],
          }
        end
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

    # given two groups of components, check the difference
    def find_missing_items(first_group, second_group)
      warnings = []

      first_group.each do |first|
        first_location = first[:location]

        second_group.each do |second|
          second_location = second[:location]
          second_location = "code" if %w[templates ruby].include?(second_location)
          # subtract one group from the other, leaving only those not in both
          in_current = find_missing(second[:components].clone, first[:components].clone)

          next if second[:components].include?("all")

          # now we have a list of 'missing' component assets, check the gem to see if that asset exists
          in_current.each do |component|
            asset_in_gem = @gem_data.include?("component_#{second_location}".to_sym) && @gem_data["component_#{second_location}".to_sym].include?(component)
            check_static = @static_data && second_location != "code"
            asset_in_static = asset_already_in_static(second_location, component) if check_static
            raise_warning = asset_in_gem && !asset_in_static

            # this raises a warning if the asset exists and isn't included either in the application or static
            warnings << create_warning(component, "Included in #{first_location} but not #{second_location}") if raise_warning
          end
        end
      end

      warnings
    end

    def asset_already_in_static(location, component)
      return true if @static_data[location].include?(component)

      false
    end

    def check_for_assets_already_in_static(locations)
      warnings = []

      locations.each do |location|
        next if location[:location] == "templates" || location[:location] == "ruby"

        location[:components].each do |component|
          raise_warning = asset_already_in_static(location[:location], component)
          warnings << create_warning(component, "Included in #{location[:location]} but already included in static") if raise_warning
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

    def warn_about_style_overrides(results)
      warnings = []

      results.each do |result|
        warnings << create_warning("Possible component style override", result) if result.include? ".scss"
        warnings << create_warning("Possible hard coded component markup", result) if [".html", ".rb"].any? { |needle| result.include? needle }
      end

      warnings
    end

    def warn_about_jquery_references(results)
      warnings = []

      results.each do |result|
        warnings << create_warning("Possible jQuery", result)
      end

      warnings
    end

    def find_missing(needle, haystack)
      (haystack - needle).flatten.sort
    end

    def get_components_by_application
      results = []
      found_something = false

      @gem_data[:component_listing].each do |component|
        found_in_applications = []

        @applications_data.each do |application|
          next unless application[:application_found]

          name = application[:name]
          found_something = true

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

      results if found_something
    end
  end
end
