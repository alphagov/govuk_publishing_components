require "rails_helper"

describe "Fieldset", type: :view do
  def component_name
    "fieldset"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders a fieldset correctly" do
    render_component(
      legend_text: "Do you have a passport?",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!",
    )

    assert_select ".govuk-fieldset__legend", text: "Do you have a passport?"
    assert_select ".gem-c-fieldset", text: /Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!/
  end

  it "renders a fieldset with the legend as heading" do
    render_component(
      legend_text: "Do you have a passport?",
      heading_level: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!",
    )
    assert_select ".govuk-fieldset .govuk-fieldset__legend h2", "Do you have a passport?"
  end

  it "renders a fieldset with a custom size legend" do
    render_component(
      legend_text: "Do you have a passport?",
      heading_size: "xl",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!",
    )

    assert_select ".govuk-fieldset__legend.govuk-fieldset__legend--xl"
  end

  it "renders a fieldset with an error correctly" do
    render_component(
      legend_text: "Do you have a passport?",
      error_message: "uh oh",
      error_id: "error_id",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!",
    )

    assert_select ".gem-c-fieldset.govuk-form-group.govuk-form-group--error"
    assert_select ".govuk-fieldset[aria-describedby=error_id]"
    assert_select ".gem-c-error-message[id=error_id]", text: "Error: uh oh"
  end
end
