require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnOrganisations do
  subject { described_class.new(content_item) }

  let(:content_item) { GovukSchemas::Example.find("corporate_information_page", example_name: "best-practice-about-page") }

  describe "#initialize" do
    it "does not raise exception" do
      expect { subject }.not_to raise_error
    end
  end

  describe "#breadcrumbs" do
    it "returns breadcrumbs based on organisation" do
      expect(subject.breadcrumbs).to eq([
        { title: "Home", url: "/" },
        { title: "Organisations", url: "/government/organisations" },
        {
          title: "Intellectual Property Office",
          url: "/government/organisations/intellectual-property-office",
        },
      ])
    end
  end
end
