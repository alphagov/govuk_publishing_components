require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_applications"

describe "Auditing the components in applications" do
  it "returns correct information" do
    path = File.join(Dir.pwd, "/spec/dummy")
    application = GovukPublishingComponents::AuditApplications.new(path, "govuk_publishing_components")

    expected = {
      name: "govuk_publishing_components",
      application_found: true,
      components_found: [
        {
          location: "templates",
          components: ["accordion", "back link", "contextual breadcrumbs", "contextual footer", "contextual sidebar", "error summary", "feedback", "govspeak", "input", "layout footer", "layout for admin", "layout for public", "layout header", "skip link", "tabs", "title"],
        },
        {
          location: "stylesheets",
          components: %w[all],
        },
        {
          location: "print_stylesheets",
          components: [],
        },
        {
          location: "javascripts",
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
        feedback: ["app/views/layouts/application.html.erb"],
        govspeak: ["app/views/welcome/contextual_navigation.html.erb", "lib/test_file_1.rb"],
        input: ["app/views/welcome/error_summary.html.erb", "app/views/welcome/error_summary.html.erb"],
        "layout footer": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "layout for admin": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "layout for public": ["app/views/layouts/dummy_public_layout.html.erb"],
        "layout header": ["app/views/layouts/dummy_admin_layout.html.erb"],
        "print link": ["lib/test_file_2.erb"],
        "skip link": ["app/views/layouts/dummy_admin_layout.html.erb"],
        tabs: ["app/views/welcome/error_summary.html.erb", "app/views/welcome/tabs_example.html.erb"],
        title: ["app/views/welcome/contextual_navigation.html.erb", "app/views/welcome/error_summary.html.erb", "app/views/welcome/table.html.erb"],
      },
      helper_references: {
        BrandHelper: ["lib/test_file_3.rb"],
        ButtonHelper: ["lib/test_file_3.rb"],
        SharedHelper: ["lib/test_file_3.rb"],
        TableHelper: ["app/views/welcome/table.html.erb"],
      },
    }

    expect(application.data).to match(expected)
  end
end
