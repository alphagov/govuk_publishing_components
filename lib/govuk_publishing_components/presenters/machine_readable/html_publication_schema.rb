module GovukPublishingComponents
  module Presenters
    class HtmlPublicationSchema < FaqPageSchema
      def structured_data
        return ArticleSchema.new(page).structured_data if less_than_two_headings_of_any_one_type?

        super
      end

      def heading_counts
        @heading_counts ||= (1..5).each_with_object({}) do |n, hash|
          heading = "h#{n}"
          hash[heading] = doc.xpath("//*[@class=\"govspeak\"]//#{heading}").count
        end
      end

      def less_than_two_headings_of_any_one_type?
        heading_counts.values.max < 2
      end

      def question_and_answers
        headings.each_with_object({}) do |heading, hash|
          question = heading.text

          next_heading = heading_pairs[heading]
          next_heading_path = next_heading && next_heading.path
          answer = content_between(heading.path, next_heading_path)

          hash[question] = {
            answer: answer.map(&:to_s).join,
            anchor: heading.attr(:id),
          }
        end
      end

      def headings
        @headings ||= doc.xpath("//*[@class=\"govspeak\"]//#{first_heading_type_with_more_than_one_occurance}")
      end

      def first_heading_type_with_more_than_one_occurance
        heading_counts.detect { |_k, v| v > 1 }.first
      end

      def heading_pairs
        @heading_pairs ||= pairs_hash(headings)
      end

      # Converts [:a, :b, :c] into
      # {:a => :b, :b => :c}
      def pairs_hash(array)
        all_but_last = array[0..-2]
        all_but_first = array[1..]
        pairs = [all_but_last, all_but_first].transpose
        Hash[pairs]
      end

      # From: https://stackoverflow.com/a/7816046/1014251
      # If `stop_xpath` is `nil` gets text to end of content
      def content_between(start_xpath, stop_xpath = nil)
        node = doc.at_xpath(start_xpath).next_element
        stop = stop_xpath && doc.at_xpath(stop_xpath)
        [].tap do |content|
          while node && node != stop
            content << node
            node = node.next_element
          end
        end
      end
    end
  end
end
