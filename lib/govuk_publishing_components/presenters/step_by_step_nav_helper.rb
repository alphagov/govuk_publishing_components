module GovukPublishingComponents
  module Presenters
    # @private
    # Only used by the step by step component
    class StepByStepNavHelper
      include ActionView::Helpers
      include ActionView::Context

      def render_step_nav_element(element, options)
        @options = options
        @link_index = options[:link_index]

        case element[:type]
        when "paragraph"
          paragraph(element[:text])
        when "list"
          list(element)
        end
      end

      # id should be lowercase, contain only numbers and letters and replace spaces with dashes
      def generate_step_nav_id(step_title)
        step_title.downcase.tr(" ", "-").gsub(/[^a-z0-9\-\s]/i, '')
      end

    private

      def paragraph(text)
        content_tag(
          :p,
          text,
          class: "gem-c-step-nav__paragraph"
        )
      end

      def list(element)
        content_tag(
          get_list_element(element[:style]),
          class: "gem-c-step-nav__list #{get_list_style(element[:style])}",
          data: {
            length: element[:contents].length
          }
        ) do
          element[:contents].collect { |contents|
            concat(
              content_tag(
                :li,
                class: "gem-c-step-nav__list-item js-list-item #{link_active(contents[:active])}"
              ) do
                create_list_item_content(contents)
              end
            )
          }
        end
      end

      def create_list_item_content(link)
        if link[:href]
          @link_index += 1
          href = link_href(link[:active], link[:href], "step-by-step-nav=#{@options[:content_id]}")

          text = capture do
            concat link_text(link[:active], link[:text])
            concat " "
            concat create_context(link[:context])
          end

          link_to(
            href,
            rel: ("external" if href.start_with?('http')),
            data: {
              position: "#{@options[:step_index] + 1}.#{@link_index}"
            },
            class: "gem-c-step-nav__link js-link"
          ) do
            text
          end
        else
          link[:text]
        end
      end

      def create_context(context)
        content_tag(:span, context, class: "gem-c-step-nav__context") if context
      end

      def get_list_style(style)
        "gem-c-step-nav__list--choice" if style == "choice"
      end

      def get_list_element(style)
        style == "choice" ? "ul" : "ol"
      end

      def link_href(active, href, query_string = false)
        href += "?#{query_string}" if query_string
        active ? "#content" : href
      end

      def link_text(active, text)
        active ? content_tag(:span, "You are currently viewing: ", class: "visuallyhidden") + text : text
      end

      def link_active(active)
        "gem-c-step-nav__list-item--active" if active
      end
    end
  end
end
