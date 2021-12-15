module GovukPublishingComponents
  module Presenters
    class SinglePageNotificationButtonHelper
      attr_reader :already_subscribed, :data_attributes, :base_path, :js_enhancement, :button_type, :button_location, :classes

      def initialize(local_assigns)
        @local_assigns = local_assigns
        @data_attributes = @local_assigns[:data_attributes] || {}
        @js_enhancement = @local_assigns[:js_enhancement] || false
        @already_subscribed = @local_assigns[:already_subscribed] || false
        @base_path = @local_assigns[:base_path] || nil
        @button_location = button_location_is_valid? ? @local_assigns[:button_location] : nil
        @button_type = @local_assigns[:already_subscribed] ? "Unsubscribe" : "Subscribe"
        @classes = %w[gem-c-single-page-notification-button]
        @classes << "js-personalisation-enhancement" if js_enhancement
      end

      def data
        @data_attributes[:track_label] = base_path
        # data-action for tracking should have the format of e.g. "Unsubscribe-button-top", or "Subscribe-button-bottom"
        # when button_location is not present data-action will fall back to "Unsubscribe-button"/"Subscribe-button"
        @data_attributes[:track_action] = [button_type, "button", button_location].compact.join("-")
        @data_attributes[:module] = "single-page-notification-button" if js_enhancement
        @data_attributes[:track_category] = "Single-page-notification-button"
        # This attribute is passed through to the personalisation API to ensure when a new button is returned from the API, it has the same button_location
        @data_attributes[:button_location] = button_location
        @data_attributes
      end

      def button_location_is_valid?
        %w[bottom top].include? @local_assigns[:button_location]
      end

      def button_text
        @already_subscribed ? I18n.t("components.single_page_notification_button.unsubscribe_text") : I18n.t("components.single_page_notification_button.subscribe_text")
      end
    end
  end
end
