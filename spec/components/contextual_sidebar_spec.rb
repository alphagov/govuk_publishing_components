require "rails_helper"

describe "Contextual sidebar", type: :view do
  def component_name
    "contextual_sidebar"
  end

  it "renders the sidebar" do
    render_component(
      content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "speech"),
    )

    assert_select ".gem-c-contextual-sidebar"
  end

  it "can render in welsh" do
    I18n.with_locale(:cy) do
      render_component(
        content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "speech"),
      )
    end
    assert_select ".gem-c-contextual-sidebar"
  end

  it "applies GA4 tracking to the Ukraine sidebar" do
    should_show_ukraine = {
      links: {
        topical_events: [
          {
            content_id: "bfa79635-ffda-4b5d-8266-a9cd3a03649c",
            title: "Russian invasion of Ukraine: UK government response",
            base_path: "/government/topical-events/russian-invasion-of-ukraine-uk-government-response",
            locale: "en",
          },
        ],
      },
    }.deep_stringify_keys!
    content_item = GovukSchemas::Example.find("document_collection", example_name: "document_collection")
    content_item = content_item.deep_merge!(should_show_ukraine)

    render_component(
      content_item:,
    )
    index_total = 4 # have to hard code this here but if ukraine links change this number may change, and test will fail
    assert_select ".gem-c-contextual-sidebar__cta-ukraine .gem-c-contextual-sidebar__cta[data-module='ga4-link-tracker']"
    assert_select ".gem-c-contextual-sidebar__cta-ukraine .gem-c-contextual-sidebar__cta .govuk-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"1\",\"index_link\":\"1\",\"index_section_count\":\"1\",\"index_total\":\"#{index_total}\",\"section\":\"Invasion of Ukraine\"}']"
    assert_select ".gem-c-contextual-sidebar__cta-ukraine .gem-c-contextual-sidebar__cta .govuk-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"1\",\"index_link\":\"2\",\"index_section_count\":\"1\",\"index_total\":\"#{index_total}\",\"section\":\"Invasion of Ukraine\"}']"
  end

  it "allows GA4 tracking to be disabled" do
    should_show_ukraine = {
      links: {
        topical_events: [
          {
            content_id: "bfa79635-ffda-4b5d-8266-a9cd3a03649c",
            title: "Russian invasion of Ukraine: UK government response",
            base_path: "/government/topical-events/russian-invasion-of-ukraine-uk-government-response",
            locale: "en",
          },
        ],
      },
    }.deep_stringify_keys!
    content_item = GovukSchemas::Example.find("document_collection", example_name: "document_collection")
    content_item = content_item.deep_merge!(should_show_ukraine)

    render_component(
      content_item:,
      disable_ga4: true,
    )
    assert_select ".gem-c-contextual-sidebar .gem-c-contextual-sidebar__cta--ukraine[data-module='ga4-link-tracker']", false
    assert_select ".gem-c-contextual-sidebar .gem-c-contextual-sidebar__cta--ukraine .govuk-link[data-ga4-link]", false
  end
end
