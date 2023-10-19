require "rails_helper"

describe "Intervention", type: :view do
  def component_name
    "intervention"
  end

  it "renders the component" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      dismiss_text: "Hide this suggestion",
    )

    assert_select ".gem-c-intervention", text: /You might be interested in/
    assert_select ".gem-c-intervention .govuk-link", text: "Travel abroad"
    assert_select ".gem-c-intervention .govuk-link", text: /Hide this suggestion/
  end

  it "adds data attributes correctly" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      data_attributes: {
        "hello": "world0",
        "this-is": "a test 0",
      },
      suggestion_data_attributes: {
        "hello": "world1",
        "this-is": "a test 1",
      },
      dismiss_data_attributes: {
        "hello": "world2",
        "this-is": "a test 2",
      },
      dismiss_link_data_attributes: {
        "hello": "world3",
        "this-is": "a test 3",
      },
      dismiss_text: "Hide this suggestion",
    )

    assert_select ".gem-c-intervention[data-hello=world0]"
    assert_select ".gem-c-intervention[data-this-is='a test 0']"

    assert_select ".gem-c-intervention a:first-of-type[data-hello=world1]"
    assert_select ".gem-c-intervention a:first-of-type[data-this-is='a test 1']"

    assert_select ".gem-c-intervention p:nth-of-type(2)[data-hello=world2]"
    assert_select ".gem-c-intervention p:nth-of-type(2)[data-this-is='a test 2']"

    assert_select ".js-dismiss-link[data-hello=world3]"
    assert_select ".js-dismiss-link[data-this-is='a test 3']"
  end

  it "renders the component with GA4 tracking when ga4_tracking is true" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      dismiss_text: "Hide this suggestion",
      ga4_tracking: true,
    )

    assert_select ".gem-c-intervention[data-ga4-intervention-banner]"
    assert_select ".gem-c-intervention a:first-of-type[data-module='ga4-link-tracker']"
    assert_select ".gem-c-intervention a:first-of-type[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"intervention\",\"section\":\"You might be interested in\",\"index_link\":1,\"index_total\":1}']"

    assert_select ".js-dismiss-link[data-module=ga4-event-tracker]"
    assert_select ".js-dismiss-link[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"intervention\",\"section\":\"You might be interested in\",\"action\":\"closed\"}']"
  end

  it "ensures data modules are combined correctly when GA4 tracking is true" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      dismiss_text: "Hide this suggestion",
      suggestion_data_attributes: {
        module: "hello-world",
      },
      dismiss_link_data_attributes: {
        module: "hello-world",
      },
      ga4_tracking: true,
    )

    assert_select ".gem-c-intervention a:first-of-type[data-module='hello-world ga4-link-tracker']"
    assert_select ".js-dismiss-link[data-module='hello-world ga4-event-tracker']"
  end

  it "renders the component without GA4 tracking when ga4_tracking is false" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      suggestion_link_text: "Travel abroad",
      suggestion_link_url: "/travel-abroad",
      dismiss_text: "Hide this suggestion",
      ga4_tracking: false,
    )

    assert_select ".gem-c-intervention[data-ga4-intervention-banner]", false
    assert_select ".gem-c-intervention a:first-of-type[data-module=ga4-link-tracker]", false
    assert_select ".gem-c-intervention a:first-of-type[data-ga4-link]", false

    assert_select ".js-dismiss-link[data-module=ga4-event-tracker]", false
    assert_select ".js-dismiss-link[data-ga4-event]", false
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
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      dismiss_text: "Hide this suggestion",
    )

    assert_select ".gem-c-intervention", text: /You might be interested in/
    assert_select ".gem-c-intervention .govuk-body:nth-child(1) .govuk-link", false
    assert_select ".gem-c-intervention .govuk-body:nth-child(2) .govuk-link", text: /Hide this suggestion/
  end

  it "renders the right query string when none exists" do
    render_component(
      name: "test-campaign",
      suggestion_text: "You might be interested in",
      dismiss_text: "Hide this suggestion",
    )

    assert_select "a[href='?hide-intervention=true']"
  end

  it "doesn't render anything if no parameter is passed" do
    assert_empty render_component({})
  end

  it "doesn't render anything if no suggestion text is provided" do
    assert_empty render_component(dismiss_text: "Hide this suggestion")
  end

  it "doesn't render anything if a dismiss link is given but without a name for the campaign" do
    assert_empty render_component(
      suggestion_text: "You might be interested in",
      dismiss_text: "Hide this suggestion",
    )
  end

  describe "hide" do
    it "hides the banner if specified" do
      render_component(
        suggestion_text: "Based on your browsing you might be interested in",
        suggestion_link_text: "Travel abroad: step by step",
        suggestion_link_url: "/travel-abroad",
        hide: true,
      )

      assert_select ".gem-c-intervention[hidden]"
    end
  end

  describe "new tab" do
    it "renders with target=_'blank' with new_tab option" do
      render_component(
        suggestion_text: "Based on your browsing you might be interested in",
        suggestion_link_text: "Travel abroad: step by step",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select "a[target='_blank']"
    end

    it "renders with security attributes" do
      render_component(
        suggestion_text: "Based on your browsing you might be interested in",
        suggestion_link_text: "Travel abroad: step by step",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select "a[rel='noopener noreferrer']"
    end

    it "renders with security attributes for external links" do
      render_component(
        suggestion_text: "Based on your browsing you might be interested in",
        suggestion_link_text: "Travel back in time",
        suggestion_link_url: "https://https://www.nationalarchives.gov.uk/",
        new_tab: true,
      )

      assert_select "a[rel='noopener noreferrer external']"
    end

    it "renders no target attribute without the new_tab option" do
      render_component(
        suggestion_text: "Based on your browsing you might be interested in",
        suggestion_link_text: "Travel abroad: step by step",
        suggestion_link_url: "/travel-abroad",
      )

      assert_select "a[target='_blank']", false
    end

    it "appends accesible link text" do
      render_component(
        suggestion_text: "See the world.",
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select ".gem-c-intervention", text: /See the world.\s+Travel abroad \(opens in a new tab\)/
    end

    it "doesn't append accessible link text if link text is already included" do
      render_component(
        suggestion_text: "See the world.",
        suggestion_link_text: "Travel abroad (opens in a new tab) guidance",
        suggestion_link_url: "/travel-abroad",
        new_tab: true,
      )

      assert_select ".gem-c-intervention", text: /See the world.\s+Travel abroad \(opens in a new tab\) guidance/
    end
  end
end
