require "rails_helper"

describe "Contextual navigation" do
  scenario "There's a step by step list" do
    given_theres_a_page_with_a_step_by_step
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
  end

  scenario "There's more than one step by step" do
    given_theres_are_two_step_by_step_lists
    and_i_visit_that_page
    then_i_just_see_the_step_by_step_related_links
    and_no_step_by_step_header
  end

  scenario "I see the step by step I am currently interacting with" do
    given_theres_are_two_step_by_step_lists
    and_i_visit_that_page_by_clicking_on_a_step_by_step_link
    then_i_see_the_step_by_step_that_i_am_interacting_with
    and_i_see_the_other_step_by_step_as_an_also_part_of_list
  end

  scenario "There's a mainstream browse page tagged" do
    given_theres_a_page_with_browse_page
    and_i_visit_that_page
    then_i_see_the_browse_page_in_the_footer
    and_the_parent_based_breadcrumbs
  end

  scenario "The page has curated related items" do
    given_theres_a_page_with_related_items
    and_i_visit_that_page
    then_i_see_the_related_links_sidebar
    and_the_parent_based_breadcrumbs
  end

  scenario "It's a travel advice page" do
    given_there_is_a_travel_advice_page
    and_i_visit_that_page
    then_i_see_the_related_links_sidebar
    and_the_parent_based_breadcrumbs
  end

  scenario "There's a taxon tagged" do
    given_theres_a_guide_with_a_live_taxon_tagged_to_it
    and_i_visit_that_page
    then_i_see_the_taxon_in_the_related_navigation_footer
    and_the_taxonomy_breadcrumbs
  end

  scenario "There's legacy things tagged" do
    given_theres_a_page_with_just_legacy_taxonomy
    and_i_visit_that_page
    then_i_see_the_legacy_topic_in_the_related_navigation_footer
    and_the_parent_based_breadcrumbs
  end

  scenario "There's a secondary step by step list and no primary step by step list" do
    given_theres_a_page_with_a_secondary_step_by_step
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
  end

  scenario "There's more than one secondary step by step list and no primary step by step list" do
    given_there_are_two_secondary_step_by_step_lists
    and_i_visit_that_page
    then_i_just_see_the_step_by_step_related_links
  end

  scenario "There's 3 secondary step by steps and 2 primary step by step lists" do
    given_there_are_three_secondary_step_by_steps_and_two_primary_to_step_navs
    and_i_visit_that_page
    then_i_just_see_the_step_by_step_related_links_with_just_two_links
    and_i_dont_see_the_secondary_step_by_step_related_links
  end

  scenario "There's 1 primary step by step and 1 secondary step by step" do
    given_there_are_one_primary_step_by_steps_and_one_secondary_to_step_navs
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
    then_i_see_the_primary_step_by_step
  end

  scenario "There's a related to step by step lists and no primary step by step list" do
    given_there_is_a_related_to_step_nav
    and_i_visit_that_page
    then_theres_no_step_by_step_at_all
    and_no_step_by_step_header
  end

  scenario "There are three related to step by step lists and no primary step by step list" do
    given_there_are_three_related_to_step_nav
    and_i_visit_that_page
    then_theres_no_step_by_step_at_all
    and_no_step_by_step_header
  end

  scenario "There are three related to step by step lists, no primary step by step list and one secondary to step nav" do
    given_there_are_three_related_to_step_nav_and_one_secondary_to_step_nav
    and_i_visit_that_page
    then_theres_no_step_by_step_at_all
    and_no_step_by_step_header
  end

  scenario "There's 2 primary step by step, 1 secondary step by step and I am interacting with one of the primary" do
    given_there_are_two_primary_step_by_steps_and_one_secondary_to_step_navs
    and_i_visit_that_page_by_clicking_on_a_step_by_step_link
    then_i_see_the_step_by_step_that_i_am_interacting_with
    and_i_see_the_other_step_by_step_as_an_also_part_of_list
    and_i_dont_see_the_secondary_step_by_step_in_the_also_part_of_list
  end

  include GdsApi::TestHelpers::ContentStore

  def given_theres_a_page_with_a_step_by_step
    content_store_has_random_item(links: { part_of_step_navs: [random_step_nav_item("step_by_step_nav")] })
  end

  def given_theres_are_two_step_by_step_lists
    part_of_step_navs = 2.times.map { random_step_nav_item("step_by_step_nav") }
    part_of_step_navs[0]["title"] = "PRIMARY STEP BY STEP - NOT INTERACTING WITH"
    part_of_step_navs[1]["content_id"] = "8ad999bd-8603-40eb-97c0-999cb22047cd"
    part_of_step_navs[1]["title"] = "PRIMARY STEP BY STEP - INTERACTING WITH"

    content_store_has_random_item(links: { part_of_step_navs: part_of_step_navs })
  end

  def given_theres_a_page_with_a_secondary_step_by_step
    content_store_has_random_item(links: { secondary_to_step_navs: [random_step_nav_item("step_by_step_nav")] })
  end

  def given_there_are_two_secondary_step_by_step_lists
    content_store_has_random_item(links: { secondary_to_step_navs: 2.times.map { random_step_nav_item("step_by_step_nav") } })
  end

  def given_there_are_three_secondary_step_by_steps_and_two_primary_to_step_navs
    secondary_to_step_navs = 3.times.map { random_step_nav_item("step_by_step_nav") }
    secondary_to_step_navs[0]["title"] = "SECONDARY STEP BY STEP"

    content_store_has_random_item(links: {
      secondary_to_step_navs: secondary_to_step_navs,
      part_of_step_navs: 2.times.map { random_step_nav_item("step_by_step_nav") },
    })
  end

  def given_there_are_one_primary_step_by_steps_and_one_secondary_to_step_navs
    part_of_step_navs = 1.times.map { random_step_nav_item("step_by_step_nav") }
    part_of_step_navs[0]["title"] = "PRIMARY STEP BY STEP"

    content_store_has_random_item(links: {
      secondary_to_step_navs: 1.times.map { random_step_nav_item("step_by_step_nav") },
      part_of_step_navs: part_of_step_navs,
    })
  end

  def given_there_are_two_primary_step_by_steps_and_one_secondary_to_step_navs
    part_of_step_navs = 2.times.map { random_step_nav_item("step_by_step_nav") }
    part_of_step_navs[0]["title"] = "PRIMARY STEP BY STEP - NOT INTERACTING WITH"
    part_of_step_navs[1]["content_id"] = "8ad999bd-8603-40eb-97c0-999cb22047cd"
    part_of_step_navs[1]["title"] = "PRIMARY STEP BY STEP - INTERACTING WITH"

    secondary_to_step_navs = 1.times.map { random_step_nav_item("step_by_step_nav") }
    secondary_to_step_navs[0]["title"] = "SECONDARY STEP BY STEP"

    content_store_has_random_item(links: {
      part_of_step_navs: part_of_step_navs,
      secondary_to_step_navs: secondary_to_step_navs,
    })
  end

  def given_there_is_a_related_to_step_nav
    content_store_has_random_item(links: {
      related_to_step_navs: 1.times.map { random_step_nav_item("step_by_step_nav") },
    })
  end

  def given_there_are_three_related_to_step_nav
    content_store_has_random_item(links: {
      related_to_step_navs: 3.times.map { random_step_nav_item("step_by_step_nav") },
    })
  end

  def given_there_are_three_related_to_step_nav_and_one_secondary_to_step_nav
    content_store_has_random_item(links: {
      related_to_step_navs: 3.times.map { random_step_nav_item("step_by_step_nav") },
      secondary_to_step_navs: 1.times.map { random_step_nav_item("step_by_step_nav") },
    })
  end

  def given_theres_a_page_with_browse_page
    content_store_has_random_item(
      links: {
        "parent" => [example_item("mainstream_browse_page", "top_level_page")],
        "mainstream_browse_pages" => [example_item("mainstream_browse_page", "root_page")],
      },
    )
  end

  def given_theres_a_page_with_related_items
    content_store_has_random_item(
      links: {
        "parent" => [example_item("mainstream_browse_page", "top_level_page")],
        "ordered_related_items" => [example_item("guide", "guide")],
      },
    )
  end

  def given_there_is_a_travel_advice_page
    content_item = random_item(
      "travel_advice",
      "base_path" => "/page-with-contextual-navigation",
      "document_type" => "travel_advice",
      "links" => {
        "parent" => [example_item("mainstream_browse_page", "top_level_page")],
        "taxons" => [example_item("taxon", "taxon")],
        "ordered_related_items" => [example_item("guide", "guide")],
      },
    )

    content_store_has_item(content_item["base_path"], content_item)
  end

  def given_theres_a_guide_with_a_live_taxon_tagged_to_it
    alpha_taxon = example_item("taxon", "taxon_in_alpha_phase")
    live_taxon = example_item("taxon", "taxon")

    content_store_has_random_item(
      schema: "guide",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
      },
    )
  end

  def given_theres_a_page_with_just_legacy_taxonomy
    content_store_has_random_item(links: {
      "topics" => [example_item("topic", "topic")],
      "parent" => [example_item("mainstream_browse_page", "top_level_page")],
    })
  end

  def and_i_visit_that_page
    visit "/contextual-navigation/page-with-contextual-navigation"
  end

  def and_i_visit_that_page_by_clicking_on_a_step_by_step_link
    visit "/contextual-navigation/page-with-contextual-navigation?step-by-step-nav=8ad999bd-8603-40eb-97c0-999cb22047cd"
  end

  def then_i_see_the_step_by_step
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).to have_selector(".gem-c-step-nav__header")
  end

  def then_i_see_the_step_by_step_that_i_am_interacting_with
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).to have_selector(".gem-c-step-nav__header")
    within ".gem-c-step-nav-header" do
      expect(page).to have_content("PRIMARY STEP BY STEP - INTERACTING WITH")
      expect(page).not_to have_content("PRIMARY STEP BY STEP - NOT INTERACTING WITH")
    end
  end

  def and_the_step_by_step_header
    expect(page).to have_selector(".gem-c-step-nav-header")
  end

  def then_i_just_see_the_step_by_step_related_links
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).not_to have_selector(".gem-c-step-nav__header")
  end

  def then_i_just_see_the_step_by_step_related_links_with_just_two_links
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).not_to have_selector(".gem-c-step-nav__header")
    within(".gem-c-step-nav-related") do
      expect(page).to have_xpath(".//li", count: 2)
    end
  end

  def and_no_step_by_step_header
    expect(page).not_to have_selector(".gem-c-step-nav-header")
  end

  def then_theres_no_step_by_step_at_all
    expect(page).not_to have_selector(".gem-c-step-nav-related")
    expect(page).not_to have_selector(".gem-c-step-nav__header")
  end

  def and_i_dont_see_the_secondary_step_by_step_related_links
    within ".gem-c-step-nav-related" do
      expect(page).not_to have_content("SECONDARY STEP BY STEP")
    end
  end

  def and_i_see_the_other_step_by_step_as_an_also_part_of_list
    within ".gem-c-step-nav-related:last-child" do
      expect(page).to have_content("Also part of")
      expect(page).to have_content("PRIMARY STEP BY STEP - NOT INTERACTING WITH")
      expect(page).not_to have_content("PRIMARY STEP BY STEP - INTERACTING WITH")
    end
  end

  def and_i_dont_see_the_secondary_step_by_step_in_the_also_part_of_list
    within ".gem-c-step-nav-related:last-child" do
      expect(page).not_to have_content("SECONDARY STEP BY STEP")
    end
  end

  def then_i_see_the_browse_page_in_the_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_selector(".gem-c-related-navigation")
      expect(page).to have_content("Browse")
    end
  end

  def then_i_see_the_related_links_sidebar
    within ".gem-c-contextual-sidebar" do
      expect(page).to have_selector(".gem-c-related-navigation")
      expect(page).to have_content("The national curriculum")
    end
  end

  def then_i_see_the_primary_step_by_step
    within ".gem-c-step-nav-header" do
      expect(page).to have_content("PRIMARY STEP BY STEP")
    end
  end

  def and_the_parent_based_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link("Benefits")
    end
  end

  def and_the_taxonomy_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link("A level")
    end
  end

  def then_i_see_the_taxon_in_the_related_navigation_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_css(".gem-c-related-navigation__link", text: "A level")
    end
  end

  def then_i_see_the_legacy_topic_in_the_related_navigation_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_css(".gem-c-related-navigation__link", text: "Oil and gas")
    end
  end

  def content_store_has_random_item(schema: "placeholder", links: {})
    content_item = random_item(schema, "base_path" => "/page-with-contextual-navigation",
                                       "links" => links)

    content_store_has_item(content_item["base_path"], content_item)
  end

  def random_step_nav_item(schema_name)
    GovukSchemas::Example.find(schema_name, example_name: "step_by_step_nav")
  end

  def example_item(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name: example_name)
  end

  def random_item(schema_name, merge_with = {})
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema_name) do |random_item|
      random_item.merge(merge_with)
    end
  end
end
