require "rails_helper"

describe "Contents list with body", type: :view do
  def component_name
    "contents_list_with_body"
  end

  def contents_list
    [
      { href: "/one", text: "1. One" },
      { href: "/two", text: "2. Two" },
    ]
  end

  def block
    "<p>Foo</p>".html_safe
  end

  it "renders nothing without a block" do
    assert_empty render_component({ contents: contents_list })
  end

  it "yields the block without contents data" do
    assert_includes(render_component({}) { block }, block)
  end

  it "renders a sticky-element-container" do
    render_component({ contents: contents_list }) { block }

    assert_select("#contents.gem-c-contents-list-with-body")
    assert_select("#contents[data-module='sticky-element-container']")
  end

  it "does not apply the sticky-element-container data-module without contents data" do
    render_component({}) { block }

    assert_select("#contents[data-module='sticky-element-container']", count: 0)
  end

  it "renders a contents-list component" do
    render_component({ contents: contents_list }) { block }

    assert_select(".gem-c-contents-list-with-body .gem-c-contents-list")
    assert_select ".gem-c-contents-list__link[href='/one']", text: "1. One"
  end

  it "renders a back-to-top component" do
    render_component({ contents: contents_list }) { block }

    assert_select(%(.gem-c-contents-list-with-body
                    .gem-c-contents-list-with-body__link-wrapper
                    .gem-c-contents-list-with-body__link-container
                    .gem-c-back-to-top-link[href='#contents']))
  end
end
