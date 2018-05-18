require "rails_helper"

describe "Title", type: :view do
  def component_name
    "title"
  end

  it "error if no title" do
    assert_raises do
      render_component({})
    end
  end

  it "title text appears" do
    render_component(title: "Hello World")
    assert_select ".gem-c-title__text", text: "Hello World"
  end

  it "title context appears" do
    render_component(title: "Hello World", context: "Format")
    assert_select ".gem-c-title__context", text: "Format"
  end

  it "title context link appears" do
    render_component(title: "Hello World", context: { text: "Format", href: "/format", data: { tracking: true } })
    assert_select ".gem-c-title__context-link[href='/format'][data-tracking]", text: "Format"
  end

  it "applies title length if supplied" do
    render_component(title: "Hello World", context: "format", average_title_length: 'long')
    assert_select ".gem-c-title .gem-c-title__text--long", text: "Hello World"
  end

  it "applies the inverse flag if supplied" do
    render_component(title: "Hello World", inverse: true)
    assert_select ".gem-c-title--inverse", text: "Hello World"
  end
end
