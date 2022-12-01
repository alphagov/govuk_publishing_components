RSpec.describe GovukPublishingComponents::Presenters::InterventionHelper do
  describe "Intervention helper" do
    describe ".dismiss_link" do
      it "returns the default dismiss query string" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({})
        default_dismiss_link = intervention_helper.dismiss_link

        expect(default_dismiss_link).to eql("?hide-intervention=true")
      end

      it "adds the dismiss query string parameter" do
        existing_query_string = "?a=b"
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ query_string: existing_query_string })
        new_query_string = intervention_helper.dismiss_link

        expect(new_query_string).to eql("?a=b&hide-intervention=true")
      end

      it "returns the default query string if the one passed is empty" do
        existing_query_string = ""
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ query_string: existing_query_string })
        new_query_string = intervention_helper.dismiss_link

        expect(new_query_string).to eql("?hide-intervention=true")
      end
    end

    describe ".show?" do
      it "returns falsey value when no params are passed" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({})

        expect(intervention_helper.show?).to be_falsey
      end
    end

    describe ".security_attr" do
      it "returns default security attributes for new tab links" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page" })
        security_attrs = intervention_helper.security_attr

        expect(security_attrs).to eql("noopener noreferrer")
      end

      it "returns appends external attribute for new tab external links" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ suggestion_link_text: "Text", suggestion_link_url: "https://www.nationalarchives.gov.uk" })
        security_attrs = intervention_helper.security_attr

        expect(security_attrs).to eql("noopener noreferrer external")
      end
    end

    describe ".accessible_link_text" do
      it "appends text to make new tab link accessible" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ suggestion_link_text: "Text", suggestion_link_url: "/path-to-page" })
        link_text = intervention_helper.accessible_text

        expect(link_text).to eq("Text (opens in a new tab)")
      end

      it "doesn't append text if link text is already accessible" do
        intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ suggestion_link_text: "Travel abroad (opens in a new tab) guidance", suggestion_link_url: "/path-to-page" })
        link_text = intervention_helper.accessible_text

        expect(link_text).to eq("Travel abroad (opens in a new tab) guidance")
      end
    end
  end
end
