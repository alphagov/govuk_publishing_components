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
  end

  it "shows heading text" do
    render_component(href: '#', heading_text: 'This is some text')
    assert_select ".gem-c-image-card .gem-c-image-card__title", text: 'This is some text'
  end

  it "can render different heading levels" do
    render_component(href: '#', heading_text: 'heading 1', heading_level: 1)
    assert_select ".gem-c-image-card h1.gem-c-image-card__title", text: 'heading 1'
  end

  it "shows metadata and description" do
    render_component(href: '#', metadata: 'some metadata', description: 'description')
    assert_select ".gem-c-image-card .gem-c-image-card__metadata", text: 'some metadata'
    assert_select ".gem-c-image-card .gem-c-image-card__description", text: 'description'
  end

  it "renders a large version" do
    render_component(href: '#', large: true)
    assert_select ".gem-c-image-card.gem-c-image-card--large"
  end
end
