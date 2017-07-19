require "spec_helper"

describe 'Component guide' do
  it 'loads a component guide' do
    visit '/component-guide'
    expect(page).to have_title 'GOV.UK Component Guide'
  end
end
