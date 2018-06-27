require "rails_helper"

describe "ImageCard", type: :view do
  def component_name
    "image_card"
  end

  it "renders nothing when no link provided" do
    assert_empty render_component({})
  end

  it "shows an image" do
    render_component(href: '#', image_src: '/moo.jpg', image_alt: 'some meaningful alt text')
    assert_select ".gem-c-image-card .gem-c-image-card__image[src='/moo.jpg'][alt='some meaningful alt text']"
    assert_select ".gem-c-image-card[data-module='track-click']", false
  end

  it "shows heading text" do
    render_component(href: '#', heading_text: 'This is some text')
    assert_select ".gem-c-image-card .gem-c-image-card__title", text: 'This is some text'
  end

  it "can render different heading levels" do
    render_component(href: '#', heading_text: 'heading 1', heading_level: 1)
    assert_select ".gem-c-image-card h1.gem-c-image-card__title", text: 'heading 1'
  end

  it "can have no heading tag" do
    render_component(href: '#', heading_text: 'no heading', heading_level: 0)
    assert_select ".gem-c-image-card span.gem-c-image-card__title", text: 'no heading'
    assert_select ".gem-c-image-card h2.gem-c-image-card__title", false
  end

  it "shows context and description" do
    render_component(href: '#', context: 'some context', description: 'description')
    assert_select ".gem-c-image-card .gem-c-image-card__context", text: 'some context'
    assert_select ".gem-c-image-card .gem-c-image-card__description", text: 'description'
  end

  it "renders extra links" do
    render_component(href: '#', extra_links: [{ href: '/1', text: 'link1' }, { href: '/2', text: 'link2' }])
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/1']", text: 'link1'
    assert_select ".gem-c-image-card__list .gem-c-image-card__list-item a[href='/2']", text: 'link2'
  end

  it "renders extra links without indent" do
    render_component(href: '#', extra_links: [{ href: '/1', text: 'link1' }], extra_links_no_indent: true)
    assert_select ".gem-c-image-card__list"
    assert_select ".gem-c-image-card__list.gem-c-image-card__list--indented", false
  end

  it "renders extra links without a main link" do
    render_component(extra_links: [{ href: '/1', text: 'link1' }])
    assert_select ".gem-c-image-card__title a", false
  end

  it "applies branding" do
    render_component(href: '#', heading_text: 'test', extra_links: [{ href: '/1', text: 'link1' }], brand: 'attorney-generals-office')
    assert_select ".gem-c-image-card.brand--attorney-generals-office"
    assert_select ".gem-c-image-card__title-link.brand__color"
    assert_select ".gem-c-image-card__list-item .brand__color"
  end

  it "renders a large version" do
    render_component(href: '#', large: true)
    assert_select ".gem-c-image-card.gem-c-image-card--large"
  end

  it "applies tracking attributes" do
    render_component(href: '#', href_data_attributes: { track_category: 'cat' }, heading_text: 'test')
    assert_select ".gem-c-image-card[data-module='track-click']"
    assert_select ".gem-c-image-card__title-link[data-track-category='cat']"
  end

  it "applies tracking attributes for extra links" do
    render_component(href: '#', extra_links: [{ href: '/', text: '1', data_attributes: { track_category: 'cat' } }])
    assert_select ".gem-c-image-card[data-module='track-click']"
    assert_select ".gem-c-image-card__list-item a[data-track-category='cat']"
  end

  it "shows metadata" do
    render_component(href: '#', metadata: "Unpaid")
    assert_select ".gem-c-image-card__metadata", text: 'Unpaid'
  end
end
