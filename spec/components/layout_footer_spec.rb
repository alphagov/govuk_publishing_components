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
    render_component(meta: { items: [{ href: "/help", text: "Help" }] })

    assert_select ".govuk-footer__meta .govuk-footer__link[href='/help']", text: "Help"
  end

  it "renders the footer with navigation" do
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
    )

    assert_select ".govuk-footer__navigation .govuk-footer__heading", text: "Services and information"
    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-2 .govuk-footer__link[href='/browse/benefits']", text: "Benefits"
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


  it 'renders the footer with a top border' do
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
              attributes: { target: "_blank" }
            }
          ]
        }
      ]
    )

    assert_select '.gem-c-layout-footer--border'
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
end
