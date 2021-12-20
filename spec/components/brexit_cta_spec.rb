require "rails_helper"

describe "BrexitCta", type: :view do
  def component_name
    "contextual_sidebar/brexit_cta"
  end

  before(:each) do
    I18n.locale = :en
  end

  let(:content_item) do
    {
      "base_path" => "/any-page",
      "content_id" => SecureRandom.uuid,
    }
  end

  let(:welsh_content_item) { content_item.merge("locale" => "cy") }

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text: text
  end

  it "shows standard brexit call to action" do
    render_component({ content_item: content_item })
    assert_select ".gem-c-contextual-sidebar__heading", text: "Brexit"
    assert_link_with_text_in(".gem-c-contextual-sidebar__text", "/brexit", "Check what you need to do")
  end

  it "shows standard brexit call to action for Welsh pages" do
    I18n.with_locale(:cy) { render_component({ content_item: welsh_content_item }) }
    assert_select ".gem-c-contextual-sidebar__heading", text: "Brexit"
    assert_link_with_text_in(".gem-c-contextual-sidebar__text", "/brexit.cy", "Gwiriwch beth mae angen i chi wneud")
  end
end
