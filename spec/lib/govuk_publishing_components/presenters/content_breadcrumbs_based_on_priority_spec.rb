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

  let(:worker_taxon) do
    {
      "content_id" => "b7f57213-4b16-446d-8ded-81955d782680",
      "base_path" => "/coronavirus-taxon/work-and-financial-support",
      "title" => "Work and financial support during coronavirus",
      "details" => {
        "url_override" => "/guidance/brexit-guidance-for-individuals",
      },
    }
  end

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

  let(:payload) { [education_taxon] }

  describe "#priority_taxon" do
    %w[directly_tagged_to_taxons indirectly_tagged_to_taxons].each do |tagged_to_taxons|
      context tagged_to_taxons do
        subject { described_class.new(send(tagged_to_taxons, payload)) }

        it "returns the matching taxon" do
          expect(subject.priority_taxon).to eq(education_taxon)
        end

        context "with business taxon" do
          let(:payload) { [business_taxon] }

          it "returns the business taxon" do
            expect(subject.priority_taxon).to eq(business_taxon)
          end
        end

        context "with worker taxon" do
          let(:payload) { [worker_taxon] }

          it "returns the worker taxon" do
            expect(subject.priority_taxon).to eq(worker_taxon)
          end
        end

        context "with brexit taxon" do
          let(:payload) { [brexit_taxon] }

          it "returns the brexit taxon" do
            expect(subject.priority_taxon).to eq(brexit_taxon)
            expect(subject.brexit_audience).to eq("Brexitbusinessandcitizen")
          end
        end

        context "with education and business taxons" do
          let(:payload) { [education_taxon, business_taxon] }

          it "returns the education taxon" do
            expect(subject.priority_taxon).to eq(education_taxon)
          end
        end

        context "with brexit_taxon and brexit_individuals taxon" do
          let(:payload) { [brexit_taxon, brexit_individuals_taxon] }

          it "returns the brexit_individuals taxon" do
            expect(subject.priority_taxon).to eq(brexit_individuals_taxon)
            expect(subject.brexit_audience).to eq("Brexitcitizen")
          end
        end

        context "with brexit_taxon taxon and brexit_business taxon" do
          let(:payload) { [brexit_taxon, brexit_business_taxon] }

          it "returns the brexit_business taxon" do
            expect(subject.priority_taxon).to eq(brexit_business_taxon)
            expect(subject.brexit_audience).to eq("Brexitbusiness")
          end
        end

        context "with brexit_individuals taxon and brexit_business taxon" do
          let(:payload) { [brexit_taxon, brexit_individuals_taxon, brexit_business_taxon] }

          it "returns the brexit_taxon taxon" do
            expect(subject.priority_taxon).to eq(brexit_taxon)
            expect(subject.brexit_audience).to eq("Brexitbusinessandcitizen")
          end
        end

        context "with no matches" do
          let(:payload) { [] }

          it "returns nil" do
            expect(subject.priority_taxon).to be_nil
          end
        end

        context "with priority-taxon query_parameters" do
          it "returns the preferred priority taxon" do
            preferred_content_id = business_taxon["content_id"]
            query_parameters = { "priority-taxon" => preferred_content_id }
            payload = [education_taxon, business_taxon]
            content_item = send(tagged_to_taxons, payload)
            context_breadcrumb = described_class.new(content_item, query_parameters)

            expect(context_breadcrumb.priority_taxon).to eq(business_taxon)
          end

          it "returns the default taxon if not tagged to priority taxon" do
            preferred_content_id = business_taxon["content_id"]
            query_parameters = { "priority-taxon" => preferred_content_id }
            payload = [education_taxon]
            content_item = send(tagged_to_taxons, payload)
            context_breadcrumb = described_class.new(content_item, query_parameters)

            expect(context_breadcrumb.priority_taxon).to eq(education_taxon)
          end
        end
      end

      describe ".call" do
        let(:content) { send(tagged_to_taxons, [education_taxon]) }

        it "returns the matching taxon" do
          expect(described_class.call(content)).to eq(breadcrumb_for(content, education_taxon))
        end

        context "with a url_override field present" do
          let(:content) { send(tagged_to_taxons, [worker_taxon]) }
          let(:url_override) { worker_taxon["details"]["url_override"] }

          it "it replaces the base path" do
            breadcrumbs = breadcrumb_for(content, worker_taxon)
            breadcrumbs[:path] = url_override
            breadcrumbs[:tracking_action] = "superBreadcrumb"

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
      tracking_action: "superBreadcrumb",
      tracking_label: content_item["base_path"],
      tracking_dimension_enabled: false,
    }
  end
end
