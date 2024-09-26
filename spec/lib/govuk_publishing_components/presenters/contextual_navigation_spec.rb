require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContextualNavigation do
  subject { described_class.new(content_item, request) }
  let(:content_item) { GovukSchemas::Example.find("guide", example_name: "guide") }
  let(:path) { content_item["base_path"] }
  let(:query_parameters) { {} }
  let(:request) { instance_double("ActionDispatch::Request", path:, query_parameters:) }

  describe "#initialize" do
    it "does not raise exception" do
      expect { subject }.not_to raise_error
    end
  end

  describe "#organisation_breadcrumbs" do
    it "calls ContentBreadcrumbsBasedOnOrganisation" do
      called_class = GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnOrganisations
      expect(called_class).to receive(:call)
        .with(content_item)
        .and_return([])
      subject.organisation_breadcrumbs
    end
  end

  describe "#content_has_related_organisations?" do
    context "when content item is linked to no organisations" do
      let(:content_item) do
        GovukSchemas::Example.find(
          "homepage",
          example_name: "homepage_with_popular_links_on_govuk",
        )
      end

      it "returns false" do
        expect(subject.content_has_related_organisations?).to be(false)
      end
    end

    context "when content item is only linked to world organisations" do
      let(:content_item) do
        GovukSchemas::Example.find(
          "worldwide_corporate_information_page",
          example_name: "worldwide_corporate_information_page",
        )
      end

      it "returns false" do
        expect(subject.content_has_related_organisations?).to be(false)
      end
    end

    context "when content item is linked to at least 1 normal organisation" do
      let(:content_item) { GovukSchemas::Example.find("document_collection", example_name: "document_collection") }

      it "returns true" do
        expect(subject.content_has_related_organisations?).to be(true)
      end
    end
  end

  describe "#content_is_a_corporate_information_page?" do
    context "when content item is corporate information page" do
      let(:content_item) do
        GovukSchemas::Example.find("corporate_information_page", example_name: "corporate_information_page")
      end

      it "returns true" do
        expect(subject.content_is_a_corporate_information_page?).to be(true)
      end
    end

    context "when content item is not corporate information page" do
      let(:content_item) { GovukSchemas::Example.find("guide", example_name: "guide") }

      it "returns false" do
        expect(subject.content_is_a_corporate_information_page?).to be(false)
      end
    end
  end
end
