require 'rails_helper'

describe "Cookie banner", type: :view do
  def component_name
    "cookie_banner"
  end

  it "renders with default values" do
    render_component({})
    assert_select '.gem-c-cookie-banner[id="global-cookie-message"][data-module="cookie-banner"]'
    assert_select '.gem-c-cookie-banner__message.govuk-width-container', text: "GOV.UK uses cookies to make the site simpler. Find out more about cookies or hide this message"
    assert_select 'a[data-hide-cookie-banner="true"]'
  end

  it "renders with custom values" do
    render_component(id: 'custom-cookie-message', message: "Custom message")
    assert_select '.gem-c-cookie-banner[id="custom-cookie-message"][data-module="cookie-banner"]'
    assert_select '.gem-c-cookie-banner__message.govuk-width-container', text: "Custom message"
  end
end
