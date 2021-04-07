require "rails_helper"

describe "ImageCard", type: :view do
  def component_name
    "image_card"
  end

  it "renders nothing when no link provided" do
    assert_empty render_component({})
  end

  it "shows an image" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text")
    assert_select ".gem-c-image-card .gem-c-image-card__image[src='/moo.jpg'][alt='some meaningful alt text']"
    assert_select ".gem-c-image-card[data-module='gem-track-click']", false
  end

  it "shows heading text" do
    render_component(href: "#", heading_text: "This is some text")
    assert_select ".gem-c-image-card .gem-c-image-card__title", text: "This is some text"
  end

  it "can render different heading levels" do
    render_component(href: "#", heading_text: "heading 1", heading_level: 1)
    assert_select ".gem-c-image-card h1.gem-c-image-card__title", text: "heading 1"
  end

  it "can have no heading tag" do
    render_component(href: "#", heading_text: "no heading", heading_level: 0)
    assert_select ".gem-c-image-card span.gem-c-image-card__title", text: "no heading"
    assert_select ".gem-c-image-card h2.gem-c-image-card__title", false
  end

  it "shows the default link size correctly" do
    render_component(href: "#", heading_text: "normal")
    assert_select ".gem-c-image-card .gem-c-image-card__title.govuk-heading-s", text: "normal"
  end

  it "shows the default link size correctly with invalid input" do
    render_component(href: "#", heading_text: "normal", font_size: "notvalid")
    assert_select ".gem-c-image-card .gem-c-image-card__title.govuk-heading-s", text: "normal"
  end

  it "can do different link sizes" do
    render_component(href: "#", heading_text: "bigger", font_size: "xl")
    assert_select ".gem-c-image-card .gem-c-image-card__title.govuk-heading-xl", text: "bigger"
  end

  it "shows description" do
    render_component(href: "#", description: "description")
    assert_select ".gem-c-image-card .gem-c-image-card__description", text: "description"
  end

  it "shows text context" do
    render_component(href: "#", context: { text: "press release" })
    assert_select ".gem-c-image-card .gem-c-image-card__context", text: "press release"
  end

  it "shows date context" do
    render_component(href: "#", context: { date: Time.zone.parse("2017-06-14 14:50:33 +0000") })
    assert_select ".gem-c-image-card .gem-c-image-card__context time[datetime='2017-06-14T14:50:33Z']", text: "14 June 2017"
  end

  it "shows date and text context together" do
    render_component(href: "#", context: { date: Time.zone.parse("2017-06-14 14:50:33 +0000"), text: "Press Release" })
    assert_select ".gem-c-image-card .gem-c-image-card__context", text: "14 June 2017 — Press Release"
    assert_select ".gem-c-image-card .gem-c-image-card__context time[datetime='2017-06-14T14:50:33Z']", text: "14 June 2017"
    assert_select ".gem-c-image-card .gem-c-image-card__context span[aria-hidden=true]", text: "—"
  end

  it "renders extra links" do
    render_component(href: "#", extra_links: [{ href: "/1", text: "link1" }, { href: "/2", text: "link2" }])
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/1']", text: "link1"
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/2']", text: "link2"
  end

  it "renders extra links without indent" do
    render_component(href: "#", extra_links: [{ href: "/1", text: "link1" }], extra_links_no_indent: true)
    assert_select ".gem-c-image-card__list"
    assert_select ".gem-c-image-card__list.gem-c-image-card__list--indented", false
  end

  it "renders extra links without a main link" do
    render_component(extra_links: [{ href: "/1", text: "link1" }])
    assert_select ".gem-c-image-card__title a", false
  end

  it "applies branding" do
    render_component(href: "#", heading_text: "test", extra_links: [{ href: "/1", text: "link1" }], brand: "attorney-generals-office")
    assert_select ".gem-c-image-card.brand--attorney-generals-office"
    assert_select ".gem-c-image-card__title-link.brand__color"
    assert_select ".gem-c-image-card__list-item .brand__color"
  end

  it "labels a no-image version" do
    render_component(href: "#", heading_text: "test", extra_links: [{ href: "/1", text: "link1" }], brand: "attorney-generals-office")
    assert_select ".gem-c-image-card--no-image"
  end

  it "renders a large version" do
    render_component(href: "#", large: true)
    assert_select ".gem-c-image-card.gem-c-image-card--large"
  end

  it "applies tracking attributes" do
    render_component(href: "#", href_data_attributes: { track_category: "cat" }, heading_text: "test")
    assert_select ".gem-c-image-card[data-module='gem-track-click']"
    assert_select ".gem-c-image-card__title-link[data-track-category='cat']"
  end

  it "applies tracking attributes for extra links" do
    render_component(href: "#", extra_links: [{ href: "/", text: "1", data_attributes: { track_category: "cat" } }])
    assert_select ".gem-c-image-card[data-module='gem-track-click']"
    assert_select ".gem-c-image-card__list-item a[data-track-category='cat']"
  end

  it "shows metadata" do
    render_component(href: "#", metadata: "Unpaid")
    assert_select ".gem-c-image-card__metadata", text: "Unpaid"
  end

  it "applies lang attribute when lang is specified" do
    render_component(href: "#", lang: "cy")
    assert_select ".gem-c-image-card[lang='cy']"
  end
end
