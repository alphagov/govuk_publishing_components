module GovukPublishingComponents
  def self.configure
    yield(Config)
  end

  module Config
    mattr_accessor :component_guide_title
    self.component_guide_title = "GOV.UK Component Guide"

    mattr_accessor :application_stylesheet
    self.application_stylesheet = "application"

    mattr_accessor :application_javascript
    self.application_javascript = "application"
  end
end
