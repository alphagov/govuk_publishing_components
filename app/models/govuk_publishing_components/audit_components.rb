module GovukPublishingComponents
  class AuditComponents
    attr_reader :data

    def initialize(path)
      # paths to key file locations
      @templates_path = "app/views/govuk_publishing_components/components"
      @stylesheets_path = "app/assets/stylesheets/govuk_publishing_components/components"
      @print_stylesheets_path = "app/assets/stylesheets/govuk_publishing_components/components/print"
      @javascripts_path = "app/assets/javascripts/govuk_publishing_components/components"
      @tests_path = "spec/components"
      @js_tests_path = "spec/javascripts/components"
      @helpers_path = "lib/govuk_publishing_components/presenters"

      @data = {
        gem_found: false,
      }
      @data = compile_data(path) if Dir.exist?(path)
    end

  private

    def compile_data(path)
      # get all files in key file locations
      @all_templates = Dir["#{path}/#{@templates_path}/*.erb"]
      @all_stylesheets = Dir["#{path}/#{@stylesheets_path}/*.scss"]
      @all_print_stylesheets = Dir["#{path}/#{@print_stylesheets_path}/*.scss"]
      @all_javascripts = Dir["#{path}/#{@javascripts_path}/*.js"]
      @all_tests = Dir["#{path}/#{@tests_path}/*.rb"]
      @all_js_tests = Dir["#{path}/#{@js_tests_path}/*.js"]
      @all_helpers = Dir["#{path}/#{@helpers_path}/*_helper.rb"]

      @templates_full_path = "#{path}/#{@templates_path}/"

      # find the cleaned names of components in key file locations
      # i.e. will show that 'component name' has a stylesheet
      # standardised like this to be used later for easier comparison
      @components = clean_files(@all_templates, @templates_full_path)
      @component_stylesheets = clean_files(@all_stylesheets, [path, @stylesheets_path].join("/"))
      @component_print_stylesheets = clean_files(@all_print_stylesheets, [path, @print_stylesheets_path].join("/"))
      @component_javascripts = clean_files(@all_javascripts, [path, @javascripts_path].join("/"))
      @component_tests = clean_files(@all_tests, [path, @tests_path].join("/"))
      @component_js_tests = clean_files(@all_js_tests, [path, @js_tests_path].join("/"))
      @component_helpers = clean_files(@all_helpers, [path, @helpers_path].join("/"))

      {
        gem_found: true,
        component_code: @components,
        components_containing_components: find_all_partials_in(@all_templates),
        component_listing: list_all_component_details,
      }
    end

    def clean_files(files, replace)
      files.map { |file| clean_file_name(file.gsub(replace, "")) }.sort
    end

    def clean_file_name(name)
      name.tr("/_-", " ")
        .gsub(".html.erb", "")
        .gsub(".erb", "")
        .gsub(".scss", "")
        .gsub(".js", "")
        .gsub("spec", "")
        .gsub(".rb", "")
        .gsub("helper", "")
        .strip
    end

    def get_component_name_from_full_path(path)
      path.gsub(/.*\K\/_/, "/")
        .gsub(@templates_full_path, "")
        .gsub(".html.erb", "")
        .gsub(".erb", "")
        .tr('\"\'', "")
    end

    # create link to component guide page for a given component e.g. 'component name'
    def get_component_link(component)
      "/component-guide/#{component.gsub(' ', '_')}"
    end

    def find_all_partials_in(templates)
      components = []

      templates.each do |template|
        partials_found = true
        components_to_search = [template]
        components_found = []

        while partials_found
          extra_components = find_partials_in(components_to_search)

          if extra_components.any?
            components_found << extra_components
            components_to_search = extra_components
          else
            partials_found = false
            components_found = components_found.flatten.reject { |c| c.include?("/") }

            if components_found.any?
              component_name = clean_file_name(get_component_name_from_full_path(template))
              components << {
                component: component_name,
                link: get_component_link(component_name),
                sub_components: components_found.uniq.sort.map { |name| clean_file_name(name) },
              }
            end
          end
        end
      end

      components.sort_by { |c| c[:component] }
    end

    def find_partials_in(components)
      extra_components = []
      components.each do |component|
        extra_components << components_within_component(component)
      end

      extra_components.flatten.uniq.sort
    end

    def components_within_component(file)
      file = get_component_name_from_full_path(file)
      file = "#{@templates_full_path}#{file}.html.erb".sub(/.*\K\//, "/_")
      data = File.read(file)
      match = data.scan(/["']{1}(govuk_publishing_components\/components\/[\/a-z_-]+["']{1})/)
      match.flatten.uniq.map(&:to_s).sort.map do |m|
        m.gsub("govuk_publishing_components/components/", "").tr('\"\'', "")
      end
    end

    def list_all_component_details
      all_component_information = []
      css_count = 0
      print_css_count = 0
      javascript_count = 0
      test_count = 0
      javascript_test_count = 0
      helper_count = 0

      @components.each do |component|
        stylesheet = check_component_has("stylesheet", component)
        css_count += 1 if stylesheet
        print_stylesheet = check_component_has("print_stylesheet", component)
        print_css_count += 1 if print_stylesheet
        javascript = check_component_has("javascript", component)
        javascript_count += 1 if javascript
        test = check_component_has("test", component)
        test_count += 1 if test
        javascript_test = check_component_has("js_test", component)
        javascript_test_count += 1 if javascript_test
        helper = check_component_has("helper", component)
        helper_count += 1 if helper

        all_component_information << {
          name: component,
          link: get_component_link(component),
          stylesheet: stylesheet,
          print_stylesheet: print_stylesheet,
          javascript: javascript,
          tests: test,
          js_tests: javascript_test,
          helper: helper,
        }
      end

      {
        total_count: @components.length,
        css_count: css_count,
        print_css_count: print_css_count,
        javascript_count: javascript_count,
        test_count: test_count,
        javascript_test_count: javascript_test_count,
        helper_count: helper_count,
        details: all_component_information,
      }
    end

    def check_component_has(a_thing, component)
      look_in = @component_stylesheets if a_thing == "stylesheet"
      look_in = @component_print_stylesheets if a_thing == "print_stylesheet"
      look_in = @component_javascripts if a_thing == "javascript"
      look_in = @component_tests if a_thing == "test"
      look_in = @component_js_tests if a_thing == "js_test"
      look_in = @component_helpers if a_thing == "helper"

      if look_in.include?(component)
        return get_asset_link(a_thing, component)
      end

      false
    end

    def get_asset_link(a_thing, component)
      url = "https://github.com/alphagov"
      repo = "govuk_publishing_components"
      blob = "blob/main"
      link = nil
      link = "#{url}/#{repo}/#{blob}/#{@stylesheets_path}/_#{component.gsub(' ', '-')}.scss" if a_thing == "stylesheet"
      link = "#{url}/#{repo}/#{blob}/#{@print_stylesheets_path}/_#{component.gsub(' ', '-')}.scss" if a_thing == "print_stylesheet"
      link = "#{url}/#{repo}/#{blob}/#{@javascripts_path}/#{component.gsub(' ', '-')}.js" if a_thing == "javascript"
      link = "#{url}/#{repo}/#{blob}/#{@tests_path}/#{component.gsub(' ', '_')}_spec.rb" if a_thing == "test"
      link = "#{url}/#{repo}/#{blob}/#{@js_tests_path}/#{component.gsub(' ', '-')}-spec.js" if a_thing == "js_test"
      link = "#{url}/#{repo}/#{blob}/#{@helpers_path}/#{component.gsub(' ', '_')}_helper.rb" if a_thing == "helper"

      link
    end
  end
end
