require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_components"

describe "Auditing the components in the gem" do
  it "fails gracefully if the gem is not found" do
    path = File.join(File.dirname(__FILE__), "not/a/real/directory")
    gem = GovukPublishingComponents::AuditComponents.new(path, false)

    expected = {
      gem_found: false,
    }

    expect(gem.data).to match(expected)
  end

  it "returns correct information" do
    path = File.join(File.dirname(__FILE__), "../dummy_gem")
    gem = GovukPublishingComponents::AuditComponents.new(path, false)

    expected = {
      gem_found: true,
      component_code: [
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
      component_helpers: [
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
          helper: true,
        },
        {
          name: "test component containing other component",
          link: "/component-guide/test_component_containing_other_component",
          stylesheet: nil,
          print_stylesheet: nil,
          javascript: nil,
          tests: nil,
          js_tests: nil,
          helper: nil,
        },
      ],
    }

    expect(gem.data).to match(expected)
  end

  it "returns a subset of audit information when simple is true" do
    path = File.join(File.dirname(__FILE__), "../dummy_gem")
    gem = GovukPublishingComponents::AuditComponents.new(path, true)

    expected = {
      gem_found: true,
      component_code: [
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
      component_helpers: [
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
      component_listing: [],
    }

    expect(gem.data).to match(expected)
  end
end
