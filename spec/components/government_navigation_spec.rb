require "rails_helper"

describe "Government navigation", type: :view do
  def component_name
    "government_navigation"
  end

  it "renders a list of government links" do
    render_component({})

    assert_select "\#proposition-links li a", text: "Departments"
    assert_link_with_text("/government/organisations", "Departments")
    assert_link_with_text("/search/news-and-communications", "News and communications")
    assert_link_with_text("/search/policy-papers-and-consultations?content_store_document_type[]=open_consultations&amp;content_store_document_type[]=closed_consultations", "Consultations")
    assert_link_with_text("/search/research-and-statistics", "Statistics")
  end

  it "has no active links by default" do
    render_component({})

    assert_select "a.active", false
  end

  it "can mark a link as active" do
    render_component(active: "departments")

    assert_select "a.active", text: "Departments"
  end

  def assert_link_with_text(link, text)
    assert_select "a[href=\"#{link}\"]", text: text
  end
end
