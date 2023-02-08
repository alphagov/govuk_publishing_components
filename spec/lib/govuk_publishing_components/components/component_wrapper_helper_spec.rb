RSpec.describe GovukPublishingComponents::Presenters::ComponentWrapperHelper do
  describe "Component helper" do
    it "accepts basic component attributes" do
      args = {
        id: "id",
        data: {
          module: "module",
        },
        aria: {
          labelledby: "element",
        },
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
        class: nil,
      }
      expect(component_helper.all_attributes).to eql(expected)
    end

    it "accepts valid class names" do
      component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "gem-c-component govuk-component")
      expected = {
        id: nil,
        data: nil,
        aria: nil,
        class: "gem-c-component govuk-component",
      }
      expect(component_helper.all_attributes).to eql(expected)
    end

    it "rejects invalid class names" do
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "js-okay not-cool-man")
      }.to raise_error(ArgumentError, "Passed classes must be prefixed with `js-`")
    end

    it "can set an id, overriding a passed value" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
      helper.set_id("override")
      expect(helper.all_attributes[:id]).to eql("override")
    end

    it "does not accept invalid ids" do
      error = "Id cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "2idstartingwithanumber")
      }.to raise_error(ArgumentError, error)

      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "id containing spaces")
      }.to raise_error(ArgumentError, error)

      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "idwitha.character")
      }.to raise_error(ArgumentError, error)
    end

    it "does not accept invalid ids when passed" do
      error = "Id cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`"
      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
        helper.set_id("2idstartingwithanumber")
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
        helper.set_id("id containing spaces")
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(id: "original")
        helper.set_id("idwitha.character")
      }.to raise_error(ArgumentError, error)
    end

    it "can add a class to already passed classes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "js-original")
      helper.add_class("gem-c-extra")
      expect(helper.all_attributes[:class]).to eql("js-original gem-c-extra")
    end

    it "will error if trying to add an invalid class to already passed classes" do
      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(classes: "js-original")
        helper.add_class("gem-c-extra something-invalid")
      }.to raise_error(ArgumentError, "Passed classes must be prefixed with `js-`")
    end

    it "can add data attributes to already passed data attributes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(data: { module: "original-module", other: "other" })
      helper.add_data_attribute({ module: "extra-module", another: "another" })
      expect(helper.all_attributes[:data]).to eql({ module: "original-module extra-module", other: "other", another: "another" })
    end

    it "can add aria attributes to already passed aria attributes" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "original-label", describedby: "other" })
      helper.add_aria_attribute({ label: "extra-label", controls: "something" })
      expect(helper.all_attributes[:aria]).to eql({ label: "original-label extra-label", describedby: "other", controls: "something" })
    end

    it "does not accept invalid aria attributes" do
      error = "Aria attribute is not recognised"
      expect {
        GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { potato: "salad" })
      }.to raise_error(ArgumentError, error)

      expect {
        helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(aria: { label: "something" })
        helper.add_aria_attribute({ potato: "salad" })
      }.to raise_error(ArgumentError, error)
    end

    it "can collect auditing information about component usage" do
      helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(component_id: "unique", potato: "potato")
      allow_any_instance_of(GovukPublishingComponents::Presenters::ComponentWrapperHelper).to(
        receive(:get_application_name).and_return("test application"),
      )
      allow_any_instance_of(Kernel)
        .to receive(:caller)
        .and_return([
          "app/views/govuk_publishing_components/components/_a_component.html.erb",
          "something else",
          "app/views/shared/template.html.erb",
          "another thing",
        ])
      d = Time.now
      expected = {
        application: "test application",
        component: "a component",
        date: d.strftime("%d/%m/%Y %H:%M"),
        options: {
          component_id: "unique",
          potato: "potato",
        },
        template: "app/views/shared/template.html.erb",
        url: "not found",
      }
      expect(helper.component_usage_data).to eql(expected)
    end
  end
end
