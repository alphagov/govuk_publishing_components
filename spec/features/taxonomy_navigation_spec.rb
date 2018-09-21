require "rails_helper"

describe "Taxonomy navigation" do
  scenario "There's a taxon tagged to content with many world locations" do
    given_theres_a_page_with_a_live_taxon_and_many_world_locations_tagged_to_it
    and_i_visit_that_page
    then_i_see_the_taxonomy_sidebar_and_world_locations
  end

  scenario "There's a taxon tagged to content with many world locations" do
    given_theres_a_page_with_a_live_taxon_and_related_item_overrides
    and_i_visit_that_page
    then_i_see_the_taxonomy_sidebar_and_related_links
  end


  include GdsApi::TestHelpers::ContentStore

  def given_theres_a_page_with_a_live_taxon_and_many_world_locations_tagged_to_it
    locations = []
    6.times { |n| locations << random_item("world_location", "title" => "World location #{n + 1}") }
    alpha_taxon = random_item("taxon", "title" => "An alpha taxon", "phase" => "alpha")
    live_taxon = random_item("taxon", "title" => "A live taxon", "phase" => "live")

    content_store_has_random_item(
      schema: "news_article",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
        "world_locations" => locations,
      }
    )
  end

  def given_theres_a_page_with_a_live_taxon_and_related_item_overrides
    curated_links = [
      random_item("answer", "title" => "Override link A"),
      random_item("guide", "title" => "Override link B"),
    ]

    alpha_taxon = random_item("taxon", "title" => "An alpha taxon", "phase" => "alpha")
    live_taxon = random_item("taxon", "title" => "A live taxon", "phase" => "live")

    content_store_has_random_item(
      schema: "news_article",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
        "ordered_related_items_overrides" => curated_links,
      }
    )
  end

  def and_i_visit_that_page
    visit "/contextual-navigation/page-with-contextual-navigation"
  end

  def then_i_see_the_taxonomy_sidebar_and_world_locations
    expect(page).to have_css(".gem-c-taxonomy-navigation__link", text: "A live taxon")
    expect(page).to_not have_css(".related-link.gem-c-taxonomy-navigation__link")

    expect(page).to have_css(".gem-c-taxonomy-navigation__section-link", text: "World location 1")
    expect(page).to have_css(".gem-c-taxonomy-navigation__section-link", text: "World location 5")

    expect(page).to have_css(".js-hidden .gem-c-taxonomy-navigation__section-link", text: "World location 6")
    expect(page).to have_css(".gem-c-taxonomy-navigation__link.toggle-wrap", text: "+ 1 more")
  end

  def then_i_see_the_taxonomy_sidebar_and_related_links
    expect(page).to have_css(".gem-c-taxonomy-navigation__link", text: "A live taxon")
    expect(page).to have_css(".related-link.gem-c-taxonomy-navigation__link", text: "Override link A")
    expect(page).to have_css(".related-link.gem-c-taxonomy-navigation__link", text: "Override link B")
  end

  def random_item(schema_name, merge_with = {})
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema_name) do |random_item|
      random_item.merge(merge_with)
    end
  end

  def content_store_has_random_item(schema: "placeholder", links: {})
    content_item = random_item(schema, "base_path" => "/page-with-contextual-navigation",
        "links" => links)

    content_store_has_item(content_item["base_path"], content_item)
  end
end
