describe "When the asset helper is configured", type: :view do
  scenario "go to page with multiple GOV.UK publishing components only" do
    visit "/asset_helper"

    within(:xpath, "//head", visible: false) do
      expect(page).to have_xpath("//link", visible: false, count: 3)

      expect(page).to have_xpath("//link[1][@href=\'/assets/application.css\']", visible: false)
      expect(page).to have_xpath("//link[2][@href=\'/assets/govuk_publishing_components/components/_notice.css\']", visible: false)
      expect(page).to have_xpath("//link[3][@href=\'/assets/govuk_publishing_components/components/_details.css\']", visible: false)

      expect(page).to have_no_xpath("//*[@href=\'/assets/govuk_publishing_components/components/_title.css\']", visible: false)
    end
  end

  scenario "go to page with multiple GOV.UK publishing components and an app component" do
    visit "/asset_helper_with_app_component"

    within(:xpath, "//head", visible: false) do
      expect(page).to have_xpath("//link", visible: false, count: 3)

      expect(page).to have_xpath("//link[1][@href=\'/assets/application.css\']", visible: false)
      expect(page).to have_xpath("//link[2][@href=\'/assets/govuk_publishing_components/components/_notice.css\']", visible: false)
      expect(page).to have_xpath("//link[3][@href=\'/assets/components/_app-component.css\']", visible: false)
    end
  end

  scenario "go to page with multiple GOV.UK publishing components and an app view" do
    visit "/asset_helper_with_app_view"

    within(:xpath, "//head", visible: false) do
      expect(page).to have_xpath("//link", visible: false, count: 3)

      expect(page).to have_xpath("//link[1][@href=\'/assets/application.css\']", visible: false)
      expect(page).to have_xpath("//link[2][@href=\'/assets/govuk_publishing_components/components/_notice.css\']", visible: false)
      expect(page).to have_xpath("//link[3][@href=\'/assets/views/_app-view.css\']", visible: false)
    end
  end
end
