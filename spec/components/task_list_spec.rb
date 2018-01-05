require 'rails_helper'

describe "Task List", type: :view do
  def render_component(locals)
    render file: "components/_task_list", locals: locals
  end

  def tasklist
    [
      [
        {
          title: 'Group 1 step 1',
          show_help_link: true,
          optional: true,
          contents: [
            {
              type: 'paragraph',
              text: 'Group 1 step 1 paragraph'
            },
            {
              type: 'list',
              style: 'required',
              contents: [
                {
                  href: '/link1',
                  text: 'Link 1',
                },
                {
                  href: 'http://www.gov.uk',
                  text: 'Link 2',
                  context: '&pound;0 to &pound;300'
                },
              ]
            },
            {
              type: 'substep',
              optional: false
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside a required substep'
            },
          ]
        },
        {
          title: 'Group 1 step 2',
          optional: false,
          contents: [
            {
              type: 'paragraph',
              text: 'test'
            }
          ]
        }
      ],
      [
        {
          title: 'Group 2 step 1',
          contents: [
            {
              type: 'paragraph',
              text: 'Group 2 step 1 paragraph'
            },
            {
              type: 'list',
              style: 'choice',
              contents: [
                {
                  href: '/link3',
                  text: 'Link 3',
                },
                {
                  href: '/link4',
                  active: true,
                  text: 'Link 4',
                },
              ]
            },
            {
              type: 'substep',
              optional: true
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside an optional substep'
            },
          ]
        },
        {
          title: 'Group 2 step 2',
          logic: 'or',
          contents: [
            {
              type: 'paragraph',
              text: 'test'
            },
            {
              type: 'list',
              contents: [
                {
                  href: '/link5',
                  text: 'Link 5'
                },
                {
                  text: 'or'
                },
                {
                  href: '/link6',
                  text: 'Link 6'
                }
              ]
            },
            {
              type: 'heading',
              text: 'This is a heading'
            }
          ]
        },
        {
          title: 'Group 2 step 3?"`_!',
          contents: [
            {
              type: 'paragraph',
              text: 'test'
            }
          ]
        }
      ]
    ]
  end

  group1 = ".gem-c-task-list__group:nth-child(1)"
  group1step1 = group1 + " .gem-c-task-list__step:nth-of-type(1)"
  group1step2 = group1 + " .gem-c-task-list__step:nth-of-type(2)"

  group2 = ".gem-c-task-list__group:nth-child(2)"
  group2step1 = group2 + " .gem-c-task-list__step:nth-of-type(1)"
  group2step2 = group2 + " .gem-c-task-list__step:nth-of-type(2)"

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "renders paragraphs" do
    render_component(groups: tasklist)
    assert_select ".gem-c-task-list"

    assert_select group1 + " .gem-c-task-list__step#group-1-step-1:nth-of-type(1)"
    assert_select group1step1 + " .gem-c-task-list__title", text: "Group 1 step 1"
    assert_select group1step1 + " .gem-c-task-list__paragraph", text: "Group 1 step 1 paragraph"

    assert_select group2 + " .gem-c-task-list__step#group-2-step-2:nth-of-type(1)"
    assert_select group2step1 + " .gem-c-task-list__title", text: "Group 2 step 1"
    assert_select group2step1 + " .gem-c-task-list__paragraph", text: "Group 2 step 1 paragraph"
  end

  it "renders headings" do
    render_component(groups: tasklist)

    assert_select group2step2 + " h3.gem-c-task-list__heading", text: "This is a heading"
  end

  it "renders a tasklist with different heading levels" do
    render_component(groups: tasklist, heading_level: 4)

    assert_select group1step1 + " h4.gem-c-task-list__title", text: "Group 1 step 1"
    assert_select group2step1 + " h4.gem-c-task-list__title", text: "Group 2 step 1"
  end

  it "renders headings correctly if the heading level is changed" do
    render_component(groups: tasklist, heading_level: 4)

    assert_select group2step2 + " h5.gem-c-task-list__heading", text: "This is a heading"
  end

  it "opens a step by default" do
    render_component(groups: tasklist, show_step: 2)

    assert_select group1 + " .gem-c-task-list__step#group-1-step-2[data-show]"
  end

  it "remembers last opened step" do
    render_component(groups: tasklist, remember_last_step: true)

    assert_select ".gem-c-task-list[data-remember]"
  end

  it "generates IDs for steps correctly" do
    render_component(groups: tasklist)

    assert_select group2step2 + " #group-2-step-2.gem-c-task-list__panel"
    assert_select group2 + " .gem-c-task-list__step:nth-of-type(3) #group-2-step-3.gem-c-task-list__panel"
  end

  it "renders links" do
    render_component(groups: tasklist)

    assert_select group1step1 + " .gem-c-task-list__link-item[href='/link1'][data-position='1.1.1']", text: "Link 1"
    assert_select group1step1 + " .gem-c-task-list__link-item[href='/link1'][rel='external']", false
    assert_select group1step1 + " .gem-c-task-list__link-item[href='http://www.gov.uk'][rel='external'][data-position='1.1.2']", text: "Link 2"
    assert_select group1step1 + " .gem-c-task-list__context", text: "&pound;0 to &pound;300"

    assert_select group2step1 + " .gem-c-task-list__link-item[href='/link3'][data-position='2.1.1']", text: "Link 3"
  end

  it "renders links without hrefs" do
    render_component(groups: tasklist)

    assert_select group2step2 + " .gem-c-task-list__link .gem-c-task-list__link-item[href='/link5'][data-position='2.2.1']", text: "Link 5"
    assert_select group2step2 + " .gem-c-task-list__link", text: "or"
    assert_select group2step2 + " .gem-c-task-list__link .gem-c-task-list__link-item[href='/link6'][data-position='2.2.2']", text: "Link 6"
  end

  it "renders optional steps, sub steps and optional sub steps" do
    render_component(groups: tasklist)

    assert_select group1 + " .gem-c-task-list__step.gem-c-task-list__step--optional:nth-of-type(1)"
    assert_select group1step1 + " .gem-c-task-list__substep .gem-c-task-list__paragraph", text: "This paragraph is inside a required substep"
    assert_select group2step1 + " .gem-c-task-list__substep.gem-c-task-list__substep--optional .gem-c-task-list__paragraph", text: "This paragraph is inside an optional substep"
  end

  it "renders get help links back to the main task list" do
    render_component(groups: tasklist, task_list_url: "/learn-to-drive", task_list_url_link_text: "Get help")

    assert_select group1step1 + " .gem-c-task-list__help-link[href='/learn-to-drive#group-1-step-1']", text: "Get help"
    assert_select group2step1 + " .gem-c-task-list__help-link[href='/learn-to-drive#group-2-step-1']", false
  end

  it "displays group numbering and step logic correctly" do
    render_component(groups: tasklist)

    assert_select group1 + " .gem-c-task-list__circle--number .gem-c-task-list__circle-inner .gem-c-task-list__circle-background", text: "Step 1"
    assert_select group1step2 + " .gem-c-task-list__circle--logic .gem-c-task-list__circle-inner .gem-c-task-list__circle-background", text: "and"
    assert_select group2 + " .gem-c-task-list__circle--number .gem-c-task-list__circle-inner .gem-c-task-list__circle-background", text: "Step 2"
    assert_select group2step2 + " .gem-c-task-list__circle--logic .gem-c-task-list__circle-inner .gem-c-task-list__circle-background", text: "or"
  end

  it "applies the correct required and choice styles correctly to lists" do
    render_component(groups: tasklist)

    assert_select group1step1 + " .gem-c-task-list__links.gem-c-task-list__links--required"
    assert_select group2step1 + " .gem-c-task-list__links.gem-c-task-list__links--choice"
  end

  it "allows steps to be open on page load" do
    render_component(groups: tasklist, show_step: 3)

    assert_select group2 + " .gem-c-task-list__step[data-show]:nth-of-type(1)"
  end

  it "can set active states on groups and links" do
    render_component(groups: tasklist, highlight_group: 1)

    assert_select group1 + ".gem-c-task-list__group--active"
    assert_select group2step1 + " .gem-c-task-list__link-item.gem-c-task-list__link-item--active[href='#content']", text: "You are currently viewing: Link 4"
  end

  it "renders a small tasklist" do
    render_component(groups: tasklist, small: true)

    assert_select ".gem-c-task-list"
    assert_select ".gem-c-task-list.gem-c-task-list--large", false
  end
end
