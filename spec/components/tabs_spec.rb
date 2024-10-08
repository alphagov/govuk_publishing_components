require "rails_helper"

describe "Tabs", type: :view do
  def component_name
    "tabs"
  end

  it "does not render anything if no data is passed" do
    assert_empty render_component({})
  end

  it "renders tabs and sections" do
    render_component(
      tabs: [
        {
          id: "tab1",
          label: "First section",
          content: "<p>Fusce at dictum tellus, ac accumsan est. Nulla vitae turpis in nulla gravida tincidunt. Duis lectus felis, tempus id bibendum sit amet, posuere ut elit. Donec enim odio, eleifend in urna a, sagittis egestas est. Proin id ex ultricies, porta eros id, vehicula quam. Morbi non sagittis velit.</p>",
        },
        {
          id: "tab2",
          label: "Second section",
          content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam congue elementum commodo. Vestibulum elit turpis, efficitur quis posuere vitae, commodo vitae augue. Donec ut pharetra ligula. Phasellus ac mauris eu felis bibendum dapibus rutrum sed quam. Pellentesque posuere ante id consequat pretium.</p>",
        },
      ],
    )
    assert_select ".govuk-tabs[data-module='govuk-tabs ga4-event-tracker']"
    assert_select ".govuk-tabs__tab", 2
    assert_select ".govuk-tabs__panel", 2
    assert_select "#tab1"
    assert_select "#tab1"
  end

  it "renders tabs as links" do
    render_component(
      as_links: true,
      tabs: [
        {
          label: "First section",
          href: "/page1",
        },
        {
          label: "Second section",
          href: "/page2",
        },
      ],
    )
    assert_select ".govuk-tabs[data-module='ga4-link-tracker']"
    assert_select ".govuk-tabs__tab", 2
    assert_select ".govuk-tabs__list-item", 2
    assert_select "a.govuk-tabs__tab[href='/page1']"
    assert_select "a.govuk-tabs__tab[href='/page2']"
  end

  it "renders with GA4 tracking on tabs" do
    render_component(
      tabs: [
        {
          id: "tab1",
          label: "First section",
          content: "<p>Fusce at dictum tellus, ac accumsan est. Nulla vitae turpis in nulla gravida tincidunt.</p>",
        },
        {
          id: "tab2",
          label: "Second section",
          content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
        },
        {
          id: "tab3",
          label: "Third section",
          content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
        },
      ],
    )

    assert_select ".govuk-tabs[data-module='govuk-tabs ga4-event-tracker']"
    assert_select ".govuk-tabs__tab[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"tabs\",\"text\":\"First section\",\"index_section\":1,\"index_section_count\":3}']"
    assert_select ".govuk-tabs__tab[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"tabs\",\"text\":\"Second section\",\"index_section\":2,\"index_section_count\":3}']"
    assert_select ".govuk-tabs__tab[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"tabs\",\"text\":\"Third section\",\"index_section\":3,\"index_section_count\":3}']"
  end

  it "renders without GA4 tracking on tabs" do
    render_component(
      disable_ga4: true,
      tabs: [
        {
          id: "tab1",
          label: "First section",
          content: "<p>Fusce at dictum tellus, ac accumsan est. Nulla vitae turpis in nulla gravida tincidunt.</p>",
        },
        {
          id: "tab2",
          label: "Second section",
          content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
        },
      ],
    )

    assert_select ".govuk-tabs[data-module='govuk-tabs ga4-event-tracker']", false
    assert_select ".govuk-tabs__tab[data-ga4-event]", false
  end

  it "renders with GA4 tracking on tabs as links" do
    render_component(
      as_links: true,
      tabs: [
        {
          href: "tab1",
          label: "First section",
          active: true,
        },
        {
          href: "tab2",
          label: "Second section",
        },
        {
          href: "tab3",
          label: "Third section",
        },
      ],
    )

    assert_select ".govuk-tabs[data-module='ga4-link-tracker']"
    assert_select ".govuk-tabs__tab[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"tabs\",\"text\":\"First section\",\"index_section\":1,\"index_section_count\":3}']"
    assert_select ".govuk-tabs__tab[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"tabs\",\"text\":\"Second section\",\"index_section\":2,\"index_section_count\":3}']"
    assert_select ".govuk-tabs__tab[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"tabs\",\"text\":\"Third section\",\"index_section\":3,\"index_section_count\":3}']"
  end

  it "renders without GA4 tracking on tabs as links" do
    render_component(
      as_links: true,
      disable_ga4: true,
      tabs: [
        {
          href: "tab1",
          label: "First section",
          active: true,
        },
        {
          href: "tab2",
          label: "Second section",
        },
      ],
    )

    assert_select ".govuk-tabs[data-module='ga4-link-tracker']", false
    assert_select ".govuk-tabs__tab[data-ga4-link]", false
  end

  it "renders tabs for the landing page" do
    render_component(
      landing_page: true,
      tabs: [
        {
          id: "tab1",
          label: "First section",
          content: "<p>Fusce at dictum tellus.</p>",
        },
        {
          id: "tab2",
          label: "Second section",
          content: "<p>Lorem ipsum.</p>",
        },
      ],
    )
    assert_select ".govuk-tabs.gem-c-tabs.gem-c-tabs--landing-page"
  end
end
