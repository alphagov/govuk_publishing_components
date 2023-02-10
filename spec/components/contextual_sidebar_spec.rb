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
      ga4_tracking: true,
      content_item: content_item,
    )
    assert_select ".gem-c-contextual-sidebar .gem-c-contextual-sidebar__cta--ukraine[data-module='gem-track-click ga4-link-tracker']"
  end
end
