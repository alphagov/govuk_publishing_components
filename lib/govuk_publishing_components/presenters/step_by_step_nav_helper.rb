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

      def generate_step_nav_id(step_title)
        step_title.parameterize
      end

    private

      def paragraph(text)
        content_tag(
          :p,
          text,
          class: "gem-c-step-nav__paragraph",
        )
      end

      def list(element)
        content_tag(
          get_list_element(element[:style]),
          class: "gem-c-step-nav__list #{get_list_style(element[:style])}",
          data: {
            length: element[:contents].length,
          },
        ) do
          element[:contents].collect do |contents|
            concat(
              content_tag(
                :li,
                class: "gem-c-step-nav__list-item js-list-item #{link_active(contents[:active])}",
              ) do
                @options[:ga4_index_total] = element[:contents].length if @options[:ga4_tracking]
                create_list_item_content(contents)
              end,
            )
          end
        end
      end

      def create_list_item_content(link)
        if link[:href]
          @link_index += 1
          href = link_href(link[:active], link[:href])

          text = capture do
            concat link_text(link[:active], link[:text])
            concat " "
            concat create_context(link[:context])
          end

          ga4_link_data ||= nil
          if @options[:ga4_tracking]
            ga4_link_data = {
              "event_name": "navigation",
              "type": "step by step",
              "index": {
                "index_section": (@options[:step_index] + 1).to_s,
                "index_link": @link_index.to_s,
              },
              "index_total": @options[:ga4_index_total].to_s,
              "section": @options[:step_title],
            }.to_json
          end

          link_to(
            href,
            rel: ("external" if href.start_with?("http")),
            data: {
              position: "#{@options[:step_index] + 1}.#{@link_index}",
              ga4_link: ga4_link_data,
            },
            class: "gem-c-step-nav__link js-link",
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

      def link_href(active, href)
        return "#content" if active
        return href if external_url?(href)

        link_with_step_nav_query_parameter(href)
      end

      def external_url?(href)
        href.start_with?("http")
      end

      def link_with_step_nav_query_parameter(href)
        step_nav_content_id = @options[:step_nav_content_id]
        return href if step_nav_content_id.blank?

        uri = URI.parse(href)
        exisiting_query_params = uri.query.present? ? CGI.parse(uri.query) : {}
        new_query_params = exisiting_query_params.merge("step-by-step-nav" => step_nav_content_id)
        uri.query = new_query_params.to_query
        uri.to_s
      end

      def link_text(active, text)
        active ? content_tag(:span, "You are currently viewing: ", class: "gem-c-step-nav__link-active-context visuallyhidden") + text : text
      end

      def link_active(active)
        "gem-c-step-nav__list-item--active" if active
      end
    end
  end
end
