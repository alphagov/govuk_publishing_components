require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_applications.rb"

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
          components: ["back link", "contextual breadcrumbs", "contextual footer", "contextual sidebar", "error summary", "feedback", "govspeak", "input", "layout footer", "layout for admin", "layout for public", "layout header", "skip link", "tabs", "title"],
        },
        {
          location: "stylesheets",
          components: %w[all],
        },
        {
          location: "print_stylesheets",
          components: %w[all],
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
        "app/assets/javascripts/application.js",
      ],
    }

    expect(application.data).to match(expected)
  end
end
