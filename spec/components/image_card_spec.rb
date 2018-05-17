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
end
