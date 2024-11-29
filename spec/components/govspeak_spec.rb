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

  it "applies default margin to the component" do
    render_component(
      content: "<h2>content</h2>".html_safe,
    )
    assert_select '.gem-c-govspeak.govuk-\!-margin-bottom-0'
  end

  it "applies margin to the component" do
    render_component(
      content: "<h2>content</h2>".html_safe,
      margin_bottom: 6,
    )
    assert_select '.gem-c-govspeak.govuk-\!-margin-bottom-6'
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

  it "renders with font-size m by default" do
    render_component(
      content: "".html_safe,
    )

    assert_select ".gem-c-govspeak--font-size-m"
  end

  it "renders with font-size l when the font_size option is used" do
    render_component(
      font_size: "l",
      content: "".html_safe,
    )

    assert_select ".gem-c-govspeak--font-size-l"
  end

  it "accepts a block" do
    render "govuk_publishing_components/components/#{component_name}" do
      "content-via-block"
    end

    expect(rendered).to include("content-via-block")
  end
end
