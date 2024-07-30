require "rails_helper"

describe "Accordion", type: :view do
  def component_name
    "accordion"
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end

  it "places the title and content correctly" do
    test_data = {
      id: "test-for-heading-and-content",
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
        },
        {
          heading: { text: "Heading 3" },
          content: { html: "<p>Content 3.</p>" },
        },
      ],
    }

    render_component(test_data)

    assert_select ".govuk-accordion__section-button", text: "Heading 1", count: 1
    assert_select ".govuk-accordion__section-content", text: /Content 1./, count: 1

    assert_select ".govuk-accordion__section-button", text: "Heading 2", count: 1
    assert_select ".govuk-accordion__section-content", text: /Content 2./, count: 1

    assert_select ".govuk-accordion__section-button", text: "Heading 3", count: 1
    assert_select ".govuk-accordion__section-content", text: /Content 3./, count: 1
  end

  it "uses the correct id, and interpolates it correctly" do
    test_data = {
      id: "test-for-id",
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          summary: { text: "Summary 2." },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }

    render_component(test_data)

    assert_select "#test-for-id", count: 1
    assert_select "[id^='test-for-id-heading-']", count: 2
    assert_select "[id^='test-for-id-summary-']", count: 2
    assert_select "[id^='test-for-id-content-']", count: 2
  end

  it "an id is created when no id is set" do
    test_data = {
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }

    render_component(test_data)

    # Default id is `default-id-{XXXXXXXX}`. This is using CSS selectors
    # to check the start and the end of the id.
    assert_select "[id^='default-id-']", count: 4

    assert_select "[id$='-heading-1']", count: 1
    assert_select "[id$='-summary-1']", count: 1
    assert_select "[id$='-content-1']", count: 1
  end

  it "the heading level is changed when heading_level is set" do
    test_data = {
      id: "heading-level-change",
      heading_level: 5,
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }
    render_component(test_data)
    assert_select "h5", count: 1
  end

  it "sets a default margin bottom" do
    test_data = {
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }

    render_component(test_data)
    assert_select '.gem-c-accordion.govuk-\!-margin-bottom-6'
  end

  it "sets a custom margin bottom" do
    test_data = {
      margin_bottom: 0,
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }

    render_component(test_data)
    assert_select '.gem-c-accordion.govuk-\!-margin-bottom-0'
  end

  it "default heading level is used when heading_level is not set" do
    test_data = {
      id: "heading-level-default",
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }

    render_component(test_data)
    assert_select "h2", count: 1
  end

  it "data attribute is present when required" do
    test_data = {
      id: "test-for-data-attributes",
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
          data_attributes: { gtm: "google-tag-manager" },
        },
        {
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
          data_attributes: { gtm: "google-tag-manager" },
        },
      ],
    }

    render_component(test_data)

    assert_select "[data-gtm]", count: 2
    assert_select "[data-gtm='google-tag-manager']", count: 2
  end

  it "ga4 data attributes are present by default" do
    test_data = {
      id: "test-for-data-attributes",
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }

    render_component(test_data)

    assert_select ".govuk-accordion[data-ga4-expandable]"
    assert_select '.govuk-accordion[data-module="govuk-accordion gem-accordion ga4-event-tracker"]'
    assert_select '.govuk-accordion__section-heading[data-ga4-event=\'{"event_name":"select_content","type":"accordion","text":"Heading 1","index_section":1,"index_section_count":2}\']'
    assert_select '.govuk-accordion__section-heading[data-ga4-event=\'{"event_name":"select_content","type":"accordion","text":"Heading 2","index_section":2,"index_section_count":2}\']'
  end

  it "ga4 can be disabled" do
    test_data = {
      id: "test-for-data-attributes",
      disable_ga4: true,
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }

    render_component(test_data)

    assert_select ".govuk-accordion[data-ga4-expandable]", false
    assert_select '.govuk-accordion[data-module="govuk-accordion gem-accordion"]'
    assert_select '.govuk-accordion[data-module="govuk-accordion gem-accordion ga4-event-tracker"]', false
    assert_select ".govuk-accordion__section-heading[data-ga4-event]", false
  end

  it '`data-module="govuk-accordion"` attribute is present when no custom data attributes given' do
    test_data = {
      id: "test-for-module-data-attributes",
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }
    render_component(test_data)
    assert_select "[data-module='govuk-accordion gem-accordion ga4-event-tracker']", count: 1
  end

  it '`data-module="govuk-accordion"` attribute is present when custom data attributes given' do
    test_data = {
      id: "test-for-module-data-attributes",
      data_attributes: {
        accordion: "first",
      },
      items: [
        {
          data_attributes: {
            gtm: "this-is-gtm",
          },
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          data_attributes: {
            gtm: "this-is-a-second-gtm",
          },
          heading: { text: "Heading 2" },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }
    render_component(test_data)
    assert_select "[data-module='govuk-accordion gem-accordion ga4-event-tracker']", count: 1
    assert_select "[data-gtm]", count: 2
    assert_select "[data-gtm='this-is-gtm']", count: 1
    assert_select "[data-gtm='this-is-a-second-gtm']", count: 1
    assert_select "[data-accordion='first']", count: 1
  end

  it "allows a custom data module to be included" do
    test_data = {
      id: "test-for-module-data-attributes",
      data_attributes: {
        module: "ga4-link-tracker",
      },
      items: [
        {
          heading: { text: "Heading 1" },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }
    render_component(test_data)
    assert_select "[data-module='ga4-link-tracker govuk-accordion gem-accordion ga4-event-tracker']", count: 1
  end

  it "section has class added when expanded flag is present" do
    test_data = {
      id: "test-for-expanded-layout",
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
          expanded: true,
        },
        {
          heading: { text: "Heading 2" },
          summary: { text: "Summary 2." },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }
    render_component(test_data)
    assert_select ".govuk-accordion__section.govuk-accordion__section--expanded", count: 1
    assert_select ".govuk-accordion__section", count: 2
  end

  it "adds id to heading when attribute passed" do
    test_data = {
      anchor_navigation: true,
      items: [
        {
          heading: { text: "Heading 1", id: "heading-with-id" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
        {
          heading: { text: "Heading 2" },
          summary: { text: "Summary 2." },
          content: { html: "<p>Content 2.</p>" },
        },
      ],
    }
    render_component(test_data)

    assert_select ".govuk-accordion__section-heading", count: 2
    assert_select ".govuk-accordion__section-heading#heading-with-id", count: 1
    assert_select ".govuk-accordion__section-heading:not([id])", count: 1
  end

  it "loop index starts at one, not zero (thanks Nunjucks.)" do
    test_data = {
      id: "thanks-nunjucks",
      items: [
        {
          heading: { text: "Heading 1" },
          summary: { text: "Summary 1." },
          content: { html: "<p>Content 1.</p>" },
        },
      ],
    }

    render_component(test_data)

    assert_select "#thanks-nunjucks-heading-1", count: 1
    assert_select "#thanks-nunjucks-summary-1", count: 1
    assert_select "#thanks-nunjucks-content-1", count: 1
  end
end
