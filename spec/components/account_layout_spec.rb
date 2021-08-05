require "rails_helper"

describe "Account layout", type: :view do
  def component_name
    "account_layout"
  end

  it "accepts a block" do
    render "govuk_publishing_components/components/#{component_name}" do
      "content-via-block"
    end
    expect(rendered).to include("content-via-block")
  end

  it "renders content in an account layout wrapper" do
    render "govuk_publishing_components/components/#{component_name}" do
      "<h1>content</h1>".html_safe
    end

    assert_select ".gem-c-account-layout h1", text: "content"
  end

  it "renders with a phase banner by default" do
    render_component({})

    assert_select ".gem-c-account-layout .gem-c-phase-banner"
  end

  it "renders with an account nav by default" do
    render_component({})

    assert_select ".gem-c-account-layout .gem-c-account-layout-nav"
  end

  it "renders with a feedback prompt by default" do
    render_component({})

    assert_select ".gem-c-account-layout .gem-c-account-layout-feedback-footer h2", text: "Help improve GOV.UK accounts"
  end

  it "can render without an account nav" do
    render_component(hide_account_navigation: true)

    # both the nav and its .govuk-grid-column-one-third container should not be present
    assert_select ".gem-c-account-layout .govuk-main-wrapper > .govuk-grid-column-one-third", false
    assert_select ".gem-c-account-layout .gem-c-account-layout-nav", false
  end

  it "can render without a phase banner" do
    render_component(hide_phase_banner: true)

    assert_select ".gem-c-account-layout .gem-c-phase-banner", false
  end

  it "can render without a feedback prompt" do
    render_component(hide_feedback_footer: true)

    assert_select ".gem-c-account-layout .gem-c-account-layout-feedback-footer", false
  end

  it "does not indicate an active navigation item by default" do
    render_component({})

    assert_select ".gem-c-account-layout-nav li.gem-c-account-layout-menu__item.gem-c-account-layout-menu__item--current a[aria-current=page]", false
  end

  it "indicates the active navigation item if the location parameter is passed" do
    render_component(location: "manage")

    assert_select ".gem-c-account-layout-nav li.gem-c-account-layout-menu__item.gem-c-account-layout-menu__item--current a[aria-current=page]", text: "Manage your account"
  end

  it "can render with additional navigational content before the <main> landmark" do
    render "govuk_publishing_components/components/#{component_name}", before_main: "<a id='testing' href>before</a>".html_safe do
      "<h1>content</h1>".html_safe
    end

    assert_select "a#testing + main"
    assert_select "a#testing", text: "before"
  end
end
