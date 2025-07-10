require "rails_helper"

describe "Tag", type: :view do
  def component_name
    "tag"
  end

  it "renders a standard tag component correctly" do
    render_component({ text: "Hello" })
    assert_select ".gem-c-tag", text: "Hello"
    assert_select "strong.govuk-tag", text: "Hello"
  end

  it "errors if text is nil" do
    assert_raises do
      render_component({})
    end
  end

  it "errors if text is empty" do
    assert_raises do
      render_component({ text: "" })
    end
  end

  it "makes text sentence case" do
    render_component({ text: "HELLO WORLD!" })
    assert_select ".gem-c-tag", text: "Hello world!"
  end

  it "adds a colour if a valid one is supplied" do
    colours = %w[grey green turquoise blue light-blue purple pink red orange yellow]
    colours.each do |colour|
      render_component({ text: "Hello", colour: colour })
      assert_select "strong.govuk-tag.govuk-tag--#{colour}"
    end
  end

  it "ignores invalid colours" do
    render_component({ text: "Hello", colour: "glass" })
    assert_select ".gem-c-tag.govuk-tag"
    assert_select "strong.govuk-tag.govuk-tag--glass", false
  end
end
