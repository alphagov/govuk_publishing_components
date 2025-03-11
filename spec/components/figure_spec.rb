require "rails_helper"

describe "Figure", type: :view do
  def component_name
    "figure"
  end

  it "fails to render a figure when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "fails to render an image when no source is given" do
    render_component(src: "", alt: "")
    assert_select "img", false, "Should not have drawn img tag with no src"
  end

  it "renders a figure correctly" do
    render_component(src: "/image", alt: "image alt text")
    assert_select ".gem-c-figure__image[src=\"/image\"]"
    assert_select ".gem-c-figure__image[alt=\"image alt text\"]"
  end

  it "renders a figure with caption correctly" do
    render_component(src: "/image", alt: "image alt text", caption: "This is a caption")
    assert_select ".gem-c-figure__image[src=\"/image\"]"
    assert_select ".gem-c-figure__image[alt=\"image alt text\"]"
    assert_select ".gem-c-figure__figcaption .gem-c-figure__figcaption-text", text: "This is a caption"
  end

  it "renders a figure with credit correctly" do
    render_component(src: "/image", alt: "image alt text", credit: "Creative Commons")
    assert_select ".gem-c-figure__image[src=\"/image\"]"
    assert_select ".gem-c-figure__image[alt=\"image alt text\"]"
    assert_select ".gem-c-figure__figcaption .gem-c-figure__figcaption-text", text: "Image credit: Creative Commons"
  end

  it "renders a figure with caption and credit correctly" do
    render_component(src: "/image", alt: "image alt text", caption: "This is a caption", credit: "Creative Commons")
    assert_select ".gem-c-figure__image[src=\"/image\"]"
    assert_select ".gem-c-figure__image[alt=\"image alt text\"]"
    assert_select ".gem-c-figure__figcaption .gem-c-figure__figcaption-text", text: "This is a caption"
    assert_select ".gem-c-figure__figcaption .gem-c-figure__figcaption-text", text: "Image credit: Creative Commons"
  end
end
