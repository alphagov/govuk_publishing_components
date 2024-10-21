require "rails_helper"

describe "Chart", type: :view do
  def component_name
    "chart"
  end

  let(:data) do
    {
      chart_label: "Page views chart",
      table_label: "Page views table",
      keys: (Date.new(2017, 12, 1)..Date.new(2017, 12, 12)).to_a,
      rows: [
        {
          label: "2017",
          values: [5, nil, nil, 119, 74, 117, 50, 119, 61, 110, 12, 21, 121, 67],
        },
        {
          label: "2018",
          values: [3, 8, 37, 435, 78, 4, 9, 61, 110, 12, 21, 121],
        },
      ],
    }
  end

  it "does not render when no data is given" do
    assert_empty render_component({})
  end

  it "does not render if keys are missing" do
    data[:keys] = []
    assert_empty render_component(data)
  end

  it "does not render if row data is missing" do
    data[:rows] = []
    assert_empty render_component(data)
  end

  it "renders when given valid data" do
    render_component(data)
    assert_select '.gem-c-chart.govuk-\!-margin-bottom-3', 1
  end

  it "renders the correct table data horizontally" do
    data[:table_direction] = "horizontal"
    render_component(data)
    assert_select ".govuk-table__body .govuk-table__header:nth-child(1)", text: "2017"
    assert_select ".govuk-table__cell--numeric", 26
    assert_select ".govuk-table__header", 14
    assert_select "td:first", text: "5"
    assert_select "td:last", text: "121"
  end

  it "renders the correct table data vertically" do
    data[:table_direction] = "vertical"
    render_component(data)
    assert_select ".govuk-table__body .govuk-table__header:nth-child(1)", text: "2017-12-01"
    assert_select ".govuk-table__cell--numeric", 24
    assert_select ".govuk-table__header", 14

    assert_select "td:first", text: "5"
    assert_select ".govuk-table__body tr:nth-of-type(4) td:first", text: "119"
    assert_select "td:last", text: "121"
  end

  it "calls the chart library" do
    render_component(data)
    assert_select "script", text: /new Chartkick.["LineChart"]/
  end

  it "displays a heading" do
    data[:chart_heading] = "hello"
    render_component(data)

    assert_select "h2.gem-c-heading", text: "hello"
  end

  it "displays a heading with a custom heading level" do
    data[:chart_heading] = "hello"
    data[:chart_heading_level] = 4
    render_component(data)

    assert_select "h4.gem-c-heading", text: "hello"
  end

  it "can include an overview" do
    overview = "This chart shows a gradual decline in the numbers of hedgehogs using social media since 2008."
    data[:chart_overview] = overview
    render_component(data)
    assert_select ".gem-c-chart__a11y-note-1", text: overview
    assert_select ".gem-c-chart__a11y-note-2", text: "This chart is a visual representation of the data available in the table."
  end

  it "can include a download link" do
    data[:link] = "https://www.gov.uk"
    render_component(data)

    assert_select '.govuk-link[href="https://www.gov.uk"]', text: "Download chart data"
  end

  it "can have a different bottom margin" do
    data[:margin_bottom] = 0
    render_component(data)

    assert_select '.gem-c-chart.govuk-\!-margin-bottom-0'
  end

  it "renders a minimal version" do
    data[:minimal] = true
    data[:link] = "https://should.not.be.shown"
    data[:minimal_link] = "https://www.gov.uk"
    data[:chart_overview] = "This is a chart showing a rise in sea levels in the last ten years"
    render_component(data)

    assert_select ".gem-c-chart.gem-c-chart--minimal"
    assert_select '.gem-c-chart .govuk-link[href="https://should.not.be.shown"]', false
    assert_select '.gem-c-chart .gem-c-chart__minimal-link[href="https://www.gov.uk"]'
    assert_select ".gem-c-chart__a11y-note-1", text: "This is a chart showing a rise in sea levels in the last ten years"
    assert_select ".gem-c-chart__a11y-note-2", false
  end

  it "does not render a minimal version if a link is not supplied" do
    data[:minimal] = true
    assert_empty render_component(data)
  end

  it "only calls an external script once" do
    render_component(data)
    data[:classes] = "" # need to 'reset' this otherwise it carries from the first component and breaks shared_helper
    render_component(data)

    assert_select 'script[src="https://www.gstatic.com/charts/loader.js"]', count: 1
  end
end
