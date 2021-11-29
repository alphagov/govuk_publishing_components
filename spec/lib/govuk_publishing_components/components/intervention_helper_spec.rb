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

    it "returns the default query string if the one passed is empty" do
      existing_query_string = ""
      intervention_helper = GovukPublishingComponents::Presenters::InterventionHelper.new({ query_string: existing_query_string })
      new_query_string = intervention_helper.dismiss_link
      expect(new_query_string).to eql("?hide-intervention=true")
    end
  end
end
