require 'govuk_component_test_helper'

class TaskListHeaderTestCase < ComponentTestCase
  def component_name
    "task_list_header"
  end

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "renders default component" do
    render_component(title: "This is my title")

    assert_select ".gem-c-task-list-header span.gem-c-task-list-header__title", text: "This is my title"
  end

  test "renders with a link" do
    render_component(title: "This is my title", path: "/notalink")

    link = ".gem-c-task-list-header a.gem-c-task-list-header__title"

    assert_select link + "[href='/notalink']", text: "This is my title"
    assert_select link + "[data-track-category='tasklistHeaderClicked']"
    assert_select link + "[data-track-action='top']"
    assert_select link + "[data-track-label='/notalink']"
    assert_select link + "[data-track-dimension='This is my title']"
    assert_select link + "[data-track-dimension-index='29']"
  end

  test "renders with a skip link" do
    render_component(title: "This is my title", skip_link: "#skiplink")

    link = ".gem-c-task-list-header .gem-c-task-list-header__skip-link"

    assert_select link + "[href='#skiplink']", text: "Skip content"
    assert_select link + "[data-track-category='tasklistHeaderClicked']"
    assert_select link + "[data-track-action='top']"
    assert_select link + "[data-track-label='#skiplink']"
    assert_select link + "[data-track-dimension='Skip content']"
    assert_select link + "[data-track-dimension-index='29']"
  end

  test "renders with a skip link with custom text" do
    render_component(title: "This is my title", skip_link: "#skiplink", skip_link_text: "It's hard to think of a good value")

    assert_select ".gem-c-task-list-header .gem-c-task-list-header__skip-link[href='#skiplink']", text: "It's hard to think of a good value"
  end
end
