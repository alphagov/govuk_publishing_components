require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::SelectHelper do
  error_items = [
    {
      text: "Error! Look out!",
    },
  ]
  error_id = "3"
  hint_id = "9"
  hint = "Remember to breathe regularly."

  options = [
    {
      text: "Option 1",
      value: "option1",
    },
  ]
  complex_options = [
    {
      text: "Option 1",
      value: "option1",
      disabled: true,
    },
    {
      text: "Option 2",
      value: "option2",
      data_attributes: {
        another_attribute: "attribute 1",
        something_else: "attribute 2",
        some_json: "{ thing1: 'thing2' }",
      },
    },
  ]

  describe "initialize" do
    it "sets default values correctly" do
      select = described_class.new({})
      expect(select.options).to eq([])
      expect(select.error_items).to eq([])
      expect(select.error_id).to be_nil
      expect(select.hint).to be_nil
      expect(select.hint_id).to be_nil
      expect(select.options_markup).to eq("")
      expect(select.describedby).to eq(%w[])
    end

    it "accepts valid options" do
      select = described_class.new({ options: })
      expect(select.options).to eq(options)
    end

    it "accepts error items and an error id" do
      select = described_class.new({ error_items:, error_id: })
      expect(select.error_items).to eq(error_items)
      expect(select.error_id).to eq(error_id)
    end

    it "accepts error items and an error message" do
      error_message = "I told you to look out."
      select = described_class.new({ error_items:, error_message: })
      expect(select.error_items).to eq([
        {
          text: "Error! Look out!",
        },
        {
          text: "I told you to look out.",
        },
      ])
    end

    it "can take a hint and a hint id" do
      hint = "Look behind the spooky door."
      hint_id = "11"
      select = described_class.new({ hint:, hint_id: })
      expect(select.hint).to eq(hint)
      expect(select.hint_id).to eq(hint_id)
    end

    it "creates markup for basic options" do
      select = described_class.new({ options: })
      expect(select.options_markup).to eq("<option value=\"option1\">Option 1</option>")
    end

    it "create markup for complex options" do
      expected = "<option disabled=\"disabled\" value=\"option1\">Option 1</option>
<option data-another-attribute=\"attribute 1\" data-something-else=\"attribute 2\" data-some-json=\"{ thing1: &#39;thing2&#39; }\" value=\"option2\">Option 2</option>"
      select = described_class.new({ options: complex_options })
      expect(select.options_markup).to eq(expected)
    end
  end

  describe "describedby" do
    it "returns the default when no options are passed" do
      select = described_class.new({})
      expect(select.describedby).to eq([])
    end

    it "adds a generated error_id" do
      allow(SecureRandom).to receive(:hex).and_return("1234")
      select = described_class.new({ error_items: })
      expect(select.describedby).to eq(%w[error-1234])
    end

    it "adds a passed error_id" do
      select = described_class.new({ error_id: })
      expect(select.describedby).to eq([error_id])
    end

    it "adds a generated hint_id" do
      allow(SecureRandom).to receive(:hex).and_return("1234")
      select = described_class.new({ error_items:, hint: })
      expect(select.describedby).to eq(%w[error-1234 hint-1234])
    end

    it "adds a passed hint_id" do
      select = described_class.new({ hint_id:, hint: })
      expect(select.describedby).to eq([hint_id])
    end
  end

  describe "css_classes" do
    it "returns defaults" do
      select = described_class.new({})
      expect(select.css_classes).to eq(%w[govuk-form-group gem-c-select])
    end

    it "returns error class if error_items is present" do
      select = described_class.new({ error_items: })
      expect(select.css_classes).to eq(%w[govuk-form-group gem-c-select govuk-form-group--error])
    end
  end

  describe "select_classes" do
    it "returns defaults" do
      select = described_class.new({})
      expect(select.select_classes).to eq(%w[govuk-select])
    end

    it "returns the right classes for full_width" do
      select = described_class.new({ full_width: true })
      expect(select.select_classes).to eq(%w[govuk-select gem-c-select__select--full-width])
    end

    it "returns the right classes with an error_id" do
      select = described_class.new({ error_id: })
      expect(select.select_classes).to eq(%w[govuk-select govuk-select--error])
    end

    it "returns the right classes for full_width and an error_id" do
      select = described_class.new({ full_width: true, error_id: })
      expect(select.select_classes).to eq(%w[govuk-select gem-c-select__select--full-width govuk-select--error])
    end
  end

  describe "label_classes" do
    it "returns defaults" do
      select = described_class.new({})
      expect(select.label_classes).to eq(%w[govuk-label])
    end

    it "returns the right classes with a heading_size" do
      select = described_class.new({ heading_size: "11" })
      expect(select.label_classes).to eq(%w[govuk-label govuk-label--11])
    end
  end
end
