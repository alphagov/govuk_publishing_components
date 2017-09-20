require "spec_helper"

describe 'Component example with automated testing' do
  it 'has accessibility testing hooks' do
    visit '/component-guide/test-component'
    expect(page).to have_selector('[data-module="test-a11y"]')
  end

  it 'runs automated accessibility testing tools' do
    visit '/component-guide/test-component'
    expect(page).to have_selector('.js-test-a11y-success.js-test-a11y-finished')
  end

  it 'throws JavaScript errors if a component has an accessibility issue' do
    expect { visit '/component-guide/test-component-with-a11y-issue' }
      .to raise_error(Capybara::Poltergeist::JavascriptError)
  end

  it 'does not throw JavaScript errors if there are duplicate IDs' do
    visit '/component-guide/test-component-with-duplicate-ids'
  end
end
