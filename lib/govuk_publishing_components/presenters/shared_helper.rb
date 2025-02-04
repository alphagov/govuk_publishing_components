module GovukPublishingComponents
  module Presenters
    class SharedHelper
      attr_reader :options, :margin_bottom, :heading_level, :classes

      def initialize(local_assigns)
        @options = local_assigns
        @margin_bottom = @options[:margin_bottom] || 3
        @heading_level = @options[:heading_level] || 2
      end

      def get_margin_bottom
        [*0..9].include?(@margin_bottom) ? "govuk-!-margin-bottom-#{margin_bottom}" : "govuk-!-margin-bottom-3"
      end

      def get_heading_level
        return [*1..6].include?(@heading_level) ? "h#{@heading_level}" : "h2" unless @heading_level.zero?

        "span"
      end

      def valid_heading_size?(size)
        %w[xl l m s].include?(size)
      end

      def get_heading_size(option, fallback)
        govuk_class = "govuk-heading-"

        if valid_heading_size?(option)
          "#{govuk_class}#{option}"
        else
          "#{govuk_class}#{fallback}"
        end
      end

      def t_locale(content, options = {})
        # Check if the content string has a translation
        content_translation_available = translation_present?(content)

        # True, return locale
        this_locale = I18n.locale if content_translation_available
        # If false, return default locale
        this_locale = I18n.default_locale unless content_translation_available

        # Check if default string passed in
        if options[:default].present?
          # Check if the default string has a translation
          default_translation_available = translation_present?(options[:default])
          # If true, return locale
          this_locale = I18n.locale if default_translation_available
          # If false, return default_locale
          this_locale = I18n.default_locale unless default_translation_available
        end

        this_locale
      end

      def t_lang(content, options = {})
        locale = t_locale(content, options)
        "lang=#{locale}" unless locale.eql?(I18n.locale)
      end

      def t_locale_check(locale)
        locale.presence unless locale.to_s.eql?(I18n.locale.to_s)
      end

    private

      def translation_present?(content)
        default_string = "This is a string to act as a default for the `I18n.translate` method. Comparing the result reveals if there is a translation in the i18n files."
        I18n.translate(
          content,
          default: default_string,
          fallback: false,
        ) != default_string
      end
    end
  end
end
