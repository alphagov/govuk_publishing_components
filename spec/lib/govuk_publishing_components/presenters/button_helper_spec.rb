require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ButtonHelper do
  describe "margin bottom" do
    it "sets default margin bottom" do
      button = described_class.new({})
      expect(button.info_text_classes).to eq(%w[gem-c-button__info-text])
    end

    it "sets a margin bottom based on a valid option" do
      button = described_class.new({ margin_bottom: 4 })
      expect(button.info_text_classes).to eq(%w[gem-c-button__info-text govuk-!-margin-bottom-4])
    end

    it "sets a default margin bottom when passed an invalid option" do
      button = described_class.new({ margin_bottom: 120 })
      expect(button.info_text_classes).to eq(%w[gem-c-button__info-text gem-c-button__info-text--bottom-margin])
    end
  end

  describe "data attributes" do
    it "sets nothing if nothing is passed" do
      button = described_class.new({})
      expect(button.data_attributes).to eq({})
    end

    it "sets them correctly when passed" do
      data = { example: "one", example2: "two" }
      button = described_class.new({ data_attributes: data })
      expect(button.data_attributes).to eq(data)
    end

    it "includes the button module if a link is also passed" do
      button = described_class.new({ data_attributes: { example: "one", example2: "two" }, href: "/" })
      expect(button.data_attributes).to eq({ example: "one", example2: "two", module: "govuk-button" })
    end
  end

  describe "GA4 attributes" do
    it "does not set them by default" do
      button = described_class.new({})
      expect(button.data_attributes).to eq({})
    end

    it "sets them when start is true" do
      button = described_class.new({ start: true })
      expect(button.data_attributes).to eq({ ga4_attributes: { event_name: "navigation", type: "start button" }.to_json })
    end

    # ideally we'd return nothing rather than a nil attribute but nil attributes are ignored when rendering
    it "does not set them when start is true and GA4 is disabled" do
      button = described_class.new({ start: true, disable_ga4: true })
      expect(button.data_attributes).to eq({ ga4_attributes: nil })
    end
  end

  describe "classes" do
    it "correctly applies valid classes" do
      button = described_class.new({ classes: "js-one js-two" })
      expect(button.classes).to eq(%w[js-one js-two])
    end

    it "throws an error if classes are invalid" do
      expect {
        described_class.new({ classes: "js-one two" })
      }.to raise_error("Passed classes must be prefixed with `js-`")
    end
  end

  describe "link?" do
    it "knows that a href has not been passed" do
      button = described_class.new({})
      expect(button.link?).to be(false)
    end

    it "knows that a href has been passed" do
      button = described_class.new({ href: "/" })
      expect(button.link?).to be(true)
    end
  end

  describe "info_text?" do
    it "knows that info text has not been passed" do
      button = described_class.new({})
      expect(button.info_text?).to be(false)
    end

    it "knows that info text has been passed" do
      button = described_class.new({ info_text: "text" })
      expect(button.info_text?).to be(true)
    end
  end

  describe "aria_labelledby" do
    it "is not set without info_text" do
      button = described_class.new({})
      expect(button.aria_labelledby).to be_nil
    end

    it "is set with info_text" do
      button = described_class.new({ info_text: "text" })
      expect(button.aria_labelledby).to include("button-id-")
      expect(button.aria_labelledby).to include("info-text-id-")
    end
  end

  describe "info_text_options" do
    it "sets a default class" do
      button = described_class.new({})
      expect(button.info_text_options).to eq({ class: %w[gem-c-button__info-text] })
    end

    it "sets id and aria if info_text is present" do
      button = described_class.new({ info_text: "text" })
      expect(button.info_text_options).to include({ class: %w[gem-c-button__info-text] })
      expect(button.info_text_options).to include({ aria: { hidden: true } })
      expect(button.info_text_options[:id]).to include("info-text-id-")
    end
  end

  describe "html_options" do
    it "sets default values" do
      button = described_class.new({})
      expect(button.html_options).to eq({ class: "gem-c-button govuk-button", aria: { labelledby: nil }, data: {}, type: "submit" })
    end

    it "includes any valid passed classes" do
      button = described_class.new({ classes: "js-one js-two" })
      expect(button.html_options).to eq({ class: "gem-c-button govuk-button js-one js-two", aria: { labelledby: nil }, data: {}, type: "submit" })
    end

    it "includes required attributes if a href is passed" do
      button = described_class.new({ href: "/" })
      expect(button.html_options).to eq({ class: "gem-c-button govuk-button", aria: { labelledby: nil }, type: nil, data: { module: "govuk-button" }, role: "button", draggable: false })
    end

    it "sets id and labelledby if info_text passed" do
      button = described_class.new({ info_text: "text" })
      expect(button.html_options[:id]).to include("button-id-")
      expect(button.html_options[:aria][:labelledby]).to include("button-id-")
      expect(button.html_options[:aria][:labelledby]).to include("info-text-id-")
    end

    it "sets rel" do
      button = described_class.new({ rel: "rel_value" })
      expect(button.html_options[:rel]).to eq("rel_value")
    end

    it "sets data attributes" do
      data = { example: "one", example2: "two" }
      button = described_class.new({ data_attributes: data })
      expect(button.html_options[:data]).to eq(data)
    end

    it "sets title" do
      button = described_class.new({ title: "title_value" })
      expect(button.html_options[:title]).to eq("title_value")
    end

    it "sets target" do
      button = described_class.new({ target: "target_value" })
      expect(button.html_options[:target]).to eq("target_value")
    end

    it "sets name and value" do
      button = described_class.new({ name: "name_value", value: "value_value" })
      expect(button.html_options[:name]).to eq("name_value")
      expect(button.html_options[:value]).to eq("value_value")
    end

    it "does not set name if value is not present" do
      button = described_class.new({ name: "name_value" })
      expect(button.html_options[:name]).to be_nil
      expect(button.html_options[:value]).to be_nil
    end

    it "does not set value if name is not present" do
      button = described_class.new({ value: "value_value" })
      expect(button.html_options[:name]).to be_nil
      expect(button.html_options[:value]).to be_nil
    end

    it "sets aria_label" do
      button = described_class.new({ aria_label: "label_value" })
      expect(button.html_options[:aria]).to eq({ label: "label_value" })
    end

    it "sets aria_controls" do
      button = described_class.new({ aria_controls: "controls_value" })
      expect(button.html_options[:aria]).to eq({ controls: "controls_value", labelledby: nil })
    end

    it "sets aria_describedby" do
      button = described_class.new({ aria_describedby: "described_value" })
      expect(button.html_options[:aria]).to eq({ describedby: "described_value", labelledby: nil })
    end

    it "sets form" do
      button = described_class.new({ form: "form_value" })
      expect(button.html_options[:form]).to eq("form_value")
    end
  end

  describe "button_type" do
    it "sets a default if nothing passed" do
      button = described_class.new({})
      expect(button.button_type).to eq("submit")
    end

    it "sets a value if passed" do
      button = described_class.new({ type: "legendary" })
      expect(button.button_type).to eq("legendary")
    end

    it "is not set if button is a link" do
      button = described_class.new({ href: "/" })
      expect(button.button_type).to be_nil
    end
  end
end
