require "action_view"

module GovukPublishingComponents
  module Presenters
    class ContentsListHelper
      include ActionView::Helpers::SanitizeHelper

      attr_reader :classes, :contents

      def initialize(options)
        @contents = options[:contents] || []
        @nested = @contents.any? { |c| c[:items] && c[:items].any? }
        @format_numbers = options[:format_numbers]
      end

      def list_item_classes(list_item, nested)
        list_item_classes = "gem-c-contents-list__list-item"
        list_item_classes << " gem-c-contents-list__list-item--#{parent_modifier}" unless nested
        list_item_classes << " gem-c-contents-list__list-item--dashed" if nested
        list_item_classes << " gem-c-contents-list__list-item--active" if list_item[:active]

        list_item_classes
      end

      def wrap_numbers_with_spans(content_item_link)
        content_item_text = strip_tags(content_item_link) # just the text of the link
        content_item_text_stripped = clean_whitespace(content_item_text) # keep original content_item_text for the string replacement.
        # Must start with a number
        # Number must be between 1 and 999 (ie not 2014)
        # Must be followed by a space
        # May contain a period `1.`
        # May be a decimal `1.2`
        number = /^\d{1,3}(\.?|\.\d{1,2})(?=\s)/.match(content_item_text_stripped)

        if number
          words = content_item_text.sub(number.to_s, "").strip # remove the number from the text
          words = clean_whitespace(words)
          content_item_link.sub(content_item_text, "<span class=\"gem-c-contents-list__number\">#{number} </span><span class=\"gem-c-contents-list__numbered-text\">#{words}</span>").squish.html_safe
        else
          content_item_link
        end
      end

      def clean_whitespace(text)
        text.gsub(/&nbsp;/, " ").strip
      end

      def get_index_total
        total = @contents.length
        @contents.each do |parent|
          total += parent[:items].length if parent[:items]
        end
        total
      end

      def get_ga4_event_name(link)
        return "select_content" if link.start_with?("#")

        "navigation"
      end

    private

      def parent_modifier
        if @nested
          "parent"
        elsif @format_numbers
          "numbered"
        else
          "dashed"
        end
      end
    end
  end
end
