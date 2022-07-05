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
      "component four",
    ],
    component_stylesheets: [
      "component one",
      "component two",
      "component three",
      "component four",
    ],
    component_print_stylesheets: [
      "component two",
    ],
    component_javascripts: [
      "component one",
      "component four",
    ],
    component_tests: [],
    component_js_tests: [],
    components_containing_components: [
      {
        component: "component three",
        sub_components: [
          "component four",
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
              "component three",
              "component that does not exist",
            ],
          },
          {
            location: "stylesheets",
            components: [
              "component one",
              "component two",
              "component three",
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
        uses_static: false,
        summary: [
          {
            name: "Components in templates",
            value: "component four, component one, component that does not exist, component three",
          },
          {
            name: "Components in stylesheets",
            value: "component one, component two, component three",
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
            message: "Included in code but not stylesheets",
          },
          {
            component: "component four",
            message: "Included in code but not javascripts",
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
        component_locations: nil,
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end

  # if static contains an asset that an application needs, no warning should be raised
  it "returns a comparison for an application using individual components and takes static into account" do
    application = [
      {
        name: "collections",
        application_found: true,
        components_found: [
          {
            location: "templates",
            components: [
              "component one",
              "component two",
              "component four",
            ],
          },
          {
            location: "stylesheets",
            components: [
              "component one",
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
            components: [],
          },
        ],
        gem_style_references: [],
        jquery_references: [],
      },
      {
        name: "static",
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
            components: [
              "component one",
              "component two",
            ],
          },
          {
            location: "print_stylesheets",
            components: [
              "component two",
            ],
          },
          {
            location: "javascripts",
            components: [
              "component one",
            ],
          },
          {
            location: "ruby",
            components: [],
          },
        ],
        gem_style_references: [],
        jquery_references: [],
      },
    ]
    comparer = GovukPublishingComponents::AuditComparer.new(gem, application)

    expected = [
      {
        name: "collections",
        application_found: true,
        uses_static: true,
        summary: [
          {
            name: "Components in templates",
            value: "component four, component one, component two",
          },
          {
            name: "Components in stylesheets",
            value: "component one",
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
            value: "",
          },
        ],
        warnings: [
          {
            component: "component four",
            message: "Included in code but not stylesheets",
          },
          {
            component: "component four",
            message: "Included in code but not javascripts",
          },
          {
            component: "component one",
            message: "Included in stylesheets but already included in static",
          },
        ],
        warning_count: 3,
        gem_style_references: [],
        jquery_references: [],
        component_locations: nil,
      },
      {
        name: "static",
        application_found: true,
        uses_static: false,
        summary: [
          {
            name: "Components in templates",
            value: "component one, component two",
          },
          {
            name: "Components in stylesheets",
            value: "component one, component two",
          },
          {
            name: "Components in print stylesheets",
            value: "component two",
          },
          {
            name: "Components in javascripts",
            value: "component one",
          },
          {
            name: "Components in ruby",
            value: "",
          },
        ],
        warnings: [],
        warning_count: 0,
        gem_style_references: [],
        jquery_references: [],
        component_locations: nil,
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
        uses_static: false,
        summary: [
          {
            name: "Components in templates",
            value: "component one, component two",
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
        component_locations: nil,
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
        component_locations: nil,
        uses_static: false,
        summary: [
          {
            name: "Components in templates",
            value: "component four, component three, component two",
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
            component: "component four",
            message: "Included in code but not stylesheets",
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
        warning_count: 6,
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end
end
