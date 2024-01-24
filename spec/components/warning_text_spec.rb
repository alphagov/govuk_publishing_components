require "rails_helper"

describe "warning text", type: :view do
  def component_name
    "warning_text"
  end

  it "renders warning text" do
    render_component(text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__assistive", text: "Warning")
    assert_select(".govuk-warning-text__text", text: /You can be fined up to £5,000 if you don’t register?/i)
  end

  it "renders custom assistive text" do
    render_component(text_assistive: "Danger", text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__assistive", text: "Danger")
    assert_select(".govuk-warning-text__text", text: /You can be fined up to £5,000 if you don’t register?/i)
  end

  it "renders custom icon text" do
    render_component(text_icon: ":(", text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__icon", text: ":(")
  end

  it "renders no icon" do
    render_component(text_icon: "", text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__icon", false)
    assert_select(".gem-c-warning-text__text--no-indent", text: /You can be fined up to £5,000 if you don’t register/i)
  end

  it "renders large warning text" do
    render_component(large_font: true, text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__text.gem-c-warning-text__text--large", text: /You can be fined up to £5,000 if you don’t register/i)
  end

  it "renders highlighted text" do
    render_component(highlight_text: true, text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__text.gem-c-warning-text__text--highlight", text: /You can be fined up to £5,000 if you don’t register/i)
  end

  it "renders highlighted and large text together" do
    render_component(highlight_text: true, large_font: true, text: "Because")
    assert_select(".govuk-warning-text__text.gem-c-warning-text__text--highlight.gem-c-warning-text__text--large", text: /Because/i)
  end

  it "renders as a heading" do
    render_component(text: "Because", heading_level: 1)
    assert_select("h1.govuk-warning-text__text", text: /Because/i)
    assert_select("h1.govuk-warning-text__text .govuk-warning-text__assistive", text: /Warning/i)
  end

  it "has GA4 link tracking" do
    render_component(text: "Because", heading_level: 1)
    assert_select("[data-module='ga4-link-tracker']")
    assert_select('[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]')
    assert_select("[data-ga4-track-links-only]")
  end

  it "can disable GA4 link tracking" do
    render_component(disable_ga4: true, text: "Because", heading_level: 1)
    assert_select("[data-module='ga4-link-tracker']", false)
    assert_select('[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]', false)
    assert_select("[data-ga4-track-links-only]", false)
  end
end
