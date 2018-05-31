require 'action_view'

module GovukPublishingComponents
  module Presenters
    class ContentsListHelper
      include ActionView::Helpers::SanitizeHelper

      def wrap_numbers_with_spans(content_item_link)
        content_item_text = strip_tags(content_item_link) #just the text of the link

        # Must start with a number
        # Number must be between 1 and 999 (ie not 2014)
        # Must be followed by a space
        # May contain a period `1.`
        # May be a decimal `1.2`
        number = /^\d{1,3}(\.?|\.\d{1,2})(?=\s)/.match(content_item_text)

        if number
          words = content_item_text.sub(number.to_s, '').strip #remove the number from the text
          content_item_link.sub(content_item_text, "<span class=\"gem-c-contents-list__number\">#{number} </span><span class=\"gem-c-contents-list__numbered-text\">#{words}</span>").squish.html_safe
        else
          content_item_link
        end
      end
    end
  end
end
