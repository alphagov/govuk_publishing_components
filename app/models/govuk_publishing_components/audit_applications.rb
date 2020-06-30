module GovukPublishingComponents
  class AuditApplications
    attr_reader :data

    def initialize(path, name)
      templates_path = "app/views"
      stylesheets_path = "app/assets/stylesheets"
      javascripts_path = "app/assets/javascripts"
      helpers_path = "app/helpers"
      presenters_path = "app/presenters"

      templates = Dir["#{path}/#{templates_path}/**/*.html.erb"]
      stylesheets = Dir["#{path}/#{stylesheets_path}/**/*.scss"]
      javascripts = Dir["#{path}/#{javascripts_path}/**/*.js"]
      helpers = Dir["#{path}/#{helpers_path}/**/*.rb"]
      presenters = Dir["#{path}/#{presenters_path}/**/*.rb"]

      find_templates = /<%=[ ]*render ['"]{1}govuk_publishing_components\/components\/[a-zA-Z_-]+/
      replace_templates = /<%=[ ]*render ['"]{1}govuk_publishing_components\/components\//

      @find_all_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components/
      find_stylesheets = /@import ["']{1}govuk_publishing_components\/components\/(?!print)+[a-zA-Z_-]+/
      replace_stylesheets = /@import ["']{1}govuk_publishing_components\/components\//

      @find_all_print_stylesheets = /@import ["']{1}govuk_publishing_components\/all_components_print/
      find_print_stylesheets = /@import ["']{1}govuk_publishing_components\/components\/print\/[a-zA-Z_-]+/
      replace_print_stylesheets = /@import ["']{1}govuk_publishing_components\/components\/print\//

      @find_all_javascripts = /\/\/[ ]*= require govuk_publishing_components\/all_components/
      find_javascripts = /[\/]{2}[ ]*=[ ]*require govuk_publishing_components\/components\/[a-zA-Z_-]+/
      replace_javascripts = /[\/]{2}[ ]*=[ ]*require govuk_publishing_components\/components\//

      find_ruby = /render\(["']{1}govuk_publishing_components\/components\/[a-zA-Z_-]+['"]{1}/
      replace_ruby = /render\(["']{1}govuk_publishing_components\/components\//

      components_in_templates = find_components(templates, find_templates, replace_templates) || []
      components_in_stylesheets = find_components(stylesheets, find_stylesheets, replace_stylesheets) || []
      components_in_print_stylesheets = find_components(stylesheets, find_print_stylesheets, replace_print_stylesheets) || []
      components_in_javascripts = find_components(javascripts, find_javascripts, replace_javascripts) || []

      components_in_helpers = find_components(helpers, find_ruby, replace_ruby) || []
      components_in_presenters = find_components(presenters, find_ruby, replace_ruby) || []
      components_in_ruby = [components_in_helpers, components_in_presenters].flatten.uniq
      components_in_ruby.delete("none") if components_in_ruby.length > 1

      @data = {
        name: name,
        application_found: application_exists(path),
        components_in_templates: components_in_templates,
        components_in_stylesheets: components_in_stylesheets,
        components_in_print_stylesheets: components_in_print_stylesheets,
        components_in_javascripts: components_in_javascripts,
        components_in_ruby: components_in_ruby,
      }
    end

  private

    def find_components(files, find, replace)
      components_found = []

      files.each do |file|
        src = File.read(file)
        components_found << find_match(find, replace, src)
      end

      found = components_found.flatten.uniq.sort
      return %w[none] if found.empty?

      found
    end

    def find_match(find, replace, src)
      return %w[all] if src.match(@find_all_stylesheets) || src.match(@find_all_print_stylesheets) || src.match(@find_all_javascripts)

      matches = src.scan(find)
      all_matches = []
      matches.each do |match|
        match.to_s.gsub!(replace, "")
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
