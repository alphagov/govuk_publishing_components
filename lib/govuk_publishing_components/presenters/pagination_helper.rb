module GovukPublishingComponents
  module Presenters
    class PaginationHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :prev_link, :next_link, :ga4_type

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

      def has_pages?
        @items.present?
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
