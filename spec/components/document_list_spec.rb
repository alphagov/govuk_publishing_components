require 'rails_helper'

describe "Document list", type: :view do
  def component_name
    "document_list"
  end

  it "renders nothing when no data is given" do
    assert_empty render_component({})
  end

  it "renders nothing when an empty array is passed in" do
    assert_empty render_component(items: [])
  end

  it "renders a document list correctly" do
    render_component(
      items: [
        {
          link: {
            text: "School behaviour and attendance: parental responsibility measures",
            path: "/government/publications/parental-responsibility-measures-for-behaviour-and-attendance"
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance"
          }
        },
        {
          link: {
            text: "School exclusion",
            path: "/government/publications/school-exclusion"
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-07-19 15:01:48 +0000"),
            document_type: "Statutory guidance"
          }
        }
      ]
    )
    li = ".gem-c-document-list__item-title"
    attribute = ".gem-c-document-list__attribute"

    assert_select "#{li} a[href='/government/publications/parental-responsibility-measures-for-behaviour-and-attendance']", text: "School behaviour and attendance: parental responsibility measures"
    assert_select "#{attribute} time", text: "5 January 2017"
    assert_select "#{attribute} time[datetime='2017-01-05T14:50:33Z']"
    assert_select ".gem-c-document-list__attribute--document-type", text: "Statutory guidance"

    assert_select "#{li} a[href='/government/publications/school-exclusion']", text: "School exclusion"
    assert_select "#{attribute} time", text: "19 July 2017"
    assert_select "#{attribute} time[datetime='2017-07-19T15:01:48Z']"
  end

  it "renders a document list with link tracking" do
    render_component(
      items: [
        {
          link: {
            text: "Link 1",
            path: "/link1",
            data_attributes: {
              track_category: "navDocumentCollectionLinkClicked",
              track_action: "1.1",
              track_label: "/link1",
              track_options: {
                dimension28: "2",
                dimension29: "Link 1"
              }
            }
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance"
          }
        },
        {
          link: {
            text: "Link 2",
            path: "/link2",
            data_attributes: {
              track_category: "navDocumentCollectionLinkClicked",
              track_action: "1.2",
              track_label: "/link2",
              track_options: {
                dimension28: "2",
                dimension29: "Link 2"
              }
            }
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-07-19 15:01:48 +0000"),
            document_type: "Statutory guidance"
          }
        }
      ]
    )
    li = ".gem-c-document-list__item-title"

    assert_select "#{li} a[href='/link1']", text: "Link 1"
    assert_select "#{li} a[data-track-category='navDocumentCollectionLinkClicked']", text: "Link 1"
    assert_select "#{li} a[data-track-action='1.1']", text: "Link 1"
    assert_select "#{li} a[data-track-label='/link1']", text: "Link 1"
    assert_select "#{li} a[data-track-options='{\"dimension28\":\"2\",\"dimension29\":\"Link 1\"}']", text: "Link 1"

    assert_select "#{li} a[href='/link2']", text: "Link 2"
    assert_select "#{li} a[data-track-category='navDocumentCollectionLinkClicked']", text: "Link 2"
    assert_select "#{li} a[data-track-action='1.2']", text: "Link 2"
    assert_select "#{li} a[data-track-label='/link2']", text: "Link 2"
    assert_select "#{li} a[data-track-options='{\"dimension28\":\"2\",\"dimension29\":\"Link 2\"}']", text: "Link 2"
  end
end
