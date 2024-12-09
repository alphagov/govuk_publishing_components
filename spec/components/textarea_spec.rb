require "rails_helper"

describe "Textarea", type: :view do
  def component_name
    "textarea"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders textarea with name and label text" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "more-details",
    )

    assert_select ".govuk-textarea"
    assert_select ".govuk-textarea[name='more-details']"

    assert_select ".govuk-label", text: "Can you provide more detail?"
  end

  it "renders textarea with a custom id" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "more-details",
      id: "this-id",
    )

    assert_select "#this-id.govuk-textarea"
  end

  it "renders textarea with a custom number of rows" do
    render_component(
      name: "custom-rows",
      rows: 10,
    )

    assert_select ".govuk-textarea"
    assert_select ".govuk-textarea[rows='10']"
  end

  it "renders textarea with a data attributes" do
    render_component(
      data: { module: "contextual-guidance" },
      name: "with-data-attributes",
    )

    assert_select ".govuk-textarea[data-module='contextual-guidance']"
  end

  it "renders textarea with aria describedby attribute if provided" do
    render_component(
      label: { text: "Title" },
      name: "described",
      describedby: "contextual-guidance",
    )

    assert_select ".govuk-textarea[aria-describedby='contextual-guidance']"
  end

  it "renders textarea with disabled spellcheck" do
    render_component(
      spellcheck: "false",
      name: "with-disabled-spellcheck",
    )

    assert_select ".govuk-textarea[spellcheck='false']"
  end

  it "sets the 'for' on the label to the textarea id" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "more-detail-label",
    )

    textarea = css_select(".govuk-textarea")
    textarea_id = textarea.attr("id").text

    assert_select ".govuk-label[for='#{textarea_id}']"
  end

  it "sets the value when provided" do
    render_component(
      name: "more-detail-value",
      value: "More detail provided",
    )

    assert_select ".govuk-textarea", text: "More detail provided"
  end

  it "applies a specified bottom margin" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "with-custom-margin-bottom",
      margin_bottom: 4,
    )

    assert_select '.gem-c-textarea.govuk-\!-margin-bottom-4'
  end

  it "defaults to the initial bottom margin if an incorrect value is passed" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "with-fallback-margin-bottom",
      margin_bottom: 12,
    )

    assert_select '.gem-c-textarea.govuk-\!-margin-bottom-6'
  end

  it "defaults to the initial bottom margin if no value is passed" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "with-no-given-margin-bottom",
    )

    assert_select '.gem-c-textarea.govuk-\!-margin-bottom-6'
  end

  context "when a hint is provided" do
    before do
      render_component(
        name: "more-detail-hint",
        hint: "Don’t include personal or financial information, eg your National Insurance number or credit card details.",
      )
    end

    it "renders the hint" do
      assert_select ".govuk-hint", text: "Don’t include personal or financial information, eg your National Insurance number or credit card details."
    end

    it "has 'aria-describedby' the hint id" do
      hint_id = css_select(".govuk-hint").attr("id")

      assert_select ".govuk-textarea[aria-describedby='#{hint_id}']"
    end
  end

  context "when an error_message is provided" do
    before do
      render_component(
        name: "more-detail-hint-error-message",
        error_message: "Please enter more detail",
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Please enter more detail"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-textarea[aria-describedby='#{error_id}']"
    end
  end

  it "renders multiple aria describedby" do
    render_component(
      label: { text: "Title" },
      name: "with-multiple-aria-describedby",
      hint: "Don’t include personal or financial information.",
      error_message: "Please enter more detail",
      describedby: "contextual-guidance",
    )
    hint_id = css_select(".govuk-hint").attr("id")
    error_id = css_select(".govuk-error-message").attr("id")

    assert_select ".govuk-textarea[aria-describedby='#{hint_id} #{error_id} contextual-guidance']"
  end

  context "when error_items are provided" do
    before do
      render_component(
        name: "more-detail-hint-error-message",
        error_items: [
          {
            text: "Error item 1",
          },
          {
            text: "Error item 2",
          },
        ],
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Error item 1Error item 2"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-textarea[aria-describedby='#{error_id}']"
    end
  end

  it "renders the textarea and label with the correct `dir` attribute when the textarea is set to 'right_to_left: true'" do
    render_component(
      name: "rtl-textarea-text",
      value: "العربيَّة",
      right_to_left: true,
      label: {
        text: "Some label text that displays right to left",
      },
    )

    assert_select ".govuk-textarea[dir='rtl']"
    assert_select ".govuk-label[dir='rtl']"
  end

  it "renders the textarea and help text (label, hint and error messages) with the correct `dir` attribute when `right_to_left` is set to true and `right_to_left_help` is set to false" do
    render_component(
      name: "rtl-textarea-text",
      value: "العربيَّة",
      hint: "Some hint text that is displayed left to right",
      right_to_left: true,
      right_to_left_help: false,
      error_message: "An error message that is displayed left to right",
      label: {
        text: "Some label text that displays left to right",
      },
    )

    assert_select ".govuk-textarea[dir='rtl']"
    assert_select ".govuk-label[dir='rtl']", false
    assert_select ".govuk-hint[dir='rtl']", false
    assert_select ".govuk-error-message[dir='rtl']", false
  end
end
