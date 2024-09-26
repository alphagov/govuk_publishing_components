require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::BreadcrumbSelector do
  subject do
    described_class.new(
      content_item,
      request,
      prioritise_taxon_breadcrumbs,
      disable_ga4,
    )
  end
  let(:content_item) { GovukSchemas::Example.find("guide", example_name: "guide") }
  let(:path) { content_item["base_path"] }
  let(:query_parameters) { {} }
  let(:request) { instance_double("ActionDispatch::Request", path:, query_parameters:) }
  let(:prioritise_taxon_breadcrumbs) { false }
  let(:disable_ga4) { false }

  describe "#initialize" do
    it "does not raise exception" do
      expect { subject }.not_to raise_error
    end
  end

  describe "#breadcrumbs" do
    context "when content item is corporate information page with parent" do
      let(:content_item) do
        GovukSchemas::Example.find(
          "corporate_information_page",
          example_name: "corporate_information_page_complaints",
        )
      end

      it "returns breadcrumbs based on ancestors" do
        expect(subject.breadcrumbs).to eq([
          { title: "Home", url: "/" },
          { title: "Department of Health", url: "/government/organisations/department-of-health" },
          { title: "About us", url: "/government/organisations/department-of-health/about" },
        ])
      end
    end

    context "when content item is corporate information page without parent but with organisation" do
      let(:content_item) do
        GovukSchemas::Example.find(
          "corporate_information_page",
          example_name: "best-practice-about-page",
        )
      end

      it "returns breadcrumbs based on organisation" do
        expect(subject.breadcrumbs).to eq([
          { title: "Home", url: "/" },
          { title: "Intellectual Property Office", url: "/government/organisations/intellectual-property-office" },
        ])
      end
    end

    context "when content item is corporate information page without parent, organisations but with taxon" do
      let(:content_item) do
        item = GovukSchemas::Example.find(
          "corporate_information_page",
          example_name: "best-practice-about-page",
        )
        item = item.deep_dup
        item.dig("links", "organisations").clear
        item["links"]["taxons"] = [{
          "base_path" => "/corporate-information",
          "title" => "Corporate information",
          "phase" => "live",
        }]
        item
      end

      it "returns breadcrumbs based on taxons" do
        expect(subject.breadcrumbs).to eq([
          { title: "Home", url: "/", is_page_parent: false },
          { title: "Corporate information", url: "/corporate-information", is_page_parent: true },
        ])
      end
    end

    context "when content item is corporate information page without parent, organisations and taxons" do
      let(:content_item) do
        item = GovukSchemas::Example.find(
          "corporate_information_page",
          example_name: "best-practice-about-page",
        )
        item = item.deep_dup
        item.dig("links", "organisations").clear
        item
      end

      it "returns default breadcrumbs" do
        expect(subject.breadcrumbs).to eq([
          { title: "Home", url: "/" },
        ])
      end
    end
  end
end
