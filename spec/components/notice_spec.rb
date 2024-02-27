require "rails_helper"

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

  it "renders a notice with a title and description" do
    render_component(title: "Statistics release cancelled", description: "<pre>Some HTML</pre>".html_safe)
    assert_select ".gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice pre", text: "Some HTML"
  end

  it "renders a notice with a title and description text" do
    render_component(title: "Statistics release cancelled", description_text: "Duplicate, added in error")
    assert_select ".gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice__description", text: "Duplicate, added in error"
  end

  it "renders a notice with a title and description from a block" do
    render_component(title: "Statistics release cancelled") do
      "<pre>Some HTML</pre>".html_safe
    end

    assert_select ".gem-c-notice__title", text: "Statistics release cancelled"
    assert_select ".gem-c-notice pre", text: "Some HTML"
  end

  it "renders a notice with a title and description govspeak" do
    render_component(title: "Statistics release update", description_govspeak: "<p>The Oil &amp; Gas Authority launched a new website on 3 October 2016 to reflect its new status as a government company.</p><p>This formalises the transfer of the Secretary of State’s regulatory powers in respect of oil and gas to the OGA, and grants it new powers. This website will no longer be updated. Visitors should refer to <a rel=\"external\" href=\"https://www.ogauthority.co.uk/news-publications/announcements/2015/establishment-of-the-oil-and-gas-authority-1/\">www.ogauthority.co.uk</a></p>".html_safe)

    assert_select ".gem-c-notice__title", text: "Statistics release update"
    assert_select ".govuk-govspeak p", text: "The Oil & Gas Authority launched a new website on 3 October 2016 to reflect its new status as a government company."
    assert_select ".govuk-govspeak p", text: "This formalises the transfer of the Secretary of State’s regulatory powers in respect of oil and gas to the OGA, and grants it new powers. This website will no longer be updated. Visitors should refer to www.ogauthority.co.uk"
    assert_select ".govuk-govspeak p a[href=\"https://www.ogauthority.co.uk/news-publications/announcements/2015/establishment-of-the-oil-and-gas-authority-1/\"][rel=\"external\"]", text: "www.ogauthority.co.uk"
  end

  it "renders title as heading only if description present" do
    render_component(title: "Statistics release cancelled", description: "<p>Some HTML</p>".html_safe)
    assert_select "h2.gem-c-notice__title", text: "Statistics release cancelled"

    render_component(title: "Statistics release cancelled", description_text: "Duplicate, added in error")
    assert_select "h2.gem-c-notice__title", text: "Statistics release cancelled"

    render_component(title: "Statistics release cancelled", description_govspeak: "[some](govspeak)".html_safe)
    assert_select "h2.gem-c-notice__title", text: "Statistics release cancelled"
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

  it "adds an aria-live attribute when the aria-live flag is provided" do
    render_component(title: "Your settings have been saved", aria_live: true)
    assert_select ".gem-c-notice[aria-live=polite]"
  end

  it "adds a lang attribute when lang is provided" do
    render_component(title: "Your settings have been saved", lang: "en")
    assert_select ".gem-c-notice[lang=en]"
  end

  it "adds no lang attribute when lang is not provided" do
    render_component(title: "Your settings have been saved")
    assert_select ".gem-c-notice[lang=en]", false
  end

  it "displays without a banner title by default" do
    render_component(title: "Your settings have been saved")
    assert_select ".gem-c-notice .govuk-notification-banner__title", false
  end

  it "displays with a banner title of 'Important' by default when show_banner_title is true" do
    render_component(title: "Your settings have been saved", show_banner_title: true, description_text: "Duplicate, added in error")
    assert_select ".gem-c-notice h2.govuk-notification-banner__title", text: "Important"
    assert_select "h3.gem-c-notice__title", text: "Your settings have been saved"
  end

  it "can display with a custom banner title if required" do
    render_component(title: "Your settings have been saved", show_banner_title: true, banner_title: "Notice", description_text: "Duplicate, added in error")
    assert_select ".gem-c-notice h2.govuk-notification-banner__title", text: "Notice"
    assert_select "h3.gem-c-notice__title", text: "Your settings have been saved"
  end

  it "has GA4 tracking enabled on the component, and disabled on the nested govspeak render" do
    render_component(title: "Title", description_govspeak: "<marquee>It's 1998</marquee>".html_safe)

    assert_select ".gem-c-notice[data-module='ga4-link-tracker']"
    assert_select ".gem-c-notice[data-ga4-track-links-only]"
    assert_select '.gem-c-notice[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]'

    assert_no_selector ".gem-c-govspeak[data-module='govspeak ga4-link-tracker']"
    assert_no_selector ".gem-c-govspeak[data-ga4-track-links-only]"
    assert_no_selector ".gem-c-govspeak[data-ga4-limit-to-element-class='call-to-action, info-notice, help-notice, advisory']"
    assert_no_selector '.gem-c-govspeak[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]'
  end

  it "can have GA4 tracking disabled" do
    render_component(title: "Title", description_govspeak: "<marquee>It's 1998</marquee>".html_safe)

    assert_no_selector ".gem-c-notice[data-module='ga4-link-tracker']"
    assert_no_selector ".gem-c-notice[data-ga4-track-links-only]"
    assert_no_selector '.gem-c-notice[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]'

    assert_no_selector ".gem-c-govspeak[data-module='govspeak ga4-link-tracker']"
    assert_no_selector ".gem-c-govspeak[data-ga4-track-links-only]"
    assert_no_selector ".gem-c-govspeak[data-ga4-limit-to-element-class='call-to-action, info-notice, help-notice, advisory']"
    assert_no_selector '.gem-c-govspeak[data-ga4-link="{\"event_name\":\"navigation\",\"type\":\"callout\"}"]'
  end
end
