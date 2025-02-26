RSpec.describe GovukPublishingComponents::Presenters::SharedHelper do
  describe "Shared component helper" do
    after do
      I18n.locale = :en
    end

    it "returns a default heading level" do
      shared_helper = described_class.new({})
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a given heading level" do
      shared_helper = described_class.new(heading_level: 6)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h6")
    end

    it "returns the default heading level if passed value is wrong" do
      shared_helper = described_class.new(heading_level: 9)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a span instead of a heading if heading level is 0" do
      shared_helper = described_class.new(heading_level: 0)
      result = shared_helper.get_heading_level
      expect(result).to eql("span")
    end

    it "returns nil if given locale is same as page locale" do
      default_locale = I18n.locale
      shared_helper = described_class.new({})

      expect(shared_helper.t_locale_check(default_locale)).to be_nil
    end

    it "returns a locale if different to the page locale" do
      locale = "ar"
      shared_helper = described_class.new({})

      expect(shared_helper.t_locale_check(locale)).to eq locale
    end

    it "returns the language attribute if translation is not present" do
      I18n.locale = :de

      translation_key = "this.is.a.key.that.should.not.be.found.to.test.the.translation"
      shared_helper = described_class.new({})

      expect(shared_helper.t_lang(translation_key)).to eq "lang=en"
    end

    it "returns no language attribute if translation is present" do
      I18n.locale = :fr

      translation_key = "components.contents_list.contents"
      shared_helper = described_class.new({})

      expect(shared_helper.t_lang(translation_key)).to be_nil
    end

    it "returns the locale if translation is not present" do
      I18n.locale = :de

      translation_key = "this.is.a.key.that.should.not.be.found.to.test.the.translation"
      shared_helper = described_class.new({})

      expect(shared_helper.t_locale(translation_key)).to eq :en
    end

    it "returns no locale if translation is present and using default locale" do
      I18n.locale = :fr

      translation_key = "components.contents_list.contents"
      shared_helper = described_class.new({})

      expect(shared_helper.t_locale(translation_key)).to be :fr
    end
  end
end
