RSpec.describe GovukPublishingComponents::Presenters::DevolvedNationsHelper do
  describe "Devolved nations component helper" do
    it "returns title text, which contains one nation, correctly" do
      devolved_nations_helper = described_class.new(national_applicability: {
        england: {
          applicable: true,
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
    end

    it "returns title text, which contains two nations, correctly" do
      devolved_nations_helper = described_class.new(national_applicability: {
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
      devolved_nations_helper = described_class.new(national_applicability: {
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
      devolved_nations_helper = described_class.new(national_applicability: {
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
      expect(devolved_nations_helper.nations_with_urls["/publication-northern-ireland"]).to eql("Publication for Northern Ireland")
      expect(devolved_nations_helper.nations_with_urls["/publication-scotland"]).to eql("Publication for Scotland")
      expect(devolved_nations_helper.nations_with_urls["/publication-wales"]).to eql("Publication for Wales")
    end

    it "returns title text, which contains one nation, and publication urls for one nation, correctly" do
      devolved_nations_helper = described_class.new(national_applicability: {
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
      expect(devolved_nations_helper.nations_with_urls["/publication-northern-ireland"]).to eql("Publication for Northern Ireland")
    end

    it "returns title text, which contains one nation, and publication urls for three nations when two have the same url, correctly" do
      devolved_nations_helper = described_class.new(national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/publication-northern-ireland",
        },
        scotland: {
          applicable: false,
          alternative_url: "/publication-scotland-wales",
        },
        wales: {
          applicable: false,
          alternative_url: "/publication-scotland-wales",
        },
      })
      expect(devolved_nations_helper.applicable_nations_title_text).to eql("England")
      expect(devolved_nations_helper.nations_with_urls["/publication-northern-ireland"]).to eql("Publication for Northern Ireland")
      expect(devolved_nations_helper.nations_with_urls["/publication-scotland-wales"]).to eql("Publication for Scotland and Wales")
    end

    it "returns title text, which contains one nation, and consultation url for one nation, correctly" do
      devolved_nations_helper = described_class.new(
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
      expect(devolved_nations_helper.alternative_content_text("Northern Ireland")).to eql("Consultation for Northern Ireland")
    end

    it "returns title text, which contains one nation, and guidance url for one nation, correctly" do
      devolved_nations_helper = described_class.new(
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
      expect(devolved_nations_helper.alternative_content_text("Northern Ireland")).to eql("Guidance for Northern Ireland")
    end

    it "returns title text, which contains one nation, and guidance url for one nation, when invalid type provided, correctly" do
      devolved_nations_helper = described_class.new(
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
      expect(devolved_nations_helper.alternative_content_text("Northern Ireland")).to eql("Publication for Northern Ireland")
    end
  end
end
