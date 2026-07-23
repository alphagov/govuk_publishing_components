require "govspeak"

module GovukPublishingComponents
  module Presenters
    class GovspeakHelper
      def initialize; end

      def parse_govspeak(block)
        return block if is_html?(block)

        Govspeak::Document.new(block.strip!).to_html.html_safe
      end

      def is_html?(str)
        !!str.match(/<[^>]*>/)
      end
    end
  end
end
