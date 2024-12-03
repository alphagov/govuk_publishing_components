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
        open: true,
        hidden: "",
        tabindex: "0",
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
        open: true,
        hidden: "",
        tabindex: "0",
      }
      expect(component_helper.all_attributes).to eql(expected)
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

    describe "classes" do
      it "accepts valid class names" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "gem-c-component govuk-component app-c-component brand--thing brand__thing direction-rtl")
        expected = {
          class: "gem-c-component govuk-component app-c-component brand--thing brand__thing direction-rtl",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "rejects invalid class names" do
        classes = "js-okay not-cool-man"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes:)
        }.to raise_error(ArgumentError, "Classes (#{classes}) must be prefixed with `js-`")
      end

      it "rejects classes that aren't an exact match of 'direction-rtl'" do
        classes = "direction-rtll"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes:)
        }.to raise_error(ArgumentError, "Classes (#{classes}) must be prefixed with `js-`")
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
    end

    describe "margin bottom" do
      it "accepts bottom margin" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(margin_bottom: 1)
        expected = {
          class: "govuk-!-margin-bottom-1",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "accepts valid class names and bottom margin" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "gem-c-component", margin_bottom: 5)
        expected = {
          class: "gem-c-component govuk-!-margin-bottom-5",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end
    end

    describe "id" do
      it "can set an id, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
        helper.set_id("override")
        expect(helper.all_attributes[:id]).to eql("override")
      end

      it "does not accept invalid ids" do
        ["1dstartingwithnumber", "id with spaces", "idwith.dot", "id\nwithnewline"].each do |id|
          expect {
            GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id:)
          }.to raise_error(ArgumentError, / contain/)
        end
      end

      it "does not accept invalid ids when passed" do
        expect {
          helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "valid")
          helper.set_id("not. a. valid. id")
        }.to raise_error(ArgumentError)
      end
    end

    describe "data attributes" do
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
    end

    describe "aria attributes" do
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
    end

    describe "roles" do
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
    end

    it "does not accept an invalid lang" do
      error = "lang attribute (klingon) is not recognised"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(lang: "klingon")
      }.to raise_error(ArgumentError, error)
    end

    describe "open" do
      it "accepts valid open attribute value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: true)
        expected = {
          open: true,
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "can set an open attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: true)
        helper.set_open(false)
        expect(helper.all_attributes[:open]).to eql(nil)
      end

      it "does not include an open attribute if the option is false" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: false)
        expect(component_helper.all_attributes).to eql({})
      end

      it "does not accept an invalid open value" do
        error = "open attribute (false) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: "false")
        }.to raise_error(ArgumentError, error)
      end
    end

    describe "hidden" do
      it "does not accept an invalid hidden value" do
        error = "hidden attribute (false) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(hidden: "false")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts valid hidden attribute value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(hidden: "until-found")
        expected = {
          hidden: "until-found",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "can set an hidden attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(hidden: "until-found")
        helper.set_hidden("hidden")
        expect(helper.all_attributes[:hidden]).to eql("hidden")
      end
    end

    describe "dir" do
      it "does not accept an invalid dir value" do
        error = "dir attribute (false) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(dir: "false")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts valid dir attribute value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(dir: "rtl")
        expected = {
          dir: "rtl",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "can set an dir attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(dir: "rtl")
        helper.set_dir("ltr")
        expect(helper.all_attributes[:dir]).to eql("ltr")
      end
    end

    it "can set an tabindex attribute, overriding a passed value" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: -1)
      helper.set_tabindex("1")
      expect(helper.all_attributes[:tabindex]).to eql("1")
    end

    describe "tabindex value regex" do
      it "accepts string numbers" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "-984347284732")
        expected = {
          tabindex: "-984347284732",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "accepts integer numbers" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: -984_347_284_732)
        expected = {
          tabindex: -984_347_284_732,
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "accepts 0" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "0")
        expected = {
          tabindex: "0",
        }
        expect(component_helper.all_attributes).to eql(expected)
      end

      it "does not accept text before a number" do
        error = "tabindex_attribute attribute (abc1) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "abc1")
        }.to raise_error(ArgumentError, error)
      end

      it "does not accept text after a number" do
        error = "tabindex_attribute attribute (123abc) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "123abc")
        }.to raise_error(ArgumentError, error)
      end

      it "does not accept extra negative symbols" do
        error = "tabindex_attribute attribute (--1) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "--1")
        }.to raise_error(ArgumentError, error)
      end

      it "does not accept extra symbols" do
        error = "tabindex_attribute attribute (-1!???) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "-1!???")
        }.to raise_error(ArgumentError, error)
      end
    end
  end
end
