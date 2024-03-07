require "rails_helper"

describe "Govspeak", type: :view do
  def component_name
    "govspeak"
  end

  it "renders content in a govspeak wrapper" do
    render_component(
      content: "<h1>content</h1>".html_safe,
    )
    assert_select ".gem-c-govspeak h1", text: "content"
  end

  it "renders inverse content correctly" do
    render_component(
      inverse: true,
      content: "<h2>inverse</h2>".html_safe,
    )

    assert_select ".gem-c-govspeak.gem-c-govspeak--inverse h2", text: "inverse"
  end

  it "renders right to left content correctly" do
    render_component(
      direction: "rtl",
      content: "<h2>right to left</h2>".html_safe,
    )

    assert_select ".direction-rtl h2", text: "right to left"
  end

  it "can disable youtube expansion" do
    render_component(
      disable_youtube_expansions: true,
      content: "<h2>youtube</h2>".html_safe,
    )

    assert_select ".disable-youtube h2", text: "youtube"
  end

  it "accepts a block" do
    render "govuk_publishing_components/components/#{component_name}" do
      "content-via-block"
    end

    expect(rendered).to include("content-via-block")
  end

  it "adds GA4 tracking" do
    render_component(
      content: "<h1>content</h1>".html_safe,
    )

    assert_select ".gem-c-govspeak[data-module='govspeak ga4-link-tracker']"
    assert_select ".gem-c-govspeak[data-ga4-track-links-only]"
    assert_select ".gem-c-govspeak[data-ga4-limit-to-element-class='call-to-action, info-notice, help-notice, advisory']"
    assert_select '.gem-c-govspeak[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]'
  end

  it "can disable GA4 tracking" do
    render_component(
      content: "<h1>content</h1>".html_safe,
      disable_ga4: true,
    )

    assert_no_selector ".gem-c-govspeak[data-module='govspeak ga4-link-tracker']"
    assert_no_selector ".gem-c-govspeak[data-ga4-track-links-only]"
    assert_no_selector ".gem-c-govspeak[data-ga4-limit-to-element-class]"
    assert_no_selector ".gem-c-govspeak[data-ga4-link]"
  end
end
