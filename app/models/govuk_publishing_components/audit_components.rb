module GovukPublishingComponents
  class AuditComponents
    attr_reader :data

    def initialize(path, options = {})
      # paths to key file locations
      @templates_path = options[:templates_path] || "app/views/govuk_publishing_components/components"
      @stylesheets_path = options[:stylesheets_path] || "app/assets/stylesheets/govuk_publishing_components/components"
      @print_stylesheets_path = options[:print_stylesheets_path] || "app/assets/stylesheets/govuk_publishing_components/components/print"
      @javascripts_path = options[:javascripts_path] || "app/assets/javascripts/govuk_publishing_components/components"
      @tests_path = options[:tests_path] || "spec/components"
      @javascript_tests_path = options[:javascript_tests_path] || "spec/javascripts/components"
      @helpers_path = options[:helpers_path] || "lib/govuk_publishing_components/presenters"

      @application_name = options[:application_name] || "govuk_publishing_components"
      @application_dir = options[:application_dir] || "govuk_publishing_components"
      @all_templates = Dir["#{path}/#{@templates_path}/*.erb"].sort
      @templates_full_path = "#{path}/#{@templates_path}/"

      @component_numbers = {
        template: 0,
        stylesheet: 0,
        print_stylesheet: 0,
        javascript: 0,
        uses_govuk_frontend_js: 0,
        uses_govuk_frontend_css: 0,
        test: 0,
        javascript_test: 0,
        helper: 0,
      }

      @data = {
        gem_found: false,
      }
      @auditing_an_application = true unless @application_name == "govuk_publishing_components"
      @data = compile_data(path) if Dir.exist?(path)
    end

  private

    def compile_data(path)
      data = {}
      data[:gem_found] = true unless @auditing_an_application
      component_file_details = get_component_file_details(path)
      data[:helper_usage] = get_helper_usage(component_file_details) unless @auditing_an_application

      # remove the template file reference as not needed
      component_file_details.map { |detail| detail.delete(:template_file) }

      data[:component_code] = clean_files(@all_templates, @templates_full_path).sort unless @auditing_an_application
      data[:component_file_details] = component_file_details
      data[:component_numbers] = @component_numbers
      data[:components_containing_components] = find_all_partials_in(@all_templates) unless @auditing_an_application
      data
    end

    def get_component_file_details(path)
      component_templates = clean_files(@all_templates, @templates_full_path).sort
      details = []
      component_templates.each do |component|
        component_detail = {}
        component_detail[:name] = component
        component_detail[:application] = @application_dir
        component_detail[:link] = get_component_link(component) unless @auditing_an_application
        file_details = [
          {
            type: "template",
            file: "#{[path, @templates_path].join('/')}/_#{component.gsub(' ', '_')}.html.erb",
          },
          {
            type: "stylesheet",
            file: "#{[path, @stylesheets_path].join('/')}/_#{component.gsub(' ', '-')}.scss",
          },
          {
            type: "print_stylesheet",
            file: "#{[path, @stylesheets_path].join('/')}/_#{component.gsub(' ', '-')}.scss",
          },
          {
            type: "javascript",
            file: "#{[path, @javascripts_path].join('/')}/#{component.gsub(' ', '-')}.js",
          },
          {
            type: "test",
            file: "#{[path, @tests_path].join('/')}/#{component.gsub(' ', '_')}_spec.rb",
          },
          {
            type: "javascript_test",
            file: "#{[path, @javascript_tests_path].join('/')}/#{component.gsub(' ', '-')}-spec.js",
          },
          {
            type: "helper",
            file: "#{[path, @helpers_path].join('/')}/#{component.gsub(' ', '_')}_helper.rb",
          },
        ]
        file_details.each do |detail|
          component_detail = component_detail.merge(get_component_asset_detail(detail, component))
        end

        details << component_detail
      end

      details
    end

    def get_component_asset_detail(detail, component)
      details = {}
      type = detail[:type]
      file = detail[:file]
      if File.file?(file)
        details["#{type}_exists".to_sym] = false
        # save the location of the template to later grep for helper use
        details["#{type}_file".to_sym] = file if type == "template"
        # we don't have separate print stylesheets anymore
        # so check the main stylesheet for print styles
        if type == "print_stylesheet"
          unless File.foreach(file).grep(/(media-type: print)/).empty?
            details["#{type}_exists".to_sym] = true
            @component_numbers[type.to_sym] += 1
          end
        else
          @component_numbers[type.to_sym] += 1
          details["#{type}_exists".to_sym] = true
          details["#{type}_lines".to_sym] = count_lines_in(file)
          details["#{type}_link".to_sym] = get_asset_link(type, component)

          if type == "javascript" && uses_govuk_frontend_js?(file)
            details[:uses_govuk_frontend_js] = true
            @component_numbers[:uses_govuk_frontend_js] += 1
          end

          if type == "stylesheet" && uses_govuk_frontend_css?(file)
            details[:uses_govuk_frontend_css] = true
            @component_numbers[:uses_govuk_frontend_css] += 1
          end
        end
      end

      details
    end

    def count_lines_in(file)
      File.read(file).each_line.count
    end

    def uses_govuk_frontend_js?(file)
      File.read(file).match(/require govuk\/components/)
    end

    def uses_govuk_frontend_css?(file)
      File.read(file).match(/@import "govuk\/components/)
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
        .gsub("helper.rb", "")
        .gsub(".rb", "")
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
      if File.exist?(file)
        data = File.read(file)
        match = data.scan(/["']{1}(govuk_publishing_components\/components\/[\/a-z_-]+["']{1})/)
        match.flatten.uniq.map(&:to_s).sort.map do |m|
          m.gsub("govuk_publishing_components/components/", "").tr('\"\'', "")
        end
      end
    end

    def get_asset_link(a_thing, component)
      url = "https://github.com/alphagov"
      repo = @application_dir
      blob = "blob/main"
      link = nil
      link = "#{url}/#{repo}/#{blob}/#{@templates_path}/_#{component.gsub(' ', '_')}.html.erb" if a_thing == "template"
      link = "#{url}/#{repo}/#{blob}/#{@stylesheets_path}/_#{component.gsub(' ', '-')}.scss" if a_thing == "stylesheet"
      link = "#{url}/#{repo}/#{blob}/#{@javascripts_path}/#{component.gsub(' ', '-')}.js" if a_thing == "javascript"
      link = "#{url}/#{repo}/#{blob}/#{@tests_path}/#{component.gsub(' ', '_')}_spec.rb" if a_thing == "test"
      link = "#{url}/#{repo}/#{blob}/#{@javascript_tests_path}/#{component.gsub(' ', '-')}-spec.js" if a_thing == "javascript_test"
      link = "#{url}/#{repo}/#{blob}/#{@helpers_path}/#{component.gsub(' ', '_')}_helper.rb" if a_thing == "helper"

      link
    end

    def get_helper_usage(components)
      helpers = [
        {
          name: "Brand helper",
          link: "lib/govuk_publishing_components/app_helpers/brand_helper.rb",
          match: /(GovukPublishingComponents::AppHelpers::BrandHelper.new)/,
          used_by: [],
        },
        {
          name: "Component wrapper helper",
          link: "lib/govuk_publishing_components/presenters/component_wrapper_helper.rb",
          match: /(GovukPublishingComponents::Presenters::ComponentWrapperHelper.new)/,
          used_by: [],
        },
        {
          name: "Shared helper",
          link: "lib/govuk_publishing_components/presenters/shared_helper.rb",
          match: /(GovukPublishingComponents::Presenters::SharedHelper.new)/,
          used_by: [],
        },
      ]

      components.each do |component|
        file = component[:template_file]
        next unless File.file?(file)

        helpers.each do |helper|
          next if File.foreach(file).grep(helper[:match]).blank?

          helper[:used_by] << {
            name: component[:name],
            link: component[:template_file].split("/components/")[1],
          }
        end
      end

      helpers
    end
  end
end
