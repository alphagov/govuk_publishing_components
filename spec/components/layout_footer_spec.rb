require 'rails_helper'

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
              text: "Benefits"
            }
          ]
        }
      ]
    )

    assert_select ".govuk-footer__navigation .govuk-footer__heading", text: "Services and information"
    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-2 .govuk-footer__link[href='/browse/benefits']", text: "Benefits"
  end

  it "renders links that can either spawn a new window or use the same window" do
    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
              target: "_blank"
            }
          ]
        }
      ]
    )
    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-2 .govuk-footer__link[target='_blank']", text: "Benefits"

    render_component(
      navigation: [
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits"
            }
          ]
        }
      ]
    )
    assert_select ".govuk-footer__navigation .govuk-footer__list--columns-2 .govuk-footer__link[target='']", text: "Benefits"
  end
end
