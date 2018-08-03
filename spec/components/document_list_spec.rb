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

  it 'adds spacing around the document list when margin flags are set' do
    render_component(
      margin_bottom: true,
      margin_top: true,
      items: [
        {
          link: {
            text: "School behaviour and attendance: parental responsibility measures",
            path: "/government/publications/parental-responsibility-measures-for-behaviour-and-attendance",
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance"
          }
        }
      ]
    )

    assert_select '.gem-c-document-list.gem-c-document-list--top-margin.gem-c-document-list--bottom-margin'
  end

  it "renders a document list correctly" do
    render_component(
      items: [
        {
          link: {
            text: "School behaviour and attendance: parental responsibility measures",
            path: "/government/publications/parental-responsibility-measures-for-behaviour-and-attendance",
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance"
          }
        },
        {
          link: {
            text: "Become an apprentice",
            path: "/become-an-apprentice",
            description: 'Becoming an apprentice - what to expect'
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

    assert_select "#{li}[href='/government/publications/parental-responsibility-measures-for-behaviour-and-attendance']", text: "School behaviour and attendance: parental responsibility measures"
    assert_select "#{attribute} time", text: "5 January 2017"
    assert_select "#{attribute} time[datetime='2017-01-05T14:50:33Z']"
    assert_select ".gem-c-document-list__attribute", text: "Statutory guidance"

    assert_select "#{li}[href='/become-an-apprentice']", text: "Become an apprentice"
    assert_select ".gem-c-document-list__item-description", text: 'Becoming an apprentice - what to expect'
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

    assert_select "#{li}[href='/link1']", text: "Link 1"
    assert_select "#{li}[data-track-category='navDocumentCollectionLinkClicked']", text: "Link 1"
    assert_select "#{li}[data-track-action='1.1']", text: "Link 1"
    assert_select "#{li}[data-track-label='/link1']", text: "Link 1"
    assert_select "#{li}[data-track-options='{\"dimension28\":\"2\",\"dimension29\":\"Link 1\"}']", text: "Link 1"

    assert_select "#{li}[href='/link2']", text: "Link 2"
    assert_select "#{li}[data-track-category='navDocumentCollectionLinkClicked']", text: "Link 2"
    assert_select "#{li}[data-track-action='1.2']", text: "Link 2"
    assert_select "#{li}[data-track-label='/link2']", text: "Link 2"
    assert_select "#{li}[data-track-options='{\"dimension28\":\"2\",\"dimension29\":\"Link 2\"}']", text: "Link 2"
  end

  it "adds branding correctly" do
    render_component(
      brand: 'attorney-generals-office',
      items: [
        {
          link: {
            text: "School behaviour and attendance: parental responsibility measures",
            path: "/government/publications/parental-responsibility-measures-for-behaviour-and-attendance",
          },
          metadata: {
            public_updated_at: Time.zone.parse("2017-01-05 14:50:33 +0000"),
            document_type: "Statutory guidance"
          }
        }
      ]
    )

    assert_select '.gem-c-document-list.brand--attorney-generals-office'
    assert_select '.gem-c-document-list .gem-c-document-list__item-title.brand__color'
  end

  it "does not wrap link in heading element if no description or metadata provided" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
          }
        }
      ]
    )

    assert_select '.gem-c-document-list__item h3', false, 'Element should not be wrapped in heading if it is not acting as a heading for any other content'
    assert_select '.gem-c-document-list__item a[href="/link/path"]', text: 'Link Title'
  end

  it "renders the item title with context when provided" do
    render_component(
      items: [
        {
          link: {
            text: "Link Title",
            path: "/link/path",
            context: "some context"
          }
        }
      ]
    )

    assert_select '.gem-c-document-list__item-title--context[href="/link/path"]', text: 'Link Title'
    assert_select '.gem-c-document-list__item-context', text: 'some context'
  end
end
