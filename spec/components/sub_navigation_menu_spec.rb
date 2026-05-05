require "rails_helper"

describe "Menu", type: :view do
  def component_name
    "sub_navigation_menu"
  end

  def links
    [
      {
        text: "Example Heading",
        links: [
          {
            "text": "Hello world",
            "href": "/hello-world",
          },
        ],
      },
      {
        text: "Another Heading",
        links: [
          {
            "text": "Example Link",
            "href": "/hello-world",
          },
        ],
      },
    ]
  end

  it "does not render anything if no data is passed" do
    test_data = {}

    assert_empty render_component(test_data)
  end

  it "does not render anything if nothing is in the items array" do
    test_data = { links: [] }

    assert_empty render_component(test_data)
  end

  it "renders unordered lists with headings" do
    render_component({
      links:,
    })

    assert_select "h3:first-of-type", text: "Example Heading"
    assert_select "ul:first-of-type li", text: "Hello world"
    assert_select "h3:nth-of-type(2)", text: "Another Heading"
    assert_select "ul:nth-of-type(2) li", text: "Example Link"
  end

  it "renders a button with the text 'Menu' by default" do
    render_component({ links: [links.first] })

    assert_select "button", text: "Menu"
  end

  it "renders a button with custom text" do
    render_component({
      button_text: "Hello world",
      links: [links.first],
    })

    assert_select "button", text: "Hello world"
  end

  it "renders with the correct accessibility attributes" do
    allow(SecureRandom).to receive(:hex).and_return("1234")
    render_component({ links: [links.first] })
    assert_select "h2#gem-c-sub-navigation-menu-heading-1234.govuk-visually-hidden", text: "Secondary navigation menu"
    assert_select "button[aria-expanded=false][aria-controls=gem-c-sub-navigation-menu-container-1234]"
    assert_select "div#gem-c-sub-navigation-menu-container-1234"
    assert_select "nav[aria-labelledby='gem-c-sub-navigation-menu-heading-1234']"
  end

  it "renders with the correct GA4 attributes" do
    render_component({ links: [
      {
        text: "Example Heading",
        links: [
          {
            "text": "Hello world",
            "href": "/hello-world",
          },
          {
            "text": "Link 2",
            "href": "/hello-world-2",
          },
        ],
      },
      {
        text: "Second section",
        links: [
          {
            "text": "Hello world",
            "href": "/hello-world",
          },
          {
            "text": "Link 2",
            "href": "/hello-world-2",
          },
        ],
      },
    ] })

    assert_select "button[data-module=ga4-event-tracker]"
    assert_select "button[data-ga4-expandable]"
    assert_select 'button[data-ga4-event=\'{\"event_name\":\"select_content\",\"index_section\":1,\"index_section_count\":1,\"type\":\"secondary header\",\"section\":\"Menu\"}\']'

    assert_select "nav[data-module=ga4-link-tracker]"

    # First section of links
    assert_select 'ul:first-of-type li:first-of-type a[data-ga4-link=\'{"event_name\":\"navigation\",\"type\":\"secondary header\",\"index_link\":1,\"index_total\":2,\"index_section\":1,\"index_section_count\":2,\"section\":\"Example Heading\"}\']'
    assert_select 'ul:first-of-type li:nth-of-type(2) a[data-ga4-link=\'{"event_name\":\"navigation\",\"type\":\"secondary header\",\"index_link\":2,\"index_total\":2,\"index_section\":1,\"index_section_count\":2,\"section\":\"Example Heading\"}\']'

    # Second section of links
    assert_select 'ul:nth-of-type(2) li:first-of-type a[data-ga4-link=\'{\"event_name\":\"navigation\",\"type\":\"secondary header\",\"index_link\":1,\"index_total\":2,\"index_section\":2,\"index_section_count\":2,\"section\":\"Second section\"}\']'
    assert_select 'ul:nth-of-type(2) li:nth-of-type(2) a[data-ga4-link=\'{\"event_name\":\"navigation\",\"type\":\"secondary header\",\"index_link\":2,\"index_total\":2,\"index_section\":2,\"index_section_count\":2,\"section\":\"Second section\"}\']'
  end
end
