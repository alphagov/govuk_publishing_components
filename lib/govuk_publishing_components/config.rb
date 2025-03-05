module GovukPublishingComponents
  def self.configure
    yield(Config)
  end

  module Config
    APP_COMPONENT_DIRECTORY = "components".freeze

    mattr_accessor :component_guide_title
    self.component_guide_title = "Component Guide"

    mattr_accessor :application_dir
    self.application_dir = ""

    mattr_accessor :application_stylesheet
    self.application_stylesheet = "application"

    mattr_accessor :application_javascript
    self.application_javascript = "application"

    mattr_accessor :custom_css_exclude_list
    self.custom_css_exclude_list = []

    mattr_accessor :exclude_css_from_static
    self.exclude_css_from_static = true

    mattr_accessor :use_es6_components
    self.use_es6_components = false

    def self.component_directory_name
      APP_COMPONENT_DIRECTORY
    end

    def self.gem_directory
      Gem::Specification.find_by_name("govuk_publishing_components").gem_dir
    end

    def self.all_stylesheets
      stylesheets = Dir.glob("#{gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/*.scss")
      # _copy-to-clipboard.css is removed due to being an empty stylesheet
      included_files = stylesheets.reject { |path| path.include?("copy-to-clipboard") }

      application_stylesheet_hash = { "#{gem_directory}/app/assets/stylesheets/component_guide/application.scss" => "component_guide/application.css" }

      included_files.each_with_object(application_stylesheet_hash) do |path, hsh|
        hsh[path] = "govuk_publishing_components/components/#{File.basename(path, '.*')}.css"
      end
    end
  end
end
