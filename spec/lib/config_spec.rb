require "spec_helper"

describe GovukPublishingComponents::Config do
  describe "#configure" do
    it "configures the application" do
      GovukPublishingComponents.configure do |config|
        config.component_guide_title = "My component guide"
      end

      expect(GovukPublishingComponents::Config.component_guide_title).to eql("My component guide")
    end
  end
end
