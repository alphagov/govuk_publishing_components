require "rails_helper"

describe "Intervention", type: :view do
  def component_name
    "intervention"
  end

  it "renders the component" do
    render_component(
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      dismiss_text: "Hide this suggestion",
    )

    assert_select ".gem-c-intervention", text: /You might be interested in/
    assert_select ".gem-c-intervention .govuk-link", text: "Travel abroad"
    assert_select ".gem-c-intervention .govuk-link", text: /Hide this suggestion/
  end

  it "renders the component without dismiss button" do
    render_component(
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
    )

    assert_select ".gem-c-intervention", text: /You might be interested in/
    assert_select ".gem-c-intervention .govuk-body:nth-child(1) .govuk-link", text: "Travel abroad"
    assert_select ".gem-c-intervention .govuk-body:nth-child(2) .govuk-link", false
  end

  it "renders the component without suggestion link" do
    render_component(
      suggestion_text: "You might be interested in",
      dismiss_text: "Hide this suggestion",
    )

    assert_select ".gem-c-intervention", text: /You might be interested in/
    assert_select ".gem-c-intervention .govuk-body:nth-child(1) .govuk-link", false
    assert_select ".gem-c-intervention .govuk-body:nth-child(2) .govuk-link", text: /Hide this suggestion/
  end

  it "renders the right query string when none exists" do
    render_component(
      suggestion_text: "You might be interested in",
      dismiss_text: "Hide this suggestion",
    )

    assert_select "a[href='?hide-intervention=true']"
  end

  it "doesn't render anything if no parameter is passed" do
    assert_empty render_component({})
  end

  describe "hide" do
    it "hides the banner if specified" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        hide: true,
      )

      assert_select ".gem-c-intervention[hidden]"
    end
  end

  describe "new tab" do
    it "renders with target=_'blank' with new_tab option" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select "a[target='_blank']"
    end

    it "renders with security attributes" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select "a[rel='noopener noreferrer']"
    end

    it "renders with security attributes for external links" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "https://https://www.nationalarchives.gov.uk/",
        new_tab: true,
      )

      assert_select "a[rel='noopener noreferrer external']"
    end

    it "renders no target attribute without the new_tab option" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
      )

      assert_select "a[target='_blank']", false
    end

    it "appends accesible link text" do
      render_component(
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select ".gem-c-intervention", text: "Travel abroad (opens in a new tab)"
    end

    it "doesn't append accessible link text if link text is already included" do
      render_component(
        suggestion_link_text: "Travel abroad (opens in a new tab) guidance",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select ".gem-c-intervention", text: "Travel abroad (opens in a new tab) guidance"
    end
  end
end
