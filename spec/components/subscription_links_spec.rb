require 'rails_helper'

describe "subscription links", type: :view do
  def component_name
    "subscription-links"
  end

  it "renders nothing when no parameters are given" do
    assert_empty render_component({})
  end

  it "renders an email signup link" do
    render_component(email_signup_link: '/email-signup')
    assert_select ".gem-c-subscription-links__link--email-alerts[href=\"/email-signup\"]", text: "Get email alerts"
  end

  it "renders a feed link" do
    render_component(feed_link: 'singapore.atom')
    assert_select ".gem-c-subscription-links__link--feed[href=\"singapore.atom\"]", text: "Subscribe to feed"
  end

  it "renders both email signup and feed links" do
    render_component(email_signup_link: 'email-signup', feed_link: 'singapore.atom')
    assert_select ".gem-c-subscription-links__link--email-alerts[href=\"email-signup\"]", text: "Get email alerts"
    assert_select ".gem-c-subscription-links__link--feed[href=\"singapore.atom\"]", text: "Subscribe to feed"
  end

  it "renders custom texts" do
    render_component(email_signup_link: 'email-signup', feed_link: 'singapore.atom', email_signup_link_text: 'Get email!', feed_link_text: 'View feed!')
    assert_select ".gem-c-subscription-links__link--email-alerts[href=\"email-signup\"]", text: "Get email!"
    assert_select ".gem-c-subscription-links__link--feed[href=\"singapore.atom\"]", text: "View feed!"
  end

  it "renders with a feed link box" do
    render_component(feed_link_box_value: 'http://www.gov.uk', feed_link: 'singapore.atom')
    assert_select ".gem-c-subscription-links__link--feed[href=\"singapore.atom\"]", false
    assert_select ".gem-c-subscription-links__feed-box input[name='feed-reader-box'][value='http://www.gov.uk']"
  end

  it "adds branding correctly" do
    render_component(email_signup_link: 'email-signup', feed_link: 'singapore.atom', brand: 'attorney-generals-office')
    assert_select ".gem-c-subscription-links.brand--attorney-generals-office"
    assert_select ".gem-c-subscription-links__link--email-alerts.brand__color"
    assert_select ".gem-c-subscription-links__link--feed.brand__color"
  end

  it "adds tracking for email signup link" do
    render_component(email_signup_link: 'email-signup', email_signup_link_data_attributes: { 'track_category': 'test' })
    assert_select ".gem-c-subscription-links__list[data-module=\"track-click\"] .gem-c-subscription-links__link--email-alerts[data-track-category=\"test\"]"
  end

  it "adds tracking for feed link" do
    render_component(feed_link: 'feed', feed_link_data_attributes: { 'track_category': 'test' })
    assert_select ".gem-c-subscription-links__list[data-module=\"track-click\"] .gem-c-subscription-links__link--feed[data-track-category=\"test\"]"
  end

  it "adds tracking for feed link when it is a toggle" do
    render_component(feed_link_box_value: 'feed', feed_link_data_attributes: { 'track_category': 'test' })
    assert_select ".gem-c-subscription-links[data-module=\"gem-toggle\"]"
    assert_select ".gem-c-subscription-links__list[data-module=\"track-click\"] .gem-c-subscription-links__link--feed[data-track-category=\"test\"]"
  end
end
