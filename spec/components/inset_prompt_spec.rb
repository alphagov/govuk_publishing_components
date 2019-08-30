require 'rails_helper'

describe "Inset prompt", type: :view do
  def component_name
    "inset_prompt"
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end

  it "renders a title" do
    test_data = { title: "Foo" }
    render_component(test_data)

    assert_select(".gem-c-inset-prompt__title", text: "Foo")
  end

  it "renders a title and description" do
    test_data = { title: "Foo", description: "Bar" }
    render_component(test_data)

    assert_select(".gem-c-inset-prompt__title", text: "Foo")
    assert_select(".gem-c-inset-prompt__body", text: "Bar")
  end

  it "renders text items" do
    test_data = {
      title: "Foo",
      items: [
        {
          text: "Ordinary text item"
        },
        {
          text: "Text item with data attributes",
          data_attributes: {
            tracking: 'ABC123'
          }
        }
      ]
    }
    render_component(test_data)

    assert_select(".gem-c-inset-prompt__list li:first-child span", text: "Ordinary text item")
    assert_select(".gem-c-inset-prompt__list li:last-child span[data-tracking='ABC123']", text: "Text item with data attributes")
  end

  it "renders link items" do
    test_data = {
      title: "Foo",
      items: [
        {
          text: "Ordinary link",
          href: "https://gov.uk"
        },
        {
          text: "Link with data attributes",
          href: "https://gov.uk",
          data_attributes: {
            tracking: 'ABC123'
          }
        }
      ]
    }
    render_component(test_data)

    assert_select(".gem-c-inset-prompt__list li:first-child a[href='https://gov.uk']", text: "Ordinary link")
    assert_select(".gem-c-inset-prompt__list li:last-child a[href='https://gov.uk'][data-tracking='ABC123']", text: "Link with data attributes")
  end

  it "renders an error state" do
    test_data = { title: "Error", description: "Please fix the date!", error: true }
    render_component(test_data)

    assert_select(".gem-c-inset-prompt--error")
  end
end
