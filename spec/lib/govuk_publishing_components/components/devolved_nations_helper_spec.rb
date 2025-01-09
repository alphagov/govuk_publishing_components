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

    it "returns title text, which contains one nation, and publication urls for three nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/publication-northern-ireland",
        },
        scotland: {
          applicable: false,
          alternative_url: "/publication-scotland",
        },
        wales: {
          applicable: false,
          alternative_url: "/publication-wales",
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.nations_with_urls[:northern_ireland][:alternative_url]).to eql("/publication-northern-ireland")
      expect(devolved_nations_helper.nations_with_urls[:scotland][:alternative_url]).to eql("/publication-scotland")
      expect(devolved_nations_helper.nations_with_urls[:wales][:alternative_url]).to eql("/publication-wales")
    end

    it "returns title text, which contains one nation, and publication urls for three nations, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/publication-northern-ireland",
        },
        scotland: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England, Scotland and Wales")
      expect(devolved_nations_helper.nations_with_urls[:northern_ireland][:alternative_url]).to eql("/publication-northern-ireland")
    end

    it "returns title text, which contains one nation, and consultation url for one nation, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(
        national_applicability: {
          england: {
            applicable: true,
          },
          northern_ireland: {
            applicable: false,
            alternative_url: "/consultation-northern-ireland",
          },
        },
        content_type: "consultation",
      )
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.alternative_content_text("northern_ireland")).to eql("Consultation for Northern Ireland")
    end

    it "returns title text, which contains one nation, and guidance url for one nation, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(
        national_applicability: {
          england: {
            applicable: true,
          },
          northern_ireland: {
            applicable: false,
            alternative_url: "/guidance-northern-ireland",
          },
        },
        content_type: "detailed_guide",
      )
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.alternative_content_text("northern_ireland")).to eql("Guidance for Northern Ireland")
    end

    it "returns title text, which contains one nation, and guidance url for one nation, when invalid type provided, correctly" do
      devolved_nations_helper = GovukPublishingComponents::Presenters::DevolvedNationsHelper.new(
        national_applicability: {
          england: {
            applicable: true,
          },
          northern_ireland: {
            applicable: false,
            alternative_url: "/publication-northern-ireland",
          },
        },
        content_type: "invalid_type",
      )
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.alternative_content_text("northern_ireland")).to eql("Publication for Northern Ireland")
    end
  end
end
