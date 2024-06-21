require "rails_helper"

describe "Document list", type: :view do
  def component_name
    "document_list"
  end

  it "renders nothing when no data is given" do
    assert_empty render_component({})
  end

  it "renders nothing when an empty array is passed in" do
    assert_empty render_component(items: [])
  end

  it "applies default margin to the component" do
    render_component(
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
    )

    assert_select '.gem-c-document-list.govuk-\!-margin-bottom-5'
  end

  it "applies margin to the component" do
    render_component(
      margin_bottom: 6,
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
    )

    assert_select '.gem-c-document-list.govuk-\!-margin-bottom-6'
  end

  it "renders a document list correctly" do
    render_component(
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
        {
          link: {
            text: "Become an apprentice",
            path: "/become-an-apprentice",
            description: "Becoming an apprentice - what to expect",
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-07-19 15:01:48 +0000"),
            document_type: "Statutory guidance",
          },
        },
      ],
    )
    div = ".gem-c-document-list__item-title"
    attribute = ".gem-c-document-list__attribute"

    assert_select "#{div} a[href='/government/publications/parental-responsibility-measures-for-behaviour-and-attendance']", text: "School behaviour and attendance: parental responsibility measures"
    assert_select "#{attribute} time", text: "5 January 2017"
    assert_select "#{attribute} time[datetime='2017-01-05T14:50:33Z']"
    assert_select ".gem-c-document-list__attribute", text: "Statutory guidance"

    assert_select "#{div} a[href='/become-an-apprentice']", text: "Become an apprentice"
    assert_select ".gem-c-document-list__item-description", text: "Becoming an apprentice - what to expect"
    assert_select "#{attribute} time", text: "19 July 2017"
    assert_select "#{attribute} time[datetime='2017-07-19T15:01:48Z']"
  end

  it "renders a document list item even when public_updated_at is nil" do
    render_component(
      items: [
        {
          link: {
            text: "Some news stories are timeless",
            path: "/timeless-news",
          },
          metadata: {
            document_type: "News Story",
            public_updated_at: nil,
          },
        },
      ],
    )

    assert_select ".gem-c-document-list__item-title a[href='/timeless-news']", text: "Some news stories are timeless"
    assert_select ".gem-c-document-list__attribute", text: "News Story"
  end

  it "renders a document list with link tracking" do
    render_component(
      items: [
        {
          link: {
            text: "Link 1",
            path: "/link1",
            data_attributes: {
              an_attribute: "some_value1",
            },
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance",
          },
        },
        {
          link: {
            text: "Link 2",
            path: "/link2",
            data_attributes: {
              an_attribute: "some_value2",
            },
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-07-19 15:01:48 +0000"),
            document_type: "Statutory guidance",
          },
        },
      ],
    )

    a = ".gem-c-document-list__item-title a"

    assert_select "#{a}[href='/link1']", text: "Link 1"
    assert_select "#{a}[data-an-attribute='some_value1']", text: "Link 1"

    assert_select "#{a}[href='/link2']", text: "Link 2"
    assert_select "#{a}[data-an-attribute='some_value2']", text: "Link 2"
  end

  it "renders a document list without links" do
    render_component(
      items: [
        {
          link: {
            text: "School behaviour and attendance: parental responsibility measures",
          },
        },
        {
          link: {
            text: "Become an apprentice",
          },
        },
      ],
    )

    div = "div.gem-c-document-list__item-title"

    assert_select "#{div}:first-of-type", text: "School behaviour and attendance: parental responsibility measures"
    assert_select "#{div}:last-of-type", text: "Become an apprentice"
  end

  it "adds branding correctly" do
    render_component(
      brand: "attorney-generals-office",
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
    )
    assert_select ".gem-c-document-list__item.brand--attorney-generals-office"
    assert_select ".gem-c-document-list .gem-c-document-list__item-title .brand__color"
  end

  it "does not wrap link in heading element if no description or metadata provided" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
        },
      ],
    )

    assert_select ".gem-c-document-list__item h3", false, "Element should not be wrapped in heading if it is not acting as a heading for any other content"
    assert_select '.gem-c-document-list__item a[href="/link/path"]', text: "Link Title"
  end

  it "renders the item title with context when provided" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
            context: "some context",
          },
        },
      ],
    )

    assert_select '.gem-c-document-list__item-title--context[href="/link/path"]', text: "Link Title"
    assert_select ".gem-c-document-list__item-context", text: "some context"
  end

  it "adds subtext" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
          subtext: "This is some subtext",
        },
      ],
    )

    assert_select ".gem-c-document-list__subtext", text: "This is some subtext"
  end

  it "removes underline from links" do
    render_component(
      remove_underline: true,
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
        },
      ],
    )

    assert_select ".gem-c-document-list.gem-c-document-list--no-underline"
  end

  it "removes the top border from list items" do
    render_component(
      remove_top_border: true,
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
        },
      ],
    )

    assert_select ".gem-c-document-list.gem-c-document-list--no-top-border"
  end

  it "removes the top border from the first list item" do
    render_component(
      remove_top_border_from_first_child: true,
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
        },
      ],
    )

    assert_select ".gem-c-document-list.gem-c-document-list--no-top-border-first-child"
  end

  it "highlights items" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
          highlight: true,
          highlight_text: "Most relevant result",
        },
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          },
          highlight: true,
        },
      ],
    )

    assert_select ".gem-c-document-list__item.gem-c-document-list__item--highlight", count: 2
    assert_select ".gem-c-document-list__item:nth-child(1) .gem-c-document-list__highlight-text", text: "Most relevant result"
    assert_select ".gem-c-document-list__item:nth-child(2) .gem-c-document-list__highlight-text", false
  end

  it "renders document parts if available" do
    render_component(
      items: [
        {
          link: {
            text: "Universal credit",
            path: "/universal-credit",
            description: "Universal Credit is replacing 6 other benefits with a single monthly payment if you are out of work or on a low income - eligibility, how to prepare",
          },
          parts: [
            {
              link: {
                text: "What universal credit is",
                path: "/universal-credit/what-it-is",
                description: "Universal Credit is a payment to help with your living costs. It’s paid monthly - or twice a month for some people in Scotland.",
              },
            },
            {
              link: {
                text: "Elegibility",
                path: "/universal-credit/eligibility",
                description: "You may be able to get Universal Credit if: you’re on a low income or out...",
              },
            },
          ],
        },
      ],
    )

    assert_select ".gem-c-document-list__item .gem-c-document-list-child", count: 2
  end

  it "adds branding to document part link correctly" do
    render_component(
      brand: "attorney-generals-office",
      items: [
        {
          link: {
            text: "Universal credit",
            path: "/universal-credit",
            description: "Universal Credit is replacing 6 other benefits with a single monthly payment if you are out of work or on a low income - eligibility, how to prepare",
          },
          parts: [
            {
              link: {
                text: "What universal credit is",
                path: "/universal-credit/what-it-is",
                description: "Universal Credit is a payment to help with your living costs. It’s paid monthly - or twice a month for some people in Scotland.",
              },
            },
          ],
        },
      ],
    )

    assert_select ".gem-c-document-list .gem-c-document-list-child__link.brand__color"
  end

  it "renders document part without link" do
    render_component(
      items: [
        {
          link: {
            text: "Universal credit",
            path: "/universal-credit",
            description: "Universal Credit is replacing 6 other benefits with a single monthly payment if you are out of work or on a low income - eligibility, how to prepare",
          },
          parts: [
            {
              link: {
                text: "Criteria",
                description: "no url provided, just text",
              },
            },
          ],
        },
      ],
    )

    assert_select ".gem-c-document-list span.gem-c-document-list-child__heading", text: "Criteria"
  end

  it "renders document part description" do
    render_component(
      items: [
        {
          link: {
            text: "Universal credit",
            path: "/universal-credit",
            description: "Universal Credit is replacing 6 other benefits with a single monthly payment if you are out of work or on a low income - eligibility, how to prepare",
          },
          parts: [
            {
              link: {
                text: "What universal credit is",
                path: "/universal-credit/what-it-is",
                description: "Universal Credit is a payment to help with your living costs. It’s paid monthly - or twice a month for some people in Scotland.",
              },
            },
          ],
        },
      ],
    )

    assert_select ".gem-c-document-list__item .gem-c-document-list-child__description", text: "Universal Credit is a payment to help with your living costs. It’s paid monthly - or twice a month for some people in Scotland."
  end

  it "adds lang attributes to elements only when locale is passed" do
    render_component(
      items: [
        {
          link: {
            text: "Tryloywder Uwch Staff Ysgrifennydd Gwladol Cymru Ionawr-Mawrth 2020",
            path: "/government/publications/office-of-the-secretary-of-state-for-wales-senior-staff-transparency-january-march-2020",
            locale: "cy",
          },
          metadata: {
            will_be_translated: "Data tryloywder",
            will_not_be_translated: "English text",
            locale: {
              will_be_translated: "cy",
            },
          },
        },
      ],
    )

    assert_select ".gem-c-document-list__item-title a[lang=\"cy\"]", text: "Tryloywder Uwch Staff Ysgrifennydd Gwladol Cymru Ionawr-Mawrth 2020"
    assert_select ".gem-c-document-list__attribute[lang=\"cy\"]", text: "Data tryloywder"
    assert_select ".gem-c-document-list__attribute:not([lang=\"cy\"])", text: "English text"
  end

  it "adds rel attribute to elements only when rel is passed" do
    render_component(
      items: [
        {
          link: {
            text: "Report Fraud",
            path: "https://www.actionfraud.police.uk/contact-us",
            rel: "external",
          },
        },
        {
          link: {
            text: "Child Benefit",
            path: "/contact-child-benefit-office",
            rel: "bad value",
          },
        },
      ],
    )

    link = ".govuk-link"

    assert_select "#{link}[href=\"https://www.actionfraud.police.uk/contact-us\"][rel=\"external\"]", text: "Report Fraud"
    assert_select "#{link}[href=\"/contact-child-benefit-office\"]:not([rel])", text: "Child Benefit"
  end

  it "has GA4 tracking enabled" do
    render_component(
      items: [
        {
          link: {
            text: "Report Fraud",
            path: "https://www.actionfraud.police.uk/contact-us",
            rel: "external",
          },
        },
      ],
    )

    assert_select "ul[data-module=ga4-link-tracker]"
    assert_select "ul[data-ga4-track-links-only]"
    assert_select "ul[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"document list\"}']"
  end

  it "can merge extra GA4 values into the existing JSON" do
    render_component(
      items: [
        {
          link: {
            text: "Report Fraud",
            path: "https://www.actionfraud.police.uk/contact-us",
            rel: "external",
          },
        },
      ],
      ga4_extra_data: {
        section: "This is the section",
        type: "I have overwritten the default value",
      },
    )

    assert_select "ul[data-module=ga4-link-tracker]"
    assert_select "ul[data-ga4-track-links-only]"
    assert_select "ul[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"I have overwritten the default value\",\"section\":\"This is the section\"}']"
  end

  it "can have GA4 tracking disabled" do
    render_component(
      disable_ga4: true,
      items: [
        {
          link: {
            text: "Report Fraud",
            path: "https://www.actionfraud.police.uk/contact-us",
            rel: "external",
          },
        },
      ],
    )

    assert_select "ul[data-module=ga4-link-tracker]", false
    assert_select "ul[data-ga4-track-links-only]", false
    assert_select "ul[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"document list\"}']", false
  end
end
