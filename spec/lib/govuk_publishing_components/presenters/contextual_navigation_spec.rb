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

    it "returns false for content tagged to the Death taxons" do
      content_item = {
        "title" => "Some Content",
        "document_type" => "guidance",
        "links" => {
          "taxons" => [
            {
              "content_id" => "ac7b8472-5d09-4679-9551-87847b0ac827",
              "locale" => "en",
              "title" => "Death",
              "base_path" => "/taxon",
              "phase" => "live",
              "links" => {
                "parent_taxons" => [],
              },
            },
          ],
        },
      }

      expect(described_class.new(content_item, request).show_covid_booster_cta?).to be false
    end
  end
end
