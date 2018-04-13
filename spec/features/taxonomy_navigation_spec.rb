require "rails_helper"

describe "Taxonomy navigation" do
  scenario "There's a taxon tagged to content with many world locations" do
    given_theres_a_guide_with_a_live_taxon_and_many_world_locations_tagged_to_it
    and_i_visit_that_page
    then_i_see_the_taxonomy_sidebar_and_world_locations
  end
  include GdsApi::TestHelpers::ContentStore
  include Slimmer::TestHelpers::GovukComponents

  def given_theres_a_guide_with_a_live_taxon_and_many_world_locations_tagged_to_it
    locations = []
    6.times { |n| locations << random_item("world_location", "title" => "World location #{n + 1}") }
    alpha_taxon = random_item("taxon", "title" => "An alpha taxon", "phase" => "alpha")
    live_taxon = random_item("taxon", "title" => "A live taxon", "phase" => "live")

    stub_request(:get, "http://rummager.dev.gov.uk/search.json?count=3&fields%5B%5D=link&fields%5B%5D=title&filter_taxons%5B%5D=#{live_taxon['content_id']}&similar_to=/page-with-contextual-navigation&start=0").
      to_return(body: { results: [{ title: 'A similar item' }] }.to_json)

    content_store_has_random_item(
      schema: "news_article",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
        "world_locations" => locations,
      }
    )
  end

  def and_i_visit_that_page
    visit "/contextual-navigation/page-with-contextual-navigation"
  end

  def then_i_see_the_taxonomy_sidebar_and_world_locations
    expect(page).to have_css(".gem-c-taxonomy-navigation__link", text: "A live taxon")
    expect(page).to have_css(".related-link.gem-c-taxonomy-navigation__link", text: "A similar item")

    expect(page).to have_css(".gem-c-taxonomy-navigation__section-link", text: "World location 1")
    expect(page).to have_css(".gem-c-taxonomy-navigation__section-link", text: "World location 5")

    expect(page).to have_css(".js-hidden .gem-c-taxonomy-navigation__section-link", text: "World location 6")
    expect(page).to have_css(".gem-c-taxonomy-navigation__link.toggle-wrap", text: "+ 1 more")
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
