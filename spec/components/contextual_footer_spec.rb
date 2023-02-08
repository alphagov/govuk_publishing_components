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

    render_component(content_item: content_item)

    has_selector? ".gem-c-contextual-footer"
  end

  context "part of a step by step" do
    it "does not renders the footer" do
      render_component(
        content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "step_by_step_nav"),
      )

      assert_no_selector ".gem-c-contextual-footer"
    end
  end
end
