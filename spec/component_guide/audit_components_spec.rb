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
      components_containing_components: [
        {
          component: "test component containing other component",
          link: "/component-guide/test_component_containing_other_component",
          sub_components: [
            "test component",
          ],
        },
      ],
      component_listing: {
        total_count: 2,
        css_count: 1,
        print_css_count: 1,
        javascript_count: 1,
        test_count: 1,
        javascript_test_count: 1,
        helper_count: 1,
        details: [
          {
            name: "test component",
            link: "/component-guide/test_component",
            stylesheet: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/_test-component.scss",
            print_stylesheet: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/print/_test-component.scss",
            javascript: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/components/test-component.js",
            tests: "https://github.com/alphagov/govuk_publishing_components/blob/main/spec/components/test_component_spec.rb",
            js_tests: "https://github.com/alphagov/govuk_publishing_components/blob/main/spec/javascripts/components/test-component-spec.js",
            helper: "https://github.com/alphagov/govuk_publishing_components/blob/main/lib/govuk_publishing_components/presenters/test_component_helper.rb",
          },
          {
            name: "test component containing other component",
            link: "/component-guide/test_component_containing_other_component",
            stylesheet: false,
            print_stylesheet: false,
            javascript: false,
            tests: false,
            js_tests: false,
            helper: false,
          },
        ],
      },
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
      components_containing_components: [],
      component_listing: [],
    }

    expect(gem.data).to match(expected)
  end
end
