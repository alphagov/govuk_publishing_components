require "rails_helper"

describe 'Component example with automated testing', js: true do
  it 'has accessibility testing hooks' do
    visit '/component-guide/test-component'
    expect(page).to have_selector('[data-module="test-a11y"]')
  end

  it 'runs automated accessibility testing tools' do
    visit '/component-guide/test-component'
    expect(page).to have_selector('.js-test-a11y-success.js-test-a11y-finished')
  end

  it 'throws JavaScript errors if a component has an accessibility issue' do
    visit '/component-guide/test-component-with-a11y-issue'

    raised_js_errors = page.driver.browser.manage.logs.get(:browser)
                           .select { |m| m.level == 'SEVERE' }

    expect(raised_js_errors.length).to eq(1)
  end

  it 'shows accessibility violations on the page' do
    visit '/component-guide/test-component-with-a11y-issue'
    expect(page).to have_selector('.js-test-a11y-failed.js-test-a11y-finished')

    selector_with_error = page.first('.selector').text
    # the img element has no src, Capybara and Chrome cannot find it as it does not have
    # a visual presence.
    expect(page).to have_selector(selector_with_error, visible: false)

    within '.component-guide-preview--violation' do
      expect(page).to have_selector('h3', text: 'Images must have alternate text')
      expect(page).to have_selector('h3 a[href*="https://dequeuniversity.com"]', text: '(see guidance)')
      expect(page).to have_text('Element does not have an alt attribute')
    end
  end

  it 'does not throw JavaScript errors if there are duplicate IDs' do
    visit '/component-guide/test-component-with-duplicate-ids'
  end

  it 'shows incomplete accessibility warnings on the page' do
    visit '/component-guide/test-component-with-a11y-incomplete-warning'
    expect(page).to have_selector('.js-test-a11y-success.js-test-a11y-finished')

    selector_with_error = page.first('.selector').text
    expect(page).to have_selector(selector_with_error)

    within '.component-guide-preview--warning' do
      expect(page).to have_selector('h3', text: 'Elements must have sufficient color contrast')
      expect(page).to have_selector('h3 a[href*="https://dequeuniversity.com"]', text: '(see guidance)')
      expect(page).to have_text('Element\'s background color could not be determined due to a background image')
    end
  end
end
