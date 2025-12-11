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
        has_pages? || @prev_link || @next_link
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

        return if arrow_link_options.blank?

        { href: nil, label: nil, title: nil, icon: nil, **arrow_link_options.symbolize_keys } => { href:, label:, title:, icon: }

        title ||= {
          "prev": t("components.pagination.previous"),
          "next": t("components.pagination.next"),
        }[direction.to_sym]

        section = {
          prev: "Previous",
          next: "Next",
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
    end
  end
end
