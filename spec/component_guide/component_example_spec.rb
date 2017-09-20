require "spec_helper"

describe 'Component example' do
  it 'illustrates how to use the component' do
    visit '/component-guide/test-component'

    expect(body).to include('How to call this component')
    expect(body).to include('<span class="n">render</span> <span class="s2">"components/test-component"</span>')
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
    expect(body).to include('<span class="n">render</span> <span class="s2">"components/test-component-with-params"</span>')


    expect(body).to include('<span class="ss">test_component_parameter: </span><span class="s2">"Some value"</span>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'Some value')

    expect(body).to include('<span class="ss">test_component_parameter: </span><span class="s2">"A different value"</span>')
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

  it 'creates a page for each example' do
    visit '/component-guide/test-component-with-params/another_example'
    expect(body).to include('How to call this example')
    expect(body).to include('How it looks')

    expect(body).to include('<span class="ss">test_component_parameter: </span><span class="s2">"A different value"</span>')
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

  it 'shows an example description if one is present' do
    visit '/component-guide/test-component-with-example-description'

    within ".component-example" do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to include('<p>This is the description of this example. It has a list in it, containing:</p>')
      end
    end
  end
end
