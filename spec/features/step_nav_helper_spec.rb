require "rails_helper"

describe "Specimen usage of step by step navigation helpers", :capybara do
  include GdsApi::TestHelpers::ContentStore

  context "no related step by step navigation journeys" do
    before do
      content_store_has_random_item(base_path: "/step-nav/vomit-comet", schema: "transaction", part_of_step_navs: nil)

      visit "/step-nav/vomit-comet"
    end

    it "does not show step nav related components" do
      expect(page).not_to have_selector(".gem-c-step-nav-header")
      expect(page).not_to have_selector(".gem-c-step-nav-related")
      expect(page).not_to have_selector(".gem-c-step-nav")
    end
  end

  context "one related step by step navigation journey" do
    before do
      content_store_has_random_item(base_path: "/step-nav/vomit-comet", schema: "transaction", part_of_step_navs: [spacewalk_step_nav])

      visit "/step-nav/vomit-comet"
    end

    it "shows step nav related links" do
      expect(page).to have_selector(".gem-c-step-nav-related")

      within(".gem-c-step-nav-related") do
        expect(page).to have_selector(".govuk-link", count: 1)
        expect(page).to have_link("Learn to spacewalk: small step by giant leap", href: "/learn-to-spacewalk")
      end
    end

    it "shows the full step nav sidebar" do
      within(".gem-c-step-nav") do
        expect(page).to have_css("h3", count: 3)
        expect(page).to have_css(".gem-c-step-nav__list-item--active", count: 1, text: "Experience zero gravity in the atmosphere") # one active link
      end
    end

    it "shows the step nav header" do
      within(".gem-c-step-nav-header") do
        expect(page).to have_link("Learn to spacewalk: small step by giant leap", href: "/learn-to-spacewalk")
      end
    end
  end

  context "one related step by step navigation journey with no steps" do
    before do
      content_store_has_random_item(base_path: "/step-nav/vomit-comet", schema: "transaction", part_of_step_navs: [zero_steps_step_nav])

      visit "/step-nav/vomit-comet"
    end

    it "shows step nav related links" do
      expect(page).to have_selector(".gem-c-step-nav-related")

      within(".gem-c-step-nav-related") do
        expect(page).to have_selector(".govuk-link", count: 1)
        expect(page).to have_link("Learn to spacewalk: small step by giant leap", href: "/learn-to-spacewalk")
      end
    end

    it "does not show the full step nav sidebar" do
      expect(page).to_not have_css(".gem-c-step-nav")
    end

    it "shows the step nav header" do
      within(".gem-c-step-nav-header") do
        expect(page).to have_link("Learn to spacewalk: small step by giant leap", href: "/learn-to-spacewalk")
      end
    end
  end

  context "multiple related step by step navigation journeys" do
    before do
      content_store_has_random_item(
        base_path: "/step-nav/vomit-comet",
        schema: "transaction",
        part_of_step_navs: [
          {
            "content_id" => "8f5d4f2b-daf0-4460-88c1-fdd76c90f6f1",
            "locale" => "en",
            "title" => "Learn to spacewalk: small step by giant leap",
            "base_path" => "/learn-to-spacewalk",
          },
          {
            "content_id" => "8f5d4f2b-daf0-4460-88c1-fdd76c90f6f2",
            "locale" => "en",
            "title" => "Lose your lunch: lurch by lurch",
            "base_path" => "/lose-your-lunch",
          },
        ],
      )

      visit "/step-nav/vomit-comet"
    end

    it "shows step nav related links" do
      expect(page).to have_selector(".gem-c-step-nav-related")

      within(".gem-c-step-nav-related") do
        expect(page).to have_selector(".gem-c-step-nav-related__link-item", count: 2)
        expect(page).to have_link("Learn to spacewalk: small step by giant leap", href: "/learn-to-spacewalk")
        expect(page).to have_link("Lose your lunch: lurch by lurch", href: "/lose-your-lunch")
      end
    end

    it "doesn't show the full step nav sidebar or header" do
      expect(page).not_to have_selector(".gem-c-step-nav-header")
      expect(page).not_to have_selector(".gem-c-step-nav")
    end
  end

  def content_store_has_random_item(base_path:, schema: "guide", part_of_step_navs: [])
    links = if part_of_step_navs
              { "part_of_step_navs" => part_of_step_navs }
            else
              {}
            end

    content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |item|
      item.merge(
        "base_path" => base_path,
        "links" => links,
      )
    end
    stub_content_store_has_item(content_item["base_path"], content_item)
    content_item
  end

  def spacewalk_step_nav
    {
      "content_id" => "8f5d4f2b-daf0-4460-88c1-fdd76c90f6f1",
      "locale" => "en",
      "title" => "Learn to spacewalk: small step by giant leap",
      "base_path" => "/learn-to-spacewalk",
      "details" => {
        "step_by_step_nav": {
          "title": "Learn to spacewalk: small step by giant leap",
          "introduction": [
            {
              "content_type": "text/govspeak",
              "content": "Check what you need to do to learn to spacewalk.",
            },
          ],
          "steps": [
            {
              "title": "Check you're allowed to spacewalk",
              "contents": [
                {
                  "type": "paragraph",
                  "text": "Most people can spacewalk unless they are banned by the federation of planets.",
                },
                {
                  "type": "list",
                  "style": "required",
                  "contents": [
                    {
                      "href": "/am-i-banned",
                      "text": "Check if you're banned",
                    },
                    {
                      "href": "/get-a-medical",
                      "text": "You need to pass a medical",
                    },
                  ],
                },
              ],
            },
            {
              "title": "Book the vomit coment",
              "logic": "and",
              "contents": [
                {
                  "type": "paragraph",
                  "text": "There may be a waiting list of several months.",
                },
                {
                  "type": "list",
                  "style": "required",
                  "contents": [
                    {
                      "href": "/step-nav/vomit-comet",
                      "text": "Experience zero gravity in the atmosphere",
                    },
                  ],
                },
              ],
            },
            {
              "title": "Get a job as an astronaut",
              "contents": [
                {
                  "type": "list",
                  "style": "required",
                  "contents": [
                    {
                      "href": "/apply-for-astronaut-position",
                      "text": "Apply to join the astronaut program",
                      "context": "Application fee: £34",
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    }
  end

  def zero_steps_step_nav
    {
      "content_id" => "8f5d4f2b-daf0-4460-88c1-fdd76c90f6f1",
      "locale" => "en",
      "title" => "Learn to spacewalk: small step by giant leap",
      "base_path" => "/learn-to-spacewalk",
      "details" => {
        "step_by_step_nav": {
          "title": "Learn to spacewalk: small step by giant leap",
          "introduction": [
            {
              "content_type": "text/govspeak",
              "content": "Check what you need to do to learn to spacewalk.",
            },
          ],
          "steps": [],
        },
      },
    }
  end
end
