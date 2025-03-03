require "rails_helper"

describe "Panel", type: :view do
  def component_name
    "panel"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders a panel component with title and body" do
    render_component(
      title: "Application complete",
      description: "Description",
    )

    assert_select ".govuk-panel__title .govuk-panel__title-text", text: "Application complete"
    assert_select ".govuk-panel__body", text: "Description"
  end

  it "renders a panel component with prepend, title and append" do
    render_component(
      title: "Application complete",
      prepend: "Prepended content",
      append: "Appended content",
    )

    assert_select ".govuk-panel__title .govuk-panel__title-text", text: "Application complete"
    assert_select ".gem-c-panel__prepend", text: "Prepended content"
    assert_select ".gem-c-panel__append", text: "Appended content"
  end

  it "renders with a default heading level of 2" do
    render_component(
      title: "Application complete",
    )

    assert_select "h2.govuk-panel__title", text: "Application complete"
  end

  it "renders with a different heading level" do
    render_component(
      title: "Application complete",
      heading_level: 1,
    )

    assert_select "h1.govuk-panel__title", text: "Application complete"
  end
end
