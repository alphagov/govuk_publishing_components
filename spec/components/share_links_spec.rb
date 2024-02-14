require "rails_helper"

describe "ShareLinks", type: :view do
  def component_name
    "share_links"
  end

  def links
    [
      {
        href: "/facebook",
        text: "Facebook",
        icon: "facebook",
      },
      {
        href: "/twitter",
        text: "Twitter",
        hidden_text: "Tweet to",
        icon: "twitter",
      },
    ]
  end

  it "renders nothing when no share links provided" do
    assert_empty render_component({})
  end

  it "renders share links correctly" do
    render_component(links:)
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]", /Share.+on.+Facebook.+\(opens.+in.+new.+tab\)/m
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]", /Tweet.+to.+Twitter.+\(opens.+in.+new.+tab\)/m
  end

  it "renders a custom title" do
    render_component(links:, title: "Share this page")
    assert_select ".gem-c-share-links .govuk-heading-s", text: "Share this page"
  end

  it "renders a share link if only one share link provided" do
    render_component(links: [links[0]])
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"]"
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"]",
                  false,
                  "A twitter share link has not been provided so should not have been rendered"
  end

  it "accepts a passed data module without removing the default" do
    attributes = {
      module: "test",
    }
    render_component(links:, data_attributes: attributes)
    assert_select ".gem-c-share-links[data-module='test gem-track-click']"
  end

  it "renders data attributes for individual links" do
    links_with_attributes = [
      {
        href: "/facebook",
        text: "Facebook",
        icon: "facebook",
        data_attributes: {
          test1: "one",
        },
      },
      {
        href: "/twitter",
        text: "Twitter",
        icon: "twitter",
        data_attributes: {
          test2: "two",
        },
      },
    ]
    render_component(links: links_with_attributes)
    assert_select '.gem-c-share-links__link[data-test1="one"]', /Share.+on.+Facebook.+\(opens.+in.+new.+tab\)/m
    assert_select '.gem-c-share-links__link[data-test2="two"]', /Share.+on.+Twitter.+\(opens.+in.+new.+tab\)/m
  end

  it "adds social interactions tracking for sharing" do
    render_component(links: [links[0]], track_as_sharing: true)
    assert_select '.gem-c-share-links[data-module="gem-track-click ga4-link-tracker"]'
    assert_select '.gem-c-share-links__link[data-track-category="social media"][data-track-action="facebook"]'
    assert_select '.gem-c-share-links__link[data-track-options=\'{"socialAction":"share","socialNetwork":"facebook","socialTarget":"/facebook"}\']'

    assert_select '.gem-c-share-links__link[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"share page\",\"index_link\":1,\"index_total\":1,\"text\":\"facebook\"}"]'
  end

  it "adds social interactions tracking for following" do
    render_component(links: [links[0]], track_as_follow: true)
    assert_select '.gem-c-share-links[data-module="gem-track-click ga4-link-tracker"]'
    assert_select '.gem-c-share-links__link[data-track-category="social media"][data-track-action="facebook"]'

    assert_select '.gem-c-share-links__link[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"follow us\",\"index_link\":1,\"index_total\":1}"]'
  end

  it "allows adding extra GA4 attributes for share links" do
    render_component(links: [links[0]], track_as_sharing: true, ga4_extra_data: { section: "This is a section", type: "overwritten type" })
    assert_select '.gem-c-share-links[data-module="gem-track-click ga4-link-tracker"]'
    assert_select '.gem-c-share-links__link[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"overwritten type\",\"index_link\":1,\"index_total\":1,\"text\":\"facebook\",\"section\":\"This is a section\"}"]'
  end

  it "allows adding extra GA4 attributes for follow links" do
    render_component(links: [links[0]], track_as_follow: true, ga4_extra_data: { section: "This is another section", type: "overwritten type 2" })
    assert_select '.gem-c-share-links[data-module="gem-track-click ga4-link-tracker"]'
    assert_select '.gem-c-share-links__link[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"overwritten type 2\",\"index_link\":1,\"index_total\":1,\"section\":\"This is another section\"}"]'
  end

  it "adds branding correctly" do
    render_component(links: [links[0]], brand: "attorney-generals-office")
    assert_select ".gem-c-share-links.brand--attorney-generals-office .gem-c-share-links__link.brand__color"
  end

  it "arranges in columns" do
    render_component(links: [links[0]], columns: true)
    assert_select ".gem-c-share-links.gem-c-share-links--columns"
  end

  it "accepts the stacking option" do
    render_component(links:, stacked: true)
    assert_select ".gem-c-share-links.gem-c-share-links--stacked"
  end

  it "displays the visually hidden text 'Share on' if custom hidden_text is not specified" do
    render_component(links:)
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/facebook\"] .govuk-visually-hidden", text: "Share on"
  end

  it "displays the provided visually hidden text" do
    render_component(links:)
    assert_select ".gem-c-share-links .gem-c-share-links__link[href=\"/twitter\"] .govuk-visually-hidden", text: "Tweet to"
  end
end
