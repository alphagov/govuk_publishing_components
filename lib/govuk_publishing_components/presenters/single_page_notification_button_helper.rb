module GovukPublishingComponents
  module Presenters
    class SinglePageNotificationButtonHelper
      attr_reader :already_subscribed, :data_attributes, :base_path, :js_enhancement, :button_type, :button_location, :classes, :skip_account

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
        @button_text_subscribe = custom_button_text_is_valid? ? custom_subscribe_text : default_subscribe_text
        @button_text_unsubscribe = custom_button_text_is_valid? ? custom_unsubscribe_text : default_unsubscribe_text
        @skip_account = @local_assigns[:skip_account] || nil
      end

      def data
        @data_attributes[:module] = "single-page-notification-button" if js_enhancement
        # This attribute is passed through to the personalisation API to ensure when a new button is returned from the API, it has the same button_location
        @data_attributes[:button_location] = button_location
        @data_attributes[:button_text_subscribe] = @button_text_subscribe
        @data_attributes[:button_text_unsubscribe] = @button_text_unsubscribe
        @data_attributes
      end

      def button_location_is_valid?
        %w[bottom top].include? @local_assigns[:button_location]
      end

      def button_text
        @already_subscribed ? @button_text_unsubscribe : @button_text_subscribe
      end

      def custom_button_text_is_valid?
        custom_subscribe_text.present? && custom_unsubscribe_text.present?
      end

      def custom_subscribe_text
        @local_assigns.dig(:button_text, :subscribe)
      end

      def custom_unsubscribe_text
        @local_assigns.dig(:button_text, :unsubscribe)
      end

      def default_subscribe_text
        I18n.t("components.single_page_notification_button.subscribe_text")
      end

      def default_unsubscribe_text
        I18n.t("components.single_page_notification_button.unsubscribe_text")
      end

      def form_action
        if skip_the_gov_uk_account?
          email_alert_frontend_endpoint_no_account
        else
          email_alert_frontend_endpoint_enforce_account
        end
      end

      def email_alert_frontend_endpoint_enforce_account
        "/email/subscriptions/single-page/new"
      end

      def email_alert_frontend_endpoint_no_account
        "/email-signup"
      end

      def skip_account_param
        "single_page_subscription"
      end

      def skip_the_gov_uk_account?
        @skip_account == "true"
      end
    end
  end
end
