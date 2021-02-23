require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/audit_comparer"

describe "Comparing data from an application with the components" do
  gem = {
    gem_found: true,
    name: "govuk_publishing_components",
    component_code: [
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

  gem_not_found = {
    gem_found: false,
  }

  it "behaves appropriately if the gem components were not found" do
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
    comparer = GovukPublishingComponents::AuditComparer.new(gem_not_found, application)
    expected = nil
    expect(comparer.applications_data).to match(expected)
  end

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
        gem_style_references: [],
        jquery_references: [],
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
            message: "Included in code but not stylesheets",
          },
          {
            component: "component one",
            message: "Included in code but not javascripts",
          },
          {
            component: "component two",
            message: "Included in stylesheets but not code",
          },
        ],
        warning_count: 5,
        gem_style_references: [],
        jquery_references: [],
      },
    ]

    expect(comparer.applications_data).to match(expected)
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
        gem_style_references: [],
        jquery_references: [],
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
        gem_style_references: [],
        jquery_references: [],
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end

  it "returns a comparison for an application using a mixed approach" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_found: [
          {
            location: "templates",
            components: [
              "component two",
              "component three",
            ],
          },
          {
            location: "stylesheets",
            components: [
              "component one",
              "component three",
            ],
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
        gem_style_references: [
          "a_made_up_application/app/assets/stylesheets/application.scss",
          "a_made_up_application/app/assets/stylesheets/application.js",
          "a_made_up_application/app/views/layouts/dummy_admin_layout.html",
        ],
        jquery_references: [],
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
            value: "component three, component two",
          },
          {
            name: "Components in stylesheets",
            value: "component one, component three",
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
        gem_style_references: [
          "a_made_up_application/app/assets/stylesheets/application.scss",
          "a_made_up_application/app/assets/stylesheets/application.js",
          "a_made_up_application/app/views/layouts/dummy_admin_layout.html",
        ],
        jquery_references: [],
        warnings: [
          {
            component: "component that does not exist",
            message: "Included in ruby but component does not exist",
          },
          {
            component: "component two",
            message: "Included in code but not stylesheets",
          },
          {
            component: "component one",
            message: "Included in stylesheets but not code",
          },
          {
            component: "Possible component style override",
            message: "a_made_up_application/app/assets/stylesheets/application.scss",
          },
          {
            component: "Possible hard coded component markup",
            message: "a_made_up_application/app/views/layouts/dummy_admin_layout.html",
          },
        ],
        warning_count: 5,
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end
end
