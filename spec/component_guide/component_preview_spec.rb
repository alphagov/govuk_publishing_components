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

  it "can render a component with only its own CSS by default" do
    visit "/component-guide/warning_text/preview"
    expect(page).to have_css("link[rel=stylesheet]", visible: :hidden, count: 2)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/component_guide/application-']", visible: :hidden)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_warning-text-']", visible: :hidden)
  end

  it "can render a component with every other components CSS in the <head>, with the component rendering last" do
    visit "/component-guide/emergency_banner/preview?all_components=true"
    expect(page).to have_css("link[rel=stylesheet][href*='/assets/govuk_publishing_components/components/']", visible: :hidden, count: 86)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_accordion-']", visible: :hidden)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_select-']", visible: :hidden)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_warning-text-']", visible: :hidden)

    last_link = find("link[rel=stylesheet]:last-of-type", visible: :hidden)
    expect(last_link[:href]).to match(/\/assets\/govuk_publishing_components\/components\/_emergency-banner-.*\.css/)
  end

  it "can render a component with every other components CSS in the <head>, with the component rendering first" do
    visit "/component-guide/emergency_banner/preview?all_components=true&render_component_first=true"
    expect(page).to have_css("link[rel=stylesheet][href*='/assets/govuk_publishing_components/components/']", visible: :hidden, count: 86)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_accordion-']", visible: :hidden)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_select-']", visible: :hidden)
    expect(page).to have_css("link[rel='stylesheet'][href*='/assets/govuk_publishing_components/components/_warning-text-']", visible: :hidden)

    first_link = find("link[rel=stylesheet]:first-of-type", visible: :hidden)
    expect(first_link[:href]).to match(/\/assets\/component_guide\/application-.*\.css/)

    second_link = find("link[rel=stylesheet]:nth-of-type(2)", visible: :hidden)
    expect(second_link[:href]).to match(/\/assets\/govuk_publishing_components\/components\/_emergency-banner-.*\.css/)
  end

  it "has a detailed page title by default" do
    visit "/component-guide/contextual_guidance/preview"
    expect(page.title).to eq("Contextual guidance: Default preview - Component Guide")

    visit "/component-guide/contextual_guidance/preview?all_components=true"
    expect(page.title).to eq("Contextual guidance: Default preview + every component's CSS file - component rendering last - Component Guide")

    visit "/component-guide/contextual_guidance/preview?all_components=true&render_component_first=true"
    expect(page.title).to eq("Contextual guidance: Default preview + every component's CSS file - component rendering first - Component Guide")
  end

  it "has a stripped down page title for Percy tests" do
    visit "/component-guide/contextual_guidance/preview?percy=true"
    expect(page.title).to eq("Contextual guidance")

    visit "/component-guide/contextual_guidance/preview?percy=true&all_components=true"
    expect(page.title).to eq("Contextual guidance + every component's CSS file - component rendering last")

    visit "/component-guide/contextual_guidance/preview?percy=true&all_components=true&render_component_first=true"
    expect(page.title).to eq("Contextual guidance + every component's CSS file - component rendering first")
  end
end
