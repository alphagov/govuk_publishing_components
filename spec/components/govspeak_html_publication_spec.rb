require "rails_helper"

describe "Govspeak for HTML publications", type: :view do
  def component_name
    "govspeak_html_publication"
  end

  it "renders content in a govspeak wrapper" do
    render_component(
      content: "<h1>content</h1>".html_safe,
    )
    assert_select ".gem-c-govspeak h1", text: "content"
  end

  it "renders right to left content correctly" do
    render_component(
      direction: "rtl",
      content: "<h2>right to left</h2>".html_safe,
    )

    assert_select ".gem-c-govspeak--direction-rtl h2", text: "right to left"
  end

  it "can disable youtube expansion" do
    render_component(
      disable_youtube_expansions: true,
      content: "<h2>youtube</h2>".html_safe,
    )

    assert_select ".js-disable-youtube h2", text: "youtube"
  end

  it "accepts a block" do
    render "govuk_publishing_components/components/#{component_name}" do
      "content-via-block"
    end

    expect(rendered).to include("content-via-block")
  end
end
