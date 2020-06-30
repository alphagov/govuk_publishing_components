require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_components.rb"

describe "Auditing the components in the gem" do
  it "returns correct information" do
    gem = GovukPublishingComponents::AuditComponents.new("#{Dir.pwd}/spec/dummy_gem")

    expected = {
      components: [
        "test component",
        "test component containing other component",
      ],
      component_stylesheets: [
        "test component",
      ],
      component_print_stylesheets: [
        "test component",
      ],
      component_javascripts: [
        "test component",
      ],
      component_tests: [
        "test component",
      ],
      component_js_tests: [
        "test component",
      ],
      components_containing_components: [
        {
          component: "test component containing other component",
          link: "/component-guide/test_component_containing_other_component",
          sub_components: [
            "test component",
          ],
        },
      ],
      component_listing: [
        {
          name: "test component",
          link: "/component-guide/test_component",
          stylesheet: true,
          print_stylesheet: true,
          javascript: true,
          tests: true,
          js_tests: true,
        },
        {
          name: "test component containing other component",
          link: "/component-guide/test_component_containing_other_component",
          stylesheet: nil,
          print_stylesheet: nil,
          javascript: nil,
          tests: nil,
          js_tests: nil,
        },
      ],
    }

    expect(gem.data).to match(expected)
  end
end
