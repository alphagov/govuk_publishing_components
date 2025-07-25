module GovukPublishingComponents
  class AuditApplications
    attr_reader :data

    def initialize(path, name, dir)
      @path = path
      application_found = application_exists(path)
      components_found = []
      @component_locations = {}
      @gem_style_references = []
      @jquery_references = []
      @helper_references = {}

      if application_found
        templates = Dir["#{path}/app/views/**/*.erb"]
        stylesheets = Dir["#{path}/app/assets/stylesheets/**/*.scss"]
        javascripts = Dir["#{path}/app/assets/javascripts/**/*.js"]

        find_components = /(?<=govuk_publishing_components\/components\/)[a-zA-Z_-]+(?=['"])/

        @find_all_stylesheets = /@(?:import|use) ["']{1}govuk_publishing_components\/all_components/ # if using the all stylesheets option
        @find_individual_asset_model = /render_component_stylesheets/ # if using per page component asset loading
        @uses_individual_asset_model = false
        find_stylesheets = /(?<=@import ["']{1}govuk_publishing_components\/components\/)(?!print\/)+[a-zA-Z_-]+(?=['"])/

        @find_all_javascripts = /\/\/ *= require govuk_publishing_components\/all_components/
        find_javascripts = /(?<=require govuk_publishing_components\/components\/)[a-zA-Z_-]+/

        components_in_templates = find_components(templates, find_components, "template", true) || []
        components_in_stylesheets = find_components(stylesheets, find_stylesheets, "stylesheet", false) || []
        components_in_javascripts = find_components(javascripts, find_javascripts, "javascript", false) || []

        ruby_paths = %w[/app/helpers/ /app/presenters/ /lib/]
        components_in_ruby = []
        ruby_paths.each do |ruby_path|
          components_in_ruby << find_components(Dir["#{path}#{ruby_path}**/*.{rb,erb}"], find_components, "ruby", true) || []
        end
        components_in_ruby = components_in_ruby.flatten.uniq

        components_found = [
          {
            location: "template",
            components: components_in_templates,
          },
          {
            location: "stylesheet",
            components: components_in_stylesheets,
          },
          {
            location: "javascript",
            components: components_in_javascripts,
          },
          {
            location: "ruby",
            components: components_in_ruby,
          },
        ]

        # applications might not have all of these things for all components
        options = {
          application_name: name,
          application_dir: dir,
          templates_path: "app/views/components",
          stylesheets_path: "app/assets/stylesheets/components",
          javascripts_path: "app/assets/javascripts/components/",
          tests_path: "spec/components/",
          javascript_tests_path: "spec/javascripts/components/",
          helpers_path: "app/helpers/",
        }
        application_components = AuditComponents.new(path, options)
        application_components = application_components.data if application_components
      end

      @data = {
        name:,
        dir:,
        application_found:,
        components_found:,
        gem_style_references: @gem_style_references.flatten.uniq.sort,
        jquery_references: @jquery_references.flatten.uniq.sort,
        component_locations: @component_locations,
        helper_references: @helper_references,
        uses_individual_asset_model: @uses_individual_asset_model,
        application_components: application_components || [],
      }
    end

  private

    def find_components(files, find, type, keep_locations)
      components_found = []

      files.each do |file|
        src = File.read(file)

        if keep_locations
          components = find_match(find, src, type)
          if components.any?
            components_found << components
            components.each do |component|
              component_sym = component.to_sym
              @component_locations[component_sym] = [] unless @component_locations[component_sym]
              @component_locations[component_sym] << clean_file_path(file)
              @component_locations[component_sym].sort!
            end
          end
        else
          components_found << find_match(find, src, type)
        end

        get_helper_references(file, src) if %w[ruby template].include?(type)

        if type == "javascript"
          jquery_references = find_code_references(file, src, /\$\(/)
          @jquery_references << jquery_references if jquery_references
        else
          gem_style_references = find_code_references(file, src, /gem-c-[-_a-zA-Z]+/)
          @gem_style_references << gem_style_references if gem_style_references
        end
      rescue StandardError => e
        Rails.logger.debug e.message
      end

      components_found.flatten.uniq.sort
    end

    def get_helper_references(file, src)
      helper_use = find_match(/GovukPublishingComponents::(?:AppHelpers|Presenters)::[a-zA-Z]+/, src, "helper")
      if helper_use.any?
        helper_use.each do |helper|
          class_name = helper.gsub(/GovukPublishingComponents::(AppHelpers)?(Presenters)?::+/, "")
          helper_sym = class_name.to_sym
          @helper_references[helper_sym] = [] unless @helper_references[helper_sym]
          @helper_references[helper_sym] << clean_file_path(file)
          @helper_references[helper_sym].uniq!
          @helper_references[helper_sym].sort!
        end
      end
    end

    # looks for components in the given src of a file
    # returns an array of component names or an empty array
    def find_match(find, src, type)
      return %w[all] if src.match(@find_all_stylesheets) && type == "stylesheet"
      return %w[all] if src.match(@find_all_javascripts) && type == "javascript"

      @uses_individual_asset_model = true if src.match(@find_individual_asset_model) && type == "template"
      matches = src.scan(find)
      return [] unless matches.any?

      all_matches = []
      matches.each do |match|
        all_matches << clean_file_name(match.tr('[])\'"', ""))
      end

      all_matches
    end

    def find_code_references(file, src, regex)
      clean_file_path(file) if regex.match?(src)
    end

    def clean_file_path(file)
      file[/(?<=#{Regexp.escape(@path.to_s)}\/)[\/0-9a-zA-Z_-]+.[0-9a-zA-Z+.]+/]
    end

    def clean_file_name(name)
      name.tr("_-", " ").strip
    end

    def application_exists(directory)
      File.directory?(directory)
    end
  end
end
