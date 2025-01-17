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
        role: "region",
        lang: "en",
        open: true,
        hidden: "",
        tabindex: "0",
        dir: "rtl",
        type: "submit",
        draggable: "true",
        name: "a_name",
        title: "Hello",
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
        role: "region",
        lang: "en",
        open: true,
        hidden: "",
        tabindex: "0",
        dir: "rtl",
        type: "submit",
        draggable: "true",
        name: "a_name",
        title: "Hello",
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
        open: nil,
        hidden: nil,
        tabindex: nil,
        dir: nil,
        type: nil,
        draggable: nil,
        title: nil,
        name: nil,
      )
      expect(component_helper.all_attributes).to eql({})
    end

    it "does not error if passed empty values" do
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(
        id: "",
        classes: "",
        data_attributes: "",
        aria: "",
        role: "",
        lang: "",
        open: "",
        tabindex: "",
        dir: "",
        type: "",
        draggable: "",
        title: "",
        name: "",
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

    describe "setting an id" do
      it "does not accept invalid ids" do
        ["1dstartingwithnumber", "id with spaces", "idwith.dot", "id\nwithnewline"].each do |id|
          expect {
            GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id:)
          }.to raise_error(ArgumentError, / contain/)
        end
      end

      it "accepts a valid id" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "valid")
        expect(helper.all_attributes[:id]).to eql("valid")
      end

      it "can set an id, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
        helper.set_id("override")
        expect(helper.all_attributes[:id]).to eql("override")
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
      it "does not accept invalid aria attributes" do
        invalid_aria = { potato: "salad", label: "something", spoon: "invalid" }
        error = "Aria attribute (potato, spoon) not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: invalid_aria)
        }.to raise_error(ArgumentError, error)

        expect {
          helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "something_valid" })
          helper.add_aria_attribute(invalid_aria)
        }.to raise_error(ArgumentError, error)
      end

      it "can add aria attributes to already passed aria attributes" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "original-label", describedby: "other" })
        helper.add_aria_attribute({ label: "extra-label", controls: "something" })
        expect(helper.all_attributes[:aria]).to eql({ label: "original-label extra-label", describedby: "other", controls: "something" })
      end
    end

    describe "roles" do
      it "does not accept an invalid role" do
        error = "Role attribute (custarddoughnuts, moose) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "custarddoughnuts moose")
        }.to raise_error(ArgumentError, error)

        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "region custarddoughnuts moose")
        }.to raise_error(ArgumentError, error)
      end

      it "does not accept an invalid role when passed" do
        error = "Role attribute (custarddoughnuts, moose) is not recognised"
        expect {
          helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "region")
          helper.add_role("custarddoughnuts moose")
        }.to raise_error(ArgumentError, error)

        expect {
          helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "region")
          helper.add_role("alert custarddoughnuts moose")
        }.to raise_error(ArgumentError, error)
      end

      it "can add a role to already passed roles" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(role: "alert")
        helper.add_role("combobox")
        expect(helper.all_attributes[:role]).to eql("alert combobox")
      end
    end

    describe "lang" do
      it "does not accept an invalid lang" do
        error = "lang attribute (klingon) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(lang: "klingon")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts a valid lang value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(lang: "en")
        expect(component_helper.all_attributes[:lang]).to eql("en")
      end

      it "can set a lang attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(lang: "en")
        helper.set_lang("de")
        expect(helper.all_attributes[:lang]).to eql("de")
      end
    end

    describe "open" do
      it "does not accept an invalid open value" do
        error = "open attribute (false) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: "false")
        }.to raise_error(ArgumentError, error)
      end

      it "does not include an open attribute if the option is false" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: false)
        expect(component_helper.all_attributes[:open]).to eql(nil)
      end

      it "can set an open attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(open: true)
        helper.set_open(false)
        # false should remove the attribute entirely, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#attributes
        expect(helper.all_attributes[:open]).to eql(nil)
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
        expect(component_helper.all_attributes[:hidden]).to eql("until-found")
      end

      it "can set a hidden attribute, overriding a passed value" do
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
        expect(component_helper.all_attributes[:dir]).to eql("rtl")
      end

      it "can set an dir attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(dir: "rtl")
        helper.set_dir("ltr")
        expect(helper.all_attributes[:dir]).to eql("ltr")
      end
    end

    describe "tabindex" do
      it "can set an tabindex attribute, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: -1)
        helper.set_tabindex("1")
        expect(helper.all_attributes[:tabindex]).to eql("1")
      end

      describe "tabindex value regex" do
        it "accepts string numbers" do
          component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "-984347284732")
          expect(component_helper.all_attributes[:tabindex]).to eql("-984347284732")
        end

        it "accepts integer numbers" do
          component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: -984_347_284_732)
          expect(component_helper.all_attributes[:tabindex]).to eql(-984_347_284_732)
        end

        it "accepts 0" do
          component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(tabindex: "0")
          expect(component_helper.all_attributes[:tabindex]).to eql("0")
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

    describe "type" do
      it "does not accept an invalid type value" do
        error = "type attribute (false) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(type: "false")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts valid type value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(type: "datetime-local")
        expect(component_helper.all_attributes[:type]).to eql("datetime-local")
      end

      it "can set a type, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(type: "submit")
        helper.set_type("button")
        expect(helper.all_attributes[:type]).to eql("button")
      end
    end

    describe "draggable" do
      it "does not accept an invalid draggable value" do
        error = "draggable attribute (ostrich) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(draggable: "ostrich")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts valid draggable value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(draggable: "true")
        expect(component_helper.all_attributes[:draggable]).to eql("true")
      end

      it "can set a draggable, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(draggable: "true")
        helper.set_draggable("false")
        expect(helper.all_attributes[:draggable]).to eql("false")
      end
    end

    describe "rel" do
      it "does not accept an invalid rel value" do
        error = "rel attribute (hubris) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "hubris")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts a valid rel value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow")
        expect(component_helper.all_attributes[:rel]).to eql("nofollow")
      end

      it "accepts multiple valid rel values" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow noreferrer")
        expect(component_helper.all_attributes[:rel]).to eql("nofollow noreferrer")
      end

      it "does not accept multiple rel values if one of them is invalid" do
        error = "rel attribute (nofollow noreferrer potato) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow noreferrer potato")
        }.to raise_error(ArgumentError, error)
      end

      it "can set a rel, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow")
        helper.set_rel("noreferrer")
        expect(helper.all_attributes[:rel]).to eql("noreferrer")
      end

      it "can add a rel to an existing rel" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow")
        helper.add_rel("noreferrer")
        expect(helper.all_attributes[:rel]).to eql("nofollow noreferrer")
      end

      it "can add multiple rels to an existing rel" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(rel: "nofollow")
        helper.add_rel("noreferrer external")
        expect(helper.all_attributes[:rel]).to eql("nofollow noreferrer external")
      end
    end

    describe "target" do
      it "does not accept an invalid target value" do
        error = "target attribute (zelda) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(target: "zelda")
        }.to raise_error(ArgumentError, error)
      end

      it "accepts a valid target value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(target: "_blank")
        expect(component_helper.all_attributes[:target]).to eql("_blank")
      end

      it "can set a target, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(target: "_blank")
        helper.set_target("_self")
        expect(helper.all_attributes[:target]).to eql("_self")
      end
    end

    describe "title" do
      it "accepts a valid title value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(title: "this is a title")
        expect(component_helper.all_attributes[:title]).to eql("this is a title")
      end

      it "can set a title, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(title: "this is a title")
        helper.set_title("this is a different title")
        expect(helper.all_attributes[:title]).to eql("this is a different title")
      end
    end

    describe "name" do
      it "accepts a valid name value" do
        component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(name: "a_name")
        expect(component_helper.all_attributes[:name]).to eql("a_name")
      end

      it "can set a name, overriding a passed value" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(name: "a_name")
        helper.set_name("another_name")
        expect(helper.all_attributes[:name]).to eql("another_name")
      end
    end

    describe "margins" do
      it "complains about an invalid margin" do
        error = "margin_bottom option (15) is not recognised"
        expect {
          GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(margin_bottom: 15)
        }.to raise_error(ArgumentError, error)
      end

      it "defaults to no margin" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new({})
        expect(helper.all_attributes[:class]).to eql(nil)
      end

      it "accepts a passed margin" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(margin_bottom: 5)
        expect(helper.all_attributes[:class]).to eql("govuk-!-margin-bottom-5")
      end

      it "can set a margin, overriding a passed margin" do
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(margin_bottom: 5)
        helper.set_margin_bottom(0)
        expect(helper.all_attributes[:class]).to eql("govuk-!-margin-bottom-0")
      end
    end
  end
end
