RSpec.describe GovukPublishingComponents::Presenters::SinglePageNotificationButtonHelper do
  describe "Single page notification button helper" do
    it "sets button location when input is valid" do
      single_helper = described_class.new(button_location: "bottom")
      expect(single_helper.button_location_is_valid?).to be(true)

      single_helper = described_class.new(button_location: "top")
      expect(single_helper.button_location_is_valid?).to be(true)
    end

    it "does not set button location when input is invalid" do
      single_helper = described_class.new(button_location: "birmingham")
      expect(single_helper.button_location_is_valid?).to be(false)
    end

    it "sets correct button text when already subscribed" do
      single_helper = described_class.new({ already_subscribed: true })
      expect(single_helper.button_text).to eq("Stop getting emails about this page")
      expect(single_helper.default_unsubscribe_text).to eq("Stop getting emails about this page")
    end

    it "sets correct button text when not already subscribed" do
      single_helper = described_class.new({ already_subscribed: false })
      expect(single_helper.button_text).to eq("Get emails about this page")
      expect(single_helper.default_subscribe_text).to eq("Get emails about this page")
    end

    it "checks for custom button text" do
      single_helper = described_class.new({ button_text: { subscribe: "subscribe now", unsubscribe: "unsubscribe me now" } })
      expect(single_helper.custom_subscribe_text).to eq("subscribe now")
      expect(single_helper.custom_unsubscribe_text).to eq("unsubscribe me now")
      expect(single_helper.custom_button_text_is_valid?).to be(true)
    end

    it "returns false when missing custom button text" do
      single_helper = described_class.new({})
      expect(single_helper.custom_button_text_is_valid?).to be(false)
    end

    it "sets form action correctly when skip is not true" do
      single_helper = described_class.new({})
      expect(single_helper.form_action).to eq("/email/subscriptions/single-page/new")
    end

    it "set form action correctly when skip is true" do
      single_helper = described_class.new(skip_account: true)
      expect(single_helper.form_action).to eq("/email-signup")
    end

    it "sets skip account param" do
      single_helper = described_class.new(skip_account: "true")
      expect(single_helper.skip_account_param).to eq("single_page_subscription")
    end

    it "sets skip_account when skip_account is a string value of true" do
      single_helper = described_class.new(skip_account: "true")
      expect(single_helper.skip_the_gov_uk_account?).to be(true)
    end

    it "sets skip_account when skip_account is a boolean value of true" do
      single_helper = described_class.new(skip_account: true)
      expect(single_helper.skip_the_gov_uk_account?).to be(true)
    end

    it "doesn't set skip_account when no value" do
      single_helper = described_class.new({})
      expect(single_helper.skip_the_gov_uk_account?).to be(false)
    end

    it "doesn't set skip_account with an invalid value" do
      single_helper = described_class.new(skip_account: "moo")
      expect(single_helper.skip_the_gov_uk_account?).to be(false)
    end
  end
end
