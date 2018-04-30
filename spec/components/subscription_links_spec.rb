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
end
