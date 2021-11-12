require "action_view"

module GovukPublishingComponents
  module Presenters
    class ButtonHelper
      attr_reader :href,
                  :text,
                  :title,
                  :info_text,
                  :info_text_classes,
                  :rel,
                  :data_attributes,
                  :margin_bottom,
                  :inline_layout,
                  :target,
                  :type,
                  :start,
                  :secondary,
                  :secondary_quiet,
                  :secondary_solid,
                  :destructive,
                  :name,
                  :value,
                  :classes,
                  :aria_label

      def initialize(local_assigns)
        @href = local_assigns[:href]
        @text = local_assigns[:text]
        @title = local_assigns[:title]
        @info_text = local_assigns[:info_text]
        @info_text_classes = %w[gem-c-button__info-text]
        if local_assigns[:margin_bottom]
          margin_class = get_margin_bottom(local_assigns[:margin_bottom], true)
          @info_text_classes << margin_class
        end
        @rel = local_assigns[:rel]
        @data_attributes = local_assigns[:data_attributes]
        @margin_bottom = local_assigns[:margin_bottom]
        @inline_layout = local_assigns[:inline_layout]
        @target = local_assigns[:target]
        @type = local_assigns[:type]
        @start = local_assigns[:start]
        @secondary = local_assigns[:secondary]
        @secondary_quiet = local_assigns[:secondary_quiet]
        @secondary_solid = local_assigns[:secondary_solid]
        @destructive = local_assigns[:destructive]
        @name = local_assigns[:name]
        @value = local_assigns[:value]
        @classes = local_assigns[:classes]
        @aria_label = local_assigns[:aria_label]
      end

      def link?
        href.present?
      end

      def html_options
        options = { class: css_classes }
        options[:role] = "button" if link?
        options[:type] = button_type
        options[:rel] = rel if rel
        options[:data] = data_attributes if data_attributes
        options[:title] = title if title
        options[:target] = target if target
        options[:name] = name if name.present? && value.present?
        options[:value] = value if name.present? && value.present?
        options[:aria] = { label: aria_label } if aria_label
        options[:draggable] = false if link?
        options
      end

      def button_type
        type || "submit" unless link?
      end

    private

      def css_classes
        css_classes = %w[gem-c-button govuk-button]
        css_classes << "govuk-button--start" if start
        css_classes << "gem-c-button--secondary" if secondary
        css_classes << "gem-c-button--secondary-quiet" if secondary_quiet
        css_classes << "govuk-button--secondary" if secondary_solid
        css_classes << "govuk-button--warning" if destructive
        if margin_bottom && !info_text
          margin_class = get_margin_bottom(margin_bottom, false)
          css_classes << margin_class
        end
        css_classes << "gem-c-button--inline" if inline_layout
        css_classes << classes if classes
        css_classes.join(" ")
      end

      def get_margin_bottom(margin, info_text)
        legacy_class = "gem-c-button--bottom-margin"
        legacy_class = "gem-c-button__info-text--bottom-margin" if info_text

        [*0..9].include?(margin) ? "govuk-!-margin-bottom-#{margin}" : legacy_class
      end
    end
  end
end
