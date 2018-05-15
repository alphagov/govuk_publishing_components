require "rails_helper"

describe "ShareLinks", type: :view do
  def component_name
    "share_links"
  end

  it "renders nothing when no share links provided" do
    assert_empty render_component({})
  end

  it "renders share links correctly" do
    render_component(facebook_href: '/facebook', twitter_href: '/twitter')
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]"
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]"
  end

  it "renders a default title if no custom title is provided" do
    render_component(facebook_href: '/facebook', twitter_href: '/twitter')
    assert_select ".gem-c-share-links__title", text: "Share this page"
  end

  it "renders a share link with custom link text correctly" do
    render_component(facebook_href: '/facebook', twitter_href: '/twitter', title: 'Share this article')
    assert_select ".gem-c-share-links__title", text: "Share this article"
  end

  it "renders a share link if only one share link provided" do
    render_component(facebook_href: '/facebook')
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]"
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]",
      false, "A twitter share link has not been provided so should not have been rendered"
    assert_select ".gem-c-share-links .gem-c-share-links__link__icon--twitter",
      false, "A twitter share link has not been provided so a twitter icon should not have been rendered"
  end
end
