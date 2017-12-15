require 'rails_helper'

describe "Task List Related", type: :view do
  def render_component(locals)
    render file: "components/_task_list_related", locals: locals
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

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "displays one link inside a heading" do
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

  it "displays more than one link in a list" do
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

  it "shows alternative heading text" do
    render_component(links: one_link, pretitle: 'Moo')

    assert_select ".pub-c-task-list-related__pretitle", text: 'Moo'
    assert_select ".pub-c-task-list-related__link[data-track-action='Moo']"
  end
end
