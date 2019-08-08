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
    assert_select ".gem-c-title__context", text: "Format"
  end

  it "title context link appears" do
    render_component(title: "Hello World", context: { text: "Format", href: "/format", data: { tracking: true } })
    assert_select ".gem-c-title__context-link[href='/format'][data-tracking]", text: "Format"
  end

  it "applies context language if supplied to a context string" do
    render_component(title: "Bonjour Monde", context: "hello", context_locale: 'en')
    assert_select ".gem-c-title__context[lang='en']"
  end

  it "applies title length if supplied" do
    render_component(title: "Hello World", context: "format", average_title_length: 'long')
    assert_select ".gem-c-title .gem-c-title__text--long", text: "Hello World"
  end

  it "applies the inverse flag if supplied" do
    render_component(title: "Hello World", inverse: true)
    assert_select ".gem-c-title--inverse", text: "Hello World"
  end

  it "has a default margin of 8" do
    render_component(title: 'Margin default')
    assert_select '.gem-c-title.govuk-\!-margin-bottom-8'
  end

  it "adds margin 0" do
    render_component(title: 'Margin 0', margin_bottom: 0)
    assert_select '.gem-c-title.govuk-\!-margin-bottom-0'
  end

  it "adds a valid margin" do
    render_component(title: 'Margin 4', margin_bottom: 4)
    assert_select '.gem-c-title.govuk-\!-margin-bottom-4'
  end

  it "ignores an invalid margin" do
    render_component(title: 'Margin wat', margin_bottom: 17)
    assert_select "[class='^=govuk-\!-margin-bottom-']", false
  end

  it "applies context language if supplied to a context link" do
    render_component(title: "Bonjour", context: { text: "Format", href: "/format" }, context_locale: "en")
    assert_select ".gem-c-title__context[lang='en']"
  end
end
