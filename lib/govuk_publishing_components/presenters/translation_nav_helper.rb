module GovukPublishingComponents
  module Presenters
    class TranslationNavHelper
      attr_reader :translations

      def initialize(local_assigns)
        @translations = []
        @translations = local_assigns[:translations] if local_assigns[:translations]
        @inverse = local_assigns[:inverse]
      end

      def has_translations?
        true if @translations.length > 1
      end

      def classes
        classes = %w[gem-c-translation-nav]
        classes << inverse_class if @inverse
        classes.join(" ")
      end

      def inverse_class
        "gem-c-translation-nav--inverse"
      end
    end
  end
end
