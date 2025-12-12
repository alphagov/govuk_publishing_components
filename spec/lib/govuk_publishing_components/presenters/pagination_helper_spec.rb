require "spec_helper"
require "action_view"
require "rails_helper"

RSpec.describe GovukPublishingComponents::Presenters::PaginationHelper do
  describe "Pagination helper" do
    describe "#has_links?" do
      it "is false if nothing passed to the component" do
        instance = described_class.new({})
        expect(instance.has_links?).to be(false)
      end

      it "is true if there are page numbers" do
        items = [
          {
            number: 6,
            href: "#",
          },
          {
            number: 7,
            href: "#",
          },
        ]
        instance = described_class.new({ items: items })
        expect(instance.has_links?).to be(true)
      end

      it "is true if there is a valid previous link" do
        previous_page = {
          href: "previous-page",
          title: "Previous page",
          label: "1 of 3",
        }
        instance = described_class.new({ previous_page: previous_page })
        expect(instance.has_links?).to be(true)
      end

      it "is true if there is a valid next link" do
        next_page = {
          href: "next-page",
          title: "Next page",
          label: "1 of 3",
        }
        instance = described_class.new({ next_page: next_page })
        expect(instance.has_links?).to be(true)
      end
    end

    it "generates only previous arrow link if only previous_page defined" do
      instance = described_class.new({
        "previous_page": {
          "href": "previous-page",
        },
      })

      result = <<~HTML.strip
        <div class="govuk-pagination__prev">
        <a href="previous-page" class="govuk-link govuk-pagination__link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;previous and next&quot;,&quot;text&quot;:&quot;Previous&quot;,&quot;section&quot;:&quot;Previous&quot;}">
        <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"> <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path> </svg>
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
        <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"> <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path> </svg>
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Next</span>
        </a>
        </div>
      HTML

      expect(instance.next_link.delete("\n")).to eq result.delete("\n")
      expect(instance.prev_link).to be_nil
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
        <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"> <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path> </svg>
        <span class="govuk-pagination__link-title govuk-pagination__link-title--decorated">Previous</span>
        </a>
        </div>
      HTML

      next_result = <<~HTML.strip
        <div class="govuk-pagination__next">
        <a href="next-page" class="govuk-link govuk-pagination__link">
        <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"> <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path> </svg>
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
