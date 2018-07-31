require "rails_helper"

describe "ContextualBreadcrumbs", type: :view do
  def component_name
    "contextual_breadcrumbs"
  end

  def example_document_for(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name: example_name)
  end

  def remove_mainstream_browse(content_item)
    content_item["links"]["mainstream_browse_pages"] = nil
    content_item
  end

  def remove_curated_related_item(content_item)
    content_item["links"]["ordered_related_items"] = nil
    content_item
  end

  def set_parent_titles_to_businesses(content_item)
    content_item["links"]["parent"][0]["title"] = "Business and self-employed"
    content_item["links"]["parent"][0]["links"]["parent"][0]["title"] = "Licences and licence applications"
    content_item
  end

  def set_live_taxons(content_item)
    content_item["links"]["taxons"][0]["phase"] = "live"
    content_item["links"]["taxons"][0]["links"]["parent_taxons"][0]["phase"] = "live"
    content_item
  end

  it "renders step by step breadcrumbs and step by step header if the content item is tagged to step by step" do
    render_component(content_item: example_document_for("guide", "guide-with-step-navs"))
    assert_select(".gem-c-step-nav-header")
    assert_select "a", text: "Learn to drive a car: step by step"
  end

  it "renders parent-based breadcrumbs if the content_item is tagged to mainstream browse" do
    render_component(content_item: example_document_for("place", "find-regional-passport-office"))
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "Passports, travel and living abroad"
    assert_select "a", text: "Passports"
  end

  it "renders curated related items breadcrumbs if the content_item has curated related items" do
    content_item = example_document_for("licence", "licence_without_continuation_link")
    content_item = remove_mainstream_browse(content_item)
    render_component(content_item: content_item)
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "Business and self-employed"
    assert_select "a", text: "Licences and licence applications"
  end

  it "renders taxon breadcrumbs if there are some and no mainstream or curated_content" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item: content_item)
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "School curriculum"
    assert_select "a", text: "Education, training and skills"
  end

  it "renders no taxon breadcrumbs if they are not live" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item["links"]["taxons"].each { |taxon| taxon["phase"] = "draft" }
    assert_no_selector(".gem-c-step-nav-header")
    assert_no_selector(".gem-c-breadcrumbs")
  end

  it "renders no breadcrumbs if there aren't any" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item["links"]["taxons"] = nil
    assert_no_selector(".gem-c-step-nav-header")
    assert_no_selector(".gem-c-breadcrumbs")
  end

  it "renders taxon breadcrumbs even if there are mainstream browse pages if prioritise_taxon_breadcrumbs is true" do
    content_item = example_document_for("guide", "guide")
    content_item = set_parent_titles_to_businesses(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item: content_item, prioritise_taxon_breadcrumbs: true)
    assert_select "a", text: "Home"
    assert_no_selector "a", text: "Business and self-employed"
    assert_no_selector "a", text: "Licences and licence applications"
    assert_select "a", text: "School curriculum"
    assert_select "a", text: "Education, training and skills"
  end

  it "renders mainstream browse pages if prioritise_taxon_breadcrumbs is false and there are live taxons" do
    content_item = example_document_for("guide", "guide")
    content_item = set_parent_titles_to_businesses(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item: content_item, prioritise_taxon_breadcrumbs: false)
    assert_select "a", text: "Home"
    assert_select "a", text: "Business and self-employed"
    assert_select "a", text: "Licences and licence applications"
    assert_no_selector "a", text: "School curriculum"
    assert_no_selector "a", text: "Education, training and skills"
  end

  it "renders mainstream browse pages if prioritise_taxon_breadcrumbs is not passed and are live taxons" do
    content_item = example_document_for("guide", "guide")
    content_item = set_parent_titles_to_businesses(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item: content_item)
    assert_select "a", text: "Home"
    assert_select "a", text: "Business and self-employed"
    assert_select "a", text: "Licences and licence applications"
    assert_no_selector "a", text: "School curriculum"
    assert_no_selector "a", text: "Education, training and skills"
  end
end
