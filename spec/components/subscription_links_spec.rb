require "rails_helper"

describe "subscription links", type: :view do
  def component_name
    "subscription_links"
  end

  it "renders nothing when no parameters are given" do
    assert_empty render_component({})
  end

  it "renders an email signup link" do
    render_component(email_signup_link: "/email-signup")
    assert_select ".gem-c-subscription-links__item[href=\"/email-signup\"]", text: "Get emails"
  end

  it "renders a feed link" do
    render_component(feed_link: "singapore.atom")
    assert_select ".gem-c-subscription-links__item[href=\"singapore.atom\"]", text: "Subscribe to feed"
    assert_select ".gem-c-subscription-links__item[data-controls][data-expanded]", false
  end

  it "renders both email signup and feed links" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom")
    assert_select ".gem-c-subscription-links[data-module='gem-toggle']", false
    assert_select ".gem-c-subscription-links__item[href=\"email-signup\"]", text: "Get emails"
    assert_select ".gem-c-subscription-links__item[href=\"singapore.atom\"]", text: "Subscribe to feed"
  end

  it "adds margin" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", margin_bottom: 7)
    assert_select '.gem-c-subscription-links.govuk-\!-margin-bottom-7'
  end

  it "has no margin class added by default" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom")
    assert_select "[class^='govuk-\!-margin-bottom-']", false
  end

  it "renders custom texts" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", email_signup_link_text: "Get email!", feed_link_text: "View feed!")
    assert_select ".gem-c-subscription-links__item[href=\"email-signup\"]", text: "Get email!"
    assert_select ".gem-c-subscription-links__item[href=\"singapore.atom\"]", text: "View feed!"
  end

  it "renders with a feed link box" do
    render_component(feed_link_box_value: "http://www.gov.uk", feed_link: "singapore.atom")
    assert_select ".gem-c-subscription-links[data-module=\"gem-toggle\"]"
    assert_select ".gem-c-subscription-links__item[href=\"singapore.atom\"]", false
    assert_select ".gem-c-subscription-links__feed-box input[name='feed-reader-box'][value='http://www.gov.uk']"
  end

  it "adds branding correctly" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", brand: "attorney-generals-office")
    assert_select ".gem-c-subscription-links.brand--attorney-generals-office"
    assert_select ".gem-c-subscription-links__item.brand__color"
    assert_select ".gem-c-subscription-links__item.brand__color"
  end

  it "adds small form modifier to the list of links" do
    render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", small_form: true)
    assert_select ".gem-c-subscription-links__list--small"
    assert_select ".gem-c-subscription-links__list-item--small"
  end

  describe "component heading" do
    it "renders a heading by default" do
      render_component(email_signup_link: "email-signup", feed_link: "singapore.atom")
      assert_select "h2.gem-c-subscription-links__hidden-header"
    end

    it "renders a heading by default" do
      render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", hide_heading: false)
      assert_select "h2.gem-c-subscription-links__hidden-header"
    end

    it "renders without a heading" do
      render_component(email_signup_link: "email-signup", feed_link: "singapore.atom", hide_heading: true)
      assert_select "h2.gem-c-subscription-links__hidden-header", false
    end
  end

  it "adds a lang attribute when set" do
    render_component(
      email_signup_link: "email-signup",
      email_signup_link_text: "Get email!",
      email_signup_link_text_locale: "es",
      feed_link: "singapore.atom",
      feed_link_text: "View feed!",
      feed_link_text_locale: "fr",
    )
    assert_select ".gem-c-subscription-links__item[lang='es']", 1
    assert_select ".gem-c-subscription-links__item[lang='fr']", 1
  end

  it "no lang attribute is added when not set" do
    render_component(
      email_signup_link: "email-signup",
      email_signup_link_text: "Get email!",
      feed_link: "singapore.atom",
      feed_link_text: "View feed!",
    )
    assert_select ".gem-c-subscription-links__item[lang]", false
  end

  it "no lang attribute set when locale is set but empty" do
    render_component(
      email_signup_link: "email-signup",
      email_signup_link_text_locale: "",
      feed_link: "singapore.atom",
      feed_link_text_locale: "",
    )
    assert_select ".gem-c-subscription-links__item[lang]", false
  end

  it "no lang attribute set when locale is false" do
    render_component(
      email_signup_link: "email-signup",
      email_signup_link_text_locale: false,
      feed_link: "singapore.atom",
      feed_link_text_locale: false,
    )
    assert_select ".gem-c-subscription-links__item[lang]", false
  end

  it "no lang attribute set when locale is nil" do
    render_component(
      email_signup_link: "email-signup",
      email_signup_link_text_locale: nil,
      feed_link: "singapore.atom",
      feed_link_text_locale: nil,
    )
    assert_select ".gem-c-subscription-links__item[lang]", false
  end
end
