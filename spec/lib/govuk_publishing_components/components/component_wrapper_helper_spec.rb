RSpec.describe GovukPublishingComponents::Presenters::ComponentWrapperHelper do
  describe "Component helper" do
    it "accepts basic component attributes" do
      args = {
        id: "id",
        data_attributes: {
          module: "module",
        },
        aria: {
          labelledby: "element",
        },
        role: "navigation",
        lang: "en",
      }
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(args)
      expected = {
        id: "id",
        data: {
          module: "module",
        },
        aria: {
          labelledby: "element",
        },
        role: "navigation",
        lang: "en",
      }
      expect(component_helper.all_attributes).to eql(expected)
    end

    it "has an option to allow components to test it is installed and working correctly" do
      args = {
        component_wrapper_test: true,
      }
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(args)
      expected = {
        data: {
          componentwrappertest: "component wrapper installed",
        },
      }
      expect(component_helper.all_attributes).to eql(expected)

      # check that the test doesn't conflict with passed data attributes
      args = {
        component_wrapper_test: true,
        data_attributes: {
          module: "module",
        },
      }
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(args)
      expected = {
        data: {
          module: "module",
          componentwrappertest: "component wrapper installed",
        },
      }
      expect(component_helper.all_attributes).to eql(expected)
    end

    it "accepts valid class names" do
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "gem-c-component govuk-component brand--thing brand__thing")
      expected = {
        class: "gem-c-component govuk-component brand--thing brand__thing",
      }
      expect(component_helper.all_attributes).to eql(expected)
    end

    it "rejects invalid class names" do
      classes = "js-okay not-cool-man"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes:)
      }.to raise_error(ArgumentError, "Classes (#{classes}) must be prefixed with `js-`")
    end

    it "can set an id, overriding a passed value" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
      helper.set_id("override")
      expect(helper.all_attributes[:id]).to eql("override")
    end

    it "does not accept invalid ids" do
      ["2idstartingwithanumber", "id containing spaces", "idwitha.character"].each do |id|
        error = "Id (#{id}) cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id:)
        }.to raise_error(ArgumentError, error)
      end
    end

    it "does not accept invalid ids when passed" do
      ["2idstartingwithanumber", "id containing spaces", "idwitha.character"].each do |id|
        error = "Id (#{id}) cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`"
        expect {
          helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
          helper.set_id(id)
        }.to raise_error(ArgumentError, error)
      end
    end

    it "can add a class to already passed classes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "js-original")
      helper.add_class("gem-c-extra")
      expect(helper.all_attributes[:class]).to eql("js-original gem-c-extra")
    end

    it "will error if trying to add an invalid class to already passed classes" do
      classes = "gem-c-extra something-invalid"
      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "js-original")
        helper.add_class(classes)
      }.to raise_error(ArgumentError, "Classes (#{classes}) must be prefixed with `js-`")
    end

    it "does not error if passed blank values" do
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(
        id: nil,
        classes: nil,
        data_attributes: nil,
        aria: nil,
        role: nil,
        lang: nil,
      )
      expect(component_helper.all_attributes).to eql({})

      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(
        id: "",
        classes: "",
        data_attributes: "",
        aria: "",
        role: "",
        lang: "",
      )
      expect(component_helper.all_attributes).to eql({})
    end

    it "does not accept invalid data attributes" do
      invalid_data = { module: "ok", xml_something: "notok", "XML_something": "notok", "has space": "notok", "has:colon": "notok", normal: "ok" }
      error = "Data attributes (xml_something, XML_something, has space, has:colon) cannot contain capitals, spaces or colons, or start with 'xml'"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(data_attributes: invalid_data)
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(data_attributes: { module: "something" })
        helper.add_data_attribute(invalid_data)
      }.to raise_error(ArgumentError, error)
    end

    it "can add data attributes to already passed data attributes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(data_attributes: { module: "original-module", other: "other" })
      helper.add_data_attribute({ module: "extra-module", another: "another" })
      expect(helper.all_attributes[:data]).to eql({ module: "original-module extra-module", other: "other", another: "another" })
    end

    it "can add aria attributes to already passed aria attributes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "original-label", describedby: "other" })
      helper.add_aria_attribute({ label: "extra-label", controls: "something" })
      expect(helper.all_attributes[:aria]).to eql({ label: "original-label extra-label", describedby: "other", controls: "something" })
    end

    it "does not accept invalid aria attributes" do
      invalid_aria = { potato: "salad", label: "something", spoon: "invalid" }
      error = "Aria attribute (potato, spoon) not recognised"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: invalid_aria)
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "something" })
        helper.add_aria_attribute(invalid_aria)
      }.to raise_error(ArgumentError, error)
    end

    it "does not accept an invalid role" do
      error = "Role attribute (custarddoughnuts, moose) is not recognised"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "custarddoughnuts moose")
      }.to raise_error(ArgumentError, error)

      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "navigation custarddoughnuts moose")
      }.to raise_error(ArgumentError, error)
    end

    it "does not accept an invalid role when passed" do
      error = "Role attribute (custarddoughnuts, moose) is not recognised"
      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "navigation")
        helper.add_role("custarddoughnuts moose")
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "navigation")
        helper.add_role("alert custarddoughnuts moose")
      }.to raise_error(ArgumentError, error)
    end

    it "does not accept an invalid lang" do
      error = "lang attribute (klingon) is not recognised"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(lang: "klingon")
      }.to raise_error(ArgumentError, error)
    end
  end
end
