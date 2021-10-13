require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnPriority do
  let(:brexit_taxon) do
    {
      "content_id" => "d6c2de5d-ef90-45d1-82d4-5f2438369eea",
      "base_path" => "/brexit",
      "title" => "Brexit",
    }
  end

  let(:brexit_business_taxon) do
    {
      "content_id" => "634fd193-8039-4a70-a059-919c34ff4bfc",
      "base_path" => "/brexit/business-guidance",
      "title" => "Brexit: business guidance",
      "details" => {
        "url_override" => "/guidance/brexit-guidance-for-businesses",
      },
    }
  end

  let(:brexit_individuals_taxon) do
    {
      "content_id" => "614b2e65-56ac-4f8d-bb9c-d1a14167ba25",
      "base_path" => "/brexit/guidance-individuals",
      "title" => "Brexit: guidance for individuals",
      "details" => {
        "url_override" => "/guidance/brexit-guidance-for-individuals",
      },
    }
  end

  let(:other_taxon) do
    {
      "content_id" => SecureRandom.uuid,
      "base_path" => "/other",
      "title" => "Other",
    }
  end

  let(:payload) { [brexit_taxon] }

  describe "#priority_taxon" do
    %w[directly_tagged_to_taxons indirectly_tagged_to_taxons].each do |tagged_to_taxons|
      context tagged_to_taxons do
        subject { described_class.new(send(tagged_to_taxons, payload)) }

        context "with brexit taxon" do
          let(:payload) { [brexit_taxon] }

          it "returns the brexit taxon" do
            priority_taxon = subject.priority_taxon
            brexit_audience = subject.brexit_audience(priority_taxon)

            expect(priority_taxon).to eq(brexit_taxon)
            expect(brexit_audience).to eq("Brexitbusinessandcitizen")
          end
        end

        context "with brexit_taxon and brexit_individuals taxon" do
          let(:payload) { [brexit_taxon, brexit_individuals_taxon] }

          it "returns the brexit_individuals taxon" do
            priority_taxon = subject.priority_taxon
            brexit_audience = subject.brexit_audience(priority_taxon)

            expect(priority_taxon).to eq(brexit_individuals_taxon)
            expect(brexit_audience).to eq("Brexitcitizen")
          end
        end

        context "with brexit_taxon taxon and brexit_business taxon" do
          let(:payload) { [brexit_taxon, brexit_business_taxon] }

          it "returns the brexit_business taxon" do
            priority_taxon = subject.priority_taxon
            brexit_audience = subject.brexit_audience(priority_taxon)

            expect(priority_taxon).to eq(brexit_business_taxon)
            expect(brexit_audience).to eq("Brexitbusiness")
          end
        end

        context "with brexit_individuals taxon and brexit_business taxon" do
          let(:payload) { [brexit_taxon, brexit_individuals_taxon, brexit_business_taxon] }

          it "returns the brexit_taxon taxon" do
            priority_taxon = subject.priority_taxon
            brexit_audience = subject.brexit_audience(priority_taxon)

            expect(priority_taxon).to eq(brexit_taxon)
            expect(brexit_audience).to eq("Brexitbusinessandcitizen")
          end
        end

        context "with no matches" do
          let(:payload) { [] }

          it "returns nil" do
            expect(subject.priority_taxon).to be_nil
          end
        end

        context "with priority-taxon query_parameters" do
          it "returns the default taxon if not tagged to priority taxon" do
            preferred_content_id = brexit_business_taxon["content_id"]
            query_parameters = { "priority-taxon" => preferred_content_id }
            payload = [brexit_individuals_taxon]
            content_item = send(tagged_to_taxons, payload)
            context_breadcrumb = described_class.new(content_item, query_parameters)

            expect(context_breadcrumb.priority_taxon).to eq(brexit_individuals_taxon)
          end
        end
      end

      describe "#priority_brexit_taxon" do
        let(:brexit_taxons) { [brexit_taxon, brexit_business_taxon] }
        let(:payload) { brexit_taxons }
        let(:content) { directly_tagged_to_taxons(payload) }
        subject { described_class.new(content) }

        it "returns the highest priority brexit taxon" do
          expect(subject.priority_brexit_taxon).to eq(brexit_business_taxon)
        end
      end

      describe ".call" do
        let(:content) { send(tagged_to_taxons, [brexit_taxon]) }

        it "returns the matching taxon" do
          expect(described_class.call(content)).to eq(breadcrumb_for(content, brexit_taxon))
        end

        context "with a url_override field present" do
          let(:content) { send(tagged_to_taxons, [brexit_individuals_taxon]) }
          let(:url_override) { brexit_individuals_taxon["details"]["url_override"] }

          it "it replaces the base path" do
            breadcrumbs = breadcrumb_for(content, brexit_individuals_taxon)
            breadcrumbs[:path] = url_override
            breadcrumbs[:tracking_action] = "superBreadcrumb Brexitcitizen"

            expect(described_class.call(content)).to eq(breadcrumbs)
          end
        end
      end
    end
  end

  def directly_tagged_to_taxons(taxons)
    taxons << other_taxon
    {
      "links" => {
        "taxons" => taxons.shuffle,
      },
    }
  end

  def indirectly_tagged_to_taxons(taxons)
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

  def breadcrumb_for(content_item, taxon)
    {
      title: taxon["title"],
      path: taxon["base_path"],
      tracking_category: "breadcrumbClicked",
      tracking_action: "superBreadcrumb Brexitbusinessandcitizen",
      tracking_label: content_item["base_path"],
      tracking_dimension_enabled: false,
    }
  end
end
