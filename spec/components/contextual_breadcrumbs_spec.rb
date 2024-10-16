require "rails_helper"

describe "ContextualBreadcrumbs", type: :view do
  def component_name
    "contextual_breadcrumbs"
  end

  def example_document_for(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name:)
  end

  def remove_mainstream_browse(content_item)
    content_item["links"].delete("mainstream_browse_pages")
    content_item
  end

  def remove_curated_related_item(content_item)
    content_item["links"].delete("ordered_related_items")
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

  it "renders breadcrumbs that collapse on mobile by default" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item:)
    assert_select ".gem-c-breadcrumbs.govuk-breadcrumbs--collapse-on-mobile"
  end

  it "renders breadcrumbs that don't collapse on mobile if flag is passed" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item:, collapse_on_mobile: false)
    assert_select ".gem-c-breadcrumbs.gem-c-breadcrumbs--collapse-on-mobile", false
  end

  it "renders step by step breadcrumbs and step by step header if the content item is tagged to step by step" do
    render_component(content_item: example_document_for("guide", "guide-with-step-navs"))
    assert_select(".gem-c-step-nav-header")
    assert_select "a", text: "Learn to drive a car: step by step"
  end

  it "renders parent-based breadcrumbs if the content_item is tagged to mainstream browse and there is a parent" do
    render_component(content_item: example_document_for("place", "find-regional-passport-office"))
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "Passports, travel and living abroad"
    assert_select "a", text: "Passports"
  end

  it "renders inverse parent-based breadcrumbs if the content_item is tagged to mainstream browse" do
    render_component(content_item: example_document_for("place", "find-regional-passport-office"), inverse: true)
    assert_select ".gem-c-breadcrumbs.gem-c-breadcrumbs--inverse"
  end

  it "renders curated related items breadcrumbs if the content_item has curated related items" do
    content_item = example_document_for("licence", "licence_without_continuation_link")
    content_item = remove_mainstream_browse(content_item)
    render_component(content_item:)
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "Business and self-employed"
    assert_select "a", text: "Licences and licence applications"
  end

  it "renders taxon breadcrumbs if the content_item is tagged to mainstream browse but there is no mainstream browse parent" do
    content_item = example_document_for("guide", "guide-with-no-parent")
    content_item = set_live_taxons(content_item)
    render_component(content_item:)
    assert_no_selector(".gem-c-step-nav-header")
    assert_select "a", text: "Home"
    assert_select "a", text: "School curriculum"
    assert_select "a", text: "Education, training and skills"
  end

  it "renders inverse taxon breadcrumbs if there are some and no mainstream or curated_content" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item = set_live_taxons(content_item)
    render_component(content_item:, inverse: true)
    assert_select ".gem-c-breadcrumbs.gem-c-breadcrumbs--inverse"
  end

  it "renders parent-based breadcrumbs if the content item is a corporate information page with a parent" do
    content_item = example_document_for("corporate_information_page", "corporate_information_page_complaints")
    render_component(content_item:)
    assert_select "a", text: "Home"
    assert_select "a", text: "Department of Health"
    assert_select "a", text: "About us"
  end

  it "renders organisation breadcrumbs if the content item is a corporate information page with no parent but with a linked organisation" do
    content_item = example_document_for("corporate_information_page", "best-practice-about-page")
    render_component(content_item:)
    assert_select "a", text: "Home"
    assert_select "a", text: "Organisations"
    assert_select "a", text: "Intellectual Property Office"
  end

  it "renders no taxon breadcrumbs if they are not live" do
    content_item = example_document_for("guide", "guide")
    content_item = remove_mainstream_browse(content_item)
    content_item = remove_curated_related_item(content_item)
    content_item["links"]["taxons"].each { |taxon| taxon["phase"] = "draft" }
    assert_no_selector(".gem-c-step-nav-header")
    assert_no_selector(".gem-c-breadcrumbs")
  end

  it "renders parent finder breadcrumb if content schema is a specialist document" do
    content_item = example_document_for("specialist_document", "cma-cases")
    content_item["links"]["taxons"] = [
      {
        api_path: "/api/content/business/competition",
        base_path: "/business/competition",
        document_type: "taxon",
        phase: "live",
        links: {
          parent_taxons: [
            {
              api_path: "/api/content/business-and-industry/business-regulation",
              base_path: "/business-and-industry/business-regulation",
              document_type: "taxon",
              phase: "live",
              links: {},
            },
          ],
        },
      },
    ]

    render_component(content_item:)

    assert_select "a", text: "Home"
    assert_select "a", text: "Competition and Markets Authority cases"
  end

  it "renders parent finder breadcrumb if content has a finder linked" do
    content_item = example_document_for("guide", "guide-with-facet-groups")
    render_component(content_item:)

    assert_select "a", text: "Home"
    assert_select "a", text: "EU Withdrawal Act 2018 statutory instruments"
  end

  it "renders parent finder breadcrumb if content has a finder linked and taxon is prioritised" do
    content_item = example_document_for("guide", "guide-with-facet-groups")
    render_component(content_item:, prioritise_taxon_breadcrumbs: true)

    assert_select "a", text: "Home"
    assert_select "a", text: "EU Withdrawal Act 2018 statutory instruments"
  end

  it "renders inverse parent finder breadcrumb" do
    content_item = example_document_for("guide", "guide-with-facet-groups")
    render_component(content_item:, prioritise_taxon_breadcrumbs: true, inverse: true)
    assert_select ".gem-c-breadcrumbs.gem-c-breadcrumbs--inverse"
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
    render_component(content_item:, prioritise_taxon_breadcrumbs: true)
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
    render_component(content_item:, prioritise_taxon_breadcrumbs: false)
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
    render_component(content_item:)
    assert_select "a", text: "Home"
    assert_select "a", text: "Business and self-employed"
    assert_select "a", text: "Licences and licence applications"
    assert_no_selector "a", text: "School curriculum"
    assert_no_selector "a", text: "Education, training and skills"
  end
end
