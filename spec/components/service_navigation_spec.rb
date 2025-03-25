require "rails_helper"

describe "Service navigation", type: :view do
  def component_name
    "service_navigation"
  end

  def navigation_items
    [
      {
        text: "Navigation item 1",
        href: "#",
      },
      {
        text: "Navigation item 2",
        href: "#",
      },
      {
        text: "Navigation item 3",
        href: "#",
      },
    ]
  end

  it "renders nothing when no navigation items provided" do
    assert_empty render_component({})
  end

  it "renders with navigation items" do
    render_component({ navigation_items: })

    assert_select(".gem-c-service-navigation")

    assert_select(".govuk-service-navigation__item:nth-child(1) .govuk-service-navigation__link", text: "Navigation item 1")
    assert_select(".govuk-service-navigation__item:nth-child(2) .govuk-service-navigation__link", text: "Navigation item 2")
    assert_select(".govuk-service-navigation__item:nth-child(3) .govuk-service-navigation__link", text: "Navigation item 3")
  end

  it "renders with active and current navigation item" do
    updated_navigation_items = navigation_items.map { |item| item[:text] == "Navigation item 2" ? item.merge(active: true) : item }
    render_component({ navigation_items: updated_navigation_items })

    assert_select(".govuk-service-navigation__item:nth-child(2).govuk-service-navigation__item--active .govuk-service-navigation__link[aria-current]", text: "Navigation item 2")
  end

  it "renders a service name when provided" do
    render_component({ navigation_items:, service_name: "My service name" })

    assert_select(".govuk-service-navigation__service-name .govuk-service-navigation__link", text: "My service name")
  end
end
