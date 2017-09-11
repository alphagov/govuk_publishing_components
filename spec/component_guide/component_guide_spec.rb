require "spec_helper"

describe 'Component guide' do
  before(:each) do
    GovukPublishingComponents.configure do |config|
      config.static = false
    end
  end

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
    expect(body).to include('render <span class="token string">\'components/test-component\'</span>')
  end

  it 'includes the component partial' do
    visit '/component-guide/test-component'

    expect(body).to include('How it looks')
    within '.component-guide-preview' do
      expect(page).to have_selector('.some-test-component')
      expect(page).to have_selector('h1.something-inside-test-component', text: 'Test component heading')
    end
  end

  it 'lists examples in a human readable way' do
    visit '/component-guide/test-component-with-params'
    expect(page).to have_selector('h2', text: 'Other examples')
    expect(page).to have_selector('h3 a[href="/component-guide/test-component-with-params/another_example"]', text: 'Another example')
  end

  it 'passes params in examples to component example' do
    visit '/component-guide/test-component-with-params'
    expect(body).to include('A test component that takes a required parameter')
    expect(body).to include('render <span class="token string">\'components/test-component-with-params\'</span>')


    expect(body).to include('test_component_parameter<span class="token punctuation">:</span> <span class="token string">"Some value"</span>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'Some value')

    expect(body).to include('test_component_parameter<span class="token punctuation">:</span> <span class="token string">"A different value"</span>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'A different value')
  end

  it 'marks strings in examples as html_safe' do
    visit '/component-guide/test-component-with-html-params'
    within ".test-component-with-html-params" do
      7.times do |i|
        count = i + 1
        expect(page).to have_selector(".param-#{count}", text: count)
      end
    end
  end

  it 'guide throws errors if component has an accessibility issue' do
    expect { visit '/component-guide/test-component-with-a11y-issue' }
      .to raise_error(Capybara::Poltergeist::JavascriptError)
  end

  it 'creates a page for each example' do
    visit '/component-guide/test-component-with-params/another_example'
    expect(body).to include('How to call this example')
    expect(body).to include('How it looks')

    expect(body).to include('test_component_parameter<span class="token punctuation">:</span> <span class="token string">"A different value"</span>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'A different value')
  end

  it 'includes the direction-rtl helper class for right to left example' do
    visit '/component-guide/test-component-with-params/right_to_left_example'
    expect(page).to have_selector('.component-guide-preview.direction-rtl')
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
    expect(page).to have_selector('[data-module="test-a11y"]')
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
    expect(page).to have_selector('.component-guide-preview-page .preview-title', text: 'Another example')
    expect(page).to have_selector('.component-guide-preview-page .test-component-with-params', text: 'A different value')
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end

  it 'loads a preview page for a specific example' do
    visit '/component-guide/test-component-with-params/another_example/preview'
    expect(page).to have_selector('.hide-header-and-footer')
    expect(page).not_to have_selector('#global-header')
    expect(page).not_to have_selector('#footer')

    expect(page).to have_no_selector('.component-guide-preview-page .preview-title')
    expect(page).to have_selector('.component-guide-preview-page .test-component-with-params', text: 'A different value')
    expect(page).to have_selector('.component-guide-preview-page [data-module="test-a11y"]')
  end

  it 'shows an example description if one is present' do
    visit '/component-guide/test-component-with-example-description'

    within ".component-example" do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to include('<p>This is the description of this example. It has a list in it, containing:</p>')
      end
    end
  end

  it 'loads a static component with correct component directory when configured' do
    GovukPublishingComponents.configure do |config|
      config.static = true
    end

    visit '/component-guide/test-static-component'

    expect(body).to include('render <span class="token string">\'govuk_component/test-static-component\'</span>')
    within '.component-guide-preview' do
      expect(page).to have_selector('.a-test-static-component')
    end
  end

  it 'shows universal accessibility criteria' do
    visit '/component-guide/test-component-with-universal-accessibility-criteria'

    within '.component-accessibility-criteria' do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to eq('<ul> <li>This is some criteria in a list</li> </ul> <p>Links in the component must:</p> <ul> <li>accept focus</li> <li>be focusable with a keyboard</li> <li>be usable with a keyboard</li> <li>indicate when it has focus</li> <li>change in appearance when touched (in the touch-down state)</li> <li>change in appearance when hovered</li> <li>be usable with touch</li> <li>be usable with <a rel="external" href="https://www.w3.org/WAI/perspectives/voice.html">voice commands</a> </li> <li>have visible text</li> </ul>')
      end
    end
  end

  it 'shows universal accessibility criteria when no other accessibility criteria are included' do
    visit '/component-guide/test-component-with-universal-accessibility-criteria-only'

    within '.component-accessibility-criteria' do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to eq('<p>Links in the component must:</p> <ul> <li>accept focus</li> <li>be focusable with a keyboard</li> <li>be usable with a keyboard</li> <li>indicate when it has focus</li> <li>change in appearance when touched (in the touch-down state)</li> <li>change in appearance when hovered</li> <li>be usable with touch</li> <li>be usable with <a rel="external" href="https://www.w3.org/WAI/perspectives/voice.html">voice commands</a> </li> <li>have visible text</li> </ul>')
      end
    end
  end
end
