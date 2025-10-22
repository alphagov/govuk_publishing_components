require "rails_helper"

describe "Emergency Banner", type: :view do
  def component_name
    "emergency_banner"
  end

  def emergency_banner_attributes(options = {})
    {
      campaign_class: options[:campaign_class],
      heading: "His Royal Highness Henry VIII",
      short_description: options[:short_description],
      link: options[:link],
      link_text: options[:link_text],
      homepage: options[:homepage],
      disable_ga4: options[:disable_ga4],
    }
  end

  it "renders banner with notable-death class" do
    render_component(emergency_banner_attributes({ campaign_class: "notable-death" }))
    assert_select ".gem-c-emergency-banner--notable-death"
  end

  it "renders banner with national-emergency class" do
    render_component(emergency_banner_attributes({ campaign_class: "national-emergency" }))
    assert_select ".gem-c-emergency-banner--national-emergency"
  end

  it "renders banner with local-emergency class" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency" }))
    assert_select ".gem-c-emergency-banner--local-emergency"
  end

  it "renders banner with homepage classes if homepage set" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency", short_description: "short description", homepage: true }))
    assert_select ".gem-c-emergency-banner--homepage"
    assert_select ".gem-c-emergency-banner__heading--homepage"
    assert_select ".gem-c-emergency-banner__description--homepage"
  end

  it "renders no link if link not specified" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency" }))
    assert_select ".govuk-link", false
  end

  it "renders link with More Information if link specified but no link text specified" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency", link: "https://www.gov.uk" }))
    assert_select ".govuk-link", text: "More information"
  end

  it "renders link with link_text if link_text and link both specified" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency", link_text: "Link Text", link: "https://www.gov.uk" }))
    assert_select ".govuk-link", text: "Link Text"
  end

  it "renders short_description if short_description specified" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency", short_description: "short description" }))
    assert_select ".gem-c-emergency-banner__description", text: "short description"
  end

  it "raises an exception if no campaign class specified" do
    assert_raises ActionView::Template::Error do
      render_component(emergency_banner_attributes({}))
    end
  end

  it "raises an exception if campaign class not in list specified" do
    assert_raises ActionView::Template::Error do
      render_component(emergency_banner_attributes({ campaign_class: "national-emergence" }))
    end
  end

  it "is labelled by the correct id" do
    render_component(emergency_banner_attributes({ campaign_class: "local-emergency", link_text: "Link Text", link: "https://www.gov.uk" }))
    # get the id of the header that is used for labelling
    id = css_select(".gem-c-emergency-banner h2")[0][:id]
    # check that the aria-labelledby points to that header using the header id
    assert_select(".gem-c-emergency-banner[aria-labelledby='#{id}']")
  end

  it "renders banner with ga4 attributes" do
    render_component(emergency_banner_attributes({ campaign_class: "notable-death" }))
    assert_select ".gem-c-emergency-banner[data-ga4-emergency-banner]"
    assert_select ".gem-c-emergency-banner[data-module=ga4-link-tracker]"
    assert_select ".gem-c-emergency-banner[data-ga4-track-links-only]"
    assert_select ".gem-c-emergency-banner[data-ga4-set-indexes]"
    assert_select ".gem-c-emergency-banner[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"emergency banner\",\"section\":\"His Royal Highness Henry VIII\"}']"
  end

  it "renders banner without ga4 attributes" do
    render_component(emergency_banner_attributes({ campaign_class: "notable-death", disable_ga4: true }))
    assert_select ".gem-c-emergency-banner[data-ga4-emergency-banner]", false
    assert_select ".gem-c-emergency-banner[data-module=ga4-link-tracker]", false
    assert_select ".gem-c-emergency-banner[data-ga4-track-links-only]", false
    assert_select ".gem-c-emergency-banner[data-ga4-set-indexes]", false
    assert_select ".gem-c-emergency-banner[data-ga4-link]", false
  end
end
