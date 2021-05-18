module GovukPublishingComponents
  module Presenters
    class SaveThisPageHelper
      attr_reader :form_action, :heading_text, :button_text, :additional_text

      FORM_ACTIONS = {
        "delete" => "/placeholder-for-delete",
        "save" => "/placeholder-for-save",
      }.freeze

      LINKS = {
        "see_saved_pages" => "/placeholder-saved-pages",
        "sign_in" => "/placeholder-sign-in",
      }.freeze

      def initialize(options)
        already_saved = options[:page_is_saved]

        @form_action = already_saved ? FORM_ACTIONS["delete"] : FORM_ACTIONS["save"]
        @heading_text = already_saved ? I18n.t("components.save_this_page.page_was_saved_heading") : I18n.t("components.save_this_page.page_not_saved_heading")
        @button_text = already_saved ? I18n.t("components.save_this_page.remove_page_button") : I18n.t("components.save_this_page.add_page_button")
        @additional_text = options[:signed_in] ? I18n.t("components.save_this_page.see_saved_pages_signed_in", link: LINKS["see_saved_pages"]) : I18n.t("components.save_this_page.see_saved_pages_signed_out", link: LINKS["sign_in"])
      end
    end
  end
end
