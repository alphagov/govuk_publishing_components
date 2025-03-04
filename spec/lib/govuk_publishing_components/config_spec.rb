require "spec_helper"

describe GovukPublishingComponents::Config do
  describe "#configure" do
    it "configures the application" do
      GovukPublishingComponents.configure do |config|
        config.component_guide_title = "My component guide"
        config.application_stylesheet = "custom_stylesheet"
        config.application_javascript = "custom_javascript"
      end

      expect(described_class.component_guide_title).to eql("My component guide")
      expect(described_class.application_stylesheet).to eql("custom_stylesheet")
      expect(described_class.application_javascript).to eql("custom_javascript")
      expect(described_class.component_directory_name).to eql("components")
    end
  end
end
