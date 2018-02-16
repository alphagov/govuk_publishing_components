require 'rails_helper'

describe "Fieldset", type: :view do
  def render_component(locals)
    render file: "govuk_publishing_components/components/_fieldset", locals: locals
  end

  it "does not render anything if no data is passed" do
    assert_empty render_component({})
  end

  it "renders a fieldset correctly" do
    render_component(
      legend_text: 'Do you have a passport?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!'
    )

    assert_select ".gem-c-fieldset__legend", text: 'Do you have a passport?'
    assert_select ".gem-c-fieldset", text: /Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!/
  end

  it "renders a fieldset without a legend" do
    render_component(
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!'
    )

    assert_select ".gem-c-fieldset__legend", false
    assert_select ".gem-c-fieldset", text: /Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!/
  end
end
