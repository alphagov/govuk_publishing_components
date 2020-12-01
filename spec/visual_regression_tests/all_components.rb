require "rails_helper"
require "percy"
require "uri"

describe "visual regression test runner Percy", type: :feature, js: true do
  it "takes a screenshot of each component" do
    # Freeze time for transition countdown
    travel_to(Time.zone.local(2020, 12, 1, 6, 0, 0))

    visit("/component-guide")

    component_links = find("#list-all-components-in-the-gem")
      .all("a")
      .map do |link|
        URI(link[:href])
      end

    component_links.each do |link|
      skip_as_govspeak_times_out = [
        "/component-guide/govspeak",
      ]

      skip_non_visible_components = [
        "/component-guide/meta_tags",
        "/component-guide/machine_readable_metadata",
        "/component-guide/admin_analytics",
        "/component-guide/google_tag_manager_script",
        "/component-guide/layout_for_admin",
      ]

      all_components_to_skip = skip_as_govspeak_times_out + skip_non_visible_components

      next if all_components_to_skip.include?(link.path)

      visit("#{link}/preview")
      name = title.gsub(/(: Default|) preview - Component Guide/, "")
      page.find(:css, "#wrapper", wait: 10)
      Percy.snapshot(page, name: name)
    end
  end
end
