require "rails_helper"

describe "Accordion", :js, :capybara do
  scenario "There is a page with the accordion rendered" do
    given_i_visit_a_page_with_the_accordion_component
    then_the_accordion_loads
    when_i_click_the_first_accordion_section
    then_the_accordion_opens
    when_i_click_the_first_accordion_section
    then_the_accordion_has_data_attributes
  end

  def given_i_visit_a_page_with_the_accordion_component
    visit "/accordionexample"
  end

  def then_the_accordion_loads
    expect(page).to have_css(".gem-c-accordion", visible: :visible)
    expect(page).to have_css(".govuk-accordion__show-all", visible: :visible)
    expect(page).to have_css(".govuk-accordion__section-content[hidden='until-found']", text: "This is the content for Writing well for the web.")
  end

  def when_i_click_the_first_accordion_section
    page.first(".govuk-accordion__section-button").click
  end

  def then_the_accordion_opens
    expect(page).to have_selector(".govuk-accordion__section.govuk-accordion__section--expanded", visible: :visible)
    expect(page).to have_css(".govuk-accordion__section-content", text: "This is the content for Writing well for the web.")
    expect(page).not_to have_css(".govuk-accordion__section-content[hidden='until-found']", text: "This is the content for Writing well for the web.")
  end

  def then_the_accordion_has_data_attributes
    expect(page).to have_selector(".gem-c-accordion[data-show-text='Show']", visible: :visible)
    expect(page).to have_selector(".gem-c-accordion[data-hide-text='Hide']", visible: :visible)
    expect(page).to have_selector(".gem-c-accordion[data-show-all-text='Show all sections']", visible: :visible)
    expect(page).to have_selector(".gem-c-accordion[data-hide-all-text='Hide all sections']", visible: :visible)
    expect(page).to have_selector(".gem-c-accordion[data-this-section-visually-hidden=' this section']", visible: :visible)
    expect(page).to have_selector(".govuk-accordion__section-heading[data-custom-data-attr='custom-data-attr-accordion-item-1']", visible: :visible)
  end
end
