require 'rails_helper'

describe "Fieldset", type: :view do
  def render_component(locals)
    render file: "components/_fieldset", locals: locals
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders a fieldset correctly" do
    render_component(
      legend_text: 'Do you have a passport?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!'
    )

    assert_select ".gem-c-fieldset__legend", text: 'Do you have a passport?'
    assert_select ".gem-c-fieldset", text: /Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!/
  end
end
