require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::CheckboxesHelper do
  items = [
    {
      label: "Red",
      value: "red_value",
    },
    {
      label: "Blue",
      value: "blue_value",
    },
  ]
  name = "The name of this thing"

  describe "#initialize" do
    it "does nothing if nothing passed" do
      box = described_class.new({})
      expect(box.items).to eq([])
      expect(box.name).to be_nil
      expect(box.css_classes).to be_nil
    end

    it "accepts items and sets initial classes" do
      box = described_class.new({ items: items })
      expect(box.items).to eq(items)
      expect(box.css_classes).to eq(%w[gem-c-checkboxes govuk-form-group])
    end

    it "accepts a name" do
      box = described_class.new({ items: items, name: name })
      expect(box.name).to eq(name)
    end

    it "sets an error class" do
      box = described_class.new({ items: items, error: true })
      expect(box.error).to be(true)
      expect(box.css_classes).to eq(%w[gem-c-checkboxes govuk-form-group govuk-form-group--error])
    end

    it "sets a small class" do
      box = described_class.new({ items: items, small: true })
      expect(box.css_classes).to eq(%w[gem-c-checkboxes govuk-form-group govuk-checkboxes--small])
    end

    it "detects if there is a conditional" do
      items_with_conditional = [
        {
          label: "Red",
          value: "red_value",
          conditional: "<p>some markup</p>",
        },
        {
          label: "Blue",
          value: "blue_value",
        },
      ]
      box = described_class.new({ items: items_with_conditional })
      expect(box.has_conditional).to be(true)
    end

    it "detects if there are nested checkboxes" do
      items_with_nested = [
        {
          label: "Red",
          value: "red_value",
          items: [
            label: "Orange",
            value: "orange_value",
          ],
        },
        {
          label: "Blue",
          value: "blue_value",
        },
      ]
      box = described_class.new({ items: items_with_nested })
      expect(box.has_nested).to be(true)
    end

    it "sets a default id" do
      box = described_class.new({ items: items })
      expect(box.id).to include("checkboxes-")
    end

    it "sets a passed id" do
      box = described_class.new({ items: items, id: "this-is-my-id" })
      expect(box.id).to eq("this-is-my-id")
    end

    it "sets a passed description" do
      box = described_class.new({ items: items, description: "Description" })
      expect(box.description).to eq("Description")
    end

    it "sets a passed hint text" do
      box = described_class.new({ items: items, hint_text: "Hint text" })
      expect(box.hint_text).to eq("Hint text")
    end
  end

  describe "#should_have_fieldset" do
    one_checkbox = [
      {
        label: "Red",
        value: "red_value",
      },
    ]

    it "does not have a fieldset if only one checkbox" do
      box = described_class.new({ items: one_checkbox })
      expect(box.should_have_fieldset).to be(false)
    end

    it "has a fieldset if more than one checkbox" do
      box = described_class.new({ items: items })
      expect(box.should_have_fieldset).to be(true)
    end

    it "has a fieldset if there's a heading" do
      box = described_class.new({ items: one_checkbox, heading: "Heading" })
      expect(box.should_have_fieldset).to be(true)
    end
  end

  describe "#fieldset_describedby" do
    it "includes the id of the hint element by default" do
      box = described_class.new({ items: items })
      expect(box.fieldset_describedby[0]).to include("-hint")
    end

    it "is empty if no hint text specified" do
      box = described_class.new({ items: items, no_hint_text: true })
      expect(box.fieldset_describedby).to be_nil
    end

    it "contains the ids of the hint and error elements if there is an error included" do
      box = described_class.new({ items: items, error: true })
      expect(box.fieldset_describedby[0]).to include("-hint")
      expect(box.fieldset_describedby[1]).to include("-error")
    end
  end

  describe "#size" do
    it "is m by default" do
      box = described_class.new({ items: items })
      expect(box.size).to eq("m")
    end

    it "is xl if it is to be a page heading" do
      box = described_class.new({ items: items, is_page_heading: true })
      expect(box.size).to eq("xl")
    end

    it "is the passed value if it is valid" do
      box = described_class.new({ items: items, heading_size: "s" })
      expect(box.size).to eq("s")
    end

    it "defaults to m if the passed value is valid" do
      box = described_class.new({ items: items, heading_size: "xxxxxxllll" })
      expect(box.size).to eq("m")
    end
  end

  describe "#heading_markup" do
    it "is nil if no heading passed" do
      box = described_class.new({ items: items })
      expect(box.heading_markup).to be_nil
    end

    it "is a default page heading" do
      box = described_class.new({ items: items, heading: "Heading", is_page_heading: true })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl"><h1 class="gem-c-checkboxes__heading-text govuk-fieldset__heading">Heading</h1></legend>')
    end

    it "is a default page heading with a heading caption" do
      box = described_class.new({ items: items, heading: "Heading", is_page_heading: true, heading_caption: "Caption" })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl"><span class="govuk-caption-xl">Caption</span><h1 class="gem-c-checkboxes__heading-text govuk-fieldset__heading">Heading</h1></legend>')
    end

    it "is a page heading with a custom size" do
      box = described_class.new({ items: items, heading: "Heading", is_page_heading: true, heading_size: "s" })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--s"><h1 class="gem-c-checkboxes__heading-text govuk-fieldset__heading">Heading</h1></legend>')
    end

    it "is a page heading and a heading caption with a custom size" do
      box = described_class.new({ items: items, heading: "Heading", is_page_heading: true, heading_caption: "Caption", heading_size: "s" })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--s"><span class="govuk-caption-s">Caption</span><h1 class="gem-c-checkboxes__heading-text govuk-fieldset__heading">Heading</h1></legend>')
    end

    it "is a regular heading" do
      box = described_class.new({ items: items, heading: "Heading" })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">Heading</legend>')
    end

    it "is a regular heading with a custom size" do
      box = described_class.new({ items: items, heading: "Heading", heading_size: "s" })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Heading</legend>')
    end

    it "is a regular heading visually hidden" do
      box = described_class.new({ items: items, heading: "Heading", visually_hide_heading: true })
      expect(box.heading_markup).to eq('<legend class="govuk-fieldset__legend govuk-fieldset__legend--m gem-c-checkboxes__legend--hidden">Heading</legend>')
    end
  end

  describe "#checkbox_markup" do
    it "makes a checkbox" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox with controls" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        controls: "controls",
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" data-controls="controls" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox for a conditional" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        conditional: true,
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" data-aria-controls="red-conditional-1" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox with a name" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        name: "a-name",
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" name="a-name" id="red" value="red_value" class="govuk-checkboxes__input" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checked checkbox" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        checked: true,
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" checked="checked" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox with data attributes" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        data_attributes: {
          terry: "pratchett",
        },
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" data-terry="pratchett" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox with data attributes and controls" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        data_attributes: {
          terry: "pratchett",
        },
        controls: "controls",
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" data-terry="pratchett" data-controls="controls" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end

    it "makes a checkbox exclusive" do
      box = described_class.new({ items: items })
      item = {
        label: "Red",
        value: "red_value",
        id: "red",
        exclusive: true,
      }
      expect(box.checkbox_markup(item, 1)).to eq('<input type="checkbox" id="red" value="red_value" class="govuk-checkboxes__input" data-behaviour="exclusive" /><label for="red" class="govuk-label govuk-checkboxes__label">Red</label>')
    end
  end
end
