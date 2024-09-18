require "rails_helper"

describe "Secondary navigation", type: :view do
  def component_name
    "secondary_navigation"
  end

  it "renders the component" do
    render_component({
      aria_label: "Document navigation",
    })

    assert_select ".gem-c-secondary-navigation", count: 1
  end

  it "renders the component with current page" do
    render_component({
      aria_label: "Document navigation",
      items: [
        {
          label: "Nav item 1",
          href: "#",
          current: true,
        },
        {
          label: "Nav item 2",
          href: "#",
        },
        {
          label: "Nav item 3",
          href: "#",
        },
      ],
    })

    assert_select ".gem-c-secondary-navigation", count: 1
    assert_select ".gem-c-secondary-navigation__list-item", count: 3
    assert_select ".gem-c-secondary-navigation__list-item--current", count: 1
    assert_select ".gem-c-secondary-navigation__list-item--current", text: "Nav item 1"
    assert_select ".gem-c-secondary-navigation__list-item--current a[aria-current='page']"
  end
end
