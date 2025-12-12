module GovukPublishingComponents
  module Presenters
    class PaginationHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :prev_link, :next_link, :page_links, :ga4_type

      def initialize(local_assigns)
        @arrow_links = {
          next: local_assigns[:next_page] || nil,
          prev: local_assigns[:previous_page] || nil,
        }

        @items = local_assigns[:items] || nil

        @disable_ga4 = local_assigns[:disable_ga4] || nil
        @ga4_type = has_pages? ? "pagination" : "previous and next"
        @prev_link = arrow_link_helper(direction: "prev")
        @next_link = arrow_link_helper(direction: "next")
        @page_links = pages_link_helper
      end

      def ga4_link_event(text:, section:)
        unless @disable_ga4
          {
            event_name: "navigation",
            type: @ga4_type,
            text:,
            section:,
          }.to_json
        end
      end

      def has_links?
        has_pages? || @prev_link.present? || @next_link.present?
      end

      def has_pages?
        @items.present?
      end

      def pages_link_helper
        return unless has_pages?

        page_links = @items.each_with_index.map do |item, index|
          { href: nil, ellipsis: nil, current: nil, number: nil, visually_hidden_text: nil, **item.symbolize_keys } => { href:, ellipsis:, current:, number:, visually_hidden_text: }

          raise ArgumentError, "Number or ellipsis value required for item #{index}" if ellipsis.blank? && number.blank?

          list_item_classes = %w[govuk-pagination__item]
          list_item_classes << "govuk-pagination__item--ellipsis" if ellipsis
          list_item_classes << "govuk-pagination__item--current" if current

          item_aria_label = visually_hidden_text || "Page #{number}"

          ga4_link = ga4_link_event(text: number, section: "Pagination list")

          content_tag(:li, class: list_item_classes) do
            if ellipsis
              "&ctdot;".html_safe
            else
              content_tag(:a, number, class: "govuk-link govuk-pagination__link", href:, aria: { label: item_aria_label, current: current ? "page" : nil }, data: { ga4_link: })
            end
          end
        end

        content_tag(:ul, class: "govuk-pagination__list") do
          page_links.collect { |page_link| concat(page_link) }
        end
      end

      def arrow_link_helper(direction:)
        arrow_link_options = @arrow_links[direction.to_sym]

        return if arrow_link_options.blank? || !valid_link?(arrow_link_options)

        { href: nil, label: nil, title: nil, icon: nil, **arrow_link_options.symbolize_keys } => { href:, label:, title:, icon: }

        title ||= {
          "prev": t("components.pagination.previous"),
          "next": t("components.pagination.next"),
        }[direction.to_sym]

        section = {
          prev: "Previous",
          next: "Next",
        }[direction.to_sym]

        icon = {
          prev: previous_icon,
          next: next_icon,
        }[direction.to_sym]

        ga4_link = ga4_link_event(text: label || title, section:)

        link_text_classes = %w[govuk-pagination__link-title]
        link_text_classes << "govuk-pagination__link-title--decorated" if label.blank?

        content_tag(:div, class: "govuk-pagination__#{direction}") do
          content_tag(:a, href:, class: "govuk-link govuk-pagination__link", data: { ga4_link: }) do
            concat icon if direction == "prev" || !has_pages? && direction == "next"
            concat content_tag(:span, title, class: link_text_classes)
            concat icon if has_pages? && direction == "next"
            concat content_tag(:span, ":", class: "govuk-visually-hidden") if label.present?
            concat content_tag(:span, label, class: "govuk-pagination__link-label") if label.present?
          end
        end
      end

    private

      def previous_icon
        '<svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
          <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
        </svg>'.squish.html_safe
      end

      def next_icon
        '<svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
          <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
        </svg>'.squish.html_safe
      end

      def valid_link?(link)
        link.key?(:href)
      end
    end
  end
end
