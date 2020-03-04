RSpec.describe GovukPublishingComponents::Presenters::SharedHelper do
  describe "Shared component helper" do
    it "returns a default margin class" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-3")
    end

    it "returns a given margin class" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(margin_bottom: 6)
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-6")
    end

    it "returns the default margin class if passed value is wrong" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(margin_bottom: "a")
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-3")
    end

    it "returns a default heading level" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a given heading level" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 6)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h6")
    end

    it "returns the default heading level if passed value is wrong" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 9)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a span instead of a heading if heading level is 0" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 0)
      result = shared_helper.get_heading_level
      expect(result).to eql("span")
    end
  end
end
