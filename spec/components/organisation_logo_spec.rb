require "rails_helper"

describe "Organisation logo", type: :view do
  def component_name
    "organisation_logo"
  end

  it "error if no parameters passed in" do
    assert_raises do
      render_component({})
    end
  end

  it "shows an organisation name" do
    render_component(organisation: { name: "Organisation name" })
    assert_select ".gem-c-organisation-logo .gem-c-organisation-logo__container", text: "Organisation name"
  end

  it "adds branding to the wrapping container" do
    render_component(organisation: { name: "Branded", brand: "department-for-international-trade" })
    assert_select ".gem-c-organisation-logo.brand--department-for-international-trade", text: "Branded"
  end

  it "includes a link when a URL is provided" do
    render_component(organisation: { name: "Linked", url: "/somewhere" })
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[href='/somewhere']", text: "Linked"
  end

  it "doesn't include a link when a URL is not provided" do
    render_component(organisation: { name: "Linked" })
    assert_select "a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[href='/somewhere']", false
    assert_select ".gem-c-organisation-logo__container"
  end

  it "adds a crest class when specified" do
    render_component(organisation: { name: "Crested", crest: "single-identity" })
    assert_select ".gem-c-organisation-logo__container.gem-c-organisation-logo__crest.gem-c-organisation-logo__crest--single-identity"
  end

  it "renders an image when specified" do
    render_component(organisation: { name: "Custom image", image: { url: "/url", alt_text: "alt" } })
    assert_select ".gem-c-organisation-logo__container img[src='/url'][alt='alt']"
  end

  it "adds data tracking attributes when specified" do
    data_attributes = {
      track_category: "someLinkClicked",
      track_action: 1,
      track_label: "/some-link",
      track_options: {
        dimension28: 2,
        dimension29: "Organisation link"
      }
    }

    render_component(organisation: { url: "/some-link", data_attributes: data_attributes })

    assert_select ".gem-c-organisation-logo[data-module='track-click']"
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[data-track-category='someLinkClicked']"
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[data-track-action='1']"
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[data-track-label='/some-link']"
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[data-track-options='{\"dimension28\":2,\"dimension29\":\"Organisation link\"}']"
  end

  it "doesn't add data tracking attributes when no link is specified" do
    data_attributes = {
      track_category: "someLinkClicked"
    }

    render_component(organisation: { data_attributes: data_attributes })
    assert_select ".gem-c-organisation-logo a.gem-c-organisation-logo__container.gem-c-organisation-logo__link[data-track-category='someLinkClicked']", false
  end

  it "doesn't let malicious tags into the organisation name even though we're using html_safe" do
    component_name = "<script>alert('Hello!')</script>"
    render_component(organisation: { name: component_name })

    assert_select ".gem-c-organisation-logo", text: "alert('Hello!')"
  end
end
