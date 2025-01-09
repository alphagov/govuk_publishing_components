module GovukPublishingComponents
  module Presenters
    class DevolvedNationsHelper
      attr_reader :national_applicability, :content_type

      def initialize(local_assigns)
        @national_applicability = local_assigns[:national_applicability]
        @content_type = local_assigns[:content_type] || "publication"
      end

      def applicable_nations_title_text(use_english_translation = nil)
        @national_applicability
          .select { |_, v| v[:applicable] == true }
          .map { |k, _| get_translation("components.devolved_nations.#{k}", use_english_translation) }
          .sort
          .to_sentence(
            two_words_connector: get_translation("components.devolved_nations.connectors.two_words", use_english_translation),
            last_word_connector: get_translation("components.devolved_nations.connectors.last_word", use_english_translation),
          )
      end

      def get_translation(key, use_english_translation = nil)
        return I18n.t(key, locale: :en) if use_english_translation

        I18n.t(key)
      end

      def ga4_applicable_nations_title_text(remove_connector_word = nil)
        return applicable_nations_title_text(true).gsub(" and", ",") if remove_connector_word

        applicable_nations_title_text(true)
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

        if I18n.exists?("components.devolved_nations.type.#{@content_type}")
          I18n.t("components.devolved_nations.type.#{@content_type}", nation:)
        else
          I18n.t("components.devolved_nations.type.publication", nation:)
        end
      end
    end
  end
end
