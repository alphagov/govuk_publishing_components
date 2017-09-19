require "spec_helper"

describe 'Static component guide' do
  before(:each) do
    GovukPublishingComponents.configure do |config|
      config.static = true
    end
  end

  it 'loads a static component with correct component directory when configured' do
    visit '/component-guide/test-static-component'

    expect(body).to include('<span class="n">render</span> <span class="s2">"govuk_component/test-static-component"</span>')
    within '.component-guide-preview' do
      expect(page).to have_selector('.a-test-static-component')
    end
  end
end
