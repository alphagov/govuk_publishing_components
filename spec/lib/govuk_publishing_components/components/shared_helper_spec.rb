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

    it "accepts passed class names if prefixed with 'js-'" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(classes: "js-okay js-fine")
      expect(shared_helper.classes).to eql(%w[js-okay js-fine])
    end

    it "rejects passed class names if not prefixed with 'js-'" do
      expect {
        GovukPublishingComponents::Presenters::SharedHelper.new(classes: "js-okay not-cool-man")
      }.to raise_error(ArgumentError, "Passed classes must be prefixed with `js-`")
    end
  end
end
