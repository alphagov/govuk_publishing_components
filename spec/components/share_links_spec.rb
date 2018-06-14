require "rails_helper"

describe "ShareLinks", type: :view do
  def component_name
    "share_links"
  end

  def links
    [
      {
        href: '/facebook',
        text: 'Facebook',
        icon: 'facebook'
      },
      {
        href: '/twitter',
        text: 'Twitter',
        icon: 'twitter'
      },
    ]
  end

  it "renders nothing when no share links provided" do
    assert_empty render_component({})
  end

  it "renders share links correctly" do
    render_component(links: links)
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]"
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]"
  end

  it "renders a custom title" do
    render_component(links: links, title: 'Share this page')
    assert_select ".gem-c-share-links__title", text: "Share this page"
  end

  it "renders a share link if only one share link provided" do
    render_component(links: [links[0]])
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]"
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]",
      false, "A twitter share link has not been provided so should not have been rendered"
  end

  it "adds social interactions tracking" do
    render_component(links: [links[0]], track_as_sharing: true)
    assert_select '.gem-c-share-links__link[data-track-category="social media"][data-track-action="facebook"]'
    assert_select '.gem-c-share-links__link[data-track-options=\'{"socialAction":"share","socialNetwork":"facebook","socialTarget":"/facebook"}\']'
  end

  it "adds branding correctly" do
    render_component(links: [links[0]], brand: 'attorney-generals-office')
    assert_select ".gem-c-share-links.brand--attorney-generals-office .gem-c-share-links__link.brand__color"
  end

  it "accepts the stacking option" do
    render_component(links: links, stacked: true)
    assert_select ".gem-c-share-links.gem-c-share-links--stacked"
  end
end
