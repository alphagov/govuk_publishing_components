require "rails_helper"

# this component renders the Select component
# so only test the additional functionality

describe "Select with search", type: :view do
  def component_name
    "select_with_search"
  end

  it "adds `select-with-search` to data module of select" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "big",
          text: "Big",
        },
        {
          value: "medium",
          text: "Medium",
        },
        {
          value: "small",
          text: "Small",
        },
      ],
    )

    assert_select "select[data-module~='select-with-search']"
  end
end
