require 'rails_helper'

describe "Panel", type: :view do
  def component_name
    "panel"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders an error summary with title and aria-labelledby set correctly" do
    render_component(
      title: 'Application complete',
      description: 'Description'
    )

    assert_select ".govuk-panel__title", text: 'Application complete'
    assert_select ".govuk-panel__body", text: 'Description'
  end
end
