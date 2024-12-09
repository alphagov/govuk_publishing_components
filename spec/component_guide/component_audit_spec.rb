require "rails_helper"

describe "Component audit page", :capybara do
  it "renders the audit page" do
    visit "/component-guide/audit"
    expect(page).to have_title "Component audit - Component Guide"
  end
end
