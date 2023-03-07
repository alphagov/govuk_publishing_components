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
    components_containing_components: [
      {
        component: "component three",
        sub_components: [
          "component four",
        ],
      },
    ],
    component_file_details: [
      {
        name: "component one",
        link: "",
        template_exists: true,
        template_lines: 1,
        template_link: "",
        stylesheet_exists: true,
        stylesheet_lines: 1,
        stylesheet_link: "",
        print_stylesheet_exists: false,
        javascript_exists: true,
        javascript_lines: 1,
        javascript_link: "",
        test_exists: true,
        test_lines: 1,
        test_link: "",
        javascript_test_exists: true,
        javascript_test_lines: 1,
        javascript_test_link: "",
        helper_exists: true,
      },
      {
        name: "component two",
        link: "",
        template_exists: true,
        template_lines: 1,
        template_link: "",
        stylesheet_exists: true,
        stylesheet_lines: 1,
        stylesheet_link: "",
        print_stylesheet_exists: true,
        javascript_exists: false,
        javascript_lines: 1,
        javascript_link: "",
        test_exists: true,
        test_lines: 1,
        test_link: "",
        javascript_test_exists: true,
        javascript_test_lines: 1,
        javascript_test_link: "",
        helper_exists: true,
      },
      {
        name: "component three",
        link: "",
        template_exists: true,
        template_lines: 1,
        template_link: "",
        stylesheet_exists: true,
        stylesheet_lines: 1,
        stylesheet_link: "",
        print_stylesheet_exists: false,
        javascript_exists: false,
        javascript_lines: 1,
        javascript_link: "",
        test_exists: true,
        test_lines: 1,
        test_link: "",
        javascript_test_exists: true,
        javascript_test_lines: 1,
        javascript_test_link: "",
        helper_exists: true,
      },
      {
        name: "component four",
        link: "",
        template_exists: true,
        template_lines: 1,
        template_link: "",
        stylesheet_exists: true,
        stylesheet_lines: 1,
        stylesheet_link: "",
        print_stylesheet_exists: false,
        javascript_exists: true,
        javascript_lines: 1,
        javascript_link: "",
        test_exists: true,
        test_lines: 1,
        test_link: "",
        javascript_test_exists: true,
        javascript_test_lines: 1,
        javascript_test_link: "",
        helper_exists: true,
      },
    ],
    component_numbers: {},
    component_listing: {},
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
            location: "template",
            components: [
              "component one",
              "component that does not exist",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
              "component two",
              "component four",
            ],
          },
          {
            location: "print_stylesheet",
            components: [],
          },
          {
            location: "javascript",
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
            location: "template",
            components: [
              "component one",
              "component three",
              "component that does not exist",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
              "component two",
              "component three",
            ],
          },
          {
            location: "print_stylesheet",
            components: [],
          },
          {
            location: "javascript",
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
        helper_references: nil,
        component_locations: {},
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
            message: "Included in template but component does not exist",
          },
          {
            component: "component four",
            message: "Included in code but not stylesheet",
          },
          {
            component: "component four",
            message: "Included in code but not javascript",
          },
          {
            component: "component one",
            message: "Included in code but not javascript",
          },
          {
            component: "component two",
            message: "Included in stylesheet but not code",
          },
        ],
        warning_count: 5,
        gem_style_references: [],
        jquery_references: [],
        component_locations: {},
        helper_references: nil,
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end

  it "returns a comparison for an application using individual components where no assets have been included" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_found: [
          {
            location: "template",
            components: [
              "component one",
            ],
          },
          {
            location: "stylesheet",
            components: [],
          },
          {
            location: "print_stylesheet",
            components: [],
          },
          {
            location: "javascript",
            components: [],
          },
          {
            location: "ruby",
            components: [],
          },
        ],
        gem_style_references: [],
        jquery_references: [],
        helper_references: nil,
        component_locations: {},
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
            value: "component one",
          },
          {
            name: "Components in stylesheets",
            value: "",
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
            component: "component one",
            message: "Included in code but not stylesheet",
          },
          {
            component: "component one",
            message: "Included in code but not javascript",
          },
        ],
        warning_count: 2,
        gem_style_references: [],
        jquery_references: [],
        component_locations: {},
        helper_references: nil,
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
            location: "template",
            components: [
              "component one",
              "component two",
              "component four",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
            ],
          },
          {
            location: "print_stylesheet",
            components: [],
          },
          {
            location: "javascript",
            components: [],
          },
          {
            location: "ruby",
            components: [],
          },
        ],
        gem_style_references: [],
        jquery_references: [],
        component_locations: {},
      },
      {
        name: "static",
        application_found: true,
        components_found: [
          {
            location: "template",
            components: [
              "component one",
              "component two",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
              "component two",
            ],
          },
          {
            location: "print_stylesheet",
            components: [
              "component two",
            ],
          },
          {
            location: "javascript",
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
        component_locations: {},
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
            message: "Included in code but not stylesheet",
          },
          {
            component: "component four",
            message: "Included in code but not javascript",
          },
          {
            component: "component one",
            message: "Included in stylesheet but already included in static",
          },
        ],
        warning_count: 3,
        gem_style_references: [],
        jquery_references: [],
        component_locations: {},
        helper_references: nil,
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
        component_locations: {},
        helper_references: nil,
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
            location: "template",
            components: [
              "component one",
              "component two",
            ],
          },
          {
            location: "stylesheet",
            components: %w[all],
          },
          {
            location: "print_stylesheet",
            components: %w[all],
          },
          {
            location: "javascript",
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
        component_locations: {},
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
        component_locations: {},
        helper_references: nil,
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
            location: "template",
            components: [
              "component two",
              "component three",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
              "component three",
            ],
          },
          {
            location: "print_stylesheet",
            components: %w[all],
          },
          {
            location: "javascript",
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
        component_locations: {},
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
            message: "Included in code but not stylesheet",
          },
          {
            component: "component two",
            message: "Included in code but not stylesheet",
          },
          {
            component: "component one",
            message: "Included in stylesheet but not code",
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
        helper_references: nil,
        component_locations: {},
      },
    ]

    expect(comparer.applications_data).to match(expected)
  end

  it "returns a comparison for an application with component and helper references" do
    application = [
      {
        name: "Dummy application",
        application_found: true,
        components_found: [
          {
            location: "template",
            components: [
              "component one",
              "component three",
              "component that does not exist",
            ],
          },
          {
            location: "stylesheet",
            components: [
              "component one",
              "component two",
              "component three",
            ],
          },
          {
            location: "print_stylesheet",
            components: [],
          },
          {
            location: "javascript",
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
        component_locations: {
          accordion: ["app/views/welcome/accordion_example.html.erb"],
        },
        helper_references: {
          BrandHelper: ["lib/test_file_3.rb"],
          ButtonHelper: ["lib/test_file_3.rb"],
          SharedHelper: ["lib/test_file_3.rb"],
          TableHelper: ["app/views/welcome/table.html.erb"],
        },
      },
    ]

    gem[:component_listing][:details] = [
      {
        name: "accordion",
      },
    ]

    comparer = GovukPublishingComponents::AuditComparer.new(gem, application)

    expected = {
      gem_found: true,
      name: "govuk_publishing_components",
      component_code: [
        "component one",
        "component two",
        "component three",
        "component four",
      ],
      components_containing_components: [
        {
          component: "component three",
          sub_components: [
            "component four",
          ],
        },
      ],
      component_listing: {
        details: [
          {
            name: "accordion",
          },
        ],
      },
      components_by_application: [],
      helpers_used_by_applications: [
        {
          name: :BrandHelper,
          count: 1,
          locations: [
            {
              locations: ["lib/test_file_3.rb"],
              name: "Dummy application",
            },
          ],
        },
        {
          name: :ButtonHelper,
          count: 1,
          locations: [
            {
              locations: ["lib/test_file_3.rb"],
              name: "Dummy application",
            },
          ],
        },
        {
          name: :SharedHelper,
          count: 1,
          locations: [
            {
              locations: ["lib/test_file_3.rb"],
              name: "Dummy application",
            },
          ],
        },
        {
          name: :TableHelper,
          count: 1,
          locations: [
            {
              locations: ["app/views/welcome/table.html.erb"],
              name: "Dummy application",
            },
          ],
        },
      ],
      component_file_details: [
        {
          name: "component one",
          link: "",
          template_exists: true,
          template_lines: 1,
          template_link: "",
          stylesheet_exists: true,
          stylesheet_lines: 1,
          stylesheet_link: "",
          print_stylesheet_exists: false,
          javascript_exists: true,
          javascript_lines: 1,
          javascript_link: "",
          test_exists: true,
          test_lines: 1,
          test_link: "",
          javascript_test_exists: true,
          javascript_test_lines: 1,
          javascript_test_link: "",
          helper_exists: true,
        },
        {
          name: "component two",
          link: "",
          template_exists: true,
          template_lines: 1,
          template_link: "",
          stylesheet_exists: true,
          stylesheet_lines: 1,
          stylesheet_link: "",
          print_stylesheet_exists: true,
          javascript_exists: false,
          javascript_lines: 1,
          javascript_link: "",
          test_exists: true,
          test_lines: 1,
          test_link: "",
          javascript_test_exists: true,
          javascript_test_lines: 1,
          javascript_test_link: "",
          helper_exists: true,
        },
        {
          name: "component three",
          link: "",
          template_exists: true,
          template_lines: 1,
          template_link: "",
          stylesheet_exists: true,
          stylesheet_lines: 1,
          stylesheet_link: "",
          print_stylesheet_exists: false,
          javascript_exists: false,
          javascript_lines: 1,
          javascript_link: "",
          test_exists: true,
          test_lines: 1,
          test_link: "",
          javascript_test_exists: true,
          javascript_test_lines: 1,
          javascript_test_link: "",
          helper_exists: true,
        },
        {
          name: "component four",
          link: "",
          template_exists: true,
          template_lines: 1,
          template_link: "",
          stylesheet_exists: true,
          stylesheet_lines: 1,
          stylesheet_link: "",
          print_stylesheet_exists: false,
          javascript_exists: true,
          javascript_lines: 1,
          javascript_link: "",
          test_exists: true,
          test_lines: 1,
          test_link: "",
          javascript_test_exists: true,
          javascript_test_lines: 1,
          javascript_test_link: "",
          helper_exists: true,
        },
      ],
      component_numbers: {},
    }

    expect(comparer.gem_data).to match(expected)
  end
end
