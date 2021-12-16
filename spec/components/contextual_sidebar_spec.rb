require "rails_helper"

describe "Contextual sidebar", type: :view do
  def component_name
    "contextual_sidebar"
  end

  it "renders the sidebar" do
    render_component(
      content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "speech"),
    )

    assert_select ".gem-c-contextual-sidebar"
  end

  it "can render in welsh" do
    I18n.with_locale(:cy) do
      render_component(
        content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: "speech"),
      )
    end
    assert_select ".gem-c-contextual-sidebar"
  end

  it "renders Brexit CTA on allowed taxons" do
    content_item = {
      "title" => "Transport news story",
      "content_id" => "3c402d90-fe77-49b9-a8aa-1800d4fc2b3d",
      "locale" => "en",
      "links" => {
        "taxons" => [
          {
            "content_id" => "13d01427-33b5-4ca4-bf7a-68425f54e236",
            "title" => "Rail",
            "phase" => "live",
            "links" => {
              "parent_taxons" => [
                {
                  "content_id" => "a4038b29-b332-4f13-98b1-1c9709e216bc",
                  "title" => "Transport",
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: content_item)
    assert_select ".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit"
  end

  it "does not render Brexit CTA when we have a document id exception" do
    content_item = {
      "title" => "30 creative teams awarded up to £100,000 each for Festival UK* 2022 R&D project",
      "content_id" => "c3752802-f091-43a9-ba90-33568fccf391",
      "locale" => "en",
      "links" => {
        "taxons" => [
          {
            "content_id" => "e2ca2f1a-0ff3-43ce-b813-16645ff27904",
            "title" => "Society and culture",
            "phase" => "live",
          },
        ],
      },
    }
    render_component(content_item: content_item)
    assert_select ".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit", 0
  end

  it "does not render Brexit CTA when we have a document type exception" do
    content_item = {
      "title" => "Transport news story",
      "content_id" => "3c402d90-fe77-49b9-a8aa-1800d4fc2b3d",
      "locale" => "en",
      "document_type" => "transaction",
      "links" => {
        "taxons" => [
          {
            "content_id" => "a4038b29-b332-4f13-98b1-1c9709e216bc",
            "title" => "Transport",
            "phase" => "live",
          },
        ],
      },
    }
    render_component(content_item: content_item)
    assert_select ".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit", 0
  end

  it "does not render Brexit CTA when we have a taxon exception" do
    content_item = {
      "title" => "Local transport news story",
      "content_id" => "5c82db20-7631-11e4-a3cb-005056011aef",
      "locale" => "en",
      "links" => {
        "taxons" => [
          {
            "content_id" => "3b4d6319-fcef-4637-b35a-e3df76321894",
            "title" => "Local transport",
            "phase" => "live",
            "links" => {
              "parent_taxons" => [
                {
                  "content_id" => "a4038b29-b332-4f13-98b1-1c9709e216bc",
                  "title" => "Transport",
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: content_item)
    assert_select ".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit", 0
  end

  it "does not render Brexit CTA when locale is not 'en' or 'cy'" do
    content_item = {
      "title" => "السعي إلى إتمام القضاء على برنامج الأسلحة الكيميائية السوري",
      "content_id" => "9ec092af-0f53-4a82-b4b0-9d016162ba01",
      "locale" => "ar",
      "links" => {
        "taxons" => [
          {
            "content_id" => "3b4d6319-fcef-4637-b35a-e3df76321894",
            "title" => "Local transport",
            "phase" => "live",
            "links" => {
              "parent_taxons" => [
                {
                  "content_id" => "a4038b29-b332-4f13-98b1-1c9709e216bc",
                  "title" => "Transport",
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: content_item)
    assert_select ".gem-c-contextual-sidebar__cta.gem-c-contextual-sidebar__cta--brexit", 0
  end
end
