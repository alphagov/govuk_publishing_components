require "rails_helper"

describe "Contextual navigation" do
  scenario "There is a brexit taxon" do
    given_theres_a_page_with_brexit_taxon
    and_i_visit_that_page
    and_i_see_the_brexit_contextual_breadcrumbs
    and_i_see_the_brexit_call_to_action
  end

  scenario "There is a page tagged to the brexit business child taxon" do
    given_theres_a_page_tagged_to_the_brexit_business_taxon
    and_i_visit_that_page
    then_i_see_the_brexit_business_contextual_breadcrumbs
  end

  scenario "There is a page tagged to the brexit individuals child taxon" do
    given_theres_a_page_tagged_to_the_brexit_individuals_taxon
    and_i_visit_that_page
    then_i_see_the_brexit_individuals_contextual_breadcrumbs
  end

  scenario "There is a page tagged to both brexit child taxons" do
    given_theres_a_page_tagged_to_both_child_taxons
    and_i_visit_that_page
    and_i_see_the_brexit_contextual_breadcrumbs
  end

  scenario "There's a step by step list" do
    given_theres_a_page_with_a_step_by_step
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
    and_i_do_not_see_the_brexit_call_to_action
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
    given_theres_a_browse_page
    and_i_visit_that_page
    then_i_see_the_browse_page_in_the_footer
    and_the_default_breadcrumbs
  end

  scenario "Foreign travel advice content" do
    given_theres_a_travel_advice_page
    and_i_visit_that_page
    then_i_see_parent_breadcrumbs
  end

  scenario "The page has curated related items" do
    given_theres_a_page_with_related_items
    and_i_visit_that_page
    then_i_see_the_related_links_sidebar
    and_the_default_breadcrumbs
  end

  scenario "The page has a topic" do
    given_theres_a_page_with_a_topic
    and_i_visit_that_page
    then_i_see_the_topic_breadcrumb
  end

  scenario "The page has many topics" do
    given_theres_a_page_with_more_than_one_topic
    and_i_visit_that_page
    then_i_see_the_topic_breadcrumb
    and_i_see_the_both_topics_in_the_related_navigation_footer
  end

  scenario "It's a HTML Publication document" do
    given_there_is_a_non_step_by_step_parent_page
    and_the_page_is_an_html_publication_with_that_parent
    and_i_visit_that_page
    then_i_see_home_and_parent_links
  end

  scenario "A page is tagged to the brexit taxon and a step_by_step" do
    given_theres_a_page_with_brexit_taxon_tagged_to_step_by_step
    and_i_visit_that_page
    then_i_see_the_step_by_step
    and_the_step_by_step_header
    and_i_do_not_see_the_brexit_contextual_breadcrumbs
    and_i_see_the_brexit_call_to_action
  end

  scenario "It's a HTML Publication with a parent with breadcrumbs" do
    given_there_is_a_parent_page_with_two_taxon
    and_the_page_is_an_html_publication_with_that_parent
    and_i_visit_that_page
    then_i_see_home_and_parent_breadcrumbs
    then_i_see_four_breadcrumb_links # home, 2 x taxon, parent
  end

  scenario "It's a HTML Publication with a parent tagged to a step by step" do
    given_there_is_a_parent_page_with_a_step_by_step
    and_the_page_is_an_html_publication_with_that_parent
    and_i_visit_that_page
    then_i_see_the_step_by_step_breadcrumbs
  end

  scenario "There's a taxon tagged" do
    given_theres_a_guide_with_a_live_taxon_tagged_to_it
    and_i_visit_that_page
    then_i_see_the_taxon_in_the_related_navigation_footer
    and_the_taxonomy_breadcrumbs
  end

  scenario "A browse page has a topic" do
    given_theres_a_browse_page_with_a_topic
    and_i_visit_that_page
    then_i_see_the_topic_in_the_related_navigation_footer
    and_the_default_breadcrumbs
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
    part_of_step_nav = random_step_nav_item("step_by_step_nav")
    part_of_step_nav["title"] = "PRIMARY STEP BY STEP"

    content_store_has_random_item(links: {
      secondary_to_step_navs: [random_step_nav_item("step_by_step_nav")],
      part_of_step_navs: [part_of_step_nav],
    })
  end

  def given_there_are_two_primary_step_by_steps_and_one_secondary_to_step_navs
    part_of_step_navs = 2.times.map { random_step_nav_item("step_by_step_nav") }
    part_of_step_navs[0]["title"] = "PRIMARY STEP BY STEP - NOT INTERACTING WITH"
    part_of_step_navs[1]["content_id"] = "8ad999bd-8603-40eb-97c0-999cb22047cd"
    part_of_step_navs[1]["title"] = "PRIMARY STEP BY STEP - INTERACTING WITH"

    secondary_to_step_nav = random_step_nav_item("step_by_step_nav")
    secondary_to_step_nav["title"] = "SECONDARY STEP BY STEP"

    content_store_has_random_item(links: {
      part_of_step_navs: part_of_step_navs,
      secondary_to_step_navs: [secondary_to_step_nav],
    })
  end

  def given_there_is_a_related_to_step_nav
    content_store_has_random_item(links: {
      related_to_step_navs: [random_step_nav_item("step_by_step_nav")],
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
      secondary_to_step_navs: [random_step_nav_item("step_by_step_nav")],
    })
  end

  def given_theres_a_browse_page
    content_store_has_random_item(
      links: {
        "parent" => [top_level_mainstream_browse_page],
        "mainstream_browse_pages" => [example_item("mainstream_browse_page", "root_page")],
      },
    )
  end

  def given_theres_a_travel_advice_page
    content_store_has_random_item(
      schema: "travel_advice",
      links: {
        "topics" => [topic_item],
        "parent" => [example_parent_page],
      },
    )
  end

  def given_theres_a_page_with_related_items
    content_store_has_random_item(
      links: {
        "parent" => [top_level_mainstream_browse_page],
        "ordered_related_items" => [example_item("guide", "guide")],
      },
    )
  end

  def given_theres_a_guide_with_a_live_taxon_tagged_to_it
    alpha_taxon = example_item("taxon", "taxon_in_alpha_phase")
    live_taxon = taxon_item

    content_store_has_random_item(
      schema: "guide",
      links: {
        "taxons" => [live_taxon, alpha_taxon],
      },
    )
  end

  def given_theres_a_browse_page_with_a_topic
    content_store_has_random_item(links: {
      "topics" => [topic_item],
      "mainstream_browse_pages" => [top_level_mainstream_browse_page],
      "parent" => [top_level_mainstream_browse_page],
    })
  end

  def given_theres_a_page_with_a_topic
    content_store_has_random_item(links: { "topics" => [topic_item] })
  end

  def given_theres_a_page_with_more_than_one_topic
    content_store_has_random_item(
      links: { "topics" => [topic_item, second_topic_item] },
    )
  end

  def given_theres_a_page_with_brexit_taxon_tagged_to_step_by_step
    given_theres_a_page_with_brexit_taxon(part_of_step_navs: true)
  end

  def given_theres_a_page_with_brexit_taxon(part_of_step_navs: nil)
    live_taxon = taxon_item
    live_taxon["links"]["parent_taxons"] = [brexit_taxon]
    links = { "taxons" => [live_taxon] }

    if part_of_step_navs == true
      links[:part_of_step_navs] = []
      links[:part_of_step_navs] << random_step_nav_item("step_by_step_nav")
    end

    content_store_has_random_item(
      links: links,
    )
  end

  def given_theres_a_page_tagged_to_the_brexit_business_taxon
    tag_page_to_a_taxon(brexit_business_taxon)
  end

  def given_theres_a_page_tagged_to_the_brexit_individuals_taxon
    tag_page_to_a_taxon(brexit_individuals_taxon)
  end

  def given_theres_a_page_tagged_to_both_child_taxons
    tag_page_to_a_taxon(brexit_individuals_taxon, brexit_business_taxon)
  end

  def tag_page_to_a_taxon(*taxons)
    content_store_has_random_item(
      links: {
        "taxons" => taxons,
      },
    )
  end

  def given_there_is_a_non_step_by_step_parent_page
    @parent = not_step_by_step_content
  end

  def not_step_by_step_content
    not_step_by_step_content = random_item("placeholder")
    not_step_by_step_content["links"].delete("part_of_step_navs")
    not_step_by_step_content["links"].delete("secondary_to_step_navs")
    not_step_by_step_content
  end

  def given_there_is_a_parent_page_with_two_taxon
    taxon = taxon_item
    taxon_two = taxon_item
    @parent = random_item("guide")
    @parent["links"] = { "taxons" => [taxon, taxon_two] }
  end

  def given_there_is_a_parent_page_with_a_step_by_step
    step_by_step = random_step_nav_item("step_by_step_nav").merge("title" => "A step by step page")

    @parent = random_item("placeholder")
    @parent["links"]["part_of_step_navs"] = [step_by_step]
    @parent["links"].delete("finder")
  end

  def and_the_page_is_an_html_publication_with_that_parent
    content_item = example_item("html_publication", "published")
    content_item["base_path"] = "/page-with-contextual-navigation"
    content_item["links"]["parent"] = [@parent]

    stub_content_store_has_item(@parent["base_path"], @parent)
    stub_content_store_has_item(content_item["base_path"], content_item)
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

  def then_i_see_the_topic_breadcrumb
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(topic_item["title"])
    end
  end

  def and_the_default_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(top_level_mainstream_browse_page["title"])
    end
  end

  def then_i_see_parent_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(example_parent_page["title"])
    end
  end

  def and_the_taxonomy_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(taxon_item["title"])
    end
  end

  def and_i_do_not_see_the_brexit_contextual_breadcrumbs
    within ".gem-c-contextual-breadcrumbs" do
      expect(page).not_to have_link(brexit_taxon["title"])
    end
  end

  def and_i_see_the_brexit_contextual_breadcrumbs(taxon = nil)
    title = taxon.nil? ? brexit_taxon["title"] : taxon["title"]

    within ".gem-c-step-nav-header" do
      expect(page).to have_content("Part of")
      expect(page).to have_link(title)
    end
  end

  def then_i_see_the_brexit_business_contextual_breadcrumbs
    and_i_see_the_brexit_contextual_breadcrumbs(brexit_business_taxon)
  end

  def then_i_see_the_brexit_individuals_contextual_breadcrumbs
    and_i_see_the_brexit_contextual_breadcrumbs(brexit_individuals_taxon)
  end

  def and_i_see_the_brexit_call_to_action
    within ".gem-c-contextual-sidebar" do
      expect(page).to have_selector(".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit")
      expect(page).to have_css(".gem-c-contextual-sidebar__heading", text: I18n.t("components.related_navigation.transition.title"))
    end
  end

  def and_i_do_not_see_the_brexit_call_to_action
    within ".gem-c-contextual-sidebar" do
      expect(page).not_to have_selector(".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit")
    end
  end

  def then_i_see_the_step_by_step_breadcrumbs
    within ".gem-c-contextual-breadcrumbs" do
      expect(page).to have_link("A step by step page")
    end
  end

  def then_i_see_the_taxon_in_the_related_navigation_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_css(".gem-c-related-navigation__link", text: taxon_item["title"])
    end
  end

  def then_i_see_the_topic_in_the_related_navigation_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_css(".gem-c-related-navigation__link", text: topic_item["title"])
    end
  end

  def and_i_see_the_both_topics_in_the_related_navigation_footer
    within ".gem-c-contextual-footer" do
      expect(page).to have_css(".gem-c-related-navigation__link", text: topic_item["title"])
      expect(page).to have_css(".gem-c-related-navigation__link", text: second_topic_item["title"])
    end
  end

  # Use links version if output could be either step by step or breadcrumbs
  def then_i_see_home_and_parent_links
    within ".gem-c-contextual-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(@parent["title"])
    end
  end

  def then_i_see_home_and_parent_breadcrumbs
    within ".gem-c-breadcrumbs" do
      expect(page).to have_link("Home")
      expect(page).to have_link(@parent["title"])
    end
  end

  def then_i_see_four_breadcrumb_links
    within(".gem-c-breadcrumbs") do
      expect(page).to have_selector(".govuk-breadcrumbs__list-item", count: 4)
    end
  end

  def then_i_do_not_see_home_and_parent_breadcrumbs
    expect(page).not_to have_selector(".gem-c-breadcrumbs")
  end

  def content_store_has_random_item(schema: "placeholder", links: {})
    content_item = random_item(
      schema,
      "base_path" => "/page-with-contextual-navigation",
      "links" => links,
    )

    stub_content_store_has_item(content_item["base_path"], content_item)
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

  def brexit_taxon
    {
      "content_id" => "d6c2de5d-ef90-45d1-82d4-5f2438369eea",
      "api_path" => "/api/content/brexit",
      "base_path" => "/brexit",
      "title" => "Brexit",
      "locale" => "en",
    }
  end

  def brexit_business_taxon
    {
      "content_id" => "634fd193-8039-4a70-a059-919c34ff4bfc",
      "api_path" => "/api/content/brexit/business-guidance",
      "base_path" => "/brexit/business-guidance",
      "title" => "Brexit: business guidance",
      "locale" => "en",
      "links" => {
        "parent_taxons" => [brexit_taxon],
      },
    }
  end

  def brexit_individuals_taxon
    {
      "content_id" => "614b2e65-56ac-4f8d-bb9c-d1a14167ba25",
      "api_path" => "/api/content/brexit/guidance-individuals",
      "base_path" => "/brexit/guidance-individuals",
      "title" => "Brexit: guidance for individuals",
      "locale" => "en",
      "links" => {
        "parent_taxons" => [brexit_taxon],
      },
    }
  end

  def example_parent_page
    @example_parent_page ||= example_item("answer", "answer")
  end

  def top_level_mainstream_browse_page
    @top_level_mainstream_browse_page ||= example_item("mainstream_browse_page", "top_level_page")
  end

  def taxon_item
    @taxon_item ||= example_item("taxon", "taxon")
  end

  def topic_item
    @topic_item ||= example_item("topic", "topic")
  end

  def second_topic_item
    @second_topic_item ||= example_item("topic", "curated_subtopic")
  end
end
