require "rails_helper"

describe "Details", type: :view do
  def component_name
    "details"
  end

  it "renders a details element" do
    render_component(title: "Some title") do
      "This is more info"
    end

    assert_select "details.gem-c-details"
    assert_select ".govuk-details__summary-text", text: "Some title"
    assert_select ".govuk-details__text", text: "This is more info"
  end

  it "renders an open details element" do
    render_component(title: "Some title", open: true) do
      "This is more info"
    end

    assert_select "details.gem-c-details[open]"
  end

  it "applies a specified bottom margin" do
    render_component(
      title: "Some title",
      margin_bottom: 0,
    )

    assert_select '.govuk-details.govuk-\!-margin-bottom-0'
  end

  it "applies data attributes when provided" do
    render_component(
      title: "Some title",
      data_attributes: {
        track_category: "track-category",
        track_action: "track-action",
        track_label: "track-label",
      },
    )

    assert_select '.govuk-details .govuk-details__summary[data-track-category="track-category"]'
    assert_select '.govuk-details .govuk-details__summary[data-track-action="track-action"]'
    assert_select '.govuk-details .govuk-details__summary[data-track-label="track-label"]'
  end

  it "defaults to the initial bottom margin if an incorrect value is passed" do
    render_component(
      title: "Some title",
      margin_bottom: 12,
    )

    assert_select '.govuk-details.govuk-\!-margin-bottom-3'
  end
end
