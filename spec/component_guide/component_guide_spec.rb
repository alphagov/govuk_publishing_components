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

  it 'marks strings in fixtures as html_safe' do
    visit '/component-guide/test-component-with-html-params'
    within ".test-component-with-html-params" do
      7.times do |i|
        count = i + 1
        expect(page).to have_selector(".param-#{count}", text: count)
      end
    end
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

  it 'displays the body of a component as html using static’s govspeak component' do
    visit '/component-guide/test-component'
    within ".component-body" do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to include('An example body with <a href="/component-guide">markdown in it</a>')
        expect(content).to include('<p>This is a list:</p>')
        expect(content).to include('<li>list item one</li>')
      end
    end
  end

  it 'has accessibility testing hooks' do
    visit '/component-guide/test-component'
    expect(page).to have_selector('.component-guide-preview[data-module="test-a11y"]')
  end

  it 'displays the accessibility acceptance criteria of a component as html using static’s govspeak component' do
    visit '/component-guide/test-component'
    within ".component-accessibility-criteria" do
      expect(page).to have_selector('h2', text: 'Accessibility acceptance criteria')

      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to include('<li>This is some criteria in a list</li>')
      end
    end
  end

  it 'loads a preview all page for a component' do
    visit '/component-guide/test-component-with-params/preview'
    expect(page).to have_selector('.hide-header-and-footer')
    expect(page).not_to have_selector('#global-header')
    expect(page).not_to have_selector('#footer')

    expect(page).to have_selector('.component-guide-preview-page .preview-title', text: 'Default')
    expect(page).to have_selector('.component-guide-preview-page .test-component-with-params', text: 'Some value')
    expect(page).to have_selector('.component-guide-preview-page .preview-title', text: 'Another fixture')
    expect(page).to have_selector('.component-guide-preview-page .test-component-with-params', text: 'A different value')
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end

  it 'loads a preview page for a specific fixture' do
    visit '/component-guide/test-component-with-params/another_fixture/preview'
    expect(page).to have_selector('.hide-header-and-footer')
    expect(page).not_to have_selector('#global-header')
    expect(page).not_to have_selector('#footer')

    expect(page).to have_no_selector('.component-guide-preview-page .preview-title')
    expect(page).to have_selector('.component-guide-preview-page .test-component-with-params', text: 'A different value')
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end
end
