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

    # As the following data attributes contain period symbols, we must use an alternative to assert_select.
    html = Nokogiri::HTML(rendered)
    password_input_component = html.at(".govuk-password-input")
    expect(password_input_component.attr("data-i18n.show-password")).to eql("Show")
    expect(password_input_component.attr("data-i18n.hide-password")).to eql("Hide")
    expect(password_input_component.attr("data-i18n.show-password-aria-label")).to eql("Show password")
    expect(password_input_component.attr("data-i18n.hide-password-aria-label")).to eql("Hide password")
    expect(password_input_component.attr("data-i18n.password-shown-announcement")).to eql("Your password is visible")
    expect(password_input_component.attr("data-i18n.password-hidden-announcement")).to eql("Your password is hidden")
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
      button_show_password_aria_label: "View password",
      button_hide_password_aria_label: "Obscure password",
      button_show_password_text: "View",
      button_hide_password_text: "Obscure",
      password_shown_announcement: "Password is in view",
      password_hidden_announcement: "Password is obscured",
    })
    assert_select "div.govuk-password-input label", "Secret number"
    assert_select "p#1234-password-input-with-error-message-error", "Incompatible: 6 is scared of 7, so they can't be next to each other."
    assert_select "div.govuk-password-input button", "View"

    # As the following data attributes contain period symbols, we must use an alternative to assert_select.
    html = Nokogiri::HTML(rendered)
    password_input_component = html.at(".govuk-password-input")
    expect(password_input_component.attr("data-i18n.show-password")).to eql("View")
    expect(password_input_component.attr("data-i18n.hide-password")).to eql("Obscure")
    expect(password_input_component.attr("data-i18n.show-password-aria-label")).to eql("View password")
    expect(password_input_component.attr("data-i18n.hide-password-aria-label")).to eql("Obscure password")
    expect(password_input_component.attr("data-i18n.password-shown-announcement")).to eql("Password is in view")
    expect(password_input_component.attr("data-i18n.password-hidden-announcement")).to eql("Password is obscured")
  end

  it "accepts margin_bottom values" do
    render_component({ margin_bottom: 9 })
    assert_select 'div.govuk-password-input[class~="govuk-form-group govuk-password-input gem-c-password-input govuk-!-margin-bottom-9"]'
  end
end
