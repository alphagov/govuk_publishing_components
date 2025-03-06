require "rails_helper"

describe "Summary banner", type: :view do
  def component_name
    "summary_banner"
  end

  it "fails to render a banner when nothing is passed to it" do
    assert_empty render_component({})
  end

  it "fails to render a banner when no title or no text is passed to it" do
    assert_empty render_component(title: "Summary")
    assert_empty render_component(text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy.")
  end

  it "renders a banner with title and text correctly" do
    render_component(title: "Summary", text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy.")

    assert_select ".gem-c-summary-banner__title", text: "Summary"
    assert_select ".gem-c-summary-banner__text", text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy."
  end

  it "renders a banner with an aria label" do
    render_component(title: "Summary", text: "Text")
    assert_select "section[aria-label]"
  end

  it "renders a banner with title, text and secondary text correctly" do
    render_component(
      title: "Summary",
      text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy.",
      secondary_text: "This consultation ran from<br><strong class='consultation-date'><time datetime='2024-11-05T11:00:00.000+00:00'>11am on 5 November 2024</time> to <time datetime='2024-12-03T17:00:00.000+00:00'>5pm on 3 December 2024</time></strong>",
    )

    assert_select ".gem-c-summary-banner__title", text: "Summary"
    assert_select ".gem-c-summary-banner__text", text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy."
    assert_select ".gem-c-summary-banner__text", text: "This consultation ran from<br><strong class='consultation-date'><time datetime='2024-11-05T11:00:00.000+00:00'>11am on 5 November 2024</time> to <time datetime='2024-12-03T17:00:00.000+00:00'>5pm on 3 December 2024</time></strong>"
  end

  it "renders a banner with GA4 tracking" do
    render_component(
      title: "Summary",
      text: "This call for evidence will inform the development of the financial services sector plan, a key part of the government’s modern industrial strategy.",
    )

    assert_select ".gem-c-summary-banner[data-module=ga4-link-tracker]"
    assert_select ".gem-c-summary-banner[data-ga4-track-links-only]"
    assert_select ".gem-c-summary-banner[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"callout\"}']"
  end
end
