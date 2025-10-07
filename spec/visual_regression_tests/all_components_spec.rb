require "rails_helper"
require "percy/capybara"
require "uri"

# rubocop:disable RSpec/NoExpectationExample
describe "visual regression test runner Percy", :visual_regression do
  it "takes a screenshot of each component" do
    # Freeze time for consistency
    travel_to Time.zone.local(2020, 12, 1, 6, 0, 0)

    skip_as_govspeak_times_out = %w[
      /component-guide/govspeak/preview
    ]

    skip_non_visible_components = %w[
      /component-guide/meta_tags/preview
      /component-guide/machine_readable_metadata/preview
      /component-guide/google_tag_manager_script/preview
      /component-guide/layout_for_admin/preview
    ]

    all_components_to_skip = skip_as_govspeak_times_out + skip_non_visible_components

    visit("/component-guide")

    component_links = find("#list-all-components-in-the-gem")
      .all("a")
      .flat_map do |link|
        [
          URI("#{link[:href]}/preview"),
          URI("#{link[:href]}/preview?all_components=true"),
          URI("#{link[:href]}/preview?all_components=true&render_component_first=true"),
        ]
      end

    # The public layout component has two previews - one with multiple versions
    # as part of the component guide, and another one at `/public`.
    component_links << URI("/public")

    component_links.each do |link|
      next if all_components_to_skip.include?(link.path)

      visit(link)

      name = title.gsub(/(: Default|) preview - Component Guide/, "")

      page.find(:css, "body > #wrapper", wait: 10)

      page.percy_snapshot(name)
    end

    travel_back
  end
end
# rubocop:enable RSpec/NoExpectationExample
