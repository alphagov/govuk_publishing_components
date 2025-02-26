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
    expect_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("admin").once

    render_component(
      browser_title: "Hello, admin page",
      environment: "production",
      js_filename: "admin",
    )
  end

  context "loads a separate bundle for es6 components" do
    before "enable loading of separate es6 components bundle" do
      GovukPublishingComponents.configure do |config|
        config.use_es6_components = true
      end
    end

    after "disable loading of separate es6 components bundle" do
      GovukPublishingComponents.configure do |config|
        config.use_es6_components = false
      end
    end

    it "can receive a custom js filename for es6" do
      allow_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("application")
      expect_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("es6-bundle", { type: "module" }).once

      render_component(
        browser_title: "Hello, admin page",
        environment: "production",
        js_module_filename: "es6-bundle",
      )
    end

    it "can use the default filename for es6 components" do
      allow_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("application")
      expect_any_instance_of(ActionView::Base).to receive(:javascript_include_tag).with("es6-components", { type: "module" }).once

      render_component(
        browser_title: "Hello, admin page",
        environment: "production",
      )
    end
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
