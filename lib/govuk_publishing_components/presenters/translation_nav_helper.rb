module GovukPublishingComponents
  module Presenters
    class TranslationNavHelper
      attr_reader :translations

      def initialize(local_assigns)
        @translations = []
        @translations = local_assigns[:translations] if local_assigns[:translations]
        @no_margin_top = local_assigns[:no_margin_top]
        @inverse = local_assigns[:inverse]
      end

      def has_translations?
        true if @translations.length > 1
      end

      def classes
        classes = %w[gem-c-translation-nav]
        classes << inverse_class if @inverse
        classes << margin_class if @no_margin_top
        classes.join(" ")
      end

      def inverse_class
        "gem-c-translation-nav--inverse"
      end

      def margin_class
        "gem-c-translation-nav--no-margin-top"
      end
    end
  end
end
