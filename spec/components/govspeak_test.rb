require 'govuk_component_test_helper'

class GovspeakTestCase < ComponentTestCase
  def component_name
    "govspeak"
  end

  test "renders content in a govspeak wrapper" do
    render_component(
      content: '<h1>content</h1>'
    )
    assert_select ".govuk-govspeak h1", text: 'content'
  end

  test "renders right to left content correctly" do
    render_component(
      direction: "rtl",
      content: "<h2>right to left</h2>"
    )

    assert_select ".direction-rtl h2", text: 'right to left'
  end

  test "can disable youtube expansion" do
    render_component(
      disable_youtube_expansions: true,
      content: "<h2>youtube</h2>"
    )

    assert_select ".disable-youtube h2", text: "youtube"
  end

  test "can enable rich govspeak" do
    render_component(
      rich_govspeak: true,
      content: "<strong>boldly go</strong>"
    )

    assert_select ".rich-govspeak strong", text: 'boldly go'
  end
end
