require "rails_helper"

describe "TaxonomyList", type: :view do
  def component_name
    "taxonomy_list"
  end

  it "renders nothing if no parameters are passed in" do
    assert_empty render_component({})
  end

  it "renders highlight box links" do
    render_component(
      highlight_box: {
        items: [
          link: {
            text: "Education, Skills and Training",
            path: "/education",
            description: "Everything about Education",
          },
          metadata: {
            document_type: "Taxon",
          },
        ],
      },
    )

    assert_select ".gem-c-taxonomy-list .gem-c-highlight-boxes__title[href='/education']", text: "Education, Skills and Training"
    assert_select ".gem-c-taxonomy-list .gem-c-highlight-boxes__description", text: "Everything about Education"
    assert_select ".gem-c-taxonomy-list .gem-c-highlight-boxes__metadata", text: "Taxon"
  end

  it "renders document list links" do
    render_component(
      document_list: {
        items: [
          link: {
            text: "Student Finance",
            path: "/student-finance",
            description: "How to apply for student finance",
          },
          metadata: {
            document_type: "Guide",
          },
        ],
      },
    )

    assert_select ".gem-c-taxonomy-list .gem-c-document-list__item-title[href='/student-finance']", text: "Student Finance"
    assert_select ".gem-c-taxonomy-list .gem-c-document-list__item-description", text: "How to apply for student finance"
    assert_select ".gem-c-taxonomy-list .gem-c-document-list__attribute", text: "Guide"
  end

  it "renders image card links" do
    render_component(
      image_cards: {
        items: [
          {
            link: {
              path: "/apprenticeships",
              text: "Apprenticeships",
              heading_level: 0,
            },
            image: {
              url: "/path/to/image",
              alt: "Apprentices working",
            },
          },
        ],
      },
    )

    assert_select ".gem-c-taxonomy-list .gem-c-image-card__title-link[href='/apprenticeships']", text: "Apprenticeships"
    assert_select ".gem-c-taxonomy-list .gem-c-image-card__image[alt='Apprentices working']"
    assert_select ".gem-c-taxonomy-list .gem-c-image-card__image[src='/path/to/image']"
  end

  it "renders all links within one list only" do
    render_component(
      document_list: {
        items: [
          link: {
            text: "Student Finance",
            path: "/student-finance",
            description: "How to apply for student finance",
          },
          metadata: {
            document_type: "Guide",
          },
        ],
      },
      highlight_box: {
        items: [
          link: {
            text: "Education, Skills and Training",
            path: "/education",
            description: "Everything about Education",
          },
          metadata: {
            document_type: "Taxon",
          },
        ],
      },
      image_cards: {
        items: [
          {
            link: {
              path: "/apprenticeships",
              text: "Apprenticeships",
              heading_level: 0,
            },
            image: {
              url: "/path/to/image",
              alt: "Apprentices working",
            },
          },
        ],
      },
    )

    assert_select "ul.gem-c-taxonomy-list", count: 1
  end
end
