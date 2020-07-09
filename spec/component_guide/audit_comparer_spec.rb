require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_comparer.rb"

describe "Comparing data from an application with the components" do
  gem = {
    name: "govuk_publishing_components",
    component_templates: [
      "component one",
      "component two",
      "component three",
    ],
    component_stylesheets: [
      "component one",
      "component two",
      "component three",
    ],
    component_print_stylesheets: [
      "component two",
    ],
    component_javascripts: [
      "component one",
    ],
    component_tests: [],
    component_js_tests: [],
    components_containing_components: [
      {
        component: "component one",
        sub_components: [
          "component three",
        ],
      },
    ],
    component_listing: [],
  }

  it "returns a comparison for an application using individual components" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_found: [
          {
            location: "templates",
            components: [
              "component one",
              "component that does not exist",
            ],
          },
          {
            location: "stylesheets",
            components: [
              "component one",
              "component two",
              "component four",
            ],
          },
          {
            location: "print_stylesheets",
            components: [],
          },
          {
            location: "javascripts",
            components: [],
          },
          {
            location: "ruby",
            components: [
              "component three",
            ],
          },
        ],
      },
    ]
    comparer = GovukPublishingComponents::AuditComparer.new(gem, application)

    expected = [
      {
        name: "Dummy application",
        application_found: true,
        summary: [
          {
            name: "Components in templates",
            value: "component one, component that does not exist, component three",
          },
          {
            name: "Components in stylesheets",
            value: "component one, component two, component four",
          },
          {
            name: "Components in print stylesheets",
            value: "",
          },
          {
            name: "Components in javascripts",
            value: "",
          },
          {
            name: "Components in ruby",
            value: "component three",
          },
        ],
        warnings: [
          {
            component: "component that does not exist",
            message: "Included in templates but component does not exist",
          },
          {
            component: "component four",
            message: "Included in stylesheets but component does not exist",
          },
          {
            component: "component three",
            message: "Included in templates but not stylesheets",
          },
          {
            component: "component one",
            message: "Included in templates but not javascripts",
          },
          {
            component: "component three",
            message: "Included in ruby but not stylesheets",
          },
          {
            component: "component two",
            message: "Included in stylesheets but not templates",
          },
        ],
        warning_count: 6,
      },
    ]

    expect(comparer.data).to match(expected)
  end

  it "returns a comparison for an application using all components" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_found: [
          {
            location: "templates",
            components: [
              "component one",
              "component two",
            ],
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
            components: [
              "component that does not exist",
            ],
          },
        ],
      },
    ]
    comparer = GovukPublishingComponents::AuditComparer.new(gem, application)

    expected = [
      {
        name: "Dummy application",
        application_found: true,
        summary: [
          {
            name: "Components in templates",
            value: "component one, component three, component two",
          },
          {
            name: "Components in stylesheets",
            value: "all",
          },
          {
            name: "Components in print stylesheets",
            value: "all",
          },
          {
            name: "Components in javascripts",
            value: "all",
          },
          {
            name: "Components in ruby",
            value: "component that does not exist",
          },
        ],
        warnings: [
          {
            component: "component that does not exist",
            message: "Included in ruby but component does not exist",
          },
        ],
        warning_count: 1,
      },
    ]

    expect(comparer.data).to match(expected)
  end
end
