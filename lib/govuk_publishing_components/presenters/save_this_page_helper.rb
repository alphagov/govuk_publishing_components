module GovukPublishingComponents
  module Presenters
    class SaveThisPageHelper
      attr_reader :page_is_saved, :signed_in

      PAGE_IS_SAVED_FORM_ACTIONS = {
        true => "/placeholder-for-delete",
        false => "/placeholder-for-save",
      }.freeze

      SEE_SAVED_PAGES_LOGGED_IN = {
        true => {
          link: "/placeholder-saved-pages",
          text: "components.save_this_page.see_saved_pages_signed_in",
        },
        false => {
          link: "/placeholder-sign-in-saved-pages",
          text: "components.save_this_page.see_saved_pages_signed_out",
        },
      }.freeze

      def initialize(options)
        @page_is_saved = options[:page_is_saved] || false
        @signed_in = options[:signed_in] || false
      end

      def form_action
        PAGE_IS_SAVED_FORM_ACTIONS[@page_is_saved]
      end

      def heading_text
        @page_is_saved ? I18n.t("components.save_this_page.page_was_saved_heading") : I18n.t("components.save_this_page.page_not_saved_heading")
      end

      def button_text
        @page_is_saved ? I18n.t("components.save_this_page.remove_page_button") : I18n.t("components.save_this_page.add_page_button")
      end

      def additional_text
        I18n.t(SEE_SAVED_PAGES_LOGGED_IN[@signed_in][:text], link: SEE_SAVED_PAGES_LOGGED_IN[@signed_in][:link])
      end
    end
  end
end
