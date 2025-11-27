require "spec_helper"
require "action_view"
require "rails_helper"

RSpec.describe GovukPublishingComponents::Presenters::PaginationHelper do
  describe "Pagination helper" do
    it "generates only previous arrow link if only previous_page defined" do
      instance = described_class.new({
        "previous_page": {
          "href": "previous-page",
        },
      })

      result = <<~HTML.strip
        <div class="govuk-pagination__prev">
        <a href="previous-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;previous and next&quot;,&quot;text&quot;:&quot;Previous&quot;,&quot;section&quot;:&quot;Previous&quot;}">
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Previous</span>
        </a>
        </div>
      HTML

      expect(instance.prev_link.delete("\n")).to eq result.delete("\n")
      expect(instance.next_link).to be_nil
    end

    it "generates only next arrow link if only next_page defined" do
      instance = described_class.new({
        "next_page": {
          "href": "next-page",
        },
      })

      result = <<~HTML.strip
        <div class="govuk-pagination__next">
        <a href="next-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;previous and next&quot;,&quot;text&quot;:&quot;Next&quot;,&quot;section&quot;:&quot;Next&quot;}">
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Next</span>
        </a>
        </div>
      HTML

      expect(instance.next_link.delete("\n")).to eq result.delete("\n")
      expect(instance.prev_link).to be_nil
    end

    it "generates arrow link with icon if defined for no pages" do
      icon = content_tag(:span, "test icon")

      instance = described_class.new({
        "previous_page": {
          "href": "previous-page",
          "icon": icon,
        },
        "next_page": {
          "href": "next-page",
          "icon": icon,
        },
      })

      prev_result = <<~HTML.strip
        <div class="govuk-pagination__prev">
        <a href="previous-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;previous and next&quot;,&quot;text&quot;:&quot;Previous&quot;,&quot;section&quot;:&quot;Previous&quot;}">
        <span>test icon</span>
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Previous</span>
        </a>
        </div>
      HTML

      next_result = <<~HTML.strip
        <div class="govuk-pagination__next">
        <a href="next-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;previous and next&quot;,&quot;text&quot;:&quot;Next&quot;,&quot;section&quot;:&quot;Next&quot;}">
        <span>test icon</span>
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Next</span>
        </a>
        </div>
      HTML

      expect(instance.next_link.delete("\n")).to eq next_result.delete("\n")
      expect(instance.prev_link.delete("\n")).to eq prev_result.delete("\n")
    end

    it "generates link to page if defined" do
      instance = described_class.new({
        items: [
          {
            href: "page-1",
            number: "1",
          },
        ],
      })

      page_result = <<~HTML.strip
        <ul class="govuk-pagination__list">
        <li class="govuk-pagination__item">
        <a class="govuk-link govuk-pagination__link" href="page-1" aria-label="Page 1" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;pagination&quot;,&quot;text&quot;:&quot;1&quot;,&quot;section&quot;:&quot;Pagination list&quot;}">
        1
        </a>
        </li>
        </ul>
      HTML

      expect(instance.page_links.delete("\n")).to eq page_result.delete("\n")
    end

    it "generates link to current page if defined" do
      instance = described_class.new({
        items: [
          {
            href: "page-1",
            number: "1",
            current: true,
          },
        ],
      })

      page_result = <<~HTML.strip
        <ul class="govuk-pagination__list">
        <li class="govuk-pagination__item govuk-pagination__item--current">
        <a class="govuk-link govuk-pagination__link" href="page-1" aria-label="Page 1" aria-current="page" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;pagination&quot;,&quot;text&quot;:&quot;1&quot;,&quot;section&quot;:&quot;Pagination list&quot;}">
        1
        </a>
        </li>
        </ul>
      HTML

      expect(instance.page_links.delete("\n")).to eq page_result.delete("\n")
    end

    it "generates ellipsis item if defined" do
      instance = described_class.new({
        items: [
          {
            ellipsis: true,
          },
        ],
      })

      page_result = <<~HTML.strip
        <ul class="govuk-pagination__list">
        <li class="govuk-pagination__item govuk-pagination__item--ellipsis">
        &ctdot;
        </li>
        </ul>
      HTML

      expect(instance.page_links.delete("\n")).to eq page_result.delete("\n")
    end

    it "throws error if item passed as argument with number and ellipsis not set" do
      expect {
        described_class.new({
          items: [
            {
              href: "page-1",
            },
          ],
        })
      }.to raise_error("Number or ellipsis value required for item 0")
    end

    it "generates arrow link with icon if defined for pages" do
      icon = content_tag(:span, "test icon")

      instance = described_class.new({
        "previous_page": {
          "href": "previous-page",
          "icon": icon,
        },
        "next_page": {
          "href": "next-page",
          "icon": icon,
        },
        items: [
          {
            number: "1",
          },
        ],
      })

      prev_result = <<~HTML.strip
        <div class="govuk-pagination__prev">
        <a href="previous-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;pagination&quot;,&quot;text&quot;:&quot;Previous&quot;,&quot;section&quot;:&quot;Previous&quot;}">
        <span>test icon</span>
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Previous</span>
        </a>
        </div>
      HTML

      next_result = <<~HTML.strip
        <div class="govuk-pagination__next">
        <a href="next-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;pagination&quot;,&quot;text&quot;:&quot;Next&quot;,&quot;section&quot;:&quot;Next&quot;}">
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Next</span>
        <span>test icon</span>
        </a>
        </div>
      HTML

      expect(instance.next_link.delete("\n")).to eq next_result.delete("\n")
      expect(instance.prev_link.delete("\n")).to eq prev_result.delete("\n")
    end

    it "generates arrow link without data-ga4-link if disable_ga4 set to true" do
      instance = described_class.new({
        "disable_ga4": true,
        "previous_page": {
          "href": "previous-page",
        },
        "next_page": {
          "href": "next-page",
        },
      })

      previous_result = <<~HTML.strip
        <div class="govuk-pagination__prev">
        <a href="previous-page" class="govuk-link govuk-pagination__link">
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Previous</span>
        </a>
        </div>
      HTML

      next_result = <<~HTML.strip
        <div class="govuk-pagination__next">
        <a href="next-page" class="govuk-link govuk-pagination__link">
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Next</span>
        </a>
        </div>
      HTML

      expect(instance.next_link.delete("\n")).to eq next_result.delete("\n")
      expect(instance.prev_link.delete("\n")).to eq previous_result.delete("\n")
    end

    it "sets data-ga4-link `type` attribute to `pagination` if items defined" do
      instance = described_class.new({
        items: [
          {
            number: 1,
            href: "#",
          },
        ],
      })

      text = "text"
      section = "section"

      result = {
        event_name: "navigation",
        type: "pagination",
        text:,
        section:,
      }.to_json

      expect(instance.ga4_link_event(text:, section:)).to eq result
    end

    it "sets data-ga4-link `type` attribute to `previous and next` if no items defined" do
      instance = described_class.new({
        "next_page": {
          "href": "next-page",
        },
      })

      text = "text"
      section = "section"

      result = {
        event_name: "navigation",
        type: "previous and next",
        text:,
        section:,
      }.to_json

      expect(instance.ga4_link_event(text:, section:)).to eq result
    end
  end
end
