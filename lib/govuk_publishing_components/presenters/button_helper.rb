require 'action_view'

module GovukPublishingComponents
  module Presenters
    class ButtonHelper
      attr_reader :href, :text, :title, :info_text, :rel, :data_attributes,
        :margin_bottom, :target, :type, :start, :secondary, :secondary_quiet, :destructive

      def initialize(local_assigns)
        @href = local_assigns[:href]
        @text = local_assigns[:text]
        @title = local_assigns[:title]
        @info_text = local_assigns[:info_text]
        @rel = local_assigns[:rel]
        @default_data_attributes = { "prevent-double-click" => true }
        @data_attributes = local_assigns[:data_attributes]
        @margin_bottom = local_assigns[:margin_bottom]
        @target = local_assigns[:target]
        @type = local_assigns[:type]
        @start = local_assigns[:start]
        @secondary = local_assigns[:secondary]
        @secondary_quiet = local_assigns[:secondary_quiet]
        @destructive = local_assigns[:destructive]
      end

      def link?
        href.present?
      end

      def html_options
        options = { class: css_classes }
        options[:role] = "button" if link?
        options[:type] = button_type
        options[:rel] = rel if rel
        options[:data] = data_attributes ? data_attributes.merge(@default_data_attributes) : @default_data_attributes
        options[:data] = data_attributes if button_type != "submit"
        options[:title] = title if title
        options[:target] = target if target
        options
      end

      def button_type
        type || "submit" unless link?
      end

    private

      def css_classes
        classes = %w(gem-c-button govuk-button)
        classes << "govuk-button--start" if start
        classes << "gem-c-button--secondary" if secondary
        classes << "gem-c-button--secondary-quiet" if secondary_quiet
        classes << "govuk-button--warning" if destructive
        classes << "gem-c-button--bottom-margin" if margin_bottom
        classes.join(" ")
      end
    end
  end
end
