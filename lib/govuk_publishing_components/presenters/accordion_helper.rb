module GovukPublishingComponents
  module Presenters
    class AccordionHelper
      def initialise; end

      def translations
        {
          show_text: "common.show",
          hide_text: "common.hide",
          show_all_text: "components.accordion.show_all",
          hide_all_text: "components.accordion.hide_all",
          this_section_visually_hidden: "components.accordion.this_section_visually_hidden",
        }
      end

      def apply_translations
        shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new({})
        locales = {}
        data_attributes = {}

        translations.each do |key, translation|
          locales[key] = shared_helper.t_locale(translation)
          data_attributes[key] = I18n.translate(translation)
        end

        unique_locales = locales.values.uniq

        if unique_locales.length > 1
          data_attributes[:locale] = locales
        elsif unique_locales[0] != I18n.locale
          data_attributes[:locale] = unique_locales[0]
        end

        data_attributes
      end
    end
  end
end
