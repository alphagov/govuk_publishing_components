require "rails_helper"

describe "Component preview", :capybara do
  it "shows all component examples on a page without header or footer" do
    visit "/component-guide/test_component_with_params/preview"
    expect(page).to have_selector(".govuk-template--rebranded")
    expect(page).to have_selector(".govuk-width-container")

    expect(page).not_to have_selector("body > header")
    expect(page).not_to have_selector("body > footer")

    expect(page).to have_selector(".component-guide-preview-page .preview-title", text: "Default")
    expect(page).to have_selector(".component-guide-preview-page .test-component-with-params", text: "Some value")
    expect(page).to have_selector(".component-guide-preview-page .preview-title", text: "Another example")
    expect(page).to have_selector(".component-guide-preview-page .test-component-with-params", text: "A different value")
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end

  it "shows a specific example on a page without header or footer" do
    visit "/component-guide/test_component_with_params/another_example/preview"
    expect(page).to have_selector(".govuk-template--rebranded")
    expect(page).to have_selector(".govuk-width-container")

    expect(page).not_to have_selector("body > header")
    expect(page).not_to have_selector("body > footer")

    expect(page).to have_no_selector(".component-guide-preview-page .preview-title")
    expect(page).to have_selector(".component-guide-preview-page .test-component-with-params", text: "A different value")
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end

  it "shows all component examples using the full page width without header or footer" do
    visit "/component-guide/test_component_using_full_page_width/preview"
    expect(page).to have_selector(".govuk-template--rebranded")
    expect(page).to have_selector(".govuk-full-width-container")

    expect(page).not_to have_selector("body > header")
    expect(page).not_to have_selector("body > footer")

    expect(page).to have_no_selector(".component-guide-preview-page .preview-title")
    expect(page).to have_selector(".component-guide-preview-page .test-component-full-width", text: "Preview example uses the full page width")
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end
end
