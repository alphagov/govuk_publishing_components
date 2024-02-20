require "rails_helper"

describe "Metadata", type: :view do
  def component_name
    "metadata"
  end

  it "renders metadata in a definition list" do
    render_component({})
    assert_select ".gem-c-metadata dl"

    assert_select "dd", false
    assert_select "dt", false
  end

  it "renders from metadata" do
    render_component(from: "<a href='/link'>Department</a>")

    assert_definition("From:", "Department")
    assert_link_with_text_in("dd", "/link", "Department")
  end

  it "renders part of metadata" do
    render_component(part_of: "<a href='/link'>Department</a>")

    assert_definition("Part of:", "Department")
    assert_link_with_text_in("dd", "/link", "Department")
  end

  it "renders history metadata" do
    render_component(history: "Updated 2 weeks ago")

    assert_definition("History:", "Updated 2 weeks ago")
  end

  it "renders custom metadata" do
    render_component(other: {
      "Related topics": [
        "<a href='/government/topics/arts-and-culture'>Arts and culture</a>",
        "<a href='/government/topics/sports-and-leisure'>Sports and leisure</a>",
      ],
      "Applies to": "England",
    })

    assert_definition("Related topics:", "Arts and culture and Sports and leisure")
    assert_definition("Applies to:", "England")
    assert_link_with_text_in("dd", "/government/topics/arts-and-culture", "Arts and culture")
    assert_link_with_text_in("dd", "/government/topics/sports-and-leisure", "Sports and leisure")
  end

  it "renders multiples as a single sentence (except history)" do
    render_component(
      from: %w[one another],
      part_of: %w[this that],
      other: {
        "Related topics": %w[a b c],
      },
    )

    assert_definition("From:", "one and another")
    assert_definition("Part of:", "this and that")
    assert_definition("Related topics:", "a, b, and c")
  end

  it "long lists of metadata are truncated and the remainder hidden behind a toggle for from" do
    links = [
      "<a href=\"/government/organisations/ministry-of-defence\">Ministry of Defence</a>",
      "<a href=\"/government/organisations/cabinet-office\">Cabinet Office</a>",
      "<a href=\"/government/organisations/department-for-business-energy-and-industrial-strategy\">Department for Business, Energy &amp; Industrial Strategy</a>",
      "<a href=\"/government/organisations/foreign-commonwealth-office\">Foreign &amp; Commonwealth Office</a>",
      "<a href=\"/government/people/william-hague\">The Rt Hon William Hague</a>",
      "<a href=\"/government/organisations/department-for-environment-food-rural-affairs\">Department for Environment, Food &amp; Rural Affairs</a>",
      "<a href=\"/government/organisations/department-for-work-pensions\">Department for work and pensions</a>",
      "<a href=\"/government/organisations/foreign-commonwealth-office\">Foreign and Commonwealth Office</a>",
    ]
    render_component(from: links)

    assert_truncation(links.length, 5)
  end

  it "short lists of metadata are not truncated for from" do
    links = [
      "<a href=\"/government/organisations/ministry-of-defence\">Ministry of Defence</a>",
      "<a href=\"/government/organisations/cabinet-office\">Cabinet Office</a>",
      "<a href=\"/government/organisations/department-for-business-energy-and-industrial-strategy\">Department for Business, Energy &amp; Industrial Strategy</a>",
      "<a href=\"/government/organisations/foreign-commonwealth-office\">Foreign &amp; Commonwealth Office</a>",
      "<a href=\"/government/people/william-hague\">The Rt Hon William Hague</a>",
      "<a href=\"/government/organisations/department-for-environment-food-rural-affairs\">Department for Environment, Food &amp; Rural Affairs</a>",
      "<a href=\"/government/organisations/department-for-work-pensions\">Department for work and pensions</a>",
    ]
    render_component(from: links)

    assert_no_truncation(links.length)
  end

  it "long lists of metadata are truncated and the remainder hidden behind a toggle for part of" do
    links = [
      "<a href=\"/government/topics/energy\">Energy</a>",
      "<a href=\"/government/topics/environment\">Environment</a>",
      "<a href=\"/government/topics/arts-and-culture\">Arts and Culture</a>",
      "<a href=\"/government/topics/borders-and-immigration\">Borders and Immigration</a>",
      "<a href=\"/government/topics/business-and-enterprise\">Business and Enterprise</a>",
      "<a href=\"/government/topics/children-and-young-people\">Children and Young People</a>",
      "<a href=\"/government/topics/climate-change\">Climate Change</a>",
      "<a href=\"/government/topics/community-and-society\">Community and Society</a>",
    ]
    render_component(part_of: links)

    assert_truncation(links.length, 5)
  end

  it "short lists of metadata are not truncated for part of" do
    links = [
      "<a href=\"/government/topics/energy\">Energy</a>",
      "<a href=\"/government/topics/environment\">Environment</a>",
      "<a href=\"/government/topics/arts-and-culture\">Arts and Culture</a>",
      "<a href=\"/government/topics/borders-and-immigration\">Borders and Immigration</a>",
      "<a href=\"/government/topics/business-and-enterprise\">Business and Enterprise</a>",
      "<a href=\"/government/topics/children-and-young-people\">Children and Young People</a>",
      "<a href=\"/government/topics/climate-change\">Climate Change</a>",
    ]
    render_component(from: links)

    assert_no_truncation(links.length)
  end

  it "long lists of metadata are truncated and the remainder hidden behind a toggle for other" do
    links = [
      "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=information-technology-digital-and-creative\">IT, digital and creative</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=manufacturing\">Manufacturing</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=mining\">Mining</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=real-estate-and-property\">Real estate and property</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=science-and-technology\">Science and technology</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=service-industries\">Service industries</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=transport-and-distribution\">Transport and distribution</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=travel-and-leisure\">Travel and leisure</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=utilities-providers\">Utilities providers</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=wholesale-and-retail\">Wholesale and retail</a>",
    ]
    render_component(other: {
      "Industry": links,
    })

    assert_truncation(links.length, 5)
  end

  it "long lists of metadata are truncated and the remainder hidden behind a toggle for other in a foreign language" do
    links = [
      "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=information-technology-digital-and-creative\">IT, digital and creative</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=manufacturing\">Manufacturing</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=mining\">Mining</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=real-estate-and-property\">Real estate and property</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=science-and-technology\">Science and technology</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=service-industries\">Service industries</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=transport-and-distribution\">Transport and distribution</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=travel-and-leisure\">Travel and leisure</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=utilities-providers\">Utilities providers</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=wholesale-and-retail\">Wholesale and retail</a>",
    ]
    I18n.with_locale("cy") do
      render_component(other: {
        "Industry": links,
      })

      assert_truncation(links.length, 5)
    end
  end

  it "short lists of metadata are not truncated for other" do
    links = [
      "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>",
      "<a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>",
    ]
    render_component(other: {
      "Industry": links,
    })

    assert_no_truncation(links.length)
  end

  it "renders the component on a dark background" do
    render_component(from: "<a href='/link'>Department</a>", inverse: true)

    assert_select ".gem-c-metadata.gem-c-metadata--inverse.gem-c-metadata--inverse-padded"
  end

  it "renders the component on a dark background without extra padding" do
    render_component(from: "<a href='/link'>Department</a>", inverse: true, inverse_compress: true)

    assert_select ".gem-c-metadata.gem-c-metadata--inverse"
    assert_select ".gem-c-metadata.gem-c-metadata--inverse.gem-c-metadata--inverse-padded", false
  end

  it "applies a custom margin-bottom class if margin_bottom is specified" do
    render_component(from: "<a href='/link'>Department</a>", margin_bottom: 2)

    assert_select '.gem-c-metadata.govuk-\!-margin-bottom-2'
  end

  it "adds GA4 tracking to the 'see all updates' link" do
    render_component(last_updated: "Hello World", see_updates_link: true, other: { "Updated" => "13 April 2023, <a href=\"/hmrc-internal-manuals/self-assessment-claims-manual/updates\">see all updates</a>" })

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "content history",
      "section": "Top",
    }.to_json

    assert_select ".gem-c-metadata__definition:nth-of-type(2)" do |alternate_see_all_updates_container|
      expect(alternate_see_all_updates_container.attr("data-module").to_s).to eq "ga4-link-tracker"
      expect(alternate_see_all_updates_container.attr("data-ga4-track-links-only").to_s).to eq ""
      expect(alternate_see_all_updates_container.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end
  end

  it "allows GA4 tracking to be disabled" do
    render_component(last_updated: "Hello World", see_updates_link: true, disable_ga4: true, other: { "Updated" => "13 April 2023, <a href=\"/hmrc-internal-manuals/self-assessment-claims-manual/updates\">see all updates</a>" })

    assert_select ".js-see-all-updates-link[data-module='ga4-link-tracker']", false
    assert_select ".gem-c-metadata__definition:nth-of-type(2)[data-module='ga4-link-tracker']", false
    assert_select ".gem-c-metadata__definition:nth-of-type(2)[data-ga4-track-links-only]", false
  end

  def assert_truncation(length, limit)
    assert_select ".gem-c-metadata__toggle-items", count: 1
    assert_select ".gem-c-metadata__definition > a", count: limit
    assert_select ".gem-c-metadata__definition .gem-c-metadata__toggle-items a", count: length - limit
    assert_select "a[href=\"#\"]", text: t("common.toggle_more", show: t("common.show"), number: length - limit)
  end

  def assert_no_truncation(length)
    assert_select ".gem-c-metadata__definition > a", count: length
    assert_select ".gem-c-metadata__toggle-items", count: 0
  end

  def assert_definition(term, definition)
    assert_select ".gem-c-metadata__term", text: term
    assert_select ".gem-c-metadata__definition", text: definition
  end

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text:
  end
end
