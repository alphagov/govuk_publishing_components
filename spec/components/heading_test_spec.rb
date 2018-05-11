require 'rails_helper'

describe "Heading", type: :view do
  def component_name
    "heading"
  end

  it "fails to render a heading when no title is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders a heading correctly" do
    render_component(text: 'Download documents')
    assert_select "h1.gem-c-heading", text: 'Download documents'
  end

  it "renders a different heading level" do
    render_component(text: 'Original consultation', heading_level: 3)
    assert_select "h3.gem-c-heading", text: 'Original consultation'
  end

  it "has a specified id attribute" do
    render_component(text: 'Consultation description', id: 'custom-id')
    assert_select ".gem-c-heading[id='custom-id']", text: 'Consultation description'
  end

  it "adds the correct class for publications and consultations page" do
    render_component(text: 'Consistency is nice', mobile_top_margin: true)
    assert_select ".gem-c-heading.gem-c-heading--mobile-top-margin"
  end

  it "adds padding" do
    render_component(text: 'Padddddding', padding: true)
    assert_select ".gem-c-heading.gem-c-heading--padding"
  end

  it "adds margin 2" do
    render_component(text: 'Margin 2', margin_bottom: 2)
    assert_select ".gem-c-heading.gem-c-heading--margin-bottom-2"
  end

  it "adds margin 4" do
    render_component(text: 'Margin 4', margin_bottom: 4)
    assert_select ".gem-c-heading.gem-c-heading--margin-bottom-4"
  end
end
