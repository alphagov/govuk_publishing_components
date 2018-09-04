require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::PageWithStepByStepNavigation do
  let(:content_item) {
    payload_for(
      "guide",
      "links" => {
        "part_of_step_navs" => [
          {
            "api_path": "/api/content/learn-to-drive-a-car",
            "base_path": "/learn-to-drive-a-car",
            "content_id": "e01e924b-9c7c-4c71-8241-66a575c2f61f",
            "description": "Learn to drive a car in the UK - get a provisional licence, take driving lessons, prepare for your theory test, book your practical test.",
            "document_type": "step_by_step_nav",
            "locale": "en",
            "public_updated_at": "2018-02-20T12:37:16Z",
            "schema_name": "step_by_step_nav",
            "title": "Learn to drive a car: step by step",
            "withdrawn": false,
            "details": {
              "step_by_step_nav": {
                "title": "Learn to drive a car: step by step",
                "introduction": [
                  {
                    "content_type": "text/govspeak",
                    "content": "Check what you need to do to learn to drive."
                  }
                ],
                "steps": [
                  {
                    "title": "Check you're allowed to drive",
                    "contents": [
                      {
                        "type": "paragraph",
                        "text": "Most people can start learning to drive when they’re 17."
                      },
                      {
                        "type": "list",
                        "style": "required",
                        "contents": [
                          {
                            "href": "/vehicles-can-drive",
                            "text": "Check what age you can drive"
                          },
                          {
                            "href": "/legal-obligations-drivers-riders",
                            "text": "Requirements for driving legally"
                          },
                          {
                            "href": "/driving-eyesight-rules",
                            "text": "Driving eyesight rules"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "title": "Driving lessons and practice",
                    "contents": [
                      {
                        "type": "paragraph",
                        "text": "You need a provisional driving licence to take lessons or practice."
                      },
                      {
                        "type": "list",
                        "style": "required",
                        "contents": [
                          {
                            "href": "/guidance/the-highway-code",
                            "text": "The Highway Code"
                          },
                          {
                            "href": "/driving-lessons-learning-to-drive",
                            "text": "Taking driving lessons"
                          },
                          {
                            "href": "/find-driving-schools-and-lessons",
                            "text": "Find driving schools, lessons and instructors"
                          },
                          {
                            "href": "/government/publications/car-show-me-tell-me-vehicle-safety-questions",
                            "text": "Practise vehicle safety questions"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "title": "Prepare for your theory test",
                    "logic": "and",
                    "contents": [
                      {
                        "type": "list",
                        "style": "required",
                        "contents": [
                          {
                            "href": "/theory-test/revision-and-practice",
                            "text": "Theory test revision and practice"
                          },
                          {
                            "href": "/take-practice-theory-test",
                            "text": "Take a practice theory test"
                          },
                          {
                            "href": "https://www.safedrivingforlife.info/shop/product/official-dvsa-theory-test-kit-app-app",
                            "text": "Theory and hazard perception test app"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    )
  }

  context "rules for handling differing numbers of linked step navs" do
    let(:step_nav) do
      {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
        "details" => {
          "step_by_step_nav" => {
            "steps" => [
              "title": "Step one"
            ]
          }
        }
      }
    end

    context "for a content item with no step nav links" do
      let(:content_store_response) do
        {
          "title" => "Building giant swimming pools",
          "document_type" => "guide",
        }
      end

      it "handled gracefully" do
        step_nav_links = described_class.new(content_store_response, '/giant-pool/planning')

        expect(step_nav_links.step_navs.count).to eq(0)

        expect(step_nav_links.show_header?).to be false
        expect(step_nav_links.header).to eq({})

        expect(step_nav_links.show_related_links?).to be false
        expect(step_nav_links.related_links).to eq([])

        expect(step_nav_links.show_sidebar?).to be false
        expect(step_nav_links.sidebar).to eq(nil)
      end
    end

    context "for a content item with `part_of_step_navs` links" do
      let(:content_store_response) do
        {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "part_of_step_navs" => [step_nav],
          }
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, '/vomit-comet-session')

        expect(step_nav_links.step_navs.count).to eq(1)

        expect(step_nav_links.show_header?).to be true
        expect(step_nav_links.header).to eq(
          path: "/learn-to-spacewalk",
          title: "Learn to spacewalk: small step by giant leap",
          tracking_id: "cccc-dddd"
        )

        expect(step_nav_links.show_related_links?).to be true
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd"
          }
        ])

        expect(step_nav_links.show_sidebar?).to be true
      end
    end

    context "for a content item with a couple of `part_of_step_navs` links" do
      let(:step_nav2) do
        {
          "content_id" => "aaaa-bbbb",
          "title" => "Lose your lunch: lurch by lurch",
          "base_path" => "/lose-your-lunch"
        }
      end

      let(:content_store_response) do
        {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "part_of_step_navs" => [step_nav, step_nav2],
          }
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, '/vomit-comet-session')

        expect(step_nav_links.step_navs.count).to eq(2)

        expect(step_nav_links.show_related_links?).to be true
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd"
          },
          {
            href: "/lose-your-lunch",
            text: "Lose your lunch: lurch by lurch",
            tracking_id: "aaaa-bbbb"
          }
        ])

        expect(step_nav_links.show_header?).to be false
        expect(step_nav_links.show_sidebar?).to be false
      end
    end


    context "for a content item with many `part_of_step_navs` links" do
      let(:content_store_response) do
        {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "part_of_step_navs" => Array.new(6, step_nav),
          }
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, '/vomit-comet-session')

        expect(step_nav_links.step_navs.count).to eq(6)

        expect(step_nav_links.show_header?).to be false
        expect(step_nav_links.show_related_links?).to be false
        expect(step_nav_links.show_sidebar?).to be false
      end
    end
  end

  context "configuring step by step content for a sidebar navigation element" do
    it "sets up navigation appropriately" do
      step_nav_helper = described_class.new(content_item, "/random_url")
      expect(step_nav_helper.step_navs.count).to eq(1)

      sidebar = step_nav_helper.sidebar

      # the step nav should be configured to display on a sidebar
      expect(sidebar[:heading_level]).to eq(3)
      expect(sidebar[:small]).to be(true)

      # the page isn't in the step nav so nothing should be highlighted
      expect(sidebar[:show_step]).to be nil
      expect(sidebar[:highlight_step]).to be nil
    end

    it "configures active links appropriately" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive")
      sidebar = step_nav_helper.sidebar

      expect(step_nav_helper.step_navs.count).to eq(1)

      # shows the step with /driving-lessons-learning-to-drive
      expect(sidebar[:show_step]).to eq(2)

      # highlights the step with /driving-lessons-learning-to-drive
      expect(sidebar[:highlight_step]).to be(2)

      # sets the /driving-lessons-learning-to-drive link to active
      expect(sidebar[:steps][1][:contents][1][:contents][1][:active]).to be true
    end
  end

  context("active step by step") do
    it "returns true if there is an active step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "e01e924b-9c7c-4c71-8241-66a575c2f61f")
      expect(step_nav_helper.active_step_by_step?).to eq(true)
      expect(step_nav_helper.show_related_links?).to be true
    end

    it "return false if there isn't an active step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive")
      expect(step_nav_helper.active_step_by_step?).to eq(false)
    end

    it "return false if it's an invalid step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "i-dont-exist")
      expect(step_nav_helper.active_step_by_step?).to eq(false)
    end
  end

  def payload_for(schema, content_item)
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |payload|
      payload.merge(content_item)
    end
  end
end
