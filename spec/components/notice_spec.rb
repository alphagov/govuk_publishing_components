require 'rails_helper'

describe "Notice", type: :view do
  def component_name
    "notice"
  end

  it "renders nothing when no params provided" do
    assert_empty render_component({})
  end

  it "renders a notice with only a title and no description" do
    render_component(title: "Statistics release cancelled")
    assert_select ".gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice__description", false
  end

  it "renders a notice with an aria label and region" do
    render_component(title: "Statistics release cancelled")
    assert_select ".gem-c-notice[aria-label=Notice][role=region]"
  end

  it "renders a notice with a title and description text" do
    render_component(title: "Statistics release cancelled", description_text: "Duplicate, added in error")
    assert_select ".gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice__description", text: "Duplicate, added in error"
  end

  it "renders a notice with a title and description govspeak" do
    render_component(title: "Statistics release update", description_govspeak: "<p>The Oil &amp; Gas Authority launched a new website on 3 October 2016 to reflect its new status as a government company.</p><p>This formalises the transfer of the Secretary of State’s regulatory powers in respect of oil and gas to the OGA, and grants it new powers. This website will no longer be updated. Visitors should refer to <a rel=\"external\" href=\"https://www.ogauthority.co.uk/news-publications/announcements/2015/establishment-of-the-oil-and-gas-authority-1/\">www.ogauthority.co.uk</a></p>")

    assert_select ".gem-c-notice__title", text: "Statistics release update"
    assert_select ".govuk-govspeak p", text: "The Oil & Gas Authority launched a new website on 3 October 2016 to reflect its new status as a government company."
    assert_select ".govuk-govspeak p", text: "This formalises the transfer of the Secretary of State’s regulatory powers in respect of oil and gas to the OGA, and grants it new powers. This website will no longer be updated. Visitors should refer to www.ogauthority.co.uk"
    assert_select ".govuk-govspeak p a[href=\"https://www.ogauthority.co.uk/news-publications/announcements/2015/establishment-of-the-oil-and-gas-authority-1/\"][rel=\"external\"]", text: "www.ogauthority.co.uk"
  end

  it "renders title as heading only if description present" do
    render_component(title: "Statistics release cancelled", description_text: "Duplicate, added in error")
    assert_select "h2.gem-c-notice__title", text: "Statistics release cancelled"
    assert_select "p.gem-c-notice__description", text: "Duplicate, added in error"
  end

  it "render title as paragraph if no description present" do
    render_component(title: "Statistics release cancelled")
    assert_select "span.gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice__description", false
  end

  it "renders simple markup in the title" do
    render_component(title: 'Advisory Committee on Novel Foods and Processes has a <a href="http://www.food.gov.uk/acnfp">separate website</a>')
    assert_select ".gem-c-notice__title", text: 'Advisory Committee on Novel Foods and Processes has a <a href="http://www.food.gov.uk/acnfp">separate website</a>'
  end
end
