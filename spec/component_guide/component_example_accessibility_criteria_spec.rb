require "rails_helper"

describe "Component examples with accessibility criteria", :capybara do
  it "shows the accessibility acceptance criteria as HTML" do
    visit "/component-guide/test_component"

    within ".component-accessibility-criteria" do
      expect(page).to have_selector("h2", text: "Accessibility acceptance criteria")
      expect(page).to have_content("This is some criteria in a list")
    end
  end

  it "shows shared accessibility criteria" do
    visit "/component-guide/test_component_with_shared_accessibility_criteria"

    within ".component-accessibility-criteria" do
      expect(page).to have_content("indicate when they have focus")
    end
  end

  it "shows shared accessibility criteria when no other accessibility criteria are included" do
    visit "/component-guide/test_component_with_shared_accessibility_criteria_only"

    within ".component-accessibility-criteria" do
      expect(page).to have_content("indicate when they have focus")
    end
  end
end
