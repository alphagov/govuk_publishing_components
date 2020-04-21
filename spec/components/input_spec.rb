require "rails_helper"

describe "Input", type: :view do
  def component_name
    "input"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders text input with name and label text" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
    )

    assert_select ".govuk-input[type='text']"
    assert_select ".govuk-input[name='email-address']"

    assert_select ".govuk-label", text: "What is your email address?"
  end

  it "renders inputs with a configurable type" do
    render_component(
      name: "email-address",
      type: "email",
    )

    assert_select ".govuk-input[type='email']"
    assert_select ".govuk-input[name='email-address']"
  end

  # https://design-system.service.gov.uk/components/text-input/#numbers
  it "renders inputs with type number as per Design System guidance" do
    render_component(
      name: "account-number",
      type: "number",
    )

    assert_select ".govuk-input[type='text'][pattern='[0-9]*'][inputmode='numeric']"
  end

  it "renders an input with a given id" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      id: "test",
    )

    assert_select ".govuk-input#test"
  end

  it "sets the 'for' on the label to the input id" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
    )

    input = css_select(".govuk-input")
    input_id = input.attr("id").text

    assert_select ".govuk-label[for='#{input_id}']"
  end

  it "sets the value when provided" do
    render_component(
      name: "email-address",
      value: "example@example.com",
    )

    assert_select ".govuk-input[value='example@example.com']"
  end

  it "renders inputs with aria attributes if provided" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      describedby: "something",
      controls: "something-else",
    )

    assert_select ".govuk-input[aria-describedby='something'][aria-controls='something-else']"
  end

  it "renders inputs with an autocomplete attribute if provided" do
    render_component(
      label: { text: "What is your name?" },
      name: "name",
      autocomplete: "name",
    )

    assert_select ".govuk-input[autocomplete='name']"
  end

  it "renders input with a data attributes" do
    render_component(
      data: { module: "contextual-guidance" },
      name: "with-data-attributes",
    )

    assert_select ".govuk-input[data-module='contextual-guidance']"
  end

  it "renders autofocused input" do
    render_component(
      label: { text: "Username" },
      name: "username",
      autofocus: true,
      tabindex: 0,
    )

    assert_select ".govuk-input[autofocus][tabindex='0']"
  end

  it "sets the maxlength when provided" do
    render_component(
      name: "email-address",
      maxlength: 10,
    )

    assert_select ".govuk-input[maxlength='10']"
  end

  it "renders input with custom width" do
    render_component(
      name: "email-address",
      width: 10,
    )

    assert_select ".govuk-input.govuk-input--width-10"
  end

  it "renders default input width if the custom width is not supported" do
    render_component(
      name: "email-address",
      width: 11,
    )
    expect(page).to have_no_css(".govuk-input--width-10")
  end

  context "when a hint is provided" do
    before do
      render_component(
        name: "email-address",
        hint: "Please enter a valid email address",
      )
    end

    it "renders the hint" do
      assert_select ".govuk-hint", text: "Please enter a valid email address"
    end

    it "has 'aria-describedby' the hint id" do
      hint_id = css_select(".govuk-hint").attr("id")

      assert_select ".govuk-input[aria-describedby='#{hint_id}']"
    end
  end

  context "when an error_message is provided" do
    before do
      render_component(
        name: "email-address",
        error_message: "Please enter a valid email address",
        error_id: "optional"
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Please enter a valid email address"
    end

    it "accepts a passed error id" do
      assert_select "#optional.govuk-error-message"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-input[aria-describedby='#{error_id}']"
    end
  end

  context "when error_items are provided" do
    before do
      render_component(
        name: "email-address",
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

      assert_select ".govuk-input[aria-describedby='#{error_id}']"
    end
  end

  it "renders text input different sized labels" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      heading_size: "xl",
    )

    assert_select ".govuk-label.govuk-label--xl"
  end
end
