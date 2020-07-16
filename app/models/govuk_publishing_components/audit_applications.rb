module GovukPublishingComponents
  class AuditApplications
    attr_reader :data

    def initialize(path, name)
      templates = Dir["#{path}/app/views/**/*.html.erb"]
      stylesheets = Dir["#{path}/app/assets/stylesheets/**/*.scss"]
      javascripts = Dir["#{path}/app/assets/javascripts/**/*.js"]

      find_templates = /(?<=govuk_publishing_components\/components\/)[\/a-zA-Z_-]+(?=['"])/

      @find_all_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components/
      find_stylesheets = /(?<=@import ["']{1}govuk_publishing_components\/components\/)(?!print)+[a-zA-Z_-]+(?=['"])/

      @find_all_print_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components_print/
      find_print_stylesheets = /(?<=@import ["']{1}govuk_publishing_components\/components\/print\/)[a-zA-Z_-]+(?=['"])/

      @find_all_javascripts = /\/\/[ ]*= require govuk_publishing_components\/all_components/
      find_javascripts = /(?<=require govuk_publishing_components\/components\/)[a-zA-Z_-]+/

      components_in_templates = find_components(templates, find_templates, "templates") || []
      components_in_stylesheets = find_components(stylesheets, find_stylesheets, "stylesheets") || []
      components_in_print_stylesheets = find_components(stylesheets, find_print_stylesheets, "print_stylesheets") || []
      components_in_javascripts = find_components(javascripts, find_javascripts, "javascripts") || []

      find_ruby = /(?<=render\(["']{1}govuk_publishing_components\/components\/)[a-zA-Z_-]+/
      ruby_paths = %w[/app/helpers/ /app/presenters/ /lib/]

      components_in_ruby = []
      ruby_paths.each do |ruby_path|
        components_in_ruby << find_components(Dir["#{path}#{ruby_path}**/*.rb"], find_ruby, "ruby") || []
      end

      components_in_ruby = components_in_ruby.flatten.uniq

      @data = {
        name: name,
        application_found: application_exists(path),
        components_found: [
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
        ],
      }
    end

  private

    def find_components(files, find, type)
      components_found = []

      files.each do |file|
        begin
          src = File.read(file)
          components_found << find_match(find, src, type)
        rescue
          puts "File #{file} not found"
        end
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

    def clean_file_name(name)
      name.tr("_-", " ").strip
    end

    def application_exists(directory)
      File.directory?(directory)
    end
  end
end
