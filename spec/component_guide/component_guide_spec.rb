require "spec_helper"

describe 'Component guide' do
  # Load ordering test can only fail if run as the first test in suite
  # https://github.com/rails/rails/issues/12168
  it 'renders using gem layout not app layout after viewing a page on the application' do
    visit '/'
    expect(page).to have_title 'Dummy'
    visit '/component-guide'
    expect(page).to have_title 'GOV.UK Component Guide'
  end

  it 'loads a component guide' do
    visit '/component-guide'
    expect(page).to have_title 'GOV.UK Component Guide'
  end

  it 'loads a component from the dummy app' do
    visit '/component-guide'
    expect(body).to include('A test component for the dummy app')
    expect(page).to have_selector('a[href="/component-guide/test-component"]', text: 'Test component')
  end

  it 'includes component guide styles and scripts' do
    visit '/component-guide'
    expect(page).to have_selector('link[href*="/assets/govuk_publishing_components/application"]', visible: false)
    expect(page).to have_selector('script[src*="/assets/govuk_publishing_components/application"]', visible: false)
  end

  it 'includes the application’s styles and scripts' do
    visit '/component-guide'
    expect(page).to have_selector('link[href*="/assets/application"]', visible: false)
    expect(page).to have_selector('script[src*="/assets/application"]', visible: false)
  end

  it 'creates a page for the component' do
    visit '/component-guide/test-component'
    expect(body).to include('A test component for the dummy app')
  end

  it 'illustrates how to use the component' do
    visit '/component-guide/test-component'

    expect(body).to include('How to call this component')
    expect(body).to include('render \'components/test-component\'')
  end

  it 'includes the component partial' do
    visit '/component-guide/test-component'

    expect(body).to include('How it looks')
    within '.component-guide-preview' do
      expect(page).to have_selector('.some-test-component')
      expect(page).to have_selector('h1.something-inside-test-component', text: 'Test component heading')
    end
  end

  it 'lists fixtures in a human readable way' do
    visit '/component-guide/test-component-with-params'
    expect(page).to have_selector('h2', text: 'Other examples')
    expect(page).to have_selector('h3 a[href="/component-guide/test-component-with-params/another_fixture"]', text: 'Another fixture')
  end

  it 'passes params in fixtures to component example' do
    visit '/component-guide/test-component-with-params'
    expect(body).to include('A test component that takes a required parameter')
    expect(body).to include('render \'components/test-component-with-params\'')

    expect(body).to include('test_component_parameter: &quot;Some value&quot;')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'Some value')

    expect(body).to include('test_component_parameter: &quot;A different value&quot;')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'A different value')
  end

  it 'creates a page for each fixture' do
    visit '/component-guide/test-component-with-params/another_fixture'
    expect(body).to include('How to call this example')
    expect(body).to include('How it looks')

    expect(body).to include('test_component_parameter: &quot;A different value&quot;')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'A different value')
  end

  it 'handles components that use application helpers' do
    visit '/component-guide/test-component-with-helper'
    expect(body).to include('A test component that uses a helper in the host application')
    expect(page).to have_selector('.component-guide-preview .test-component-with-helper', text: 'This thing has been modified by a helper')
  end
end
