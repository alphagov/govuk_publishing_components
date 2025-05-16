require "rails_helper"

describe "Cross service header", type: :view do
  def component_name
    "cross_service_header"
  end

  def one_login_navigation_items
    {
      one_login_home: {
        href: "#",
      },
      one_login_sign_out: {
        href: "#",
        text: "Sign out",
      },
    }
  end

  def with_data_attributes
    one_login_navigation_items.transform_values do |value|
      value.merge({
        data: {
          module: "explicit-cross-domain-links",
        },
      })
    end
  end

  it "renders the One Login service header" do
    render_component({ show_account_layout: true,
                       one_login_navigation_items:,
                       service_name: "GOV.UK email subscriptions" })

    assert_select ".govuk-service-navigation__service-name", text: "GOV.UK email subscriptions"
    assert_select ".gem-c-cross-service-header__button-content", text: "One Login"
    assert_select ".gem-c-one-login-header__nav__list-item:nth-child(1) [href]", text: "GOV.UK One Login"
    assert_select ".gem-c-one-login-header__nav__list-item:nth-child(2) [href]", text: "Sign out"
  end

  it "renders the One Login service header with data attributes" do
    render_component({ show_account_layout: true,
                       one_login_navigation_items: with_data_attributes,
                       service_name: "GOV.UK email subscriptions" })

    assert_select ".gem-c-one-login-header__nav__list-item:nth-child(1) [data-module=\'explicit-cross-domain-links\']", text: "GOV.UK One Login"
    assert_select ".gem-c-one-login-header__nav__list-item:nth-child(2) [data-module=\'explicit-cross-domain-links\']", text: "Sign out"
  end

  it "renders the One Login service header and service navigation" do
    service_navigation_items = [
      { text: "Example link 1", href: "#" },
      { text: "Example link 2", href: "#" },
      { text: "Example link 3", href: "#" },
    ]
    render_component({ show_account_layout: true,
                       one_login_navigation_items:,
                       service_name: "GOV.UK email subscriptions",
                       service_navigation_items: })

    assert_select ".govuk-service-navigation__list"
    assert_select ".govuk-service-navigation__item", count: 3
  end
end
