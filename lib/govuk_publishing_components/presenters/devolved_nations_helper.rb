module GovukPublishingComponents
  module Presenters
    class DevolvedNationsHelper
      attr_reader :national_applicability

      def initialize(local_assigns)
        @national_applicability = local_assigns[:national_applicability]
      end

      def applicable_nations_title_text
        @national_applicability
          .select { |_, v| v[:applicable] == true }
          .map { |k, _| I18n.t("components.devolved_nations.#{k}") }
          .sort
          .to_sentence(last_word_connector: t("components.devolved_nations.last_word_connector"))
      end

      def nations_with_urls
        @national_applicability
          .select do |_, v|
            v[:alternative_url]
            .present?
          end
      end
    end
  end
end
