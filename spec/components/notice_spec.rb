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

  # rendering the govspeak component doesn't work here, so we visit a component guide page where it's already rendered and use that instead
  # this is only a workaround until the govspeak component is also part of the gem
  # note also that this test will fail if run individually because the govspeak component is rendered differently if run individually

  it "renders a notice with a title and description govspeak" do
    visit '/component-guide/notice/with_description_govspeak'

    within '.component-guide-preview', match: :first do
      assert page.has_selector?(".gem-c-notice__title", text: "Statistics release update")
      assert page.has_selector?(".govuk-govspeak p", text: "The Oil & Gas Authority launched a new website on 3 October 2016 to reflect its new status as a government company.")
      assert page.has_selector?(".govuk-govspeak p", text: "This formalises the transfer of the Secretary of State’s regulatory powers in respect of oil and gas to the OGA, and grants it new powers. This website will no longer be updated. Visitors should refer to www.ogauthority.co.uk")
      assert page.has_selector?(".govuk-govspeak p a[href=\"https://www.ogauthority.co.uk/news-publications/announcements/2015/establishment-of-the-oil-and-gas-authority-1/\"][rel=\"external\"]", text: "www.ogauthority.co.uk")
    end
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
end
