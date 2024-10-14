require "rails_helper"

describe "Contents list", type: :view do
  def component_name
    "contents_list"
  end

  def contents_list
    [
      { href: "/one", text: "1. One" },
      { href: "#two", text: "2. Two" },
    ]
  end

  def contents_list_with_special_chars
    [
      { href: "/one", text: "First item&nbsp;in the menu" },
      { href: "/two", text: "Second item &mdash; in the menu" },
      { href: "/three", text: "Third item &amp; in the menu" },
    ]
  end

  def numbered_contents_list_with_special_chars
    [
      { href: "/one", text: "\n1.&nbsp;First item   in the menu" },
      { href: "/two", text: "\n2.\u00a0Second item     in the menu" },
      { href: "/three", text: "\n3. Third item &amp; in the menu" },
    ]
  end

  def contents_list_with_active_item
    [
      { href: "/one", text: "1. One" },
      { href: "/two", text: "2. Two", active: true },
      { href: "/three", text: "3. Three" },
    ]
  end

  def nested_contents_list
    contents_list << {
      href: "/three",
      text: "3. Three",
      items: [
        { href: "/nested-one", text: "Nested one" },
        { href: "/nested-two", text: "Nested two" },
        { text: "Active", active: true },
        { href: "#nested-four", text: "4. Four" },
      ],
    }
  end

  def contents_list_with_markup
    [
      {
        href: "#introduction",
        text: "1. What’s new",
      },
      {
        href: "#government-offices-great-george-street",
        text: "2. Government Offices Great George Street (GOGGS): a history",
      },
      {
        href: "#the-building-of-goggs",
        text: "3. The building of <abbr title=\"Government Offices Great George Street\">GOGGS<abbr>".html_safe,
      },
    ]
  end

  it "renders nothing without provided contents" do
    assert_empty render_component({})
  end

  it "renders a list of contents links" do
    render_component(contents: contents_list)
    assert_select ".gem-c-contents-list"
    assert_select ".gem-c-contents-list__link.govuk-link--no-underline[href='/one']", text: "1. One"
    assert_select ".gem-c-contents-list__link.govuk-link--no-underline[href='#two']", text: "2. Two"
  end

  it "renders a list of contents links containing special characters" do
    render_component(contents: contents_list_with_special_chars)

    assert_select ".gem-c-contents-list__link.govuk-link--no-underline[href='/one']", text: "First item in the menu"
    assert_select ".gem-c-contents-list__link.govuk-link--no-underline[href='/two']", text: "Second item — in the menu"
    assert_select ".gem-c-contents-list__link.govuk-link--no-underline[href='/three']", text: "Third item & in the menu"
  end

  it "renders with dashes hidden from screen readers" do
    render_component(contents: contents_list)
    assert_select ".gem-c-contents-list__list-item.gem-c-contents-list__list-item--dashed span[aria-hidden='true']"
  end

  it "renders with the underline option" do
    render_component(contents: contents_list, underline_links: true)
    assert_select ".gem-c-contents-list"
    assert_select ".gem-c-contents-list .govuk-link--no-underline", false
  end

  it "renders text only when link is active" do
    render_component(contents: contents_list_with_active_item)
    assert_select ".gem-c-contents-list"
    assert_select ".gem-c-contents-list__link[href='/one']", text: "1. One"
    assert_select ".gem-c-contents-list__link[href='/two']", count: 0
    assert_select ".gem-c-contents-list__list-item[2]", text: "2. Two"
    assert_select ".gem-c-contents-list__list-item--active[aria-current='true']"
  end

  it "renders text only when link is active for numbered lists" do
    render_component(contents: contents_list_with_active_item, format_numbers: true)
    assert_select ".gem-c-contents-list"
    assert_select ".gem-c-contents-list__link[href='/one'] .gem-c-contents-list__number", text: "1."
    assert_select ".gem-c-contents-list__link[href='/one'] .gem-c-contents-list__numbered-text", text: "One"
    assert_select ".gem-c-contents-list__link[href='/two']", count: 0
    assert_select ".gem-c-contents-list__list-item[2] .gem-c-contents-list__number", text: "2."
    assert_select ".gem-c-contents-list__list-item[2] .gem-c-contents-list__numbered-text", text: "Two"
    assert_select ".gem-c-contents-list__list-item--active[aria-current='true']"
  end

  it "renders a list containing markup by removing the tags" do
    render_component(contents: contents_list_with_markup)
    assert_select ".gem-c-contents-list__link[href='#introduction']", text: "1. What’s new"
    assert_select ".gem-c-contents-list__link[href='#government-offices-great-george-street']", text: "2. Government Offices Great George Street (GOGGS): a history"
    assert_select ".gem-c-contents-list__link[href='#the-building-of-goggs']", text: "3. The building of GOGGS"
  end

  it "renders a numbered list containing markup by removing the tags" do
    render_component(contents: contents_list_with_markup, format_numbers: true)
    assert_select ".gem-c-contents-list__link[href='#introduction'] .gem-c-contents-list__number", text: "1."
    assert_select ".gem-c-contents-list__link[href='#introduction'] .gem-c-contents-list__numbered-text", text: "What’s new"
    assert_select ".gem-c-contents-list__link[href='#government-offices-great-george-street'] .gem-c-contents-list__number", text: "2."
    assert_select ".gem-c-contents-list__link[href='#government-offices-great-george-street'] .gem-c-contents-list__numbered-text", text: "Government Offices Great George Street (GOGGS): a history"
    assert_select ".gem-c-contents-list__link[href='#the-building-of-goggs'] .gem-c-contents-list__number", text: "3."
    assert_select ".gem-c-contents-list__link[href='#the-building-of-goggs'] .gem-c-contents-list__numbered-text", text: "The building of GOGGS"
  end

  it "renders a nested list of contents links" do
    render_component(contents: nested_contents_list)
    nested_link_selector = ".gem-c-contents-list__list-item--parent ol li .gem-c-contents-list__link"

    assert_select "#{nested_link_selector}[href='/nested-one']", text: "Nested one"
    assert_select "#{nested_link_selector}[href='/nested-two']", text: "Nested two"
  end

  it "formats numbers in contents links" do
    render_component(contents: contents_list, format_numbers: true)
    link_selector = ".gem-c-contents-list__list-item--numbered a[href='/one']"

    assert_select "#{link_selector} .gem-c-contents-list__number", text: "1."
    assert_select "#{link_selector} .gem-c-contents-list__numbered-text", text: "One"
  end

  it "formats numbers in contents links containing special characters" do
    render_component(contents: numbered_contents_list_with_special_chars, format_numbers: true)
    link_selector1 = ".gem-c-contents-list__list-item--numbered a[href='/one']"
    link_selector2 = ".gem-c-contents-list__list-item--numbered a[href='/two']"
    link_selector3 = ".gem-c-contents-list__list-item--numbered a[href='/three']"

    assert_select "#{link_selector1} .gem-c-contents-list__number", text: "1."
    assert_select "#{link_selector1} .gem-c-contents-list__numbered-text", text: "First item in the menu"

    assert_select "#{link_selector2} .gem-c-contents-list__number", text: "2."
    assert_select "#{link_selector2} .gem-c-contents-list__numbered-text", text: "Second item in the menu"

    assert_select "#{link_selector3} .gem-c-contents-list__number", text: "3."
    assert_select "#{link_selector3} .gem-c-contents-list__numbered-text", text: "Third item & in the menu"
  end

  it "does not format numbers in a nested list" do
    render_component(contents: nested_contents_list, format_numbers: true)

    link_selector = ".gem-c-contents-list__list-item--parent a[href='/one']"
    assert_select "#{link_selector} .gem-c-contents-list__number", text: "1."
    assert_select "#{link_selector} .gem-c-contents-list__numbered-text", text: "One"

    nested_link_selector = ".gem-c-contents-list__list-item--parent ol li a[href='/nested-four']"
    assert_select "#{nested_link_selector} .gem-c-contents-list__number", count: 0
    assert_select "#{nested_link_selector} .gem-c-contents-list__numbered-text", count: 0
  end

  it "defaults to an aria label of 'Contents' when aria label is not supplied" do
    render_component(contents: contents_list_with_active_item)
    assert_select ".gem-c-contents-list[aria-label=\"Contents\"]"
  end

  it "aria label is rendered when supplied" do
    render_component(contents: contents_list_with_active_item, aria: { label: "All pages in this guide" })
    assert_select ".gem-c-contents-list[aria-label=\"All pages in this guide\"]"
  end

  it "GA4 tracking is added by default" do
    render_component(contents: nested_contents_list)

    expected_ga4_json = {
      event_name: "navigation",
      section: "Contents",
      type: "contents list",
    }

    # Parent element attributes
    assert_select ".gem-c-contents-list" do |contents_list|
      expect(contents_list.attr("data-module").to_s).to eq "ga4-link-tracker"
    end

    # Child link attributes
    expected_ga4_json[:index_total] = 7
    expected_ga4_json[:index_link] = 1

    contents_list_links = assert_select(".gem-c-contents-list__list-item a")

    # Test the links in the list. The 6th list item is the active item, so it's just text, but the index position of that item
    # should still be respected. Therefore the final link should still have an index of 7 even though there's only 6 <a> tags.
    index_links = [1, 2, 3, 4, 5, 7]
    texts = ["1. One", "2. Two", "3. Three", "Nested one", "Nested two", "4. Four"]
    events = %w[navigation select_content navigation navigation navigation select_content]

    contents_list_links.each_with_index do |link, index|
      expected_ga4_json[:event_name] = events[index]
      expected_ga4_json[:index_link] = index_links[index]
      expect(link.attr("data-ga4-link").to_s).to eq expected_ga4_json.to_json
      expect(link).to have_text(texts[index])
    end
  end

  it "GA4 tracking can be disabled" do
    render_component(contents: nested_contents_list, disable_ga4: true)
    assert_select ".gem-c-contents-list__list-item a[data-ga4-link]", false
  end

  it "applies branding correctly" do
    render_component(contents: nested_contents_list, format_numbers: true, brand: "attorney-generals-office")
    assert_select ".gem-c-contents-list.brand--attorney-generals-office"
    assert_select ".gem-c-contents-list__link", count: 6
    assert_select ".gem-c-contents-list__link.brand__color", count: 6
  end

  it "renders the heading in welsh" do
    I18n.with_locale(:cy) { render_component(contents: contents_list) }
    assert_select ".gem-c-contents-list__title", text: "Cynnwys"
  end

  it "adds a lang attribute to the title if falling back to English" do
    allow(I18n).to receive(:translate).with("components.#{component_name}.contents", anything).and_return("en")
    I18n.with_locale(:ru) { render_component(contents: contents_list) }
    assert_select ".gem-c-contents-list__title[lang=\"en\"]"
  end

  it "applies alternative line styles correctly" do
    render_component(contents: contents_list, alternative_line_style: true)
    assert_select ".gem-c-contents-list--alternative-line-style"
  end
end
