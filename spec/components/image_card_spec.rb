require "rails_helper"

describe "ImageCard", type: :view do
  def component_name
    "image_card"
  end

  it "renders nothing when no link or youtube video id provided" do
    assert_empty render_component({})
  end

  it "shows an image" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text")
    assert_select ".gem-c-image-card .gem-c-image-card__image[src='/moo.jpg'][alt='some meaningful alt text']"
    assert_select ".gem-c-image-card[data-module='ga4-link-tracker']", false
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

  it "renders extra details" do
    render_component(href: "#", extra_details: [{ href: "/1", text: "link1" }, { href: "/2", text: "link2" }])
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/1']", text: "link1"
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/2']", text: "link2"
  end

  it "renders extra details without indent" do
    render_component(href: "#", extra_details: [{ href: "/1", text: "link1" }], extra_details_no_indent: true)
    assert_select ".gem-c-image-card__list"
    assert_select ".gem-c-image-card__list.gem-c-image-card__list--indented", false
  end

  it "renders extra details without links and just as a text list" do
    render_component(href: "#", extra_details: [{ text: "text1" }], extra_details_no_indent: true)
    assert_select ".gem-c-image-card__list"
    assert_select ".gem-c-image-card__list-item.gem-c-image-card__list-item--text"
  end

  it "renders extra details without a main link" do
    render_component(extra_details: [{ href: "/1", text: "link1" }])
    assert_select ".gem-c-image-card__title a", false
  end

  it "applies branding" do
    render_component(href: "#", heading_text: "test", extra_details: [{ href: "/1", text: "link1" }], brand: "attorney-generals-office")
    assert_select ".gem-c-image-card.brand--attorney-generals-office"
    assert_select ".gem-c-image-card__title-link.brand__color"
    assert_select ".gem-c-image-card__list-item .brand__color"
  end

  it "labels a no-image version" do
    render_component(href: "#", heading_text: "test", extra_details: [{ href: "/1", text: "link1" }], brand: "attorney-generals-office")
    assert_select ".gem-c-image-card__image-wrapper", false
  end

  it "renders a large version" do
    render_component(href: "#", large: true)
    assert_select ".gem-c-image-card.gem-c-image-card--large"
  end

  it "renders two thirds variant with correct image width and height attributes" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text", heading_text: "test", two_thirds: true)
    assert_select ".gem-c-image-card.gem-c-image-card--two-thirds"
    assert_select ".gem-c-image-card__image[width='90']"
    assert_select ".gem-c-image-card__image[height='90']"
  end

  it "renders two thirds variant with large title and description text font size for mobile" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text", heading_text: "heading", description: "description", two_thirds: true, large_font_size_mobile: true)
    assert_select ".gem-c-image-card--two-thirds .gem-c-image-card__title-link--large-font-size-mobile", text: "heading"
    assert_select ".gem-c-image-card--two-thirds .gem-c-image-card__description--large-font-size-mobile", text: "description"
  end

  it "shows metadata" do
    render_component(href: "#", metadata: "Unpaid")
    assert_select ".gem-c-image-card__metadata", text: "Unpaid"
  end

  it "applies lazy loading attribute when lazy is specified" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text", image_loading: "lazy")
    assert_select ".gem-c-image-card__image[loading='lazy']"
  end

  it "checks image loading attribute is 'auto' when value 'image_loading' is not specified" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text")
    assert_select ".gem-c-image-card__image[loading='auto']"
  end

  it "applies correct default width and height attributes to the image" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text")
    assert_select ".gem-c-image-card__image[width='300']"
    assert_select ".gem-c-image-card__image[height='200']"
  end

  it "applies the sizes attribute to image if specified" do
    render_component(href: "#", image_src: "/moo.jpg", image_alt: "some meaningful alt text", sizes: "100vw, 300vw")
    assert_select ".gem-c-image-card__image[sizes='100vw, 300vw']"
  end

  it "applies the srcset attribute to image if specified" do
    render_component(
      href: "#",
      image_src: "/moo.jpg",
      image_alt: "some meaningful alt text",
      srcset: {
        "my-image.jpg": "600w",
      },
    )
    assert_select ".gem-c-image-card__image[srcset='/images/my-image.jpg 600w']"
  end

  it "adds the imagecard module if youtube video id added" do
    render_component(youtube_video_id: "EXAMPLE", image_src: "/moo.jpg", image_alt: "some meaningful alt text", sizes: "100vw, 300vw")
    assert_select ".gem-c-image-card[data-module='image-card']"
  end

  it "generates youtube fallback link if youtube video id supplied" do
    render_component(youtube_video_id: "EXAMPLE", image_alt: "some meaningful alt text")
    assert_select ".gem-c-image-card__youtube-thumbnail-container[href='https://www.youtube.com/watch?v=EXAMPLE']"
    assert_select ".gem-c-image-card__youtube-thumbnail-image[src='https://img.youtube.com/vi/EXAMPLE/maxresdefault.jpg']"
  end

  it "adds brand__color to figcaption of youtube fallback link if brand" do
    render_component(youtube_video_id: "EXAMPLE", image_alt: "some meaningful alt text", brand: "brand")
    assert_select ".gem-c-image-card__youtube-thumbnail-container-text.brand__color"
  end
end
