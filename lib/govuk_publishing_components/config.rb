module GovukPublishingComponents
  def self.configure
    yield(Config)
  end

  module Config
    APP_COMPONENT_DIRECTORY = "components".freeze

    mattr_accessor :component_guide_title
    self.component_guide_title = "Component Guide"

    mattr_accessor :application_stylesheet
    self.application_stylesheet = "application"

    mattr_accessor :application_javascript
    self.application_javascript = "application"

    def self.component_directory_name
      APP_COMPONENT_DIRECTORY
    end

    def self.gem_directory
      Gem::Specification.find_by_name("govuk_publishing_components").gem_dir
    end
  end
end
