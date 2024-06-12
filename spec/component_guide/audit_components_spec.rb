require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_components"

describe "Auditing the components in the gem" do
  it "fails gracefully if the gem is not found" do
    path = File.join(File.dirname(__FILE__), "not/a/real/directory")
    gem = GovukPublishingComponents::AuditComponents.new(path)

    expected = {
      gem_found: false,
    }

    expect(gem.data).to match(expected)
  end

  it "returns correct information" do
    path = File.join(File.dirname(__FILE__), "../dummy_gem")
    gem = GovukPublishingComponents::AuditComponents.new(path)

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
      component_file_details: [
        {
          name: "test component",
          application: "govuk_publishing_components",
          link: "/component-guide/test_component",
          template_exists: true,
          template_lines: 7,
          template_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_test_component.html.erb",
          stylesheet_exists: true,
          stylesheet_lines: 6,
          stylesheet_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/_test-component.scss",
          print_stylesheet_exists: true,
          javascript_exists: true,
          javascript_lines: 2,
          javascript_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/components/test-component.js",
          test_exists: true,
          test_lines: 1,
          test_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/spec/components/test_component_spec.rb",
          javascript_test_exists: true,
          javascript_test_lines: 4,
          javascript_test_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/spec/javascripts/components/test-component-spec.js",
          helper_exists: true,
          helper_lines: 6,
          helper_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/lib/govuk_publishing_components/presenters/test_component_helper.rb",
          uses_govuk_frontend_css: true,
        },
        {
          name: "test component containing other component",
          application: "govuk_publishing_components",
          link: "/component-guide/test_component_containing_other_component",
          template_exists: true,
          template_lines: 3,
          template_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_test_component_containing_other_component.html.erb",
          print_stylesheet_exists: false,
          stylesheet_exists: true,
          stylesheet_lines: 4,
          stylesheet_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/_test-component-containing-other-component.scss",
          javascript_exists: true,
          javascript_lines: 4,
          javascript_link: "https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/components/test-component-containing-other-component.js",
          uses_govuk_frontend_js: true,
        },
      ],
      component_numbers: {
        template: 2,
        stylesheet: 2,
        print_stylesheet: 1,
        javascript: 2,
        test: 1,
        javascript_test: 1,
        helper: 1,
        uses_govuk_frontend_css: 1,
        uses_govuk_frontend_js: 1,
      },
      helper_usage: [
        {
          link: "lib/govuk_publishing_components/app_helpers/brand_helper.rb",
          match: /(GovukPublishingComponents::AppHelpers::BrandHelper.new)/,
          name: "Brand helper",
          used_by: [],
        },
        {
          link: "lib/govuk_publishing_components/presenters/component_wrapper_helper.rb",
          match: /(GovukPublishingComponents::Presenters::ComponentWrapperHelper.new)/,
          name: "Component wrapper helper",
          used_by: [
            {
              name: "test component",
              link: "_test_component.html.erb",
            },
          ],
        },
        {
          link: "lib/govuk_publishing_components/presenters/heading_helper.rb",
          match: /(GovukPublishingComponents::Presenters::HeadingHelper.new)/,
          name: "Heading helper",
          used_by: [],
        },
        {
          link: "lib/govuk_publishing_components/presenters/shared_helper.rb",
          match: /(GovukPublishingComponents::Presenters::SharedHelper.new)/,
          name: "Shared helper",
          used_by: [
            {
              name: "test component",
              link: "_test_component.html.erb",
            },
          ],
        },
      ],
    }

    expect(gem.data).to match(expected)
  end
end
