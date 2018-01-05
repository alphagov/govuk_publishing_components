require 'rails_helper'

describe "Back Link", type: :view do
  def render_component(locals)
    render file: "components/_back_link", locals: locals
  end

  it "fails to render a back link when no href is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders a back link correctly" do
    render_component(href: '/back-me')
    assert_select ".gem-c-back-link[href=\"/back-me\"]", text: "Back"
  end

  it "can render in welsh" do
    I18n.with_locale(:cy) { render_component(href: '/back-me') }
    assert_select ".gem-c-back-link[href=\"/back-me\"]", text: "Yn ôl"
  end
end
