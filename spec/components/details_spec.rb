require "rails_helper"

describe "Details", type: :view do
  def component_name
    "details"
  end

  it "renders a details element" do
    render_component(title: "Some title") do
      "This is more info"
    end

    assert_select "details.gem-c-details[data-module='govuk-details gem-details ga4-event-tracker']"
    assert_select ".govuk-details__summary-text[data-ga4-expandable]", text: "Some title"
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

  it "applies aria labels to summary when provided" do
    render_component(
      title: "Some title",
      summary_aria_attributes: {
        label: "label",
      },
    )

    assert_select '.govuk-details .govuk-details__summary[aria-label="label"]'
  end

  it "defaults to the initial bottom margin if an incorrect value is passed" do
    render_component(
      title: "Some title",
      margin_bottom: 12,
    )

    assert_select '.govuk-details.govuk-\!-margin-bottom-3'
  end

  it "increments the GA4 index_section parameter when more than one component instance" do
    render_component(title: "first details")
    assert_select '.govuk-details__summary[data-ga4-event=\'{"event_name":"select_content","type":"detail","text":"first details","section":"first details","index_section":1}\']'

    render_component(title: "second details")
    assert_select '.govuk-details__summary[data-ga4-event=\'{"event_name":"select_content","type":"detail","text":"second details","section":"second details","index_section":2}\']'
  end

  it "accepts GA4 event data parameters" do
    render_component(
      title: "some title",
      ga4_attributes: { index_section_count: 12 },
    )
    assert_select '.govuk-details__summary[data-ga4-event=\'{"event_name":"select_content","type":"detail","text":"some title","section":"some title","index_section":1,"index_section_count":12}\']'
  end

  it "can override GA4 event data parameters" do
    render_component(
      title: "some title",
      ga4_attributes: { type: "a mouse!", index_section_count: 12 },
    )
    assert_select '.govuk-details__summary[data-ga4-event=\'{"event_name":"select_content","type":"a mouse!","text":"some title","section":"some title","index_section":1,"index_section_count":12}\']'
  end

  it "can disable GA4" do
    render_component(
      title: "some title",
      disable_ga4: true,
    )
    assert_select ".govuk-details__summary[data-ga4-event]", false
    assert_select ".govuk-details__summary-text[data-ga4-expandable]", false
  end
end
