require "spec_helper"

describe GovukPublishingComponents::Config do
  describe "#configure" do
    it "configures the application" do
      GovukPublishingComponents.configure do |config|
        config.component_guide_title = "My component guide"
        config.static = true

        config.application_stylesheet = "custom_stylesheet"
        config.application_print_stylesheet = "custom_print_stylesheet"
        config.application_javascript = "custom_javascript"
      end

      expect(GovukPublishingComponents::Config.component_guide_title).to eql("My component guide")
      expect(GovukPublishingComponents::Config.static).to eql(true)

      expect(GovukPublishingComponents::Config.application_stylesheet).to eql("custom_stylesheet")
      expect(GovukPublishingComponents::Config.application_print_stylesheet).to eql("custom_print_stylesheet")
      expect(GovukPublishingComponents::Config.application_javascript).to eql("custom_javascript")
    end

    it "uses a default component directory" do
      GovukPublishingComponents.configure do |config|
        config.static = false
      end

      expect(GovukPublishingComponents::Config.component_directory_name).to eql('components')
    end

    it "uses a different component directory for static" do
      GovukPublishingComponents.configure do |config|
        config.static = true
      end

      expect(GovukPublishingComponents::Config.component_directory_name).to eql('govuk_component')
    end
  end
end
