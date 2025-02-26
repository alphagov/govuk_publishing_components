require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::HtmlPublicationSchema do
  describe "when SchemaOrg passed schema of type :html_publication" do
    let(:page) { double schema: :html_publication }
    let(:schema) { double structured_data: true }

    it "the page is passed to this class" do
      expect(described_class).to receive(:new).and_return(schema)
      GovukPublishingComponents::Presenters::SchemaOrg.new(page).structured_data
    end
  end

  describe "#structured_data" do
    subject(:structured_data) { described_class.new(page).structured_data }

    let(:body) { nil }
    let(:q_and_a) { structured_data["mainEntity"] }
    let(:content_item) do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "html_publication")
      content_item["details"].merge!("body" => body) if body
      content_item
    end
    let(:page_data) do
      {
        content_item:,
        schema: :html_publication,
      }
    end
    let(:page) { GovukPublishingComponents::Presenters::Page.new(page_data) }

    it "behaves like an article" do
      expect(structured_data["@type"]).to eql("Article")
      expect(structured_data["articleBody"].to_s).to eq(page.body)
    end

    context "when one heading present" do
      let(:body) do
        <<~HTML
          <div class="govspeak">
            <h2>#{Faker::Lorem.sentence}</h2>
            <p>#{Faker::Lorem.paragraph}</p>
          </div>
        HTML
      end

      it "behaves like an article" do
        expect(structured_data["@type"]).to eql("Article")
        expect(structured_data["articleBody"]).to eq(page.body)
      end
    end

    context "when multiple single headings" do
      let(:body) do
        <<~HTML
          <div class="govspeak">
            <h2>#{Faker::Lorem.sentence}</h2>
            <p>#{Faker::Lorem.paragraph}</p>
            <h3>#{Faker::Lorem.sentence}</h3>
            <p>#{Faker::Lorem.paragraph}</p>
            <h4>#{Faker::Lorem.sentence}</h4>
            <p>#{Faker::Lorem.paragraph}</p>
          </div>
        HTML
      end

      it "behaves like an article" do
        expect(structured_data["@type"]).to eql("Article")
        expect(structured_data["articleBody"]).to eq(page.body)
      end
    end

    context "when more than one header of same type" do
      let(:heading_one) { Faker::Lorem.sentence }
      let(:content_one) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_two) { Faker::Lorem.sentence }
      let(:content_two) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:body) do
        <<~HTML
          <div class="govspeak">
            <h2>#{heading_one}</h2>
            #{content_one}
            <h2>#{heading_two}</h2>
            #{content_two}
          </div>
        HTML
      end

      it "has FAQ type" do
        expect(structured_data["@type"]).to eql("FAQPage")
      end

      it "presents each headed section in the questions and answers" do
        expect(q_and_a.count).to eq(2)
        expect(q_and_a.first["name"]).to eq(heading_one)
        expect(q_and_a.first["acceptedAnswer"]["text"].strip).to eq(content_one)

        expect(q_and_a.second["name"]).to eq(heading_two)
        expect(q_and_a.second["acceptedAnswer"]["text"].strip).to eq(content_two)
      end
    end

    context "with many headings of different types" do
      let(:heading_one) { Faker::Lorem.sentence }
      let(:content_one) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_two) { Faker::Lorem.sentence }
      let(:content_two) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_three) { Faker::Lorem.sentence }
      let(:content_three) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:body) do
        <<~HTML
          <div class="govspeak">
            <h2>#{Faker::Lorem.sentence}</h2>
            <p>#{Faker::Lorem.paragraph}</p>
            <h3>#{heading_one}</h3>
            #{content_one}
            <h3>#{heading_two}</h3>
            #{content_two}
            <h4>#{heading_three}</h4>
            #{content_three}
          </div>
        HTML
      end

      it "has FAQ type" do
        expect(structured_data["@type"]).to eql("FAQPage")
      end

      it "presents each h3 section in the questions and answers" do
        expect(q_and_a.count).to eq(2)
        expect(q_and_a.first["name"]).to eq(heading_one)
        expect(q_and_a.first["acceptedAnswer"]["text"].strip).to eq(content_one)
        expect(q_and_a.second["name"]).to eq(heading_two)
      end

      it "presents all the text after the last h3 in the answer" do
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(content_two)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(heading_three)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(content_three)
      end
    end

    context "with many headings of different types and more lower level ones" do
      let(:heading_one) { Faker::Lorem.sentence }
      let(:content_one) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_two) { Faker::Lorem.sentence }
      let(:content_two) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_three) { Faker::Lorem.sentence }
      let(:content_three) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_four) { Faker::Lorem.sentence }
      let(:content_four) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:heading_five) { Faker::Lorem.sentence }
      let(:content_five) { "<p>#{Faker::Lorem.paragraph}</p>" }
      let(:body) do
        <<~HTML
          <div class="govspeak">
            <h2>#{Faker::Lorem.sentence}</h2>
            <p>#{Faker::Lorem.paragraph}</p>
            <h3>#{heading_one}</h3>
            #{content_one}
            <h4>#{heading_three}</h4>
            #{content_three}
            <h3>#{heading_two}</h3>
            #{content_two}
            <h4>#{heading_four}</h4>
            #{content_four}
            <h4>#{heading_five}</h4>
            #{content_five}
          </div>
        HTML
      end

      it "has FAQ type" do
        expect(structured_data["@type"]).to eql("FAQPage")
      end

      it "has a question for each h3" do
        expect(q_and_a.count).to eq(2)
        expect(q_and_a.first["name"]).to eq(heading_one)
        expect(q_and_a.second["name"]).to eq(heading_two)
      end

      it "has the text after the first h3 as the first answer" do
        expect(q_and_a.first["acceptedAnswer"]["text"]).to include(content_one)
        expect(q_and_a.first["acceptedAnswer"]["text"]).to include(heading_three)
        expect(q_and_a.first["acceptedAnswer"]["text"]).to include(content_three)
      end

      it "presents all the text after the last h3 in the answer" do
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(content_two)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(heading_four)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(content_four)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(heading_five)
        expect(q_and_a.second["acceptedAnswer"]["text"]).to include(content_five)
      end
    end
  end
end
