module GovukPublishingComponents
  module Presenters
    class SubscriptionLinksHelper
      attr_reader :email_signup_link, :email_signup_link_data_attributes

      def initialize(local_assigns)
        @local_assigns = local_assigns
        @email_signup_link = @local_assigns[:email_signup_link]
        @email_signup_link_data_attributes = @local_assigns[:email_signup_link_data_attributes]
      end

      def email_signup_link_text
        return @local_assigns[:email_signup_link_text] if @local_assigns[:email_signup_link_text]

        I18n.t("components.subscription_links.email_signup_link_text")
      end

      def feed_link_text
        return @local_assigns[:feed_link_text] if @local_assigns[:feed_link_text]

        I18n.t("components.subscription_links.feed_link_text")
      end

      def component_data_is_valid?
        email_signup_link.present? || feed_link.present?
      end

      def tracking_is_present?
        @local_assigns[:email_signup_link_data_attributes].present? || @local_assigns[:feed_link_data_attributes].present?
      end

      def feed_link
        @local_assigns[:feed_link]
      end

      def feed_link_data_attributes
        @local_assigns[:feed_link_data_attributes] || {}
      end
    end
  end
end
