require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_comparer.rb"

describe "Comparing data from an application with the components" do
  gem = {
    name: "govuk_publishing_components",
    components: [
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
    component_tests: [
      "component one",
    ],
    component_js_tests: [
      "component one",
    ],
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
        components_in_templates: [
          "component one",
          "component two",
        ],
        components_in_stylesheets: [
          "component one",
          "component two",
        ],
        components_in_print_stylesheets: [],
        components_in_javascripts: [],
        components_in_ruby: [
          "component three",
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
            value: "component one, component two",
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
        missing_includes: [
          {
            name: "Not in templates",
            values: [],
          },
          {
            name: "Not in stylesheets",
            values: [
              {
                warning: true,
                component: "component three",
              },
            ],
          },
          {
            name: "Not in print stylesheets",
            values: [
              {
                warning: false,
                component: "component one",
              },
              {
                warning: false,
                component: "component three",
              },
              {
                warning: true,
                component: "component two",
              },
            ],
          },
          {
            name: "Not in javascripts",
            values: [
              {
                warning: true,
                component: "component one",
              },
              {
                warning: false,
                component: "component three",
              },
              {
                warning: false,
                component: "component two",
              },
            ],
          },
        ],
        warning_count: 3,
      },
    ]

    expect(comparer.data).to match(expected)
  end

  it "returns a comparison for an application using all components" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_in_templates: [
          "component one",
          "component two",
        ],
        components_in_stylesheets: %w[all],
        components_in_print_stylesheets: %w[all],
        components_in_javascripts: %w[all],
        components_in_ruby: %w[none],
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
            value: "none",
          },
        ],
        missing_includes: [
          {
            name: "Not in templates",
            values: [],
          },
          {
            name: "Not in stylesheets",
            values: [
              {
                warning: false,
                component: "component one",
              },
              {
                warning: false,
                component: "component three",
              },
              {
                warning: false,
                component: "component two",
              },
            ],
          },
          {
            name: "Not in print stylesheets",
            values: [
              {
                warning: false,
                component: "component one",
              },
              {
                warning: false,
                component: "component three",
              },
              {
                warning: false,
                component: "component two",
              },
            ],
          },
          {
            name: "Not in javascripts",
            values: [
              {
                warning: false,
                component: "component one",
              },
              {
                warning: false,
                component: "component three",
              },
              {
                warning: false,
                component: "component two",
              },
            ],
          },
        ],
        warning_count: 0,
      },
    ]

    expect(comparer.data).to match(expected)
  end
end
