require "rails_helper"

describe "Global banner", type: :view do
  def component_name
    "global_banner"
  end

  it "renders nothing without any options" do
    assert_empty render_component({})
  end

  it "renders with minimum required options" do
    render_component(title: "Look here you", banner_version: 1)
    assert_select ".gem-c-global-banner", text: "Look here you"
  end

  it "renders with a link on the title" do
    render_component(title: "Look here you", banner_version: 1, title_href: "https://www.gov.uk")
    assert_select ".gem-c-global-banner a.gem-c-global-banner__title[href='https://www.gov.uk']", text: "Look here you"
  end

  it "includes GA4 attributes when there is a link" do
    render_component(title: "Look here you", banner_version: 1, title_href: "https://www.gov.uk")
    assert_select 'a.gem-c-global-banner__title[data-module="ga4-link-tracker"]'
    assert_select 'a.gem-c-global-banner__title[data-ga4-link=\'{"event_name":"navigation","type":"global bar","section":"Look here you"}\']'
  end

  it "renders with a title and text" do
    render_component(title: "Look here you", banner_version: 1, text: "This is important")
    assert_select ".gem-c-global-banner .gem-c-global-banner__title", text: "Look here you"
    assert_select ".gem-c-global-banner .gem-c-global-banner__text", text: "This is important"
  end

  it "includes the always visible option" do
    render_component(title: "Look here you", banner_version: 1, always_visible: true)
    assert_select ".gem-c-global-banner[data-global-banner-permanent]"
  end
end
