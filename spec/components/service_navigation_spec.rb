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
        data: {
          hello: "world",
          another: "test",
        },
      },
      {
        text: "Navigation item 2",
        href: "#",
      },
      {
        text: "Navigation item 3",
        href: "#",
        data: {
          example: "attribute",
          another: "one",
        },
      },
    ]
  end

  it "renders nothing when no navigation items provided" do
    assert_empty render_component({})
  end

  it "renders with navigation items" do
    render_component({ navigation_items: })

    assert_select("div.gem-c-service-navigation")

    assert_select(".govuk-service-navigation__item:nth-child(1) .govuk-service-navigation__link", text: "Navigation item 1")
    assert_select(".govuk-service-navigation__item:nth-child(2) .govuk-service-navigation__link", text: "Navigation item 2")
    assert_select(".govuk-service-navigation__item:nth-child(3) .govuk-service-navigation__link", text: "Navigation item 3")
  end

  it "renders with data attributes on links" do
    render_component({ navigation_items: })
    assert_select("div.gem-c-service-navigation")
    assert_select(".govuk-service-navigation__item:nth-child(1) .govuk-service-navigation__link[data-hello=world][data-another=test]")
    assert_select(".govuk-service-navigation__item:nth-child(2) .govuk-service-navigation__link[data-hello=world][data-another=test]", false)
    assert_select(".govuk-service-navigation__item:nth-child(3) .govuk-service-navigation__link[data-example=attribute][data-another=one]")
  end

  it "renders with active and current navigation item" do
    updated_navigation_items = navigation_items.map { |item| item[:text] == "Navigation item 2" ? item.merge(active: true) : item }
    render_component({ navigation_items: updated_navigation_items })

    assert_select(".govuk-service-navigation__item:nth-child(2).govuk-service-navigation__item--active
      .govuk-service-navigation__link[aria-current]
      strong.govuk-service-navigation__active-fallback", text: "Navigation item 2")
  end

  it "renders a service name when provided" do
    render_component({ navigation_items:, service_name: "My service name" })

    assert_select("section.gem-c-service-navigation")

    assert_select("span.govuk-service-navigation__service-name", text: "My service name")
  end

  it "renders a service name and service name url when provided" do
    render_component({ navigation_items:, service_name: "My service name", service_name_url: "#" })

    assert_select("section.gem-c-service-navigation")

    assert_select("span.govuk-service-navigation__service-name .govuk-service-navigation__link", text: "My service name")
  end
end
