require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContextualNavigation do
  describe "#show_covid_booster_cta?" do
    let(:request) { double("request", path: "/some-path", query_parameters: {}) }

    it "returns false for smart answers" do
      content_item = {
        "title" => "Some Content",
        "document_type" => "smart_answer",
        "links" => {},
      }

      expect(described_class.new(content_item, request).show_covid_booster_cta?).to be false
    end

    it "returns false for step by step pages" do
      content_item = {
        "title" => "Some Content",
        "document_type" => "step_by_step_nav",
        "links" => {},
      }

      expect(described_class.new(content_item, request).show_covid_booster_cta?).to be false
    end

    it "returns true for guidance" do
      content_item = {
        "title" => "Some Content",
        "document_type" => "guidance",
        "links" => {},
      }

      expect(described_class.new(content_item, request).show_covid_booster_cta?).to be true
    end
  end
end
