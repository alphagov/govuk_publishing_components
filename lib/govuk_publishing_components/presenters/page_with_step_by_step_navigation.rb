module GovukPublishingComponents
  module Presenters
    # @private
    # Only used by the step by step component
    class PageWithStepByStepNavigation
      def initialize(content_store_response, current_path, active_step_nav_content_id = false)
        @content_item = content_store_response.to_h
        @current_path = current_path
        @active_step_nav_content_id = active_step_nav_content_id
      end

      def step_navs
        @step_navs ||= parsed_step_navs.map do |step_nav|
          StepByStepModel.new(step_nav)
        end
      end

      def show_sidebar?
        show_header? && first_or_active_step_nav.steps.present?
      end

      def show_header?
        step_navs.count == 1 || get_active_step_nav
      end

      def show_related_links?
        step_navs.any? && step_navs.count < 5
      end

      def related_links(step_by_step_navs = false)
        if step_by_step_navs == false
          step_by_step_navs = step_navs
        end

        step_by_step_navs.map do |step_nav|
          {
            href: step_nav.base_path,
            text: step_nav.title,
            tracking_id: step_nav.content_id
          }
        end
      end

      def also_part_of_step_nav
        active_step_nav = get_active_step_nav
        if active_step_nav
          step_navs.delete_if { |step_nav| step_nav.content_id == active_step_nav.content_id }
        end

        step_navs.map do |step_nav|
          {
            href: step_nav.base_path,
            text: step_nav.title,
            tracking_id: step_nav.content_id
          }
        end
      end

      def sidebar
        if show_sidebar?
          @sidebar ||= first_or_active_step_nav.content.tap do |sb|
            configure_for_sidebar(sb)
            sb.merge!(small: true, heading_level: 3, tracking_id: first_or_active_step_nav.content_id)
          end
        end
      end

      def header
        if show_header?
          {
            title: first_or_active_step_nav.title,
            path: first_or_active_step_nav.base_path,
            tracking_id: first_or_active_step_nav.content_id
          }
        else
          {}
        end
      end

      def get_active_step_nav
        if @active_step_nav_content_id
          active_step_nav = step_navs.select { |step_nav| step_nav.content_id == @active_step_nav_content_id }
          active_step_nav.first
        else
          false
        end
      end

    private

      attr_reader :content_item, :current_path

      def first_or_active_step_nav
        active_step_nav = get_active_step_nav
        return active_step_nav if active_step_nav
        step_navs.first
      end

      def steps
        @steps ||= step_nav[:steps]
      end

      def parsed_step_navs
        content_item.dig("links", "part_of_step_navs").to_a
      end

      def configure_for_sidebar(step_nav_content)
        step_nav_content[:steps].each_with_index do |step, step_index|
          step[:contents].each do |content|
            next unless content[:contents]

            content[:contents].each do |link|
              if link[:href] == current_path
                link[:active] = true
                step_nav_content[:show_step] = step_index + 1
                step_nav_content[:highlight_step] = step_index + 1
              end
            end
          end
        end
        step_nav_content
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
