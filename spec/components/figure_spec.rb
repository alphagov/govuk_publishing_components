require "rails_helper"

describe "Figure", type: :view do
  def component_name
    "figure"
  end

  it "fails to render a figure when no data is given" do
    render_component({})
    assert_select "figure", false, "Should not have drawn figure with no data passed through"
  end

  it "fails to render the component when no source is given" do
    render_component(src: nil)
    assert_select "figure", false, "Should not have drawn figure with no src passed through"
  end

  it "fails to render the component when a blank source is given" do
    render_component(src: "")
    assert_select "figure", false, "Should not have drawn figure with a blank src passed through"
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
