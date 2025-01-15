require "rails_helper"

describe "Translation nav", type: :view do
  def component_name
    "translation_nav"
  end

  def multiple_translations
    [
      {
        locale: "en",
        base_path: "/en",
        text: "English",
        active: true,
      },
      {
        locale: "hi",
        base_path: "/hi",
        text: "हिंदी",
      },
    ]
  end

  it "renders nothing when no translations are given" do
    assert_empty render_component({})
  end

  it "renders nothing when only one translation given" do
    assert_empty render_component(
      translations: [
        {
          locale: "en",
          base_path: "/en",
          text: "English",
          active: true,
        },
      ],
    )
  end

  it "renders all items in a list" do
    render_component(translations: multiple_translations)
    assert_select ".gem-c-translation-nav__list-item", count: multiple_translations.length
  end

  it "renders an active item as text without a link" do
    render_component(translations: multiple_translations)
    assert_select ".gem-c-translation-nav__list-item :not(a)", text: "English"
    assert_select "a[href=\"/en\"]", false, "An active item should not be a link"
  end

  it "renders inactive items as a link with locale, base path and text" do
    render_component(translations: multiple_translations)
    assert_select ".gem-c-translation-nav__list-item a[lang='hi'][href='/hi']", text: "हिंदी"
  end

  it "identifies the language of the text" do
    render_component(translations: multiple_translations)
    assert_select "span[lang='en']", text: "English"
    assert_select "a[lang='hi']", text: "हिंदी"
  end

  it "identifies the language of the target page" do
    render_component(translations: multiple_translations)
    assert_select "a[hreflang='hi']", text: "हिंदी"
  end

  it "is labelled as translation navigation" do
    render_component(translations: multiple_translations)
    assert_select "nav[aria-label='Translations']"
  end

  it "adds branding correctly" do
    render_component(translations: multiple_translations, brand: "attorney-generals-office")
    assert_select ".gem-c-translation-nav.brand--attorney-generals-office"
    assert_select ".gem-c-translation-nav .brand__color"
  end

  it "has no margin top when option passed" do
    render_component(translations: multiple_translations, no_margin_top: true)
    assert_select ".gem-c-translation-nav--no-margin-top"
  end

  it "renders as inverse when option passed" do
    render_component(translations: multiple_translations, inverse: true)
    assert_select ".gem-c-translation-nav--inverse"
  end
end
