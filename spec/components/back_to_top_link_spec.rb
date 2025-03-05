require "rails_helper"

describe "Back To Top Link", type: :view do
  def component_name
    "back_to_top_link"
  end

  it "fails to render a back to top link when no parameters given" do
    assert_raises do
      render_component({})
    end
  end

  it "fails to render a back to top link when blank text is given" do
    assert_raises do
      render_component({ text: " " })
    end
  end

  it "fails to render a back to top link when a blank href is given" do
    assert_raises do
      render_component({ href: " " })
    end
  end

  it "renders a back to top link with default text" do
    render_component(href: "#contents")

    assert_select ".gem-c-back-to-top-link[href='#contents']", text: "Contents"
  end

  it "renders a back to top link when a href is given" do
    render_component(href: "#contents")

    assert_select ".gem-c-back-to-top-link[href='#contents']"
  end

  it "renders a back to top link with custom text" do
    render_component(href: "#contents", text: "Back to top")

    assert_select ".gem-c-back-to-top-link[href='#contents']", text: "Back to top"
  end
end
