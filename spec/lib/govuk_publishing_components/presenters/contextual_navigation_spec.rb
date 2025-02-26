require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContextualNavigation do
  subject(:contextual_navigation) { described_class.new(content_item, request) }

  let(:example) { %w[guide guide] }
  let(:content_item) { example_document_for(example.first, example.second) }
  let(:path) { content_item["base_path"] }
  let(:query_parameters) { {} }
  let(:request) { instance_double(ActionDispatch::Request, path:, query_parameters:) }

  def example_document_for(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name:)
  end

  describe "#initialize" do
    it "does not raise exception" do
      expect { contextual_navigation }.not_to raise_error
    end
  end

  describe "#organisation_breadcrumbs" do
    it "calls ContentBreadcrumbsBasedOnOrganisation" do
      called_class = GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnOrganisations
      expect(called_class).to receive(:call)
        .with(content_item)
        .and_return([])
      contextual_navigation.organisation_breadcrumbs
    end
  end

  describe "#content_has_related_organisations?" do
    context "when content item is linked to no organisations" do
      let(:example) { %w[homepage homepage_with_popular_links_on_govuk] }

      it "returns false" do
        expect(contextual_navigation.content_has_related_organisations?).to be(false)
      end
    end

    context "when content item is only linked to world organisations" do
      let(:example) { %w[worldwide_corporate_information_page worldwide_corporate_information_page] }

      it "returns false" do
        expect(contextual_navigation.content_has_related_organisations?).to be(false)
      end
    end

    context "when content item is linked to at least 1 normal organisation" do
      let(:example) { %w[document_collection document_collection] }

      it "returns true" do
        expect(contextual_navigation.content_has_related_organisations?).to be(true)
      end
    end
  end

  describe "#content_is_a_corporate_information_page?" do
    context "when content item is corporate information page" do
      let(:example) { %w[corporate_information_page corporate_information_page] }

      it "returns true" do
        expect(contextual_navigation.content_is_a_corporate_information_page?).to be(true)
      end
    end

    context "when content item is not corporate information page" do
      let(:example) { %w[guide guide] }

      it "returns false" do
        expect(contextual_navigation.content_is_a_corporate_information_page?).to be(false)
      end
    end
  end

  describe "#use_organisation_breadcrumbs?" do
    context "when content item is corporate information page linked to at least 1 normal organisation" do
      let(:example) { %w[corporate_information_page best-practice-working-at] }

      it "returns true" do
        expect(contextual_navigation.use_organisation_breadcrumbs?).to be(true)
      end
    end

    context "when content item is not corporate information page linked to at least 1 normal organisation" do
      let(:example) { %w[worldwide_corporate_information_page worldwide_corporate_information_page] }

      it "returns false" do
        expect(contextual_navigation.use_organisation_breadcrumbs?).to be(false)
      end
    end
  end
end
