module GovukPublishingComponents
  module Presenters
    class DevolvedNationsHelper
      attr_reader :national_applicability, :type

      def initialize(local_assigns)
        @national_applicability = local_assigns[:national_applicability]
        @type = local_assigns[:type] || "publication"
      end

      def applicable_nations_title_text
        @national_applicability
          .select { |_, v| v[:applicable] == true }
          .map { |k, _| I18n.t("components.devolved_nations.#{k}") }
          .sort
          .to_sentence(
            two_words_connector: I18n.t("components.devolved_nations.connectors.two_words"),
            last_word_connector: I18n.t("components.devolved_nations.connectors.last_word"),
          )
      end

      def nations_with_urls
        @national_applicability
          .select do |_, v|
            v[:alternative_url]
            .present?
          end
      end

      def alternative_content_text(name)
        nation = I18n.t("components.devolved_nations.#{name}")

        if I18n.exists?("components.devolved_nations.type.#{@type}")
          I18n.t("components.devolved_nations.type.#{@type}", nation: nation)
        else
          I18n.t("components.devolved_nations.type.publication", nation: nation)
        end
      end
    end
  end
end
