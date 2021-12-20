require "rails_helper"

describe "CovidCta", type: :view do
  def component_name
    "contextual_sidebar/covid_cta"
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

  it "shows standard covid call to action" do
    render_component({ content_item: content_item })
    assert_select ".gem-c-contextual-sidebar__heading", text: I18n.t("components.related_navigation.covid_booster.title")
    assert_link_with_text_in(".gem-c-contextual-sidebar__text", I18n.t("components.related_navigation.covid_booster.link_path"), I18n.t("components.related_navigation.covid_booster.link_text"))
  end

  it "shows standard covid call to action for Welsh pages" do
    I18n.with_locale(:cy) { render_component({ content_item: welsh_content_item }) }
    assert_select ".gem-c-contextual-sidebar__heading", text: I18n.t("components.related_navigation.covid_booster.title")
    assert_link_with_text_in(".gem-c-contextual-sidebar__text", I18n.t("components.related_navigation.covid_booster.link_path"), I18n.t("components.related_navigation.covid_booster.link_text"))
  end
end
