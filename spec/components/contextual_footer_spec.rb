require "rails_helper"

RSpec.describe "Contextual footer", type: :view do
  def component_name
    "contextual_footer"
  end

  it "renders the footer" do
    content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "speech") do |payload|
      # If this item is a part of a step nav or secondary step nav this component might not render
      payload["links"].delete("part_of_step_navs")
      payload["links"].delete("secondary_to_step_navs")
      payload
    end

    render_component(content_item:)

    assert_select ".gem-c-contextual-footer"
  end

  context "part of a step by step" do
    it "does not renders the footer" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "speech") do |payload|
        payload["links"].merge!("part_of_step_navs" => [{
          "title" => "Step by Step",
          "content_id" => SecureRandom.uuid,
          "base_path" => "/step-by-step",
          "locale" => "en",
        }])

        payload
      end

      render_component(content_item:)

      assert_select ".gem-c-contextual-footer", false
    end
  end

  it "sets the GA4 type to \"contextual footer\"" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/skating",
          "title" => "Skating",
          "document_type" => "taxon",
          "phase" => "live",
        },
        {
          "base_path" => "/paragliding",
          "title" => "Paragliding",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation[data-module='ga4-link-tracker']"
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"contextual footer\",\"index_section\":\"1\",\"index_link\":\"1\",\"index_section_count\":\"1\",\"index_total\":\"2\",\"section\":\"Explore the topic\"}']", text: "Skating"
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"contextual footer\",\"index_section\":\"1\",\"index_link\":\"2\",\"index_section_count\":\"1\",\"index_total\":\"2\",\"section\":\"Explore the topic\"}']", text: "Paragliding"
  end

  it "allows GA4 to be disabled" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/skating",
          "title" => "Skating",
          "document_type" => "taxon",
          "phase" => "live",
        },
        {
          "base_path" => "/paragliding",
          "title" => "Paragliding",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
    }

    render_component(content_item:, disable_ga4: true)
    assert_select ".gem-c-related-navigation[data-module='ga4-link-tracker']", false
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link]", false
  end
end
