RSpec.describe GovukPublishingComponents::Presenters::SharedHelper do
  describe "Shared component helper" do
    after(:each) do
      I18n.locale = :en
    end

    it "returns a default margin class" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-3")
    end

    it "returns a given margin class" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(margin_bottom: 6)
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-6")
    end

    it "returns the default margin class if passed value is wrong" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(margin_bottom: "a")
      margin_class = shared_helper.get_margin_bottom
      expect(margin_class).to eql("govuk-!-margin-bottom-3")
    end

    it "returns a default heading level" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a given heading level" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 6)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h6")
    end

    it "returns the default heading level if passed value is wrong" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 9)
      heading = shared_helper.get_heading_level
      expect(heading).to eql("h2")
    end

    it "returns a span instead of a heading if heading level is 0" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(heading_level: 0)
      result = shared_helper.get_heading_level
      expect(result).to eql("span")
    end

    it "accepts passed class names if prefixed with 'js-'" do
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(classes: "js-okay js-fine")
      expect(shared_helper.classes).to eql(%w[js-okay js-fine])
    end

    it "rejects passed class names if not prefixed with 'js-'" do
      expect {
        GovukPublishingComponents::Presenters::SharedHelper.new(classes: "js-okay not-cool-man")
      }.to raise_error(ArgumentError, "Passed classes must be prefixed with `js-`")
    end

    it "sets data attributes" do
      attributes = {
        example_attribute: 14,
      }
      expected_attributes = {
        example_attribute: 14,
      }
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(data: attributes)
      expect(shared_helper.get_data_attributes).to eql(expected_attributes)
    end

    it "sets default GTM attributes" do
      local_assigns = {
        gtm: true,
      }
      expected_attributes = {
        gtm_attributes: {
          event_name: "n/a",
          event_of_interest: false,
          privacy: false,
          component: {
            category: "n/a",
            main_type: "n/a",
            sub_type: "n/a",
            variant: "n/a",
            sup: "n/a",
            text: "n/a",
            url: "n/a",
            value: "n/a",
            position: "n/a",
            action: "n/a",
            section: "n/a",
            heading: "n/a",
            accessible_asset: "n/a",
          },
        },
      }
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(local_assigns)
      expect(shared_helper.get_data_attributes).to eql(expected_attributes)
    end

    it "accepts given GTM attributes" do
      local_assigns = {
        gtm: true,
        data: {
          gtm_attributes: {
            event_name: "this component",
          },
        },
      }
      expected_attributes = {
        gtm_attributes: {
          event_name: "this component",
          event_of_interest: false,
          privacy: false,
          component: {
            category: "n/a",
            main_type: "n/a",
            sub_type: "n/a",
            variant: "n/a",
            sup: "n/a",
            text: "n/a",
            url: "n/a",
            value: "n/a",
            position: "n/a",
            action: "n/a",
            section: "n/a",
            heading: "n/a",
            accessible_asset: "n/a",
          },
        },
      }
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(local_assigns)
      expect(shared_helper.get_data_attributes).to eql(expected_attributes)
    end

    it "allows both data attributes and gtm attributes" do
      local_assigns = {
        gtm: true,
        data: {
          attribute1: "1",
          attribute2: "2",
          gtm_attributes: {
            event_name: "this component",
            component: {
              category: "this category",
            },
          },
        },
      }
      expected_attributes = {
        attribute1: "1",
        attribute2: "2",
        gtm_attributes: {
          event_name: "this component",
          event_of_interest: false,
          privacy: false,
          component: {
            category: "this category",
            main_type: "n/a",
            sub_type: "n/a",
            variant: "n/a",
            sup: "n/a",
            text: "n/a",
            url: "n/a",
            value: "n/a",
            position: "n/a",
            action: "n/a",
            section: "n/a",
            heading: "n/a",
            accessible_asset: "n/a",
          },
        },
      }
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(local_assigns)
      expect(shared_helper.get_data_attributes).to eql(expected_attributes)
    end

    it "allows gtm attributes to be overridden if passed with data attributes" do
      local_assigns = {
        gtm: true,
        data: {
          attribute1: "1",
          gtm_attributes: {
            event_name: "test",
            component: {
              category: "navigation",
            },
          },
        },
      }
      expected_attributes = {
        attribute1: "1",
        gtm_attributes: {
          event_name: "test",
          event_of_interest: false,
          privacy: false,
          component: {
            category: "navigation",
            main_type: "n/a",
            sub_type: "n/a",
            variant: "n/a",
            sup: "n/a",
            text: "n/a",
            url: "n/a",
            value: "n/a",
            position: "n/a",
            action: "n/a",
            section: "n/a",
            heading: "n/a",
            accessible_asset: "n/a",
          },
        },
      }
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(local_assigns)
      expect(shared_helper.get_data_attributes).to eql(expected_attributes)
    end

    it "returns nil if given locale is same as page locale" do
      default_locale = I18n.locale
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_locale_check(default_locale)).to be nil
    end

    it "returns a locale if different to the page locale" do
      locale = "ar"
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_locale_check(locale)).to eq locale
    end

    it "returns the language attribute if translation is not present" do
      I18n.locale = :de

      translation_key = "this.is.a.key.that.should.not.be.found.to.test.the.translation"
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_lang(translation_key)).to eq "lang=en"
    end

    it "returns no language attribute if translation is present" do
      I18n.locale = :fr

      translation_key = "components.contents_list.contents"
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_lang(translation_key)).to be nil
    end

    it "returns the locale if translation is not present" do
      I18n.locale = :de

      translation_key = "this.is.a.key.that.should.not.be.found.to.test.the.translation"
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_locale(translation_key)).to eq :en
    end

    it "returns no locale if translation is present and using default locale" do
      I18n.locale = :fr

      translation_key = "components.contents_list.contents"
      shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})

      expect(shared_helper.t_locale(translation_key)).to be :fr
    end
  end
end
