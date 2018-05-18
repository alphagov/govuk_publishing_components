module GovukPublishingComponents
  module Presenters
    # @private
    class Sanitisation
      # Use `sub` on a potentially unsafe string. This method will sanitize
      # the method first, do the replacement, and mark the result as HTML safe.
      def self.sub_safely(string, pattern, replacement)
        escaped_text = ERB::Util.html_escape_once(string.strip)
        escaped_text.sub(pattern, replacement).html_safe
      end
    end
  end
end
