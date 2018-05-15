module GovukPublishingComponents
  module Presenters
    class TranslationNavHelper
      attr_reader :translations

      def initialize(local_assigns)
        @translations = []
        @translations = local_assigns[:translations] if local_assigns[:translations]
      end

      def has_translations?
        true if @translations.length > 1
      end

      def tracking_is_present?
        @translations.each do |translation|
          return true if translation[:data_attributes]
        end
        false
      end
    end
  end
end
