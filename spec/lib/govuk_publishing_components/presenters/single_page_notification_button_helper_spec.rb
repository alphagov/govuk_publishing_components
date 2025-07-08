RSpec.describe GovukPublishingComponents::Presenters::SinglePageNotificationButtonHelper do
  describe "Single page notification button helper" do
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
