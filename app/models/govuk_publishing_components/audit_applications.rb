module GovukPublishingComponents
  class AuditApplications
    attr_reader :data

    def initialize(path, name)
      @path = path
      application_found = application_exists(path)
      components_found = []
      @gem_style_references = []
      @jquery_references = []

      if application_found
        templates = Dir["#{path}/app/views/**/*.erb"]
        stylesheets = Dir["#{path}/app/assets/stylesheets/**/*.scss"]
        javascripts = Dir["#{path}/app/assets/javascripts/**/*.js"]

        find_components = /(?<=govuk_publishing_components\/components\/)[a-zA-Z_-]+(?=['"])/

        @find_all_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components/
        find_stylesheets = /(?<=@import ["']{1}govuk_publishing_components\/components\/)(?!print\/)+[a-zA-Z_-]+(?=['"])/

        @find_all_print_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components_print/
        find_print_stylesheets = /(?<=@import ["']{1}govuk_publishing_components\/components\/print\/)[a-zA-Z_-]+(?=['"])/

        @find_all_javascripts = /\/\/[ ]*= require govuk_publishing_components\/all_components/
        find_javascripts = /(?<=require govuk_publishing_components\/components\/)[a-zA-Z_-]+/

        components_in_templates = find_components(templates, find_components, "templates") || []
        components_in_stylesheets = find_components(stylesheets, find_stylesheets, "stylesheets") || []
        components_in_print_stylesheets = find_components(stylesheets, find_print_stylesheets, "print_stylesheets") || []
        components_in_javascripts = find_components(javascripts, find_javascripts, "javascripts") || []

        ruby_paths = %w[/app/helpers/ /app/presenters/ /lib/]
        components_in_ruby = []
        ruby_paths.each do |ruby_path|
          components_in_ruby << find_components(Dir["#{path}#{ruby_path}**/*.{rb,erb}"], find_components, "ruby") || []
        end
        components_in_ruby = components_in_ruby.flatten.uniq

        components_found = [
          {
            location: "templates",
            components: components_in_templates,
          },
          {
            location: "stylesheets",
            components: components_in_stylesheets,
          },
          {
            location: "print_stylesheets",
            components: components_in_print_stylesheets,
          },
          {
            location: "javascripts",
            components: components_in_javascripts,
          },
          {
            location: "ruby",
            components: components_in_ruby,
          },
        ]
      end

      @data = {
        name: name,
        application_found: application_found,
        components_found: components_found,
        gem_style_references: @gem_style_references.flatten.uniq.sort,
        jquery_references: @jquery_references.flatten.uniq.sort,
      }
    end

  private

    def find_components(files, find, type)
      components_found = []

      files.each do |file|
        src = File.read(file)
        components_found << find_match(find, src, type)

        if type == "javascripts"
          jquery_references = find_code_references(file, src, /\$\(/)
          @jquery_references << jquery_references if jquery_references
        else
          gem_style_references = find_code_references(file, src, /gem-c-[-_a-zA-Z]+/)
          @gem_style_references << gem_style_references if gem_style_references
        end
      rescue StandardError
        puts "File #{file} not found"
      end

      components_found.flatten.uniq.sort
    end

    def find_match(find, src, type)
      return %w[all] if src.match(@find_all_stylesheets) && type == "stylesheets"
      return %w[all] if src.match(@find_all_print_stylesheets) && type == "print_stylesheets"
      return %w[all] if src.match(@find_all_javascripts) && type == "javascripts"

      matches = src.scan(find)
      all_matches = []
      matches.each do |match|
        all_matches << clean_file_name(match.tr('[])\'"', ""))
      end

      all_matches
    end

    def find_code_references(file, src, regex)
      clean_file_path = /(?<=#{Regexp.escape(@path)}\/)[\/a-zA-Z_-]+.[a-zA-Z.]+/

      return file[clean_file_path] if regex.match?(src)
    end

    def clean_file_name(name)
      name.tr("_-", " ").strip
    end

    def application_exists(directory)
      File.directory?(directory)
    end
  end
end
