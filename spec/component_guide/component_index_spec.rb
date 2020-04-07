require "rails_helper"

describe "Component guide index" do
  # Load ordering test can only fail if run as the first test in suite
  # https://github.com/rails/rails/issues/12168
  it "renders using gem layout not app layout after viewing a page on the application" do
    visit "/test"
    expect(page).to have_title "Dummy"
    visit "/component-guide"
    expect(page).to have_title "Component Guide"
  end

  it "sets X-Frame-Options to allow inclusion in iFrames" do
    visit "/component-guide"
    expect(page.response_headers["X-Frame-Options"]).to eq("ALLOWALL")
  end

  it "sets X-Slimmer-Skip to disable Slimmer in apps which use it" do
    visit "/component-guide"
    expect(page.response_headers["X-Slimmer-Skip"]).to eq("true")
  end

  it "loads a component guide" do
    visit "/component-guide"
    expect(page).to have_title "Component Guide"
  end

  it "loads a component from the dummy app" do
    visit "/component-guide"
    expect(body).to include("A test component for the dummy app")
    expect(page).to have_selector('a[href="/component-guide/test-component"]', text: "Test component")
  end

  it "includes component guide styles and scripts" do
    visit "/component-guide"
    expect(page).to have_selector('link[href*="/assets/component_guide/application"]', visible: false)
    expect(page).to have_selector('link[href*="/assets/component_guide/print"]', visible: false)
    expect(page).to have_selector('script[src*="/assets/component_guide/application"]', visible: false)
  end

  it "includes the application’s scripts" do
    visit "/component-guide"
    expect(page).to have_selector('script[src*="/assets/application"]', visible: false)
  end

  it "includes suggested sass for the application" do
    visit "/component-guide"
    expected_main_sass = "@import 'govuk_publishing_components/govuk_frontend_support';
@import 'govuk_publishing_components/component_support';
@import 'govuk_publishing_components/components/breadcrumbs';
@import 'govuk_publishing_components/components/contextual-sidebar';
@import 'govuk_publishing_components/components/error-message';
@import 'govuk_publishing_components/components/error-summary';
@import 'govuk_publishing_components/components/govspeak';
@import 'govuk_publishing_components/components/hint';
@import 'govuk_publishing_components/components/input';
@import 'govuk_publishing_components/components/label';
@import 'govuk_publishing_components/components/layout-footer';
@import 'govuk_publishing_components/components/layout-for-admin';
@import 'govuk_publishing_components/components/layout-header';
@import 'govuk_publishing_components/components/related-navigation';
@import 'govuk_publishing_components/components/skip-link';
@import 'govuk_publishing_components/components/step-by-step-nav';
@import 'govuk_publishing_components/components/step-by-step-nav-header';
@import 'govuk_publishing_components/components/step-by-step-nav-related';
@import 'govuk_publishing_components/components/tabs';
@import 'govuk_publishing_components/components/title';"

    expect(page).to have_selector(".component-doc-h2", text: "Gem components used by this app (12)")
    expect(page).to have_selector(".govuk-details__summary-text", text: "Suggested Sass for this application")

    expect(page.find(:css, 'textarea[name="main-sass"]', visible: false).value).to eq(expected_main_sass)
  end

  it "includes suggested print sass for the application" do
    visit "/component-guide"
    expected_print_sass = "@import 'govuk_publishing_components/govuk_frontend_support';
@import 'govuk_publishing_components/components/print/govspeak';
@import 'govuk_publishing_components/components/print/layout-footer';
@import 'govuk_publishing_components/components/print/layout-header';
@import 'govuk_publishing_components/components/print/skip-link';
@import 'govuk_publishing_components/components/print/step-by-step-nav';
@import 'govuk_publishing_components/components/print/step-by-step-nav-header';
@import 'govuk_publishing_components/components/print/title';"

    expect(page.find(:css, 'textarea[name="print-sass"]', visible: false).value).to eq(expected_print_sass)
  end

  it "creates a page for the component" do
    visit "/component-guide/test-component"
    expect(body).to include("A test component for the dummy app")
  end
end
