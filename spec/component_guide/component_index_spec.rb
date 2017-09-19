require "spec_helper"

describe 'Component guide index' do
  # Load ordering test can only fail if run as the first test in suite
  # https://github.com/rails/rails/issues/12168
  it 'renders using gem layout not app layout after viewing a page on the application' do
    visit '/'
    expect(page).to have_title 'Dummy'
    visit '/component-guide'
    expect(page).to have_title 'GOV.UK Component Guide'
  end

  it 'sets X-Frame-Options to allow inclusion in iFrames' do
    visit '/component-guide'
    expect(page.response_headers["X-Frame-Options"]).to eq('ALLOWALL')
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
end
