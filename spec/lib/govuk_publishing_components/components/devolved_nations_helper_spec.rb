RSpec.describe GovukPublishingComponents::Presenters::DevolvedNationsHelper do
  describe "Devolved nations component helper" do
    it "returns title text, which contains one nation, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
    end

    it "returns title text, which contains two nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England and Wales")
    end

    it "returns title text, which contains three nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        scotland: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England, Scotland and Wales")
    end

    it "returns title text, which contains one nation, and guidance urls for three nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/guidance-northern-ireland",
        },
        scotland: {
          applicable: false,
          alternative_url: "/guidance-scotland",
        },
        wales: {
          applicable: false,
          alternative_url: "/guidance-wales",
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.nations_with_urls[:northern_ireland][:alternative_url]).to eql("/guidance-northern-ireland")
      expect(devolved_nations_helper.nations_with_urls[:scotland][:alternative_url]).to eql("/guidance-scotland")
      expect(devolved_nations_helper.nations_with_urls[:wales][:alternative_url]).to eql("/guidance-wales")
    end

    it "returns title text, which contains one nation, and guidance urls for three nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/guidance-northern-ireland",
        },
        scotland: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England, Scotland and Wales")
      expect(devolved_nations_helper.nations_with_urls[:northern_ireland][:alternative_url]).to eql("/guidance-northern-ireland")
    end
  end
end
