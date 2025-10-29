describe "When the asset helper is configured", :capybara do
  scenario "go to page with multiple GOV.UK publishing components only" do
    GovukPublishingComponents.configure do |config|
      config.exclude_css_from_static = true
    end

    visit "/asset_helper"

    within(:xpath, "//head", visible: :hidden) do
      expect(page).to have_xpath("//link", visible: :hidden, count: 3)

      expect(page).to have_selector('link[href^="/assets/application-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_notice-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_details-"][rel="stylesheet"]', visible: :hidden)
      expect(page).not_to have_selector('link[href^="/assets/govuk_publishing_components/components/_heading-"][rel="stylesheet"]', visible: :hidden)
    end
  end

  scenario "go to page with multiple GOV.UK publishing components and an app component" do
    visit "/asset_helper_with_app_component"

    within(:xpath, "//head", visible: :hidden) do
      expect(page).to have_xpath("//link", visible: :hidden, count: 3)

      expect(page).to have_selector('link[href^="/assets/application-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_notice-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/components/_app-component-"][rel="stylesheet"]', visible: :hidden)
    end
  end

  scenario "go to page with multiple GOV.UK publishing components and an app view" do
    visit "/asset_helper_with_app_view"

    within(:xpath, "//head", visible: :hidden) do
      expect(page).to have_xpath("//link", visible: :hidden, count: 3)

      expect(page).to have_selector('link[href^="/assets/application-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_notice-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/views/_app-view-"][rel="stylesheet"]', visible: :hidden)
    end
  end

  scenario "request all stylesheets when exclude_css_from_static is set to false" do
    GovukPublishingComponents.configure do |config|
      config.exclude_css_from_static = false
    end

    visit "/asset_helper"

    within(:xpath, "//head", visible: :hidden) do
      expect(page).to have_xpath("//link", visible: :hidden, count: 4)

      expect(page).to have_selector('link[href^="/assets/application-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_notice-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_details-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_heading-"][rel="stylesheet"]', visible: :hidden)
    end
  end

  scenario "request only unexcluded stylesheets when custom_css_exclude_list is set" do
    GovukPublishingComponents.configure do |config|
      config.custom_css_exclude_list = %w[notice details]
    end

    visit "/asset_helper"

    within(:xpath, "//head", visible: :hidden) do
      expect(page).to have_xpath("//link", visible: :hidden, count: 2)

      expect(page).to have_selector('link[href^="/assets/application-"][rel="stylesheet"]', visible: :hidden)
      expect(page).not_to have_selector('link[href^="/assets/govuk_publishing_components/components/_notice-"][rel="stylesheet"]', visible: :hidden)
      expect(page).not_to have_selector('link[href^="/assets/govuk_publishing_components/components/_details-"][rel="stylesheet"]', visible: :hidden)
      expect(page).to have_selector('link[href^="/assets/govuk_publishing_components/components/_heading-"][rel="stylesheet"]', visible: :hidden)
    end
  end
end
