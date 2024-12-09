require "rails_helper"

describe "Tabs component", :js, :capybara do
  scenario "Tabs load" do
    given_i_visit_a_page_with_the_tabs_component
    then_the_tabs_load
    only_the_first_tab_is_selected
    when_i_click_the_second_tab
    then_only_the_second_tab_is_selected
  end

  def given_i_visit_a_page_with_the_tabs_component
    visit "/tabsexample"
  end

  def then_the_tabs_load
    expect(page).to have_css(".govuk-tabs__list")
  end

  def only_the_first_tab_is_selected
    expect(page).to have_css("#tab_tab1[aria-selected=true]")
    expect(page).not_to have_css("#tab_tab2[aria-selected=true]")
  end

  def when_i_click_the_second_tab
    find("#tab_tab2").click
  end

  def then_only_the_second_tab_is_selected
    expect(page).to have_css("#tab_tab2[aria-selected=true]")
    expect(page).not_to have_css("#tab_tab1[aria-selected=true]")
  end
end
