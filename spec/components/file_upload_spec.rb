require "rails_helper"

describe "File upload", type: :view do
  def component_name
    "file_upload"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders input type file with name and label text" do
    render_component(
      label: { text: "Upload a file" },
      name: "file-upload",
    )

    assert_select ".govuk-file-upload[type='file']"
    assert_select ".govuk-file-upload[name='file-upload']"

    assert_select ".govuk-label", text: "Upload a file"
  end

  it "renders with JavaScript enhancement" do
    render_component(
      label: { text: "Upload a file" },
      name: "file-upload",
      javascript: true,
    )
    assert_select ".govuk-drop-zone[data-module='govuk-file-upload']"
  end

  it "renders input with multiple" do
    render_component(
      label: { text: "Upload a file" },
      name: "file-upload",
      multiple: true,
    )
    assert_select ".govuk-file-upload[multiple]"
  end

  it "renders input with a data attributes" do
    render_component(
      data: { module: "contextual-guidance" },
      name: "with-data-attributes",
    )

    assert_select ".govuk-file-upload[data-module='contextual-guidance']"
  end

  it "sets the 'for' on the label to the input id" do
    render_component(
      label: { text: "Can you provide more detail?" },
      name: "file-upload-label",
    )

    input = css_select(".govuk-file-upload")
    input_id = input.attr("id").text

    assert_select ".govuk-label[for='#{input_id}']"
  end

  it "sets the value when provided" do
    render_component(
      name: "file-upload-value",
      value: "C:/fakepath/myphoto.jpg",
    )

    assert_select ".govuk-file-upload[value='C:/fakepath/myphoto.jpg']"
  end

  it "sets accept attribute when provided" do
    render_component(
      name: "file-upload-value",
      accept: "image/*",
    )

    assert_select ".govuk-file-upload[accept='image/*']"
  end

  it "renders text input different sized labels" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      heading_size: "xl",
    )

    assert_select ".govuk-label.govuk-label--xl"
  end

  it "renders the label wrapped in a heading" do
    render_component(
      label: { text: "Where's your head at?" },
      name: "heading",
      heading_level: 3,
    )

    assert_select "h3.govuk-label-wrapper .govuk-label", text: "Where's your head at?"
  end

  it "only renders a label wrapped in a heading if specified" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      heading_size: "xl",
    )

    assert_select ".govuk-label-wrapper", false
  end

  context "when a hint is provided" do
    before do
      render_component(
        name: "file-upload-hint",
        hint: "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.",
      )
    end

    it "renders the hint" do
      assert_select ".govuk-hint", text: "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto."
    end

    it "has 'aria-describedby' the hint id" do
      hint_id = css_select(".govuk-hint").attr("id")

      assert_select ".govuk-file-upload[aria-describedby='#{hint_id}']"
    end
  end

  context "when an error_message is provided" do
    before do
      render_component(
        name: "file-upload-hint-error-message",
        error_message: "Please upload a file",
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Please upload a file"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-file-upload[aria-describedby='#{error_id}']"
    end
  end

  context "when error_items are provided" do
    before do
      render_component(
        name: "file-upload-hint-error-message",
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

      assert_select ".govuk-file-upload[aria-describedby='#{error_id}']"
    end
  end
end
