require "rails_helper"

describe "Column list", type: :view do
  def component_name
    "column_list"
  end

  it "renders nothing when no data is given" do
    assert_empty render_component({})
  end

  it "renders nothing when an empty items array is passed" do
    assert_empty render_component({
      items: [],
      title: "Should not render",
    })
  end

  it "renders the correct number of items passed to it" do
    render_component({
      items: [
        {
          heading: "Business and economy",
          text: "Small businesses, industry, imports, exports and trade",
          href: "#business-and-economy",
        },
        {
          heading: "Crime and justice",
          text: "Courts, police, prison, offenders, borders and immigration",
          href: "#crime-and-justice",
        },
        {
          heading: "Defence",
          text: "Armed forces, health and safety, search and rescue",
          href: "#defence",
        },
        {
          heading: "Education",
          text: "Students, training, qualifications and the National Curriculum",
          href: "#education",
        },
        {
          heading: "Environment",
          text: "Weather, flooding, rivers, air quality, geology and agriculture",
          href: "#environment",
        },
      ],
    })

    list_item = "li.gem-c-column-list__item"

    assert_select list_item, count: 5
    assert_select list_item do
      assert_select "h3.govuk-heading-s.gem-c-column-list__heading"
      assert_select ".govuk-link"
      assert_select ".govuk-body"
    end
  end
end
