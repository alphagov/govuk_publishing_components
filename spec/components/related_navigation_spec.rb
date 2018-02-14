require "rails_helper"

describe "Related navigation", type: :view do
  def component_name
    "related_navigation"
  end

  it "renders nothing when no parameters given" do
    assert_empty render_component({})
  end

  it "renders related content section when passed related items" do
    render_component(
      related_items: [
        {
          text: "Apprenticeships",
          path: '/apprenticeships'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__main-heading", text: 'Related content'
    assert_select ".gem-c-related-navigation__section-link--other[href=\"/apprenticeships\"]", text: 'Apprenticeships'
  end

  it "renders related guides section when passed related guides" do
    render_component(
      related_guides: [
        {
          text: "Some other guidance",
          path: '/something-a-bit-like-this'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Detailed guidance'
    assert_select ".gem-c-related-navigation__section-link[href=\"/something-a-bit-like-this\"]", text: 'Some other guidance'
  end

  it "renders topics section when passed topic items" do
    render_component(
      topics: [
        {
          text: "Finding a job",
          path: '/finding-a-job'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Explore the topic'
    assert_select ".gem-c-related-navigation__section-link[href=\"/finding-a-job\"]", text: 'Finding a job'
  end

  it "renders statistical data set section when passed statistical data set items" do
    render_component(
      statistical_data_sets: [
        {
          text: "Air quality statistics",
          path: '/air-quality-statistics'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Statistical data set'
    assert_select ".gem-c-related-navigation__section-link[href=\"/air-quality-statistics\"]", text: 'Air quality statistics'
  end

  it "renders world locations section when passed world location items" do
    render_component(
      world_locations: [
        {
          text: "USA",
          path: '/world/usa/news'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'World locations'
    assert_select ".gem-c-related-navigation__section-link[href=\"/world/usa/news\"]", text: 'USA'
  end

  it "renders collection section when passed collection items" do
    render_component(
      collections: [
        {
          text: "The future of jobs and skills",
          path: '/government/collections/the-future-of-jobs-and-skills'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Collection'
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/collections/the-future-of-jobs-and-skills\"]", text: 'The future of jobs and skills'
  end

  it "renders policy section when passed policy items" do
    render_component(
      policies: [
        {
          text: "Further education and training",
          path: '/government/policies/further-education-and-training'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Policy'
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/policies/further-education-and-training\"]", text: 'Further education and training'
  end

  it "renders topical events section when passed topical event items" do
    render_component(
      topical_events: [
        {
          text: "UK-China High-Level People to People Dialogue 2017",
          path: '/government/topical-events/uk-china-high-level-people-to-people-dialogue-2017'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Topical event'
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/topical-events/uk-china-high-level-people-to-people-dialogue-2017\"]", text: 'UK-China High-Level People to People Dialogue 2017'
  end

  it "renders other links section when passed external related links" do
    render_component(
      other: [
        [
          {
            title: "Elsewhere on the web",
            links: [{
              text: "The Student Room repaying your student loan",
              path: 'https://www.thestudentroom.co.uk/content.php?r=5967-Repaying-your-student-loan'
            }]
          }
        ]
      ]
    )

    assert_select ".gem-c-related-navigation__sub-heading--other", text: 'Elsewhere on the web'
    assert_select ".gem-c-related-navigation__section-link--other[href=\"https://www.thestudentroom.co.uk/content.php?r=5967-Repaying-your-student-loan\"]", text: 'The Student Room repaying your student loan'
  end

  it "renders external links with rel=external" do
    render_component(
      policies: [
        {
          text: "Further education and training",
          path: '/government/policies/further-education-and-training',
          rel: "external"
        }
      ]
    )

    assert_select ".gem-c-related-navigation__section-link[rel=\"external\"]"
  end

  it "adds aria labelledby to navigation sections" do
    render_component(
      topics: [
        {
          text: "Apprenticeships",
          path: '/apprenticeships'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__nav-section[aria-labelledby]"
  end

  it "adds a show more toggle link to long sections" do
    render_component(
      world_locations: [
        {
          text: 'USA',
          path: '/usa'
        },
        {
          text: 'Wales',
          path: '/wales'
        },
        {
          text: 'Fiji',
          path: '/fiji'
        },
        {
          text: 'Iceland',
          path: '/iceland'
        },
        {
          text: 'Sweden',
          path: '/sweden'
        },
        {
          text: 'Mauritius',
          path: '/mauritius'
        },
        {
          text: 'Brazil',
          path: '/brazil'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__section-link[href=\"/wales\"]", text: 'Wales'
    assert_select ".gem-c-related-navigation__link.toggle-wrap", text: '+ 2 more'
    assert_select "#toggle_world_locations .gem-c-related-navigation__section-link[href=\"/mauritius\"]", text: 'Mauritius'
    assert_select "#toggle_world_locations .gem-c-related-navigation__section-link[href=\"/brazil\"]", text: 'Brazil'
  end

  it "does not use a Show More for only one link above the max per section" do
    render_component(
      world_locations: [
        {
          text: 'USA',
          path: '/usa'
        },
        {
          text: 'Wales',
          path: '/wales'
        },
        {
          text: 'Fiji',
          path: '/fiji'
        },
        {
          text: 'Iceland',
          path: '/iceland'
        },
        {
          text: 'Sweden',
          path: '/sweden'
        },
        {
          text: 'Mauritius',
          path: '/mauritius'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__section-link[href=\"/wales\"]", text: 'Wales'
    assert_select ".gem-c-related-navigation__link.toggle-wrap", false, "Progressive disclosure should not display for only 1 link"
  end

  it "renders multiple items when passed data for multiple sections" do
    render_component(
      related_items: [
        {
          text: "Apprenticeships",
          path: '/apprenticeships'
        }
      ],
      policies: [
        {
          text: "Further education and training",
          path: '/government/policies/further-education-and-training'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__main-heading", text: 'Related content'
    assert_select ".gem-c-related-navigation__section-link--other[href=\"/apprenticeships\"]", text: 'Apprenticeships'

    assert_select ".gem-c-related-navigation__sub-heading", text: 'Policy'
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/policies/further-education-and-training\"]", text: 'Further education and training'
  end

  it "link tracking is enabled" do
    render_component(
      topics: [
        {
          text: "Apprenticeships",
          path: '/apprenticeships'
        }
      ]
    )

    assert_select ".gem-c-related-navigation__nav-section ul[data-module='track-click']"
    assert_select ".gem-c-related-navigation__section-link[data-track-category='relatedLinkClicked']"
    assert_select ".gem-c-related-navigation__section-link[data-track-action='1.1 Explore the topic']"
    assert_select ".gem-c-related-navigation__section-link[data-track-label='/apprenticeships']"
  end
end
