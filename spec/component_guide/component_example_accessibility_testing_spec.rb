require "rails_helper"

describe "Component example with automated testing", js: true do
  it "has accessibility testing hooks" do
    visit "/component-guide/test_component"
    expect(page).to have_selector('[data-module="test-a11y"]')
  end

  it "runs automated accessibility testing tools" do
    visit "/component-guide/test_component"
    expect(page).to have_selector(".js-test-a11y-success.js-test-a11y-finished")
  end

  it "shows accessibility violations on the page and through browser console" do
    visit "/component-guide/test_component_with_a11y_issue"
    expect(page).to have_selector(".js-test-a11y-failed.js-test-a11y-finished")

    expect(page.driver.browser.logs.get(:browser).map { |e| e.message if e.message.match(/Accessibility issues/) }).not_to be_empty

    selector_with_error = page.first(".selector").text
    expect(page).to have_selector(selector_with_error, visible: false)

    within ".component-guide-preview--violation" do
      expect(page).to have_selector("h3", text: "Images must have alternate text")
      expect(page).to have_selector('h3 a[href*="https://dequeuniversity.com"]', text: "(see guidance)")
      expect(page).to have_text("Element does not have an alt attribute")
    end
  end

  it "does not throw JavaScript errors if there are duplicate IDs" do
    visit "/component-guide/test_component_with_duplicate_ids"
  end

  it "shows incomplete accessibility warnings on the page" do
    visit "/component-guide/test_component_with_a11y_incomplete_warning"
    expect(page).to have_selector(".js-test-a11y-success.js-test-a11y-finished")

    selector_with_error = page.first(".selector").text
    expect(page).to have_selector(selector_with_error)

    within ".component-guide-preview--warning" do
      expect(page).to have_selector("h3", text: "ARIA attributes must conform to valid values (aria-valid-attr-value)")
      expect(page).to have_selector('h3 a[href*="https://dequeuniversity.com/rules/axe/4.8/aria-valid-attr-value?application=axeAPI"]', text: "(see guidance)")
    end
  end
end
