require 'rails_helper'

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

  it "sets the 'for' on the label to the input id" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address"
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

  it "renders inputs with an aria-describedby if provided" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      describedby: "some-other-element"
    )

    assert_select ".govuk-input[aria-describedby='some-other-element']"
  end

  it "renders input with a data attributes" do
    render_component(
      data: { module: "contextual-guidance" },
      name: "with-data-attributes"
    )

    assert_select ".govuk-input[data-module='contextual-guidance']"
  end

  it "renders autofocused input" do
    render_component(
      label: { text: "Username" },
      name: "username",
      autofocus: true,
      tabindex: 0
    )

    assert_select ".govuk-input[autofocus][tabindex='0']"
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
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Please enter a valid email address"
    end

    it "has 'aria-describedby' the error message id" do
      error_message_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-input[aria-describedby='#{error_message_id}']"
    end
  end
end
