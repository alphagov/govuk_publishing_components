require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_applications.rb"

describe "Auditing the components in applications" do
  it "returns correct information" do
    path = File.join(File.dirname(__FILE__), "../dummy")
    application = GovukPublishingComponents::AuditApplications.new(path, "an application")

    expected = {
      name: "an application",
      application_found: true,
      components_found: [
        {
          location: "templates",
          components: ["contextual breadcrumbs", "contextual footer", "contextual sidebar", "error summary", "feedback", "govspeak", "input", "layout footer", "layout for admin", "layout header", "skip link", "tabs", "title"],
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
    }

    expect(application.data).to match(expected)
  end
end
