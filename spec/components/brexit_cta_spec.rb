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

  let(:hub_content_item) do
    {
      "base_path" => "/hub",
      "content_id" => "6555e0bf-c270-4cf9-a0c5-d20b95fab7f1",
    }
  end

  let(:welsh_content_items) { [hub_content_item, content_item].map { |item| item.merge("locale" => "cy") } }

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text: text
  end

  it "shows standard brexit call to action for most pages" do
    render_component({ content_item: content_item })
    assert_select ".gem-c-contextual-sidebar__brexit-heading", text: "Brexit"
    assert_link_with_text_in(".gem-c-contextual-sidebar__brexit-text", "/brexit", "Check what you need to do")
  end

  it "shows amended brexit call to action for English Brexit hub pages" do
    render_component({ content_item: hub_content_item })
    assert_select ".gem-c-contextual-sidebar__brexit-heading", text: "Brexit checker"
    assert_link_with_text_in(".gem-c-contextual-sidebar__brexit-text", "/transition-check/questions", "Get a personalised list of actions")
  end

  it "shows standard brexit call to action for Welsh pages" do
    welsh_content_items.each do |item|
      I18n.with_locale(:cy) { render_component({ content_item: item }) }
      assert_select ".gem-c-contextual-sidebar__brexit-heading", text: "Brexit"
      assert_link_with_text_in(".gem-c-contextual-sidebar__brexit-text", "/brexit.cy", "Cael rhestr bersonol o gamau gweithredu")
    end
  end
end
