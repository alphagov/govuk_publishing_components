require 'spec_helper'

describe "Task List Header", type: :view do
  def render_component(locals)
    render file: "components/_task_list_header", locals: locals
  end

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "renders default component" do
    render_component(title: "This is my title")

    assert_select ".gem-c-task-list-header span.gem-c-task-list-header__title", text: "This is my title"
  end

  it "renders with a link" do
    render_component(title: "This is my title", path: "/notalink")

    link = ".gem-c-task-list-header a.gem-c-task-list-header__title"

    assert_select link + "[href='/notalink']", text: "This is my title"
    assert_select link + "[data-track-category='tasklistHeaderClicked']"
    assert_select link + "[data-track-action='top']"
    assert_select link + "[data-track-label='/notalink']"
    assert_select link + "[data-track-dimension='This is my title']"
    assert_select link + "[data-track-dimension-index='29']"
  end

  it "renders with a skip link" do
    render_component(title: "This is my title", skip_link: "#skiplink")

    link = ".gem-c-task-list-header .gem-c-task-list-header__skip-link"

    assert_select link + "[href='#skiplink']", text: "Skip content"
    assert_select link + "[data-track-category='tasklistHeaderClicked']"
    assert_select link + "[data-track-action='top']"
    assert_select link + "[data-track-label='#skiplink']"
    assert_select link + "[data-track-dimension='Skip content']"
    assert_select link + "[data-track-dimension-index='29']"
  end

  it "renders with a skip link with custom text" do
    render_component(title: "This is my title", skip_link: "#skiplink", skip_link_text: "It's hard to think of a good value")

    assert_select ".gem-c-task-list-header .gem-c-task-list-header__skip-link[href='#skiplink']", text: "It's hard to think of a good value"
  end
end
