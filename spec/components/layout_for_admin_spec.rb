require "rails_helper"

describe "Layout for admin", type: :view do
  def component_name
    "layout_for_admin"
  end

  it "adds the <title> tag" do
    render_component(browser_title: "Hello, admin page", environment: "production")

    assert_select "title", visible: false, text: "Hello, admin page - GOV.UK Publishing"
  end

  it "adds the robots metatag" do
    render_component(browser_title: "Hello, admin page", environment: "production")

    assert_select 'meta[name="robots"][content="noindex,nofollow,noimageindex"]', visible: false
  end

  it "can receive a custom js filename" do
    allow_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("govuk_publishing_components/vendor/modernizr")
    expect_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("admin").once

    render_component(
      browser_title: "Hello, admin page",
      environment: "production",
      js_filename: "admin",
    )
  end

  it "can receive a custom css filename" do
    expect_any_instance_of(ActionView::Base).to receive(:stylesheet_link_tag).with("admin", media: "all")

    render_component(
      browser_title: "Hello, admin page",
      environment: "production",
      css_filename: "admin",
    )
  end
end
