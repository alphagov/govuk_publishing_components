require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::PageWithStepByStepNavigation do
  let(:content_item) do
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
                    "content": "Check what you need to do to learn to drive.",
                  },
                ],
                "steps": [
                  {
                    "title": "Check you're allowed to drive",
                    "contents": [
                      {
                        "type": "paragraph",
                        "text": "Most people can start learning to drive when they’re 17.",
                      },
                      {
                        "type": "list",
                        "style": "required",
                        "contents": [
                          {
                            "href": "/vehicles-can-drive",
                            "text": "Check what age you can drive",
                          },
                          {
                            "href": "/legal-obligations-drivers-riders",
                            "text": "Requirements for driving legally",
                          },
                          {
                            "href": "/driving-eyesight-rules",
                            "text": "Driving eyesight rules",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    "title": "Driving lessons and practice",
                    "contents": [
                      {
                        "type": "paragraph",
                        "text": "You need a provisional driving licence to take lessons or practice.",
                      },
                      {
                        "type": "list",
                        "style": "required",
                        "contents": [
                          {
                            "href": "/guidance/the-highway-code",
                            "text": "The Highway Code",
                          },
                          {
                            "href": "/driving-lessons-learning-to-drive",
                            "text": "Taking driving lessons",
                          },
                          {
                            "href": "/find-driving-schools-and-lessons",
                            "text": "Find driving schools, lessons and instructors",
                          },
                          {
                            "href": "/government/publications/car-show-me-tell-me-vehicle-safety-questions",
                            "text": "Practise vehicle safety questions",
                          },
                        ],
                      },
                    ],
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
                            "text": "Theory test revision and practice",
                          },
                          {
                            "href": "/take-practice-theory-test",
                            "text": "Take a practice theory test",
                          },
                          {
                            "href": "https://www.safedrivingforlife.info/shop/product/official-dvsa-theory-test-kit-app-app",
                            "text": "Theory and hazard perception test app",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    )
  end

  context "rules for handling differing numbers of linked step navs" do
    let(:step_nav) do
      {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
        "details" => {
          "step_by_step_nav" => {
            "steps" => [
              "title": "Step one",
            ],
          },
        },
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
        step_nav_links = described_class.new(content_store_response, "/giant-pool/planning")
        disable_ga4 = true

        expect(step_nav_links.step_navs.count).to eq(0)

        expect(step_nav_links.show_header?).to be false
        expect(step_nav_links.header(disable_ga4)).to eq({})

        expect(step_nav_links.show_related_links?).to be false
        expect(step_nav_links.related_links).to eq([])

        expect(step_nav_links.show_sidebar?).to be false
        expect(step_nav_links.sidebar).to be_nil
      end
    end

    context "for a content item with `part_of_step_navs` links" do
      let(:content_store_response) do
        {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "part_of_step_navs" => [step_nav],
          },
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")
        disable_ga4 = true

        expect(step_nav_links.step_navs.count).to eq(1)

        expect(step_nav_links.show_header?).to be true
        expect(step_nav_links.header(disable_ga4)).to eq(
          path: "/learn-to-spacewalk",
          title: "Learn to spacewalk: small step by giant leap",
          tracking_id: "cccc-dddd",
          disable_ga4:,
        )

        expect(step_nav_links.show_related_links?).to be true
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd",
          },
        ])

        expect(step_nav_links.show_sidebar?).to be true
      end
    end

    context "for a content item with a couple of `part_of_step_navs` links" do
      let(:step_nav2) do
        {
          "content_id" => "aaaa-bbbb",
          "title" => "Lose your lunch: lurch by lurch",
          "base_path" => "/lose-your-lunch",
        }
      end

      let(:content_store_response) do
        {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "part_of_step_navs" => [step_nav, step_nav2],
          },
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

        expect(step_nav_links.step_navs.count).to eq(2)

        expect(step_nav_links.show_related_links?).to be true
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd",
          },
          {
            href: "/lose-your-lunch",
            text: "Lose your lunch: lurch by lurch",
            tracking_id: "aaaa-bbbb",
          },
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
          },
        }
      end

      it "parses the content item" do
        step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

        expect(step_nav_links.step_navs.count).to eq(6)

        expect(step_nav_links.show_header?).to be false
        expect(step_nav_links.show_related_links?).to be true
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
      expect(sidebar[:show_step]).to be_nil
      expect(sidebar[:highlight_step]).to be_nil
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
      expect(step_nav_helper.active_step_by_step?).to be(true)
      expect(step_nav_helper.show_related_links?).to be true
      expect(step_nav_helper.show_also_part_of_step_nav?).to be false
    end

    it "returns the active step nav in the related links if there is an active step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "e01e924b-9c7c-4c71-8241-66a575c2f61f")
      expect(step_nav_helper.related_links.count).to eq(1)
      expect(step_nav_helper.related_links.first["tracking_id"]).to eq(content_item[:content_id])
      expect(step_nav_helper.show_related_links?).to be true
    end

    it "return false if there isn't an active step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive")
      expect(step_nav_helper.active_step_by_step?).to be(false)
    end

    it "return false if it's an invalid step by step" do
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "i-dont-exist")
      expect(step_nav_helper.active_step_by_step?).to be(false)
    end

    it "shows the titles of the other step navs the content item is part of" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }

      another_step_nav = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch",
        "base_path" => "/lose-your-lunch",
      }

      content_item_in_two_step_navs = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "part_of_step_navs" => [step_nav, another_step_nav],
        },
      }

      step_nav_helper = described_class.new(content_item_in_two_step_navs, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
      expect(step_nav_helper.also_part_of_step_nav.count).to eq(1)
      expect(step_nav_helper.also_part_of_step_nav.first[:tracking_id]).to eq("aaaa-bbbb")
      expect(step_nav_helper.show_also_part_of_step_nav?).to be true
    end

    it "shows related to step nav when a step by step is active" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }
      content_item = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "related_to_step_navs" => [step_nav],
        },
      }
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
      expect(step_nav_helper.active_step_by_step?).to be(true)
      expect(step_nav_helper.also_part_of_step_nav.count).to eq(0)
    end

    it "does not shows related to step nav when a step by step is not active" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }
      content_item = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "related_to_step_navs" => [step_nav],
        },
      }
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive")
      expect(step_nav_helper.active_step_by_step?).to be(false)
      expect(step_nav_helper.show_also_part_of_step_nav?).to be false
    end

    it "shows header for related to step nav when a step by step is active" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }
      content_item = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "related_to_step_navs" => [step_nav],
        },
      }
      step_nav_helper = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
      expect(step_nav_helper.active_step_by_step?).to be(true)
      expect(step_nav_helper.show_header?).to be(true)
    end

    it "shows the titles of the other step navs the content item is part of" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }
      another_step_nav = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch",
        "base_path" => "/lose-your-lunch",
      }
      content_item_in_two_step_navs = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "related_to_step_navs" => [step_nav, another_step_nav],
        },
      }
      step_nav_helper = described_class.new(content_item_in_two_step_navs, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
      expect(step_nav_helper.also_part_of_step_nav.count).to eq(1)
      expect(step_nav_helper.also_part_of_step_nav.first[:tracking_id]).to eq("aaaa-bbbb")
      expect(step_nav_helper.show_also_part_of_step_nav?).to be true
    end

    it "does not show part of step navs if more than 5" do
      step_nav = {
        "content_id" => "cccc-dddd",
        "title" => "Learn to spacewalk: small step by giant leap",
        "base_path" => "/learn-to-spacewalk",
      }
      another_step_nav = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch",
        "base_path" => "/lose-your-lunch",
      }
      another_step_nav2 = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch 2",
        "base_path" => "/lose-your-lunch-2",
      }
      another_step_nav3 = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch 3",
        "base_path" => "/lose-your-lunch-3",
      }
      another_step_nav4 = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch 4",
        "base_path" => "/lose-your-lunch-4",
      }
      another_step_nav5 = {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch 5",
        "base_path" => "/lose-your-lunch-5",
      }
      content_item_in_six_step_navs = {
        "title" => "Book a session in the vomit comet",
        "document_type" => "transaction",
        "links" => {
          "related_to_step_navs" => [
            step_nav,
            another_step_nav,
            another_step_nav2,
            another_step_nav3,
            another_step_nav4,
            another_step_nav5,
          ],
        },
      }
      step_nav_helper = described_class.new(content_item_in_six_step_navs, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
      expect(step_nav_helper.show_also_part_of_step_nav?).to be(false)
    end
  end

  context("secondary step by steps") do
    let(:step_nav) do
      {
        "content_id" => "aaaa-bbbb",
        "title" => "Lose your lunch: lurch by lurch",
        "base_path" => "/lose-your-lunch",
        "details" => {
          "step_by_step_nav" => {
            "steps" => [
              "title": "Step one",
            ],
          },
        },
      }
    end

    context "secondary steps without other step by step links" do
      context "for a content item with a single `secondary_to_step_navs` links" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "secondary_to_step_navs" => [step_nav],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")
          disable_ga4 = true

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(1)

          expect(step_nav_links.show_secondary_step_by_step?).to be true
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be true
          expect(step_nav_links.show_header?).to be true
          expect(step_nav_links.header(disable_ga4)).to eq(
            path: "/lose-your-lunch",
            title: "Lose your lunch: lurch by lurch",
            tracking_id: "aaaa-bbbb",
            disable_ga4:,
          )

          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/lose-your-lunch",
              text: "Lose your lunch: lurch by lurch",
              tracking_id: "aaaa-bbbb",
            },
          ])

          expect(step_nav_links.show_sidebar?).to be true
        end
      end

      context "for a content item with a couple `secondary_to_step_navs` links" do
        let(:step_nav2) do
          {
            "content_id" => "aaaa-bbbb-2",
            "title" => "Lose your lunch: lurch by lurch 2",
            "base_path" => "/lose-your-lunch-2",
          }
        end

        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "secondary_to_step_navs" => [step_nav, step_nav2],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(2)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be true
          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/lose-your-lunch",
              text: "Lose your lunch: lurch by lurch",
              tracking_id: "aaaa-bbbb",
            },
            {
              href: "/lose-your-lunch-2",
              text: "Lose your lunch: lurch by lurch 2",
              tracking_id: "aaaa-bbbb-2",
            },
          ])

          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end
    end

    context "secondary step by steps with primary step by steps" do
      let(:primary_step_nav) do
        {
          "content_id" => "PRIMARY-aaaa-bbbb",
          "title" => "PRIMARY Lose your lunch: lurch by lurch",
          "base_path" => "/PRIMARY-lose-your-lunch",
          "details" => {
            "step_by_step_nav" => {
              "steps" => [
                "title": "Step one",
              ],
            },
          },
        }
      end

      context "for a content item with a single `secondary_to_step_navs` links and a single `part_of_step_navs` link" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "part_of_step_navs" => [primary_step_nav],
              "secondary_to_step_navs" => [step_nav],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")
          disable_ga4 = true

          expect(step_nav_links.step_navs.count).to eq(1)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(1)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be true
          expect(step_nav_links.header(disable_ga4)).to eq(
            path: "/PRIMARY-lose-your-lunch",
            title: "PRIMARY Lose your lunch: lurch by lurch",
            tracking_id: "PRIMARY-aaaa-bbbb",
            disable_ga4:,
          )

          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/PRIMARY-lose-your-lunch",
              text: "PRIMARY Lose your lunch: lurch by lurch",
              tracking_id: "PRIMARY-aaaa-bbbb",
            },
          ])

          expect(step_nav_links.show_sidebar?).to be true
        end
      end

      context "for a content item with a couple `secondary_to_step_navs` links and a single `part_of_step_navs` link" do
        let(:step_nav2) do
          {
            "content_id" => "aaaa-bbbb-2",
            "title" => "Lose your lunch: lurch by lurch 2",
            "base_path" => "/lose-your-lunch-2",
          }
        end

        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "part_of_step_navs" => [primary_step_nav],
              "secondary_to_step_navs" => [step_nav, step_nav2],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")
          disable_ga4 = true

          expect(step_nav_links.step_navs.count).to eq(1)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(2)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be true
          expect(step_nav_links.header(disable_ga4)).to eq(
            path: "/PRIMARY-lose-your-lunch",
            title: "PRIMARY Lose your lunch: lurch by lurch",
            tracking_id: "PRIMARY-aaaa-bbbb",
            disable_ga4:,
          )

          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/PRIMARY-lose-your-lunch",
              text: "PRIMARY Lose your lunch: lurch by lurch",
              tracking_id: "PRIMARY-aaaa-bbbb",
            },
          ])

          expect(step_nav_links.show_sidebar?).to be true
        end
      end

      context "for a content item with a single `secondary_to_step_navs` links and a couple `part_of_step_navs` link" do
        let(:primary_step_nav2) do
          {
            "content_id" => "PRIMARY-aaaa-bbbb-2",
            "title" => "PRIMARY Lose your lunch: lurch by lurch 2",
            "base_path" => "/PRIMARY-lose-your-lunch-2",
          }
        end

        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "part_of_step_navs" => [primary_step_nav, primary_step_nav2],
              "secondary_to_step_navs" => [step_nav],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(2)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(1)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/PRIMARY-lose-your-lunch",
              text: "PRIMARY Lose your lunch: lurch by lurch",
              tracking_id: "PRIMARY-aaaa-bbbb",
            },
            {
              href: "/PRIMARY-lose-your-lunch-2",
              text: "PRIMARY Lose your lunch: lurch by lurch 2",
              tracking_id: "PRIMARY-aaaa-bbbb-2",
            },
          ])

          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end

      context "for a content item with a couple `secondary_to_step_navs` links and a couple `part_of_step_navs` link" do
        let(:primary_step_nav2) do
          {
            "content_id" => "PRIMARY-aaaa-bbbb-2",
            "title" => "PRIMARY Lose your lunch: lurch by lurch 2",
            "base_path" => "/PRIMARY-lose-your-lunch-2",
          }
        end

        let(:step_nav2) do
          {
            "content_id" => "aaaa-bbbb-2",
            "title" => "Lose your lunch: lurch by lurch 2",
            "base_path" => "/lose-your-lunch-2",
          }
        end

        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "part_of_step_navs" => [primary_step_nav, primary_step_nav2],
              "secondary_to_step_navs" => [step_nav, step_nav2],
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(2)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(2)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_related_links?).to be true
          expect(step_nav_links.related_links).to eq([
            {
              href: "/PRIMARY-lose-your-lunch",
              text: "PRIMARY Lose your lunch: lurch by lurch",
              tracking_id: "PRIMARY-aaaa-bbbb",
            },
            {
              href: "/PRIMARY-lose-your-lunch-2",
              text: "PRIMARY Lose your lunch: lurch by lurch 2",
              tracking_id: "PRIMARY-aaaa-bbbb-2",
            },
          ])

          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end
    end

    context "secondary step by steps with related to step by steps" do
      let(:related_to_step_nav) do
        {
          "content_id" => "RELATED-aaaa-bbbb",
          "title" => "RELATED Lose your lunch: lurch by lurch",
          "base_path" => "/RELATED-lose-your-lunch",
          "details" => {
            "step_by_step_nav" => {
              "steps" => [
                "title": "Step one",
              ],
            },
          },
        }
      end

      context "for a content item with a single `secondary_to_step_navs` links and a single `related_to_step_navs` link" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "related_to_step_navs" => Array.new(1, related_to_step_nav),
              "secondary_to_step_navs" => Array.new(1, step_nav),
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(1)
          expect(step_nav_links.related_to_step_navs.count).to eq(1)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_related_links?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end

      context "for a content item with a couple `secondary_to_step_navs` links and a single `related_to_step_navs` link" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "related_to_step_navs" => Array.new(1, related_to_step_nav),
              "secondary_to_step_navs" => Array.new(2, step_nav),
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(2)
          expect(step_nav_links.related_to_step_navs.count).to eq(1)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_related_links?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end

      context "for a content item with a single `secondary_to_step_navs` links and a couple `related_to_step_navs` link" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "related_to_step_navs" => Array.new(2, related_to_step_nav),
              "secondary_to_step_navs" => Array.new(1, step_nav),
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(1)
          expect(step_nav_links.related_to_step_navs.count).to eq(2)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_related_links?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end

      context "for a content item with a couple `secondary_to_step_navs` links and a couple `related_to_step_navs` link" do
        let(:content_store_response) do
          {
            "title" => "Book a session in the vomit comet",
            "document_type" => "transaction",
            "links" => {
              "related_to_step_navs" => Array.new(2, related_to_step_nav),
              "secondary_to_step_navs" => Array.new(2, step_nav),
            },
          }
        end

        it "parses the content item" do
          step_nav_links = described_class.new(content_store_response, "/vomit-comet-session")

          expect(step_nav_links.step_navs.count).to eq(0)
          expect(step_nav_links.secondary_step_by_steps.count).to eq(2)
          expect(step_nav_links.related_to_step_navs.count).to eq(2)

          expect(step_nav_links.show_secondary_step_by_step?).to be false
          expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
          expect(step_nav_links.show_header?).to be false
          expect(step_nav_links.show_related_links?).to be false
          expect(step_nav_links.show_sidebar?).to be false
        end
      end
    end

    context "secondary step by step with active step by step" do
      it "shows header for related to step nav when a step by step is active and there is also a secondary step by step" do
        related_to_step_navs = {
          "content_id" => "cccc-dddd",
          "title" => "Learn to spacewalk: small step by giant leap",
          "base_path" => "/learn-to-spacewalk",
        }
        content_item = {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "secondary_to_step_navs" => [step_nav],
            "related_to_step_navs" => [related_to_step_navs],
          },
        }
        step_nav_links = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
        expect(step_nav_links.step_navs.count).to eq(0)
        expect(step_nav_links.secondary_step_by_steps.count).to eq(1)

        expect(step_nav_links.show_secondary_step_by_step?).to be false
        expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
        expect(step_nav_links.active_step_by_step?).to be(true)
        expect(step_nav_links.show_header?).to be(true)
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd",
          },
        ])
      end

      it "shows header for part of step nav when a step by step is active and there is also a secondary step by step" do
        part_of_step_navs = {
          "content_id" => "cccc-dddd",
          "title" => "Learn to spacewalk: small step by giant leap",
          "base_path" => "/learn-to-spacewalk",
        }
        content_item = {
          "title" => "Book a session in the vomit comet",
          "document_type" => "transaction",
          "links" => {
            "secondary_to_step_navs" => [step_nav],
            "part_of_step_navs" => [part_of_step_navs],
          },
        }
        step_nav_links = described_class.new(content_item, "/driving-lessons-learning-to-drive", "step-by-step-nav" => "cccc-dddd")
        expect(step_nav_links.step_navs.count).to eq(1)
        expect(step_nav_links.secondary_step_by_steps.count).to eq(1)

        expect(step_nav_links.show_secondary_step_by_step?).to be false
        expect(step_nav_links.show_related_links_for_secondary_step_by_steps?).to be false
        expect(step_nav_links.active_step_by_step?).to be(true)
        expect(step_nav_links.show_header?).to be(true)
        expect(step_nav_links.related_links).to eq([
          {
            href: "/learn-to-spacewalk",
            text: "Learn to spacewalk: small step by giant leap",
            tracking_id: "cccc-dddd",
          },
        ])
      end
    end
  end

  def payload_for(schema, content_item)
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |payload|
      payload.merge(content_item)
    end
  end
end
