RSpec.describe "MapComponent", type: :view do
  def component_name
    "map"
  end

  before { @include_map_script = nil }

  it "renders nothing without config" do
    render_component({})
    expect(rendered).not_to have_css(".app-c-map")
  end

  it "does not render without a heading" do
    render_component(centre: [0, 1], zoom: 8)
    expect(rendered).not_to have_css(".app-c-map")
  end

  it "renders the basic component" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading")
    expect(rendered).to have_css("[data-tracking-enabled] .app-c-map")
    expect(rendered).to have_css("[data-module='map'] [data-module='ga4-link-tracker']")
    expect(rendered).to have_css(".gem-c-heading h2", text: "heading")
    expect(rendered).to have_selector("[data-config*='\"center\":[0,1],\"zoom\":8,\"mapLabel\":\"Interactive map: heading\"']")
  end

  it "can have a custom heading level" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "A map showing areas of interest in Lower Chutney", heading_level: 3)
    expect(rendered).to have_css(".gem-c-heading h3", text: "A map showing areas of interest in Lower Chutney")
  end

  it "can have a description" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", description: "what a map")
    expect(rendered).to have_css(".gem-c-govspeak", text: "what a map")
  end

  it "can show a copyright message" do
    copyright = "This is copyright somebody, somewhere"
    render_component(centre: [0, 1], zoom: 8, copyright: copyright, heading_text: "heading")
    expect(rendered).to have_css(".app-c-map__copyright", text: copyright)
  end

  it "only includes the JavaScript tag once even if multiple component instances" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading")
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading")
    expect(rendered).to have_selector(:css, "script", visible: :hidden, count: 3)
  end

  it "accepts a geojson url" do
    geojson = "/fake/thing.geojson"
    render_component(geojson: geojson, heading_text: "heading")
    expect(rendered).to have_css("[data-geojson='#{geojson}']")
  end

  it "accepts base64 encoded geojson" do
    geojson = "data:application/geo+json;base64,ewogICJ0eXBlIjogIkZlYXR1cmVDb2xsZWN0aW9uIiwKICAiZmVhdHVyZXMiOiBbCiAgICB7CiAgICAgICJ0eXBlIjogIkZlYXR1cmUiLAogICAgICAiZ2VvbWV0cnkiOiB7CiAgICAgICAgInR5cGUiOiAiUG9pbnQiLAogICAgICAgICJjb29yZGluYXRlcyI6IFstMC44MTE5NTUsIDUxLjgxNTI2XQogICAgICB9LAogICAgICAicHJvcGVydGllcyI6IHsKICAgICAgICAibmFtZSI6ICJBeWxlc2J1cnkgUmVnaXN0ZXIgT2ZmaWNlIiwKICAgICAgICAiZGVzY3JpcHRpb24iOiAiQXBwb2ludG1lbnQgb25seSIKICAgICAgfSwKICAgICAgIm1hcmtlciI6IHsKICAgICAgICAic3ltYm9sIjogImNpcmNsZSIsCiAgICAgICAgImNvbG91ciI6ICJibHVlIgogICAgICB9CiAgICB9CiAgXQp9Cg=="
    render_component(geojson: geojson, heading_text: "heading")
    expect(rendered).to have_css("[data-geojson='#{geojson}']")
  end

  it "allows bounds to be passed" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", bounds: [1, 2, 3, 4])
    expect(rendered).to have_selector("[data-config*='[1,2,3,4]']")
  end

  it "does not allow invalid bounds" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", bounds: [1, 2, 3])
    expect(rendered).not_to have_selector("[data-config*='[1,2,3]']")
  end

  it "allows max_bounds to be passed" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", max_bounds: [11, 12, 13, 14])
    expect(rendered).to have_selector("[data-config*='[11,12,13,14]']")
  end

  it "does not allow invalid max_bounds" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", max_bounds: [11, 12, 13])
    expect(rendered).not_to have_selector("[data-config*='[11,12,13]']")
  end

  it "can disable GA4 tracking" do
    render_component(centre: [0, 1], zoom: 8, heading_text: "heading", disable_ga4: true)
    expect(rendered).not_to have_css("[data-tracking-enabled] .app-c-map")
    expect(rendered).not_to have_css("[data-module='map'] [data-module='ga4-link-tracker']")
  end
end
