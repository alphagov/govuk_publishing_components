RSpec.describe GovukPublishingComponents::Presenters::SubscriptionLinksHelper do
  email_signup_link_data_attributes = { test: "value" }
  feed_link_box_value = 3

  after do
    I18n.locale = :en
  end

  describe "initialize" do
    it "sets default values correctly" do
      allow(SecureRandom).to receive(:hex).and_return("12")
      subs = described_class.new({})
      expect(subs.feed_box_id).to eq("feed-reader-12")
      expect(subs.email_signup_link).to be_nil
      expect(subs.email_signup_link_data_attributes).to be_nil
      expect(subs.feed_link_box_value).to be_nil
    end

    it "accepts a value for email_signup_link" do
      subs = described_class.new({ email_signup_link: "/test" })
      expect(subs.email_signup_link).to eq("/test")
    end

    it "accepts a value for email_signup_link_data_attributes" do
      subs = described_class.new({ email_signup_link_data_attributes: })
      expect(subs.email_signup_link_data_attributes).to eq(email_signup_link_data_attributes)
    end

    it "accepts a value for feed_link_box_value" do
      subs = described_class.new({ feed_link_box_value: })
      expect(subs.feed_link_box_value).to eq(feed_link_box_value)
    end
  end

  describe "email_signup_link_text" do
    it "has a default value" do
      subs = described_class.new({})
      expect(subs.email_signup_link_text).to eq("Get emails")
    end

    it "has the right default value in a different language" do
      I18n.locale = :de
      subs = described_class.new({})
      expect(subs.email_signup_link_text).to eq(I18n.t("components.subscription_links.email_signup_link_text", locale: "de"))
    end

    it "accepts a passed value" do
      email_signup_link_text = "cabbage"
      subs = described_class.new({ email_signup_link_text: })
      expect(subs.email_signup_link_text).to eq(email_signup_link_text)
    end
  end

  describe "feed_link_text" do
    it "has a default value" do
      subs = described_class.new({})
      expect(subs.feed_link_text).to eq("Subscribe to feed")
    end

    it "has the right default value in a different language" do
      I18n.locale = :fr
      subs = described_class.new({})
      expect(subs.feed_link_text).to eq(I18n.t("components.subscription_links.feed_link_text", locale: "fr"))
    end

    it "accepts a passed value" do
      feed_link_text = "cabbage"
      subs = described_class.new({ feed_link_text: })
      expect(subs.feed_link_text).to eq(feed_link_text)
    end
  end

  describe "component_data_is_valid?" do
    it "is false by default" do
      subs = described_class.new({})
      expect(subs.component_data_is_valid?).to be(false)
    end

    it "is true if any of three values are present" do
      subs = described_class.new({ email_signup_link: "test" })
      expect(subs.component_data_is_valid?).to be(true)

      subs = described_class.new({ feed_link: "test" })
      expect(subs.component_data_is_valid?).to be(true)

      subs = described_class.new({ feed_link_box_value: "test" })
      expect(subs.component_data_is_valid?).to be(true)
    end
  end

  describe "tracking_is_present?" do
    it "is false by default" do
      subs = described_class.new({})
      expect(subs.tracking_is_present?).to be(false)
    end

    it "is true when email_signup_link_data_attributes is present" do
      subs = described_class.new({ email_signup_link_data_attributes: })
      expect(subs.tracking_is_present?).to be(true)
    end
  end

  describe "feed_link" do
    it "is nil by default" do
      subs = described_class.new({})
      expect(subs.feed_link).to be_nil
    end

    it "is set to # if there is a feed_link_box_value" do
      subs = described_class.new({ feed_link_box_value: })
      expect(subs.feed_link).to eq("#")
    end

    it "returns feed_link if set" do
      subs = described_class.new({ feed_link: "/link" })
      expect(subs.feed_link).to eq("/link")
    end
  end

  describe "feed_link_data_attributes" do
    feed_link_data_attributes = { key: "value" }

    it "is an empty object by default" do
      subs = described_class.new({})
      expect(subs.feed_link_data_attributes).to eq({})
    end

    it "returns passed attributes" do
      subs = described_class.new({ feed_link_data_attributes: })
      expect(subs.feed_link_data_attributes).to eq(feed_link_data_attributes)
    end

    it "includes data controls if there is a feed link box" do
      allow(SecureRandom).to receive(:hex).and_return("12")
      expected = {
        key: "value",
        expanded: "false",
        controls: "feed-reader-12",
      }
      subs = described_class.new({ feed_link_data_attributes:, feed_link_box_value: })
      expect(subs.feed_link_data_attributes).to eq(expected)
    end
  end
end
