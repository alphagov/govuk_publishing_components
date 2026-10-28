require "rails_helper"
require "percy/capybara"
require "uri"
require_relative "all_components_config"

# rubocop:disable RSpec/NoExpectationExample
describe "visual regression test runner Percy", :visual_regression do
  # Helper for page setup and name extraction
  def wait_for_page_and_get_name
    page.find(:css, "body", wait: 10)
    title.gsub(/(: Default|) preview - Component Guide/, "")
  end

  it "takes a screenshot of each component" do
    # Freeze time for consistency
    travel_to Time.zone.local(2020, 12, 1, 6, 0, 0)

    visit("/component-guide")

    component_links = find("#list-all-components-in-the-gem")
      .all("a")
      .map do |link|
        URI("#{link[:href]}/preview")
      end

    # The public layout component has two previews - one with multiple versions
    # as part of the component guide, and another one at `/public`.
    component_links << URI("/public")

    # Baseline Snapshots (All Variants)
    component_links.each do |link|
      next if VisualRegressionConfig::SKIP_COMPONENTS.include?(link.path)

      visit(link)
      name = wait_for_page_and_get_name
      page.percy_snapshot(name)
    end

    # Interactive Snapshots (Selected Components)
    VisualRegressionConfig::INTERACTIVE_COMPONENTS.each do |path, interactions|
      interactions.each do |interaction|
        # Visit a fresh path for each action
        visit(path)
        name = wait_for_page_and_get_name

        next unless page.has_css?(interaction[:toggle_selector], wait: 0)

        toggle_button = page.find(interaction[:toggle_selector])
        toggle_button.click

        # Wait for the element to become visible
        page.has_css?(interaction[:wait_selector], visible: true, wait: 5)

        # Snapshot the active state
        page.percy_snapshot("#{name} - #{interaction[:state_name]}")
      end
    end

    travel_back
  end
end
# rubocop:enable RSpec/NoExpectationExample
