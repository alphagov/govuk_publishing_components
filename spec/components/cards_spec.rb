require "rails_helper"

describe "Cards", type: :view do
  def component_name
    "cards"
  end

  it "renders nothing when no data is provided" do
    assert_empty render_component({})
  end

  it "renders list heading using default heading level" do
    test_data = {
      heading: "Topics",
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "h2.gem-c-cards__heading.govuk-heading-m", count: 1
  end

  it "renders list heading using custom heading level" do
    test_data = {
      heading: "Topics",
      heading_level: 3,
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "h3.gem-c-cards__heading.govuk-heading-m", count: 1
  end

  it "renders the one column list variant by default" do
    test_data = {
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "ul.gem-c-cards__list", count: 1
  end

  it "renders the one column list variant by default when passed an invalid parameter" do
    test_data = {
      columns: "2",
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "ul.gem-c-cards__list", count: 1
  end

  it "renders two column list variant" do
    test_data = {
      columns: 2,
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "ul.gem-c-cards__list.gem-c-cards__list--two-column-desktop", count: 1
  end

  it "renders three column list variant" do
    test_data = {
      columns: 3,
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "ul.gem-c-cards__list.gem-c-cards__list--three-column-desktop", count: 1
  end

  it "renders sub-heading using default heading level" do
    test_data = {
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "h3.gem-c-cards__sub-heading.govuk-heading-s", text: "Benefits"
  end

  it "renders sub-heading using custom heading level" do
    test_data = {
      sub_heading_level: 4,
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
        },
      ],
    }
    render_component(test_data)
    assert_select "h4.gem-c-cards__sub-heading.govuk-heading-s", text: "Benefits"
  end

  it "throws an error if a link doesn't have a href" do
    test_data = {
      items: [
        {
          link: {
            text: "Benefits",
            path: "",
          },
        },
      ],
    }
    assert_raises do
      render_component(test_data)
    end
  end

  it "renders a description" do
    test_data = {
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
          },
          description: "Includes eligibility, appeals, tax credits and Universal Credit",
        },
      ],
    }
    render_component(test_data)
    assert_select "p.govuk-body.gem-c-cards__description", text: "Includes eligibility, appeals, tax credits and Universal Credit"
  end

  it "renders data attributes" do
    test_data = {
      items: [
        {
          link: {
            text: "Benefits",
            path: "http://www.gov.uk",
            data_attributes: {
              an_attribute: "some_value",
            },
          },
        },
      ],
    }
    render_component(test_data)
    assert_select ".govuk-link.gem-c-cards__link[data-an-attribute='some_value']", count: 1
  end
end
