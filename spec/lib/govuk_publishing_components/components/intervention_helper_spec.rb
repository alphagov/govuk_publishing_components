RSpec.describe GovukPublishingComponents::Presenters::InterventionHelper do
  describe "Intervention helper" do
    describe ".dismiss_link" do
      it "returns the default dismiss query string" do
        intervention_helper = described_class.new({})
        default_dismiss_link = intervention_helper.dismiss_link

        expect(default_dismiss_link).to eql("?hide-intervention=true")
      end

      it "appends the dismiss query string parameter" do
        query_string = "?a=b"

        intervention_helper = described_class.new(query_string:)
        new_query_string = intervention_helper.dismiss_link

        expect(new_query_string).to eql("?a=b&hide-intervention=true")
      end

      it "returns the default query string if the one passed is empty" do
        existing_query_string = ""
        request = Rack::Utils.parse_nested_query(existing_query_string)

        intervention_helper = described_class.new(request:)
        new_query_string = intervention_helper.dismiss_link

        expect(new_query_string).to eql("?hide-intervention=true")
      end
    end

    describe ".show?" do
      it "returns falsey value when no banner data args are passed" do
        intervention_helper = described_class.new({ params: {} })

        expect(intervention_helper).not_to be_show
      end

      it "returns falsey value when only some of required params are passed" do
        intervention_helper = described_class.new({ suggestion_link_text: "Text", params: {} })

        expect(intervention_helper).not_to be_show
      end

      it "returns falsey value when required params and hide query param is passed" do
        params = {
          "hide-intervention" => "true",
        }
        intervention_helper = described_class.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page", params: })

        expect(intervention_helper).not_to be_show
      end

      it "returns true when required params are passed" do
        intervention_helper = described_class.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page", params: {} })

        expect(intervention_helper).to be_show
      end
    end

    describe ".security_attr" do
      it "returns default security attributes for new tab links" do
        intervention_helper = described_class.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page", params: {} })
        security_attrs = intervention_helper.security_attr

        expect(security_attrs).to eql("noopener noreferrer")
      end

      it "returns appends external attribute for new tab external links" do
        external_urls = %w[https://www.nationalarchives.gov.uk //external.com https://www.gov.uk.example.com].freeze

        external_urls.each do |url|
          intervention_helper = described_class.new({ suggestion_link_text: "Text", suggestion_link_url: url, params: {} })
          security_attrs = intervention_helper.security_attr

          expect(security_attrs).to eql("noopener noreferrer external")
        end
      end
    end

    describe ".accessible_link_text" do
      it "appends text to make new tab link accessible" do
        intervention_helper = described_class.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page", params: {} })
        link_text = intervention_helper.accessible_text

        expect(link_text).to eq("Text (opens in a new tab)")
      end

      it "doesn't append text if link text is already accessible" do
        intervention_helper = described_class.new({ suggestion_link_text: "Travel abroad (opens in a new tab) guidance", suggestion_link_url: "/path-to-page", params: {} })
        link_text = intervention_helper.accessible_text

        expect(link_text).to eq("Travel abroad (opens in a new tab) guidance")
      end
    end
  end
end
