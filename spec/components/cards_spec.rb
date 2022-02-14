require "rails_helper"

describe "Cards", type: :view do
  def component_name
    "cards"
  end

  it "renders nothing when no data is provided" do
    assert_empty render_component({})
  end


  it "renders list heading" do
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
    assert_select ".gem-c-cards__heading.govuk-heading-m", text: "Topics"
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

  it "renders list" do
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

  it "renders a list item" do
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
    assert_select ".gem-c-cards__list-item", text: "Benefits"
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

  it "renders a link with href" do
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
    assert_select '.govuk-link.gem-c-cards__link[href="http://www.gov.uk"]', text: "Benefits"
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

end
