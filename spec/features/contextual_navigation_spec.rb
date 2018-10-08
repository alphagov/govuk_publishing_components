require "rails_helper"

describe "Contextual navigation" do
  scenario "There's a step by step list" do
    given_theres_a_page_with_a_step_by_step
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
  end

  scenario "There's between 2-5 step by step lists" do
    given_theres_are_two_step_by_step_lists
    and_i_visit_that_page
    then_i_just_see_the_step_by_step_related_links
    and_no_step_by_step_header
  end

  scenario "There's 6 or more step by step lists" do
    given_theres_are_six_step_by_step_lists
    and_i_visit_that_page
    then_theres_no_step_by_step_at_all
    and_no_step_by_step_header
  end

  scenario "I see the step by step I am currently interacting with" do
    given_theres_are_two_step_by_step_lists
    and_i_visit_that_page_by_clicking_on_a_step_by_step_link
    then_i_see_the_step_by_step
    and_the_step_by_step_header
  end

  scenario "There's a mainstream browse page tagged" do
    given_theres_a_page_with_browse_page
    and_i_visit_that_page
    then_i_see_the_parent_based_breadcrumbs
    and_the_related_topics_footer
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
    given_theres_a_guide_with_a_live_taxon_and_collection_tagged_to_it
    and_i_visit_that_page
    then_i_see_the_related_links_sidebar
    and_the_related_topics_footer
    and_the_taxonomy_breadcrumbs
  end

  scenario "There's legacy things tagged" do
    given_theres_a_page_with_just_legacy_taxonomy
    and_i_visit_that_page
    then_i_see_the_parent_based_breadcrumbs
    and_the_related_topics_footer
  end

  include GdsApi::TestHelpers::ContentStore

  def given_theres_a_page_with_a_step_by_step
    content_store_has_random_item(links: { part_of_step_navs: [random_step_nav_item("step_by_step_nav")] })
  end

  def given_theres_are_two_step_by_step_lists
    content_store_has_random_item(links: { part_of_step_navs: 2.times.map { random_step_nav_item("step_by_step_nav") } })
  end

  def given_theres_are_six_step_by_step_lists
    content_store_has_random_item(links: { part_of_step_navs: 6.times.map { random_step_nav_item("step_by_step_nav") } })
  end

  def given_theres_a_page_with_browse_page
    content_store_has_random_item(
      links: {
        "parent" => [random_item("mainstream_browse_page", "title" => "A parent")],
        "mainstream_browse_pages" => [random_item("mainstream_browse_page", "title" => "A browse page")],
      }
    )
  end

  def given_theres_a_page_with_related_items
    content_store_has_random_item(
      links: {
        "parent" => [random_item("mainstream_browse_page", "title" => "A parent")],
        "ordered_related_items" => [random_item("guide", "title" => "A related link curated in Publisher")]
      }
    )
  end

  def given_there_is_a_travel_advice_page
    content_item = random_item(
      "travel_advice",
      "base_path" => "/page-with-contextual-navigation",
      "document_type" => "travel_advice",
      "links" => {
        "parent" => [random_item("mainstream_browse_page", "title" => "A parent")],
        "taxons" => [random_item("taxon", "phase" => "live")],
        "ordered_related_items" => [random_item("guide", "title" => "A related link curated in Publisher")]
      }
    )

    content_store_has_item(content_item["base_path"], content_item)
  end

  def given_theres_a_guide_with_a_live_taxon_and_collection_tagged_to_it
    document_collection = random_item("document_collection", "title" => "A cool document collection")
    alpha_taxon = random_item("taxon", "title" => "An alpha taxon", "phase" => "alpha")
    live_taxon = random_item("taxon", "title" => "A live taxon", "phase" => "live")

    stub_request(:get, "http://rummager.dev.gov.uk/search.json?count=3&fields%5B%5D=link&fields%5B%5D=title&filter_navigation_document_supertype=guidance&filter_taxons%5B%5D=#{live_taxon['content_id']}&similar_to=/page-with-contextual-navigation&start=0").
      to_return(body: { results: [{ title: 'A similar item' }] }.to_json)

    content_store_has_random_item(
      schema: "guide",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
        "document_collections" => [document_collection],
      }
    )
  end

  def given_theres_a_page_with_just_legacy_taxonomy
    topic = random_item("topic", "title" => "A legacy topic")
    content_store_has_random_item(links: {
      "topics" => [topic],
      "parent" => [random_item("mainstream_browse_page", "title" => "A parent")]
    })
  end

  def and_i_visit_that_page
    visit "/contextual-navigation/page-with-contextual-navigation"
  end

  def and_i_visit_that_page_by_clicking_on_a_step_by_step_link
    visit "/contextual-navigation/page-with-contextual-navigation?step-by-step-nav=8ad782bd-8603-40eb-97c0-434cb22047cd"
  end

  def then_i_see_the_step_by_step
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).to have_selector(".gem-c-step-nav__header")
  end

  def and_the_step_by_step_header
    expect(page).to have_selector(".gem-c-step-nav-header")
  end

  def then_i_just_see_the_step_by_step_related_links
    expect(page).to have_selector(".gem-c-step-nav-related")
    expect(page).not_to have_selector(".gem-c-step-nav__header")
  end

  def and_no_step_by_step_header
    expect(page).not_to have_selector(".gem-c-step-nav-header")
  end

  def then_theres_no_step_by_step_at_all
    expect(page).not_to have_selector(".gem-c-step-nav-related")
    expect(page).not_to have_selector(".gem-c-step-nav__header")
  end

  def then_i_see_the_browse_page_in_the_sidebar
    expect(page).to have_selector(".gem-c-related-navigation")
    expect(page).to have_content("A browse page")
  end

  def then_i_see_the_related_links_sidebar
    expect(page).to have_selector(".gem-c-related-navigation")
  end

  def then_i_see_the_related_topics_footer
    expect(page).to have_selector(".gem-c-related-topics-navigation")
  end

  alias and_the_related_topics_footer then_i_see_the_related_topics_footer

  def then_i_see_the_parent_based_breadcrumbs
    within '.gem-c-breadcrumbs' do
      expect(page).to have_link("Home")
      expect(page).to have_link("A parent")
    end
  end

  alias and_the_parent_based_breadcrumbs then_i_see_the_parent_based_breadcrumbs

  def and_the_taxonomy_breadcrumbs
    within '.gem-c-breadcrumbs' do
      expect(page).to have_link("Home")
      expect(page).to have_link("A live taxon")
    end
  end

  def then_i_see_the_related_navigation_sidebar
    expect(page).to have_selector(".gem-c-related-navigation")
    expect(page).to have_content("A legacy topic")
  end

  def content_store_has_random_item(schema: "placeholder", links: {})
    content_item = random_item(schema, "base_path" => "/page-with-contextual-navigation",
        "links" => links)

    content_store_has_item(content_item["base_path"], content_item)
  end

  def random_step_nav_item(schema_name)
    GovukSchemas::Example.find(schema_name, example_name: "step_by_step_nav")
  end

  def random_item(schema_name, merge_with = {})
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema_name) do |random_item|
      random_item.merge(merge_with)
    end
  end
end
