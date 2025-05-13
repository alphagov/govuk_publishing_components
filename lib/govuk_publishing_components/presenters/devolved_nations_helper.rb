module GovukPublishingComponents
  module Presenters
    class DevolvedNationsHelper
      attr_reader :national_applicability, :content_type

      def initialize(local_assigns)
        @national_applicability = local_assigns[:national_applicability]
        @content_type = local_assigns[:content_type] || "publication"
      end

      def applicable_nations_title_text(use_english_translation = nil)
        nation_keys = @national_applicability
                    .select { |_, v| v[:applicable] == true }
                    .map { |k, _| k }
        nation_keys.each_with_index.map { |k, i| name_for_position(k, i, nation_keys.count, use_english_translation) }.join
      end

      def name_for_position(nation, position, total, use_english_translation)
        key = if position.zero?
                :start
              elsif position == (total - 1)
                :end
              else
                :middle
              end
        I18n.t("components.devolved_nations.#{nation}.#{key}", locale: use_english_translation ? :en : nil)
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
        nation = I18n.t("components.devolved_nations.#{name}.start")

        if I18n.exists?("components.devolved_nations.type.#{@content_type}")
          I18n.t("components.devolved_nations.type.#{@content_type}", nation:)
        else
          I18n.t("components.devolved_nations.type.publication", nation:)
        end
      end
    end
  end
end
