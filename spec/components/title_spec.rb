require "rails_helper"

describe "Title", type: :view do
  def component_name
    "title"
  end

  it "error if no title" do
    assert_raises do
      render_component({})
    end
  end

  it "title text appears" do
    render_component(title: "Hello World")
    assert_select ".gem-c-title__text", text: "Hello World"
  end

  it "title context appears" do
    render_component(title: "Hello World", context: "Format")
    assert_select ".govuk-caption-xl", text: "Format"
  end

  it "applies context language if supplied to a context string" do
    render_component(title: "Bonjour Monde", context: "hello", context_locale: "en")
    assert_select ".govuk-caption-xl[lang='en']"
  end

  it "applies title length if supplied" do
    render_component(title: "Hello World", context: "format", average_title_length: "long")
    assert_select ".gem-c-title .govuk-heading-l", text: "Hello World"
  end

  it "applies the inverse flag if supplied" do
    render_component(title: "Hello World", inverse: true)
    assert_select ".gem-c-title--inverse", text: "Hello World"
  end

  it "has a default margin bottom of 8" do
    render_component(title: "Margin default")
    assert_select '.gem-c-title.govuk-\!-margin-bottom-8'
  end

  it "applies a margin bottom of 0" do
    render_component(title: "Margin 0", margin_bottom: 0)
    assert_select '.gem-c-title.govuk-\!-margin-bottom-0'
  end

  it "applies a valid margin bottom" do
    render_component(title: "Margin 4", margin_bottom: 4)
    assert_select '.gem-c-title.govuk-\!-margin-bottom-4'
  end

  it "ignores an invalid margin bottom" do
    render_component(title: "Margin wat", margin_bottom: 17)
    assert_select "[class='^=govuk-\!-margin-bottom-']", false
  end

  it "has a default margin top of 8" do
    render_component(title: "Margin default")
    assert_select '.gem-c-title.govuk-\!-margin-top-8'
  end

  it "applies a margin top of 0" do
    render_component(title: "Margin 0", margin_top: 0)
    assert_select '.gem-c-title.govuk-\!-margin-top-0'
  end

  it "applies a valid margin top" do
    render_component(title: "Margin 4", margin_top: 4)
    assert_select '.gem-c-title.govuk-\!-margin-top-4'
  end

  it "ignores an invalid margin top" do
    render_component(title: "Margin wat", margin_top: 17)
    assert_select "[class='^=govuk-\!-margin-top-']", false
  end

  it "applies context language if supplied to a context link" do
    render_component(title: "Bonjour", context: "Format", context_locale: "en")
    assert_select ".govuk-caption-xl[lang='en']"
  end
end
