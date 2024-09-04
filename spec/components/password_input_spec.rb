require "rails_helper"

describe "Password Input", type: :view do
  def component_name
    "password_input"
  end

  before { allow(SecureRandom).to receive(:hex).and_return("1234") }

  it "renders a password input component correctly by default" do
    render_component({})
    assert_select 'div.govuk-password-input[class~="govuk-form-group govuk-password-input gem-c-password-input govuk-!-margin-bottom-3"]'
    assert_select "div.govuk-password-input[data-module=govuk-password-input]"
    assert_select "div.govuk-password-input input.govuk-input.govuk-password-input__input.govuk-js-password-input-input"
    assert_select "div.govuk-password-input input[name=password][type=password][autocomplete=current-password][autocapitalize=none][spellcheck=false][id='1234-password-input']"
    assert_select "div.govuk-password-input label[for='1234-password-input']", "Password"
    assert_select "div.govuk-password-input button[aria-controls='1234-password-input']", "Show"
    assert_select "p#1234-password-input-with-error-message-error", false
    assert_select "div.govuk-password-input input.govuk-input--error", false
    assert_select "div.govuk-form-group--error", false
  end

  it "renders a password input with extra classes and a paragraph when error_text is passed" do
    render_component({ error_text: "Password must contain at least 8 characters" })
    assert_select "div.govuk-form-group--error"
    assert_select "div.govuk-password-input label[for='1234-password-input-with-error-message']", "Password"
    assert_select "div.govuk-password-input input.govuk-input--error[name=password-input-with-error-message]"
    assert_select "div.govuk-password-input input.govuk-input--error[aria-describedby='1234-password-input-with-error-message-error']"
    assert_select "div.govuk-password-input button[aria-controls='1234-password-input-with-error-message']", "Show"
    assert_select "p#1234-password-input-with-error-message-error", "Error: Password must contain at least 8 characters"
  end

  it "renders a password input with custom text" do
    render_component({
      label_text: "Secret number",
      error_text_prefix: "Incompatible",
      error_text: "6 is scared of 7, so they can't be next to each other.",
    })
    assert_select "div.govuk-password-input label", "Secret number"
    assert_select "p#1234-password-input-with-error-message-error", "Incompatible: 6 is scared of 7, so they can't be next to each other."
  end

  it "accepts margin_bottom values" do
    render_component({ margin_bottom: 9 })
    assert_select 'div.govuk-password-input[class~="govuk-form-group govuk-password-input gem-c-password-input govuk-!-margin-bottom-9"]'
  end
end
