require 'govuk_component_test_helper'

class TitleComponentTestCase < ComponentTestCase
  def component_name
    "title"
  end

  test "error if no title" do
    assert_raise do
      render_component({})
    end
  end

  test "title text appears" do
    render_component(title: "Hello World")
    assert_select ".pub-c-title__text", text: "Hello World"
  end

  test "title context appears" do
    render_component(title: "Hello World", context: "Format")
    assert_select ".pub-c-title__context", text: "Format"
  end

  test "title context link appears" do
    render_component(title: "Hello World", context: { text: "Format", href: "/format", data: { tracking: true } })
    assert_select ".pub-c-title__context-link[href='/format'][data-tracking]", text: "Format"
  end

  test "applies title length if supplied" do
    render_component(title: "Hello World", context: "format", average_title_length: 'long')
    assert_select ".pub-c-title .pub-c-title__text--long", text: "Hello World"
  end
end
