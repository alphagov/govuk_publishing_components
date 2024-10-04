module GovukPublishingComponents
  module Presenters
    # @private
    # Only used by the step by step component
    class PageWithStepByStepNavigation
      MAX_SECTION_LENGTH = RelatedNavigationHelper::MAX_SECTION_LENGTH

      def initialize(content_store_response, current_path, query_parameters = {})
        @content_item = content_store_response.to_h.deep_symbolize_keys
        @current_path = current_path
        @query_parameters = query_parameters
      end

      def step_navs
        @step_navs ||= parsed_step_navs.map do |step_nav|
          StepByStepModel.new(step_nav)
        end
      end

      def related_to_step_navs
        @related_to_step_navs ||= parsed_related_to_step_navs.map do |step_nav|
          StepByStepModel.new(step_nav)
        end
      end

      def secondary_step_by_steps
        @secondary_step_by_steps ||= parsed_secondary_to_step_navs.map do |step_nav|
          StepByStepModel.new(step_nav)
        end
      end

      def show_sidebar?
        show_header? && current_step_nav.steps.present?
      end

      def show_header?
        step_navs.count == 1 || active_step_by_step? || show_secondary_step_by_step?
      end

      def show_related_links?
        if active_step_by_step?
          true
        elsif step_navs.any?
          true
        elsif show_related_links_for_secondary_step_by_steps?
          true
        else
          false
        end
      end

      def show_also_part_of_step_nav?
        active_step_by_step? && also_part_of_step_nav.any? && step_navs_combined_list.count < MAX_SECTION_LENGTH
      end

      def related_links
        step_by_step_navs = if active_step_by_step?
                              [active_step_by_step]
                            elsif step_navs.any?
                              step_navs
                            elsif show_related_links_for_secondary_step_by_steps?
                              secondary_step_by_steps
                            else
                              []
                            end

        format_related_links(step_by_step_navs)
      end

      def also_part_of_step_nav
        step_navs_list = step_navs_combined_list
        step_by_step_navs = step_navs_list.delete_if { |step_nav| step_nav.content_id == active_step_by_step.content_id }
        format_related_links(step_by_step_navs)
      end

      def sidebar
        if show_sidebar?
          @sidebar ||= current_step_nav.content.tap do |sb|
            configure_for_sidebar(sb)
            sb.merge!(small: true, heading_level: 3, tracking_id: current_step_nav.content_id, disable_ga4: @query_parameters[:disable_ga4])
          end
        end
      end

      def header(disable_ga4)
        if show_header?
          {
            title: current_step_nav.title,
            path: current_step_nav.base_path,
            tracking_id: current_step_nav.content_id,
            disable_ga4:,
          }
        else
          {}
        end
      end

      def primary_step_by_steps?
        step_navs_combined_list.any?
      end

      def active_step_by_step?
        active_step_nav_content_id.present? && active_step_by_step.present?
      end

      def active_step_by_step
        step_navs_list = step_navs_combined_list
        @active_step_navs ||= step_navs_list.select { |step_nav| step_nav.content_id == active_step_nav_content_id }
        @active_step_navs.first
      end

      def secondary_step_by_step?
        secondary_step_by_steps.any?
      end

      def secondary_step_by_step
        secondary_step_by_steps.first
      end

      def show_secondary_step_by_step?
        !primary_step_by_steps? && secondary_step_by_step? && secondary_step_by_steps.count == 1
      end

      def show_related_links_for_secondary_step_by_steps?
        !primary_step_by_steps? && secondary_step_by_step?
      end

    private

      attr_reader :content_item, :current_path

      def current_step_nav
        if active_step_by_step?
          active_step_by_step
        elsif primary_step_by_steps?
          step_navs.first
        elsif show_secondary_step_by_step?
          secondary_step_by_step
        end
      end

      def active_step_nav_content_id
        @active_step_nav_content_id ||= @query_parameters["step-by-step-nav"].present? ? @query_parameters["step-by-step-nav"] : nil
      end

      def steps
        @steps ||= step_nav[:steps]
      end

      def step_navs_combined_list
        step_nav_list = []
        step_nav_list += step_navs if step_navs.any?
        step_nav_list += related_to_step_navs if related_to_step_navs.any?
        step_nav_list
      end

      def parsed_step_navs
        content_item.dig(:links, :part_of_step_navs).to_a
      end

      def parsed_related_to_step_navs
        content_item.dig(:links, :related_to_step_navs).to_a
      end

      def parsed_secondary_to_step_navs
        content_item.dig(:links, :secondary_to_step_navs).to_a
      end

      def configure_for_sidebar(step_nav_content)
        step_nav_content[:steps].each_with_index do |step, step_index|
          step[:contents].each do |content|
            next unless content[:contents]

            content[:contents].each do |link|
              next unless link[:href] == current_path

              link[:active] = true
              step_nav_content[:show_step] = step_index + 1
              step_nav_content[:highlight_step] = step_index + 1
            end
          end
        end
        step_nav_content
      end

      def format_related_links(step_by_step_navs)
        step_by_step_navs.map do |step_nav|
          {
            href: step_nav.base_path,
            text: step_nav.title,
            tracking_id: step_nav.content_id,
          }
        end
      end
    end

    # @private
    class StepByStepModel
      def initialize(content_item)
        @content_item = content_item.deep_symbolize_keys
      end

      def title
        content_item[:title]
      end

      def base_path
        content_item[:base_path]
      end

      def content_id
        content_item[:content_id]
      end

      def content
        content_item.dig(:details, :step_by_step_nav)
      end

      def steps
        content_item.dig(:details, :step_by_step_nav, :steps)
      end

    private

      attr_reader :content_item
    end
  end
end
