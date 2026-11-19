require "rails_helper"

describe "Component guide index", :capybara do
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

  it "loads a component guide" do
    visit "/component-guide"
    expect(page).to have_title "Component Guide"
  end

  it "loads a component from the dummy app" do
    visit "/component-guide"
    expect(body).to include("A test component for the dummy app")
    expect(page).to have_selector('a[href="/component-guide/test_component"]', text: "Test component")
  end

  it "includes component guide styles and scripts" do
    visit "/component-guide"
    expect(page).to have_selector('link[href*="/assets/component_guide/application"]', visible: :hidden)
    expect(page).to have_selector('script[src*="/assets/component_guide/application"]', visible: :hidden)
  end

  it "includes the application’s scripts" do
    visit "/component-guide"
    expect(page).to have_selector('script[src*="/assets/application"]', visible: :hidden)
  end

  it "includes suggested sass for the application" do
    visit "/component-guide"
    expected_main_sass = "@use 'govuk_publishing_components/specific-components';
@use 'govuk_publishing_components/components/accordion';
@use 'govuk_publishing_components/components/app-promo-banner';
@use 'govuk_publishing_components/components/back-link';
@use 'govuk_publishing_components/components/breadcrumbs';
@use 'govuk_publishing_components/components/button';
@use 'govuk_publishing_components/components/contextual-sidebar';
@use 'govuk_publishing_components/components/cookie-banner';
@use 'govuk_publishing_components/components/cross-service-header';
@use 'govuk_publishing_components/components/error-message';
@use 'govuk_publishing_components/components/error-summary';
@use 'govuk_publishing_components/components/feedback';
@use 'govuk_publishing_components/components/govspeak';
@use 'govuk_publishing_components/components/heading';
@use 'govuk_publishing_components/components/hint';
@use 'govuk_publishing_components/components/input';
@use 'govuk_publishing_components/components/label';
@use 'govuk_publishing_components/components/layout-footer';
@use 'govuk_publishing_components/components/layout-for-admin';
@use 'govuk_publishing_components/components/layout-for-public';
@use 'govuk_publishing_components/components/layout-header';
@use 'govuk_publishing_components/components/layout-super-navigation-header';
@use 'govuk_publishing_components/components/phase-banner';
@use 'govuk_publishing_components/components/print-link';
@use 'govuk_publishing_components/components/related-navigation';
@use 'govuk_publishing_components/components/search';
@use 'govuk_publishing_components/components/search-with-autocomplete';
@use 'govuk_publishing_components/components/service-navigation';
@use 'govuk_publishing_components/components/skip-link';
@use 'govuk_publishing_components/components/step-by-step-nav';
@use 'govuk_publishing_components/components/step-by-step-nav-header';
@use 'govuk_publishing_components/components/step-by-step-nav-related';
@use 'govuk_publishing_components/components/tabs';
@use 'govuk_publishing_components/components/tag';
@use 'govuk_publishing_components/components/textarea';"

    expect(page).to have_selector(".govuk-heading-m", text: "Gem components used by this app (18)")
    expect(page).to have_selector(".govuk-details__summary-text", text: "Suggested imports for this application")

    expect(page.find(:css, 'textarea[name="main-sass"]', visible: :hidden).value).to eq(expected_main_sass)
  end

  it "includes suggested js for the application" do
    visit "/component-guide"
    expected_main_js = "//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/accordion
//= require govuk_publishing_components/components/app-promo-banner
//= require govuk_publishing_components/components/button
//= require govuk_publishing_components/components/cookie-banner
//= require govuk_publishing_components/components/cross-service-header
//= require govuk_publishing_components/components/error-summary
//= require govuk_publishing_components/components/feedback
//= require govuk_publishing_components/components/govspeak
//= require govuk_publishing_components/components/layout-super-navigation-header
//= require govuk_publishing_components/components/print-link
//= require govuk_publishing_components/components/search-with-autocomplete
//= require govuk_publishing_components/components/service-navigation
//= require govuk_publishing_components/components/skip-link
//= require govuk_publishing_components/components/step-by-step-nav
//= require govuk_publishing_components/components/tabs"

    expect(page.find(:css, 'textarea[name="main-js"]', visible: :hidden).value).to eq(expected_main_js)
  end

  it "creates a page for the component" do
    visit "/component-guide/test_component"
    expect(body).to include("A test component for the dummy app")
  end
end
