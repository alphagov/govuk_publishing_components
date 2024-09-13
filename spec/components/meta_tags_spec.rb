require "rails_helper"

describe "Meta tags", type: :view do
  def component_name
    "meta_tags"
  end

  def example_document_for(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name:)
  end

  it "renders with an example case study" do
    render_component(content_item: example_document_for("case_study", "case_study"))
    assert_meta_tag("govuk:format", "case_study")
    assert_meta_tag("govuk:publishing-app", "whitehall")
    assert_meta_tag("govuk:rendering-app", "government-frontend")
    assert_meta_tag("govuk:organisations", "<L2><W4>")
    assert_meta_tag("govuk:world-locations", "<WL3>")
    assert_meta_tag("govuk:first-published-at", "2012-12-17T15:45:44.000+00:00")
    assert_meta_tag("govuk:updated-at", "2018-08-04T10:18:42.566Z")
    assert_meta_tag("govuk:public-updated-at", "2012-12-17T15:45:44.000+00:00")
  end

  it "no meta tags are rendered when there's no trackable data" do
    assert_empty render_component(content_item: {}).strip
  end

  it "renders format in a meta tag" do
    render_component(content_item: example_document_for("publication", "statistics_publication"))
    assert_meta_tag("govuk:format", "national_statistics")
  end

  it "renders schema-name in a meta tag" do
    render_component(content_item: example_document_for("publication", "statistics_publication"))
    assert_meta_tag("govuk:schema-name", "publication")
  end

  it "renders organisation meta tag if current page is organisation" do
    render_component(content_item: example_document_for("organisation", "organisation"))
    assert_meta_tag("govuk:organisations", "<D1197>")
    assert_meta_tag("govuk:primary-publishing-organisation", "Department for Exiting the European Union")
  end

  it "renders organisations in a meta tag with angle brackets" do
    content_item = {
      links: {
        organisations: [{ analytics_identifier: "O1" }, { analytics_identifier: "O1" }],
        worldwide_organisations: [{ analytics_identifier: "W4" }],
      },
    }

    render_component(content_item:)
    assert_meta_tag("govuk:organisations", "<O1><W4>")
  end

  it "renders world locations in a meta tag with angle brackets" do
    content_item = {
      links: {
        world_locations: [
          {
            analytics_identifier: "WL3",
          },
          {
            analytics_identifier: "WL123",
          },
        ],
      },
    }

    render_component(content_item:)
    assert_meta_tag("govuk:world-locations", "<WL3><WL123>")
  end

  it "renders publishing government slug when government and political keys included" do
    render_component(content_item: { details: { political: false, government: { current: true, slug: "government" } } })
    assert_meta_tag("govuk:publishing-government", "government")
  end

  it "does not render publishing government or political status when political or government is missing" do
    assert_empty render_component(content_item: { details: { government: { current: true, slug: "government" } } }).strip
    assert_empty render_component(content_item: { details: { political: true } }).strip
  end

  it "renders 'political' political status when political content and government is current" do
    current = true
    political = true
    assert_political_status_for(political, current, "political")
  end

  it "renders 'historic' political status when political content and government is historic" do
    current = false
    political = true
    assert_political_status_for(political, current, "historic")
  end

  it "renders 'non-political' political status when non-political content and government is current" do
    current = true
    political = false
    assert_political_status_for(political, current, "non-political")
  end

  it "renders 'non-political' political status when non-political content and government is historic" do
    current = false
    political = false
    assert_political_status_for(political, current, "non-political")
  end

  it "renders taxonomy_level1 metatag for root taxon" do
    taxon = {
      title: "Root taxon",
      base_path: "/root-taxon",
      links: {
        parent_taxons: [],
      },
    }
    render_component(content_item: example_document_for("taxon", "taxon").merge(taxon))
    assert_meta_tag("govuk:taxonomy_level1", "root-taxon")
  end

  it "renders taxonomy_level1 metatag for child taxon" do
    taxon = {
      title: "Child taxon",
      links: {
        parent_taxons: [
          {
            title: "Root taxon",
            base_path: "/root-taxon",
            document_type: "taxon",
          },
        ],
      },
    }
    render_component(content_item: example_document_for("taxon", "taxon").merge(taxon))
    assert_meta_tag("govuk:taxonomy_level1", "root-taxon")
  end

  it "renders taxonomy_level1 metatag for content item" do
    content_item = {
      links: {
        taxons: [
          {
            title: "Child taxon",
            document_type: "taxon",
            links: {
              parent_taxons: [
                {
                  title: "Root taxon",
                  base_path: "/root-taxon",
                  document_type: "taxon",
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_meta_tag("govuk:taxonomy_level1", "root-taxon")
  end

  it "renders taxonomy_level1 metatag for content item with multiple roots" do
    content_item = {
      links: {
        taxons: [
          {
            title: "Education child taxon",
            document_type: "taxon",
            links: {
              parent_taxons: [
                {
                  title: "Education root taxon",
                  base_path: "/education-root-taxon",
                  document_type: "taxon",
                },
              ],
            },
          },
          {
            title: "Parenting grandchild taxon",
            document_type: "taxon",
            links: {
              parent_taxons: [
                title: "Parenting child taxon",
                document_type: "taxon",
                links: {
                  parent_taxons: [
                    {
                      title: "Parenting root taxon",
                      base_path: "/parenting-root-taxon",
                      document_type: "taxon",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_meta_tag("govuk:taxonomy_level1", "education-root-taxon, parenting-root-taxon")
  end

  it "does not render taxonomy_level1 metatag for content item with no taxon" do
    content_item = {
      links: {},
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_select "meta[name='govuk:taxonomy_level1']", 0
  end

  it "renders taxon metatags for root taxon" do
    taxon = {
      title: "Root taxon",
      content_id: "root-taxon-id",
      base_path: "/root-taxon",
      links: {
        parent_taxons: [],
      },
    }
    render_component(content_item: example_document_for("taxon", "taxon").merge(taxon))
    assert_meta_tag("govuk:taxon-ids", "root-taxon-id")
    assert_meta_tag("govuk:taxon-id", "root-taxon-id")
    assert_meta_tag("govuk:taxon-slugs", "root-taxon")
    assert_meta_tag("govuk:taxon-slug", "root-taxon")
  end

  it "renders taxon metatags for child taxon" do
    taxon = {
      title: "Child taxon",
      content_id: "child-taxon-id",
      base_path: "/root-taxon/child-taxon",
      links: {
        parent_taxons: [
          {
            title: "Root taxon",
            base_path: "/root-taxon",
            document_type: "taxon",
          },
        ],
      },
    }
    render_component(content_item: example_document_for("taxon", "taxon").merge(taxon))
    assert_meta_tag("govuk:taxon-ids", "child-taxon-id")
    assert_meta_tag("govuk:taxon-id", "child-taxon-id")
    assert_meta_tag("govuk:taxon-slugs", "child-taxon")
    assert_meta_tag("govuk:taxon-slug", "child-taxon")
  end

  it "renders taxon metatags for content item" do
    content_item = {
      links: {
        taxons: [
          {
            title: "Child taxon",
            content_id: "child-taxon-id",
            base_path: "/root-taxon/child-taxon",
            document_type: "taxon",
            links: {
              parent_taxons: [
                {
                  title: "Root taxon",
                  content_id: "root-taxon-id",
                  base_path: "/root-taxon",
                  document_type: "taxon",
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_meta_tag("govuk:taxon-ids", "child-taxon-id")
    assert_meta_tag("govuk:taxon-id", "child-taxon-id")
    assert_meta_tag("govuk:taxon-slugs", "child-taxon")
    assert_meta_tag("govuk:taxon-slug", "child-taxon")
  end

  it "renders taxon metatags for content item with multiple taxons" do
    content_item = {
      links: {
        taxons: [
          {
            title: "Education child taxon",
            base_path: "/education/education-child-taxon",
            content_id: "education-child-taxon-id",
            document_type: "taxon",
            links: {
              parent_taxons: [
                {
                  title: "Education root taxon",
                  base_path: "/education-root-taxon",
                  document_type: "taxon",
                },
              ],
            },
          },
          {
            title: "Parenting grandchild taxon",
            content_id: "parenting-grandchild-taxon-id",
            base_path: "/parenting/parenting-grandchild-taxon",
            document_type: "taxon",
            links: {
              parent_taxons: [
                title: "Parenting child taxon",
                document_type: "taxon",
                links: {
                  parent_taxons: [
                    {
                      title: "Parenting root taxon",
                      base_path: "/parenting-root-taxon",
                      document_type: "taxon",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_meta_tag("govuk:taxon-ids", "education-child-taxon-id,parenting-grandchild-taxon-id")
    assert_meta_tag("govuk:taxon-id", "education-child-taxon-id") # Expecting first alphabetical taxon
    assert_meta_tag("govuk:taxon-slugs", "education-child-taxon,parenting-grandchild-taxon")
    assert_meta_tag("govuk:taxon-slug", "education-child-taxon") # Expecting first alphabetical taxon
  end

  it "does not render taxon ID metatag for content item with no taxon" do
    content_item = {
      links: {},
    }
    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_select "meta[name='govuk:taxon-ids']", 0
  end

  it "renders the has-content-history tag as true when the content has history" do
    content_item = {
      public_updated_at: Time.parse("2017-01-01"),
      details: {
        first_public_at: Time.parse("2016-01-01"),
        change_history: [
          { note: "test", public_timestamp: Time.parse("2016-01-01") },
        ],
      },
    }

    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))

    assert_meta_tag("govuk:content-has-history", "true")
  end

  it "renders the ga4-strip-dates tag if the content item is a 'smart-answer'" do
    render_component(content_item: { document_type: "smart_answer" })
    assert_meta_tag("govuk:ga4-strip-dates", "true")
  end

  it "doesn't render the ga4-strip-dates tag if the document_type isn't relevant" do
    render_component(content_item: { document_type: "guidance" })
    assert_no_meta_tag("govuk:ga4-strip-dates")
  end

  it "renders the ga4-strip-dates tag if explicitly told to even if it wouldn't otherwise" do
    render_component(content_item: { document_type: "guidance" }, strip_dates_pii: true)
    assert_meta_tag("govuk:ga4-strip-dates", "true")
  end

  it "doesn't render the ga4-strip-dates tag if explicitly told not to even if it would otherwise" do
    render_component(content_item: { document_type: "smart_answer" }, strip_dates_pii: false)
    assert_no_meta_tag("govuk:ga4-strip-dates")
  end

  it "renders the ga4-strip-postcodes tag if the document_type is relevant" do
    formats_that_might_include_postcodes = GovukPublishingComponents::Presenters::MetaTags::FORMATS_THAT_MIGHT_INCLUDE_POSTCODES
    formats_that_might_include_postcodes.each do |format|
      render_component(content_item: { document_type: format })
      assert_meta_tag("govuk:ga4-strip-postcodes", "true")
    end
  end

  it "doesn't render the ga4-strip-postcodes tag if the document_type isn't relevant" do
    render_component(content_item: { document_type: "guidance" })
    assert_no_meta_tag("govuk:ga4-strip-postcodes")
  end

  it "renders govuk:primary-publishing-organisation if primary_publishing_organisation" do
    content_item = {
      "links": {
        "primary_publishing_organisation": [
          {
            "title": "an organisation",
          },
        ],
      },
    }

    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_meta_tag("govuk:primary-publishing-organisation", "an organisation")
  end

  it "doesn't render govuk:primary-publishing-organisation if primary_publishing_organisation empty array" do
    content_item = {
      "links": {
        "primary_publishing_organisation": [],
      },
    }

    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_no_meta_tag("govuk:primary-publishing-organisation")
  end

  it "doesn't render govuk:primary-publishing-organisation if primary_publishing_organisation nil" do
    content_item = {
      "links": {
        "primary_publishing_organisation": nil,
      },
    }

    render_component(content_item: example_document_for("case_study", "case_study").merge(content_item))
    assert_no_meta_tag("govuk:primary-publishing-organisation")
  end

  it "renders the ga4-strip-postcodes tag if explicitly told to even if it wouldn't otherwise" do
    render_component(content_item: { document_type: "guidance" }, strip_postcode_pii: true)
    assert_meta_tag("govuk:ga4-strip-postcodes", "true")
  end

  it "doesn't render the ga4-strip-postcodes tag if explicitly told not to even if it would otherwise" do
    formats_that_might_include_postcodes = GovukPublishingComponents::Presenters::MetaTags::FORMATS_THAT_MIGHT_INCLUDE_POSTCODES
    formats_that_might_include_postcodes.each do |format|
      render_component(content_item: { document_type: format }, strip_postcode_pii: false)
      assert_no_meta_tag("govuk:ga4-strip-postcodes")
    end
  end

  it "renders govuk:ga4-browse-topic by digging down mainstream_browse_pages" do
    render_component(content_item: example_document_for("transaction", "transaction"))
    assert_meta_tag("govuk:ga4-browse-topic", "housing and local services")
  end

  it "doesn't render govuk:ga4-browse-topic if the dig doesn't return anything" do
    content_item = example_document_for("html_publication", "published_with_history_mode")
    content_item.delete("links")

    render_component(content_item:)
    assert_no_meta_tag("govuk:ga4-browse-topic")
  end

  it "renders GA4 political tags by digging down to links > government in the content item" do
    render_component(content_item: example_document_for("html_publication", "published_with_history_mode"))
    assert_meta_tag("govuk:ga4-publishing-government", "2010 to 2015 Conservative and Liberal Democrat coalition government")
    assert_meta_tag("govuk:ga4-political-status", "historic")
  end

  it "doesn't render GA4 political tags if the government object doesn't exist in the content item" do
    content_item = example_document_for("html_publication", "published_with_history_mode")
    content_item["links"].delete("government")

    render_component(content_item:)
    assert_no_meta_tag("govuk:ga4-publishing-government")
    assert_no_meta_tag("govuk:ga4-political-status")
  end

  it "doesn't crash generating GA4 political tags if details/current does not exist" do
    content_item = example_document_for("html_publication", "published_with_history_mode")
    content_item["links"]["government"][0].delete("details")

    render_component(content_item:)
    assert_meta_tag("govuk:ga4-publishing-government", "2010 to 2015 Conservative and Liberal Democrat coalition government")
    assert_meta_tag("govuk:ga4-political-status", "historic")
  end

  it "doesn't render GA4 political tags if the government object exists in the content item, but political is false" do
    content_item = example_document_for("html_publication", "published_with_history_mode")
    content_item["details"]["political"] = false
    content_item["links"] = {
      "government": [
        {
          "details": {
            "current": false,
          },
          "title": "2005 to 2010 Labour government",
        },
      ],
    }

    render_component(content_item:)
    assert_no_meta_tag("govuk:ga4-publishing-government")
    assert_no_meta_tag("govuk:ga4-political-status")
  end

  it "doesn't render GA4 political tags if the government object exists in the content item, but it refers to the current government" do
    content_item = example_document_for("html_publication", "published_with_history_mode")
    content_item["details"]["political"] = true
    content_item["links"] = {
      "government": [
        {
          "details": {
            "current": true,
          },
          "title": "2015 Conservative government",
        },
      ],
    }

    render_component(content_item:)
    assert_no_meta_tag("govuk:ga4-publishing-government")
    assert_no_meta_tag("govuk:ga4-political-status")
  end

  def assert_political_status_for(political, current, expected_political_status)
    render_component(content_item: { details: { political:, government: { current:, slug: "government" } } })
    assert_meta_tag("govuk:political-status", expected_political_status)
  end

  def assert_meta_tag(name, content)
    assert_select "meta[name='#{name}'][content='#{content}']"
  end

  def assert_no_meta_tag(name)
    assert_select "meta[name='#{name}']", count: 0
  end
end
