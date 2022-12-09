require "spec_helper"

describe GovukPublishingComponents::Config do
  describe "#configure" do
    it "configures the application" do
      GovukPublishingComponents.configure do |config|
        config.component_guide_title = "My component guide"
        config.application_stylesheet = "custom_stylesheet"
        config.application_javascript = "custom_javascript"
      end

      expect(GovukPublishingComponents::Config.component_guide_title).to eql("My component guide")
      expect(GovukPublishingComponents::Config.application_stylesheet).to eql("custom_stylesheet")
      expect(GovukPublishingComponents::Config.application_javascript).to eql("custom_javascript")
      expect(GovukPublishingComponents::Config.component_directory_name).to eql("components")
    end
  end
end
