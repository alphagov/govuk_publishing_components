RSpec.describe GovukPublishingComponents::Presenters::TranslationNavHelper do
  translations = [
    {
      locale: "en",
      base_path: "/en",
      text: "English",
    },
  ]

  longer_translations = [
    {
      locale: "en",
      base_path: "/en",
      text: "English",
    },
    {
      locale: "hi",
      base_path: "/hi",
      text: "हिंदी",
    },
  ]

  describe "initialize" do
    it "sets default values correctly" do
      nav = described_class.new({})
      expect(nav.translations).to eq([])
    end

    it "accept passed translations" do
      nav = described_class.new({ translations: })
      expect(nav.translations).to eq(translations)
    end
  end

  describe "has_translations?" do
    it "is false with no translations" do
      nav = described_class.new({})
      expect(nav.has_translations?).to be_nil
    end

    it "is false when there is only one translation" do
      nav = described_class.new({ translations: })
      expect(nav.has_translations?).to be_nil
    end

    it "is true when there is more than one translation" do
      nav = described_class.new({ translations: longer_translations })
      expect(nav.has_translations?).to be(true)
    end
  end

  describe "classes" do
    it "returns default values" do
      nav = described_class.new({})
      expect(nav.classes).to eq("gem-c-translation-nav")
    end

    it "adds an inverse class when inverse is true" do
      nav = described_class.new({ inverse: true })
      expect(nav.classes).to eq("gem-c-translation-nav gem-c-translation-nav--inverse")
    end
  end

  describe "link_class" do
    it "returns nothing by default" do
      nav = described_class.new({})
      expect(nav.link_class).to be_nil
    end

    it "returns invert class when inverse is true" do
      nav = described_class.new({ inverse: true })
      expect(nav.link_class).to eq("govuk-link--inverse")
    end
  end
end
