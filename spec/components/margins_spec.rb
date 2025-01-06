require "rails_helper"

describe "All components test", type: :view do
  def component_name
    @component
  end

  def components
    %w[accordion action_link attachment back_link big_number breadcrumbs button cards chat_entry contents_list contextual_guidance cookie_banner details devolved_nations document_list emergency_banner error_alert feedback checkboxes error_message error_summary fieldset hint label radio textarea glance_metric govspeak heading image_card inset_text inverse_header layout_footer layout_header lead_paragraph list metadata notice option_select organisation_logo title panel password_input phase_banner previous_and_next_navigation print_link reorderable_list search secondary_navigation share_links signup_link step_by_step_nav_header subscription_links success_alert tabs single_page_notification_button].sort
  end

  # no need to test?
  # admin_layout cross_service_header google_tag_manager_script machine_readable_metadata meta_tags public_layout layout_super_navigation_header

  # too complex to render right now
  # contextual_breadcrumbs contextual_footer related_navigation

  # don't have margin_bottom (probably don't have the component wrapper helper)
  # single_page_notification_button has the component class on a sub element, one to check
  def components_that_dont_have_margin
    %w[add_another attachment_link character_count contextual_sidebar copy_to_clipboard date_input file_upload govspeak_html_publication input intervention modal_dialogue search_with_autocomplete select skip_link step_by_step_nav step_by_step_nav_related summary_card summary_list table translation_nav warning_text].sort
  end

  def test_data
    {
      accordion: {
        items: [
          {
            heading: { text: "Heading 1" },
            content: { html: "<p>Content 1.</p>" },
          },
        ],
      },
      action_link: {
        text: "Get more info",
        href: "/coronavirus",
      },
      attachment: {
        attachment: { title: "Attachment", url: "https://gov.uk/attachment" },
        target: "_blank",
      },
      attachment_link: {
        attachment: { title: "Attachment", url: "https://gov.uk/attachment" },
      },
      back_link: {
        href: "/back-me",
      },
      big_number: {
        number: 500,
      },
      breadcrumbs: {
        breadcrumbs: [
          {
            title: "Section",
            url: "/section",
          },
        ],
      },
      button: {
        text: "Submit",
      },
      cards: {
        heading: "Topics",
        items: [
          {
            link: {
              text: "Benefits",
              path: "http://www.gov.uk",
            },
          },
        ],
      },
      character_count: {
        name: "character-count",
        textarea: {
          label: { text: "Can you provide more detail?" },
          name: "more-details",
        },
        data: {
          module: "character-count",
        },
        maxlength: "100",
      },
      chart: {
        chart_heading: "Page views chart",
        keys: (Date.new(2017, 12, 1)..Date.new(2017, 12, 12)).to_a,
        rows: [
          {
            label: "2017",
            values: [5, nil, nil, 119, 74, 117, 50, 119, 61, 110, 12, 21, 121, 67],
          },
          {
            label: "2018",
            values: [3, 8, 37, 435, 78, 4, 9, 61, 110, 12, 21, 121],
          },
        ],
      },
      chat_entry: {
        href: "/govuk-chat",
        heading_text: "Go to GOV.UK Chat",
        description_text: "Get answers to your business questions",
      },
      checkboxes: {
        name: "favourite_colour",
        items: [
          { label: "Red", value: "red" },
        ],
      },
      contents_list: {
        contents: [
          { href: "/one", text: "1. One" },
          { href: "#two", text: "2. Two" },
        ],
      },
      contextual_guidance: {
        html_for: "news-title",
        title: "Writing a news title",
        guidance_id: "news-title-guidance",
        content: sanitize("<p>The title must make clear what the content offers users</p>"),
      },
      contextual_sidebar: {
        content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "speech"),
      },
      copy_to_clipboard: {
        label: "Some label",
        copyable_content: "https://www.example.org",
        button_text: "Copy link",
      },
      details: {
        title: "Some title",
      },
      devolved_nations: {
        national_applicability: {
          england: {
            applicable: true,
          },
        },
      },
      document_list: {
        items: [
          {
            link: {
              text: "School behaviour and attendance: parental responsibility measures",
              path: "/government/publications/parental-responsibility-measures-for-behaviour-and-attendance",
            },
            metadata: {
              public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
              document_type: "Statutory guidance",
            },
          },
        ],
      },
      emergency_banner: {
        campaign_class: "notable-death",
        heading: "His Royal Highness Henry VIII",
        short_description: "",
        link: "",
        link_text: "",
        homepage: "",
      },
      error_alert: {
        message: "Foo",
      },
      error_message: {
        text: "Please enter your National Insurance number",
      },
      error_summary: {
        id: "error-summary-id",
        items: [
          {
            text: "Descriptive link to the question with an error",
            href: "#example-error-1",
          },
        ],
      },
      fieldset: {
        legend_text: "Do you have a passport?",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ad neque, maxime est ea laudantium totam fuga!",
      },
      file_upload: {
        label: { text: "Upload a file" },
        name: "file-upload",
      },
      glance_metric: {
        name: "Unique pageviews",
        figure: "167",
        measurement_explicit_label: "Million",
        measurement_display_label: "m",
        context: "This is in your top 10 items",
        period: "Apr 2018 to Mar 2018",
      },
      govspeak_html_publication: {
        content: "<h1>content</h1>".html_safe,
      },
      heading: {
        text: "Download documents",
      },
      hint: {
        text: "For example, ‘QQ 12 34 56 C’.",
      },
      image_card: {
        href: "#",
        image_src: "/moo.jpg",
        image_alt: "some meaningful alt text",
      },
      input: {
        label: { text: "What is your email address?" },
        name: "email-address",
      },
      intervention: {
        name: "test-campaign",
        suggestion_text: "You might be interested in",
        suggestion_link_text: "Travel abroad",
        suggestion_link_url: "/travel-abroad",
        dismiss_text: "Hide this suggestion",
      },
      label: {
        text: "National Insurance number",
        html_for: "id-that-matches-input",
      },
      lead_paragraph: {
        text: "This is a lead paragraph",
      },
      list: {
        items: ["Test item", "Another test item"],
      },
      metadata: {
        from: "<a href='/link'>Department</a>",
      },
      option_select: {
        key: "option_key",
        title: "Market sector",
        options_container_id: "list-of-sectors",
        options: [
          {
            value: "aerospace",
            label: "Aerospace",
            id: "aerospace",
          },
          {
            value: "value",
            label: "Label",
            id: "ID",
          },
        ],
      },
      organisation_logo: {
        organisation: { name: "Organisation name" },
      },
      previous_and_next_navigation: {
        class: "govuk-pagination",
        previous_page: {
          url: "previous-page",
          title: "Previous page",
          label: "1 of 3",
        },
      },
      panel: {
        title: "Application complete",
        description: "Description",
      },
      radio: {
        class: "govuk-form-group",
        name: "radio-group-one-item",
        items: [
          {
            value: "government-gateway",
            text: "Use Government Gateway",
          },
        ],
      },
      search_with_autocomplete: {
        source_url: "http://example.org/api/autocomplete",
        source_key: "suggestions",
      },
      secondary_navigation: {
        aria_label: "Document navigation",
        id: "nav_1234",
        items: [
          {
            label: "Nav item 1",
            href: "#",
            current: true,
          },
        ],
      },
      select: {
        id: "mydropdown",
        label: "My dropdown",
        options: [
          {
            value: "government-gateway",
            text: "Use Government Gateway",
          },
        ],
      },
      share_links: {
        links: [
          {
            href: "/facebook",
            text: "Facebook",
            icon: "facebook",
          },
          {
            href: "/twitter",
            text: "Twitter",
            hidden_text: "Tweet to",
            icon: "twitter",
          },
        ],
      },
      signup_link: {
        heading: "Stay up to date with GOV.UK",
        link_href: "/signup-link?topic=/coronavirus-taxon",
        link_text: "Sign up to get emails",
      },
      single_page_notification_button: {
        base_path: "/the-current-page",
      },
      step_by_step_nav: {
        class: "gem-c-step-nav",
        steps: [
          {
            title: "Step 1",
            optional: true,
            contents: [
              {
                type: "paragraph",
                text: "Step 1 paragraph",
              },
              {
                type: "list",
                contents: [
                  {
                    href: "/link1",
                    text: "Link 1.1.1",
                  },
                  {
                    href: "http://www.gov.uk",
                    text: "Link 1.1.2",
                    context: "£0 to £300",
                  },
                ],
              },
            ],
          },
        ],
      },
      step_by_step_nav_header: {
        class: "gem-c-step-nav-header",
        title: "This is my title",
      },
      step_by_step_nav_related: {
        class: "gem-c-step-nav-related",
        links: [
          {
            href: "/link1",
            text: "Link 1",
          },
        ],
      },
      subscription_links: {
        email_signup_link: "/email-signup",
      },
      success_alert: {
        message: "Foo",
      },
      summary_card: {
        title: "Title",
      },
      summary_list: {
        title: "Title, summary and body",
      },
      tabs: {
        class: "govuk-tabs",
        tabs: [
          {
            id: "tab1",
            label: "First section",
            content: "<p>Fusce at dictum tellus.</p>",
          },
          {
            id: "tab2",
            label: "Second section",
            content: "<p>Lorem ipsum dolor sit amet.</p>",
          },
        ],
      },
      textarea: {
        label: { text: "Can you provide more detail?" },
        name: "more-details",
      },
      title: {
        title: "Hello World",
      },
      translation_nav: {
        translations: [
          {
            locale: "en",
            base_path: "/en",
            text: "English",
            active: true,
          },
          {
            locale: "hi",
            base_path: "/hi",
            text: "हिंदी",
          },
        ],
      },
      warning_text: {
        text: "You can be fined up to £5,000 if you don’t register.",
      },
    }
  end

  xdescribe "margins" do
    it "are present on components that should accept a margin" do
      components.each do |component|
        @component = component

        data = test_data[component.to_sym] || {}
        data[:margin_bottom] = 1

        puts @component
        render_component(data) { "block" }
        component_class = ".gem-c-#{@component.gsub('_', '-')}"
        if test_data[component.to_sym] && test_data[component.to_sym][:class]
          component_class = ".#{test_data[component.to_sym][:class]}"
        end

        assert_select component_class << '.govuk-\!-margin-bottom-1'
      end
    end

    it "are not present on components that don't accept a margin" do
      components_that_dont_have_margin.each do |component|
        @component = component

        data = test_data[component.to_sym] || {}
        data[:margin_bottom] = 1

        puts @component
        render_component(data) { "block" }
        component_class = ".gem-c-#{@component.gsub('_', '-')}"
        if test_data[component.to_sym] && test_data[component.to_sym][:class]
          component_class = ".#{test_data[component.to_sym][:class]}"
        end

        assert_select component_class
        assert_select component_class << '.govuk-\!-margin-bottom-1', false
      end
    end
  end
end
