require "rails_helper"

describe "Glance Metric", type: :view do
  def component_name
    "glance_metric"
  end

  let(:data) do
    {
      name: "Unique pageviews",
      figure: "167",
      measurement_explicit_label: "Million",
      measurement_display_label: "m",
      context: "This is in your top 10 items",
      period: "Apr 2018 to Mar 2018",
    }
  end

  it "does not render when no data is given" do
    assert_empty render_component({})
  end

  it "does not render if name is not supplied" do
    data[:name] = false
    assert_empty render_component(data)
  end

  it "renders no data if figure is not present" do
    data[:figure] = nil
    render_component(data)
    assert_select ".gem-c-glance-metric__figure", text: "No data"
  end

  it "renders correctly when given valid data" do
    render_component(data)
    assert_select ".gem-c-glance-metric"
    assert_select "h3.gem-c-glance-metric__heading", text: "Unique pageviews"
    assert_select ".gem-c-glance-metric__figure", text: /167/
    assert_select ".gem-c-glance-metric__display-label", text: "m"
    assert_select ".gem-c-glance-metric__explicit-label", text: "Million"
    assert_select ".gem-c-glance-metric__context", text: "This is in your top 10 items"
  end

  it "allows a heading level to be specified" do
    data[:heading_level] = 2
    render_component(data)
    assert_select "h2.gem-c-glance-metric__heading", text: "Unique pageviews"
  end

  it "does not show a label if no explicit measurement label is provided" do
    data[:measurement_explicit_label] = nil
    render_component(data)
    assert_select ".gem-c-glance-metric__explicit-label", 0
  end
end
