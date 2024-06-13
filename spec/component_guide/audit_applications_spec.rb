require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_applications"

describe "Auditing the components in applications" do
  it "returns correct information" do
    path = File.join(Dir.pwd, "/spec/dummy")
    application = GovukPublishingComponents::AuditApplications.new(path, "an_application", "app-dir")

    expected = {
      name: "an_application",
      dir: "app-dir",
      application_found: true,
      components_found: [
        {
          location: "template",
          components: ["accordion", "back link", "contextual breadcrumbs", "contextual footer", "contextual sidebar", "details", "error summary", "feedback", "govspeak", "input", "layout footer", "layout for admin", "layout for public", "layout header", "notice", "skip link", "tabs", "title"],
        },
        {
          location: "stylesheet",
          components: %w[all],
        },
        {
          location: "javascript",
          components: %w[all],
        },
        {
          location: "ruby",
          components: ["button", "govspeak", "print link"],
        },
      ],
      gem_style_references: [
        "app/assets/stylesheets/application.scss",
        "app/views/layouts/dummy_admin_layout.html.erb",
      ],
      jquery_references: [
        "app/assets/javascripts/some-jquery.js",
      ],
      component_locations: {
        accordion: ["app/views/welcome/accordion_example.html.erb"],
        "back link": ["app/views/welcome/public_example.html.erb"],
        button: ["lib/test_file_2.erb"],
        "contextual breadcrumbs": ["app/views/step_nav/show.html.erb", "app/views/welcome/contextual_navigation.html.erb"],
        "contextual footer": ["app/views/step_nav/show.html.erb", "app/views/welcome/contextual_navigation.html.erb"],
        "contextual sidebar": ["app/views/step_nav/show.html.erb", "app/views/welcome/contextual_navigation.html.erb"],
        "error summary": ["app/views/welcome/error_summary.html.erb"],
        details: ["app/views/welcome/asset_helper.html.erb"],
        feedback: ["app/views/layouts/application.html.erb"],
        govspeak: ["app/views/welcome/contextual_navigation.html.erb", "lib/1_test_file_1.rb"],
        input: ["app/views/welcome/error_summary.html.erb", "app/views/welcome/error_summary.html.erb"],
        "layout footer": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "layout for admin": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "layout for public": ["app/views/layouts/dummy_public_layout.html.erb"],
        "layout header": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "print link": ["lib/test_file_2.erb"],
        "skip link": ["app/views/layouts/dummy_admin_layout.html.erb"],
        notice:
          [
            "app/views/welcome/asset_helper.html.erb",
            "app/views/welcome/asset_helper_with_app_component.html.erb",
            "app/views/welcome/asset_helper_with_app_view.html.erb",
          ],
        tabs: ["app/views/welcome/error_summary.html.erb", "app/views/welcome/tabs_example.html.erb"],
        title:
          [
            "app/views/welcome/asset_helper.html.erb",
            "app/views/welcome/asset_helper_with_app_component.html.erb",
            "app/views/welcome/asset_helper_with_app_view.html.erb",
            "app/views/welcome/contextual_navigation.html.erb",
            "app/views/welcome/error_summary.html.erb",
            "app/views/welcome/table.html.erb",
          ],
      },
      helper_references: {
        BrandHelper: ["lib/test_file_3.rb"],
        ButtonHelper: ["lib/test_file_3.rb"],
        ComponentWrapperHelper: ["app/views/components/_test_component_using_wrapper.html.erb"],
        SharedHelper: ["lib/test_file_3.rb"],
        TableHelper: ["app/views/welcome/table.html.erb"],
      },
      uses_individual_asset_model: true,
      application_components: {
        component_file_details: [
          {
            name: "app component",
            application: "app-dir",
            print_stylesheet_exists: false,
            stylesheet_exists: true,
            stylesheet_lines: 3,
            stylesheet_link: "https://github.com/alphagov/app-dir/blob/main/app/assets/stylesheets/components/_app-component.scss",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_app_component.html.erb",
          },
          {
            name: "test component",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component.html.erb",
          },
          {
            name: "test component using wrapper",
            application: "app-dir",
            template_exists: true,
            template_lines: 5,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_using_wrapper.html.erb",
          },
          {
            name: "test component with a11y incomplete warning",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_a11y_incomplete_warning.html.erb",
          },
          {
            name: "test component with a11y issue",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_a11y_issue.html.erb",
          },
          {
            name: "test component with block",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_block.html.erb",
          },
          {
            name: "test component with duplicate ids",
            application: "app-dir",
            template_exists: true,
            template_lines: 5,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_duplicate_ids.html.erb",
          },
          {
            name: "test component with embed",
            application: "app-dir",
            template_exists: true,
            template_lines: 1,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_embed.html.erb",
          },
          {
            name: "test component with example description",
            application: "app-dir",
            template_exists: true,
            template_lines: 6,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_example_description.html.erb",
          },
          {
            name: "test component with helper",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_helper.html.erb",
          },
          {
            name: "test component with html params",
            application: "app-dir",
            template_exists: true,
            template_lines: 14,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_html_params.html.erb",
          },
          {
            name: "test component with no accessibility criteria",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_no_accessibility_criteria.html.erb",
          },
          {
            name: "test component with params",
            application: "app-dir",
            template_exists: true,
            template_lines: 6,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_params.html.erb",
          },
          {
            name: "test component with shared accessibility criteria",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_shared_accessibility_criteria.html.erb",
          },
          {
            name: "test component with shared accessibility criteria only",
            application: "app-dir",
            template_exists: true,
            template_lines: 3,
            template_link: "https://github.com/alphagov/app-dir/blob/main/app/views/components/_test_component_with_shared_accessibility_criteria_only.html.erb",
          },
        ],
        component_numbers: {
          helper: 0,
          javascript: 0,
          javascript_test: 0,
          print_stylesheet: 0,
          stylesheet: 1,
          template: 15,
          test: 0,
          uses_govuk_frontend_css: 0,
          uses_govuk_frontend_js: 0,
        },
      },
    }

    expect(application.data).to match(expected)
  end
end
