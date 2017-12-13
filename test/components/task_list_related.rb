require 'govuk_component_test_helper'

class TaskListRelatedTestCase < ComponentTestCase
  def component_name
    "task_list_related"
  end

  def one_link
    [
      {
        href: '/link1',
        text: 'Link 1'
      }
    ]
  end

  def two_links
    [
      {
        href: '/link1',
        text: 'Link 1'
      },
      {
        href: '/link2',
        text: 'Link 2'
      }
    ]
  end

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "displays one link inside a heading" do
    render_component(links: one_link)

    this_link = ".pub-c-task-list-related .pub-c-task-list-related__heading .pub-c-task-list-related__link"

    assert_select ".pub-c-task-list-related .pub-c-task-list-related__heading .pub-c-task-list-related__pretitle", text: 'Part of'
    assert_select this_link + "[href='/link1']", text: 'Link 1'
    assert_select this_link + "[data-track-category='tasklistPartOfClicked']"
    assert_select this_link + "[data-track-action='Part of']"
    assert_select this_link + "[data-track-label='/link1']"
    assert_select this_link + "[data-track-dimension='Link 1']"
    assert_select this_link + "[data-track-dimension-index='29']"
  end

  test "displays more than one link in a list" do
    render_component(links: two_links)

    this_link = ".pub-c-task-list-related .pub-c-task-list-related__links .pub-c-task-list-related__link[href='/link2']"

    assert_select ".pub-c-task-list-related .pub-c-task-list-related__heading .pub-c-task-list-related__pretitle", text: 'Part of'
    assert_select ".pub-c-task-list-related .pub-c-task-list-related__links .pub-c-task-list-related__link[href='/link1']", text: 'Link 1'
    assert_select this_link, text: 'Link 2'
    assert_select this_link + "[data-track-category='tasklistPartOfClicked']"
    assert_select this_link + "[data-track-action='Part of']"
    assert_select this_link + "[data-track-label='/link2']"
    assert_select this_link + "[data-track-dimension='Link 2']"
    assert_select this_link + "[data-track-dimension-index='29']"
  end

  test "alternative heading text" do
    render_component(links: one_link, pretitle: 'Moo')

    assert_select ".pub-c-task-list-related__pretitle", text: 'Moo'
    assert_select ".pub-c-task-list-related__link[data-track-action='Moo']"
  end
end
