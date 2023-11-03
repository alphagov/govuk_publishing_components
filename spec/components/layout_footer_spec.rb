require "rails_helper"

describe "Layout footer", type: :view do
  def component_name
    "layout_footer"
  end

  it "renders the footer" do
    render_component({})
    assert_select ".govuk-footer"
  end

  it "renders the footer with meta links" do
    render_component(
      meta: {
        items: [
          {
            href: "/help",
            text: "Help",
          },
        ],
      },
    )

    assert_select ".govuk-footer__meta .govuk-footer__link[href='http://www.dev.gov.uk/help']", text: "Help"
  end

  it "renders the footer with navigation with multiple links" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
            },
            {
              href: "/browse/births-deaths-marriages",
              text: "Births, deaths, marriages and care",
            },
          ],
        },
      ],
    )

    assert_select ".govuk-footer__navigation .govuk-footer__heading", text: "Services and information"
    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-2 .govuk-footer__link[href='http://www.dev.gov.uk/browse/benefits']", text: "Benefits"
  end

  it "renders the footer with navigation with one link" do
    render_component(
      navigation: [
        {
          title: "Coronavirus (COVID-19)",
          columns: 3,
          items: [
            {
              href: "/coronavirus",
              text: "Coronavirus (COVID-19): guidance and support",
            },
          ],
        },
      ],
    )

    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-3", false
    assert_select ".govuk-footer__navigation .govuk-footer__heading", text: "Coronavirus (COVID-19)"
    assert_select ".govuk-footer__navigation .govuk-footer__link[href='http://www.dev.gov.uk/coronavirus']", text: "Coronavirus (COVID-19): guidance and support"
  end

  it "renders the footer with attributes" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
              attributes: { title: "A title" },
            },
          ],
        },
      ],
    )

    assert_select "a" do |link|
      expect(link.attr("class").to_s).to eq "govuk-footer__link"
      expect(link.attr("title").to_s).to eq "A title"
    end
  end

  it "renders the footer with attributes but will set the rel attribute if target is blank" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
              attributes: { target: "_blank" },
            },
          ],
        },
      ],
    )

    assert_select "a" do |link|
      expect(link.attr("class").to_s).to eq "govuk-footer__link"
      expect(link.attr("target").to_s).to eq "_blank"
      expect(link.attr("rel").to_s).to eq "noopener"
    end
  end

  it "renders the footer meta links with attributes" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
            },
          ],
        },
      ],
      meta: {
        items: [
          {
            href: "/cymraeg",
            text: "Rhestr o Wasanaethau Cymraeg",
            attributes: {
              lang: "cy",
              hreflang: "cy",
            },
          },
        ],
      },
    )

    assert_select ".govuk-footer__meta-item a" do |link|
      expect(link.attr("class").to_s).to eq "govuk-footer__link"
      expect(link.attr("lang").to_s).to eq "cy"
      expect(link.attr("hreflang").to_s).to eq "cy"
    end
  end

  it "renders the footer with a top border" do
    render_component(
      with_border: true,
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
              attributes: { target: "_blank" },
            },
          ],
        },
      ],
    )

    assert_select ".gem-c-layout-footer--border"
  end

  it "renders the footer meta link with attributes but will set the rel attribute if target is blank" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
            },
          ],
        },
      ],
      meta: {
        items: [
          {
            href: "/guidance/keeping-a-pet-pig-or-micropig",
            text: "Keeping a pet pig or 'micropig'",
            attributes: {
              target: "_blank",
            },
          },
        ],
      },
    )

    assert_select ".govuk-footer__meta-item a" do |link|
      expect(link.attr("class").to_s).to eq "govuk-footer__link"
      expect(link.attr("target").to_s).to eq "_blank"
      expect(link.attr("rel").to_s).to eq "noopener"
    end
  end

  it "adds ga4-link-tracker to the data-module" do
    render_component(navigation: [])
    assert_select ".govuk-footer" do |footer|
      expect(footer.attr("data-module").to_s).to eq "ga4-link-tracker"
    end
  end

  it "adds ga4 tracking to navigation links" do
    render_component(
      navigation: [
        {
          title: "Section 1",
          columns: 2,
          items: [
            {
              href: "/link1",
              text: "Benefits",
            },
            {
              href: "/link2",
              text: "Births, deaths, marriages and care",
            },
          ],
        },
        {
          title: "Section 2",
          columns: 2,
          items: [
            {
              href: "/link3",
              text: "Benefits",
            },
            {
              href: "/link4",
              text: "Births, deaths, marriages and care",
            },
          ],
        },
      ],
    )

    # Note that in these tests, the index_section_count will always be 2 higher than the amount
    # in the above render_component, due to the OGL and Crown Copyright link always being rendered by default.
    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link1']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"1","index_section_count":"4","index_total":"2","section":"Section 1"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link2']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"1","index_section_count":"4","index_total":"2","section":"Section 1"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link3']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"2","index_section_count":"4","index_total":"2","section":"Section 2"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link4']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"2","index_section_count":"4","index_total":"2","section":"Section 2"}'
    end
  end

  it "adds ga4 tracking to meta links" do
    render_component(
      meta: {
        items: [
          {
            href: "/link1",
            text: "Link 1",
          },
          {
            href: "/link2",
            text: "Link 2",
          },
        ],
      },
    )

    # Note that in these tests, the index_total and index_section_count will always be 2 higher than the amount
    # in the above render_component, due to the OGL and Crown Copyright link always being rendered by default.
    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link1']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"1","index_section_count":"3","index_total":"2","section":"Support links"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link2']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"1","index_section_count":"3","index_total":"2","section":"Support links"}'
    end
  end

  it "adds ga4 tracking to the Open Government Licence link with no navigation or meta links" do
    render_component(navigation: [])
    assert_select ".govuk-footer__licence-description" do |link_parent|
      expect(link_parent.attr("data-ga4-track-links-only").to_s).to eq ""
      expect(link_parent.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","section":"Licence","index_section":"1","index_link":"1","index_section_count":"2","text":"Open Government Licence v3.0","index_total":"1","type":"footer"}'
    end
  end

  it "adds ga4 tracking to the Crown Copyright link with no navigation or meta links" do
    render_component(navigation: [])
    assert_select ".govuk-footer__meta-item[data-ga4-link]" do |link_parent|
      expect(link_parent.attr("data-ga4-track-links-only").to_s).to eq ""
      expect(link_parent.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","section":"Copyright","index_section":"2","index_link":"1","index_section_count":"2","text":"© Crown copyright","index_total":"1","type":"footer"}'
    end
  end

  it "adds ga4 tracking to a fully populated footer" do
    render_component(
      navigation: [
        {
          title: "Section 1",
          columns: 2,
          items: [
            {
              href: "/link1",
              text: "Benefits",
            },
            {
              href: "/link2",
              text: "Births, deaths, marriages and care",
            },
          ],
        },
        {
          title: "Section 2",
          columns: 2,
          items: [
            {
              href: "/link3",
              text: "Benefits",
            },
            {
              href: "/link4",
              text: "Births, deaths, marriages and care",
            },
          ],
        },
      ],
      meta: {
        items: [
          {
            href: "/link5",
            text: "Link 5",
          },
          {
            href: "/link6",
            text: "Link 6",
          },
          {
            href: "/link7",
            text: "Link 7",
          },
        ],
      },
    )

    # Note that in these tests, the index_section_count will always be 2 higher than the amount
    # in the above render_component, due to the OGL and Crown Copyright link always being rendered by default.

    # Navigation links

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link1']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"1","index_section_count":"5","index_total":"2","section":"Section 1"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link2']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"1","index_section_count":"5","index_total":"2","section":"Section 1"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link3']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"2","index_section_count":"5","index_total":"2","section":"Section 2"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link4']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"2","index_section_count":"5","index_total":"2","section":"Section 2"}'
    end

    # Meta links
    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link5']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"1","index_section":"3","index_section_count":"5","index_total":"3","section":"Support links"}'
    end

    assert_select ".govuk-footer__link[href='http://www.dev.gov.uk/link6']" do |link|
      expect(link.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"footer","index_link":"2","index_section":"3","index_section_count":"5","index_total":"3","section":"Support links"}'
    end

    # OGL link
    assert_select ".govuk-footer__licence-description" do |link_parent|
      expect(link_parent.attr("data-ga4-track-links-only").to_s).to eq ""
      expect(link_parent.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","section":"Licence","index_section":"4","index_link":"1","index_section_count":"5","text":"Open Government Licence v3.0","index_total":"1","type":"footer"}'
    end

    # Crown Copyright link
    assert_select ".govuk-footer__meta-item[data-ga4-link]" do |link_parent|
      expect(link_parent.attr("data-ga4-track-links-only").to_s).to eq ""
      expect(link_parent.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","section":"Copyright","index_section":"5","index_link":"1","index_section_count":"5","text":"© Crown copyright","index_total":"1","type":"footer"}'
    end
  end
end
