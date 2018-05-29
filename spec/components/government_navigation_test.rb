require 'govuk_component_test_helper'

class GovernmentNavigationTestCase < ComponentTestCase
  def component_name
    "government_navigation"
  end

  test "renders a list of government links" do
    render_component({})
    assert_select "\#proposition-links li a", text: "Departments"
    assert_link_with_text("/government/organisations", "Departments")
    assert_link_with_text("/government/announcements", "Announcements")
    # etc.
  end

  test "no links are active by default" do
    render_component({})
    assert_select "a.active", false
  end

  test "can mark a link as active" do
    render_component(active: 'departments')
    assert_select "a.active", text: "Departments"
  end
end
