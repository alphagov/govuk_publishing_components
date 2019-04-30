require "rails_helper"

describe 'Component example' do
  it 'illustrates how to use the component' do
    visit '/component-guide/test-component'

    expect(body).to include('How to call this component')
    expect(page).to have_content('<%= render "components/test-component", { } %>')
  end

  it 'includes the component partial' do
    visit '/component-guide/test-component'

    expect(body).to include('How it looks')
    within '.component-guide-preview', match: :first do
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

    expect(page).to have_content('<%= render "components/test-component-with-params", { test_component_parameter: "Some value" } %>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'Some value')

    expect(page).to have_content('<%= render "components/test-component-with-params", { test_component_parameter: "A different value" } %>')
    expect(page).to have_selector('.component-guide-preview .test-component-with-params', text: 'A different value')
  end

  it 'yields a block in component examples' do
    visit '/component-guide/test-component-with-block'

    expect(page).to have_selector('.component-guide-preview .test-component-with-block', text: 'Here\'s a block')

    expect(page).to have_content(%(<%= render "components/test-component-with-block", {\n} do %>\n<div class="test-block">Here's a block</div>\n<% end %>))
  end

  it 'allows examples to embedded in HTML' do
    visit '/component-guide/test-component-with-embed'

    expect(page).to have_selector('.component-guide-preview .input-control-for-embedded-component')
    expect(page).to have_selector('.component-guide-preview .test-component-with-embed')

    example = <<~EXAMPLE
      <input class="input-control-for-embedded-component">
      <%= render "components/test-component-with-embed", {
      } %>
    EXAMPLE
    expect(page).to have_content(example)
  end

  it 'allows specific examples to embed different HTML' do
    visit '/component-guide/test-component-with-embed/button_example'

    expect(page).to have_selector('.component-guide-preview .button-control-for-embedded-component')
    expect(page).to have_selector('.component-guide-preview .test-component-with-embed')

    example = <<~EXAMPLE
      <button class="button-control-for-embedded-component">Action</button>
      <%= render "components/test-component-with-embed", {
      } %>
    EXAMPLE
    expect(page).to have_content(example)
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

    expect(page).to have_content('<%= render "components/test-component-with-params", { test_component_parameter: "A different value" } %>')
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

  it 'displays the body of a component as HTML' do
    visit '/component-guide/test-component'
    within ".component-body" do
      expect(page).to have_content "An example body"
    end
  end

  it 'shows an example description if one is present' do
    visit '/component-guide/test-component-with-example-description'
    within ".component-example" do
      expect(page).to have_content "This is the description of this example"
    end
  end

  it 'shows a violation warning if no accessibility criteria are defined' do
    visit '/component-guide/test-component-with-no-accessibility-criteria'
    expect(page).to have_selector('.component-violation')
    expect(body).to include('This component is not valid')
  end
end
