require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnPriority do
  let(:education_taxon) do
    {
      "content_id" => "272308f4-05c8-4d0d-abc7-b7c2e3ccd249",
      "base_path" => "/coronavirus-education-path",
      "title" => "Coronavirus Education",
    }
  end

  let(:business_taxon) do
    {
      "content_id" => "65666cdf-b177-4d79-9687-b9c32805e450",
      "base_path" => "/coronavirus-business-path",
      "title" => "Coronavirus Business",
    }
  end

  let(:other_taxon) do
    {
      "content_id" => SecureRandom.uuid,
      "base_path" => "/other",
      "title" => "Other",
    }
  end

  let(:payload) { [education_taxon] }

  subject { described_class.new(content_with(payload)) }

  describe "#taxon" do
    it "returns the matching taxon" do
      expect(subject.taxon).to eq(education_taxon)
    end

    context "with business taxon" do
      let(:payload) { [business_taxon] }

      it "returns the business taxon" do
        expect(subject.taxon).to eq(business_taxon)
      end
    end

    context "with education and business taxons" do
      let(:payload) { [education_taxon, business_taxon] }

      it "returns the education taxon" do
        expect(subject.taxon).to eq(education_taxon)
      end
    end

    context "with no matches" do
      let(:payload) { [] }

      it "returns nil" do
        expect(subject.taxon).to be_nil
      end
    end
  end

  describe ".call" do
    let(:content) { content_with([education_taxon]) }

    it "returns the matching taxon" do
      expect(described_class.call(content)).to eq(education_taxon)
    end
  end

  def content_with(taxons)
    taxons << other_taxon
    {
      "links" => {
        "taxons" => [
          {
            "links" => {
              "parent_taxons" => taxons.shuffle,
            },
          },
        ],
      },
    }
  end
end
