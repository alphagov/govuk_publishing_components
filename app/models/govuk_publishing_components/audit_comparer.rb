module GovukPublishingComponents
  class AuditComparer
    attr_reader :applications_data, :gem_data

    def initialize(gem_data, results)
      if gem_data[:gem_found]
        @gem_data = gem_data
        @applications_data = sort_results(results)
        @gem_data[:components_by_application] = get_components_by_application || []
        @gem_data[:helpers_used_by_applications] = get_helpers_used_by_applications || []
        @gem_data[:component_file_details] = combine_all_component_file_details(@gem_data[:component_file_details], @applications_data)
      end
    end

  private

    def prettify_key(key)
      key.to_s.gsub("_", " ").capitalize
    end

    def sort_results(results)
      data = []

      results.each do |result|
        if result[:application_found]
          @current_uses_individual_asset_model = result[:uses_individual_asset_model]
          templates = result[:components_found].find { |c| c[:location] == "template" }
          stylesheets = result[:components_found].find { |c| c[:location] == "stylesheet" }
          javascripts = result[:components_found].find { |c| c[:location] == "javascript" }
          ruby = result[:components_found].find { |c| c[:location] == "ruby" }

          templates[:components] = include_any_components_within_components(templates[:components])
          ruby[:components] = include_any_components_within_components(ruby[:components])

          warnings = []
          warnings << warn_about_missing_components(result[:components_found])
          warnings << warn_about_missing_assets(result[:components_found])
          warnings << warn_about_style_overrides(result[:gem_style_references])
          warnings << warn_about_jquery_references(result[:jquery_references])
          warnings = warnings.flatten

          summary = [
            {
              name: "In templates",
              value: templates[:components],
            },
            {
              name: "In stylesheets",
              value: stylesheets[:components],
            },
            {
              name: "In javascripts",
              value: javascripts[:components],
            },
            {
              name: "In ruby",
              value: ruby[:components],
            },
          ]

          data << {
            name: result[:name],
            dir: result[:dir],
            application_found: result[:application_found],
            summary:,
            warnings:,
            warning_count: warnings.length,
            gem_style_references: result[:gem_style_references],
            jquery_references: result[:jquery_references],
            component_locations: result[:component_locations],
            helper_references: result[:helper_references],
            uses_individual_asset_model: result[:uses_individual_asset_model],
            application_components: result[:application_components],
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
        component:,
        message:,
      }
    end

    # given two groups of components, check the difference
    def find_missing_items(first_group, second_group)
      warnings = []

      first_group.each do |first|
        first_location = first[:location]

        second_group.each do |second|
          second_location = second[:location]
          second_location = "code" if %w[template ruby].include?(second_location)
          # subtract one group from the other, leaving only those not in both
          in_current = find_missing(second[:components].clone, first[:components].clone)

          next if second[:components].include?("all")

          # now we have a list of 'missing' component assets, check the gem to see if that asset exists
          in_current.each do |component|
            component_assets = @gem_data[:component_file_details].select { |c| c[:name] == component }
            if !component_assets.empty?
              component_assets = component_assets[0]
              asset_in_gem = if second_location == "code"
                               component_assets["template_exists".to_sym]
                             else
                               component_assets["#{second_location}_exists".to_sym]
                             end
            else
              asset_in_gem = false
            end

            suppress_warning = @current_uses_individual_asset_model && second_location == "stylesheet"
            raise_warning = asset_in_gem && !suppress_warning

            # this raises a warning if the asset exists and isn't included in the application
            warnings << create_warning(component, "Included in #{first_location} but not #{second_location}") if raise_warning
          end
        end
      end

      warnings
    end

    def warn_about_missing_assets(components)
      warnings = []

      code = components.select { |c| %w[template ruby].include?(c[:location]) }
      code = [
        {
          location: "code",
          components: code.map { |c| c[:components] }.flatten.uniq.sort,
        },
      ]
      assets = components.select { |c| %w[stylesheet javascript].include?(c[:location]) }

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

    # returns details of component inclusion by applications
    def get_components_by_application
      results = []
      found_something = false

      @gem_data[:component_file_details].each do |component|
        component_name = component[:name]
        locations = []

        @applications_data.each do |application|
          next unless application[:application_found] && application[:component_locations][component_name.to_sym]

          application_name = application[:name]
          found_something = true

          locations << {
            name: application_name,
            locations: application[:component_locations][component_name.to_sym],
          }
        end

        locations = locations.flatten

        results << {
          name: component_name,
          count: locations.length,
          locations:,
        }
      end

      results if found_something
    end

    # returns data of components gem helpers used in applications
    def get_helpers_used_by_applications
      results = []

      @applications_data.each do |application|
        next unless application[:application_found] && application[:helper_references].present?

        application[:helper_references].each do |key, value|
          location = {
            name: application[:name],
            locations: value,
          }

          match = results.find { |x| x[:name] == key }
          if match
            match[:locations] << location
            match[:count] = match[:count] + 1
          else
            results << {
              name: key,
              count: 1,
              locations: [location],
            }
          end
        end
      end

      results
    end

    def combine_all_component_file_details(gem_components, applications)
      applications.each do |application|
        next unless application[:application_components]

        application[:application_components][:component_file_details].each do |component|
          gem_components << component
        end
      end

      gem_components.sort_by { |c| c[:name] }
    end
  end
end
