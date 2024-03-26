module GovukPublishingComponents
  module Presenters
    class InterventionHelper
      def initialize(options = {})
        @name = options[:name]
        @dismiss_text = options[:dismiss_text]
        @accessible_text_suffix = I18n.t("components.intervention.accessible_link_text_suffix")
        @params = options[:params]
        @query_string = options[:query_string]
        @suggestion_text = options[:suggestion_text]
        @suggestion_link_text = options[:suggestion_link_text]
        @suggestion_link_url = options[:suggestion_link_url]
      end

      def accessible_text
        @suggestion_link_text << @accessible_text_suffix unless @suggestion_link_text.include?(@accessible_text_suffix)

        @suggestion_link_text
      end

      def dismiss_link
        if @query_string.present?
          "#{@query_string}&hide-intervention=true"
        else
          "?hide-intervention=true"
        end
      end

      def security_attr
        # Link is external unless it begins with "/" (but not "//") or it's on gov.uk.
        if %r{\A(/[^/]|https://(www\.)?gov\.uk(/|\z))}.match?(@suggestion_link_url)
          "noopener noreferrer"
        else
          "noopener noreferrer external"
        end
      end

      def show?
        return false if params["hide-intervention"] == "true"
        return false if @dismiss_text && @name.blank?

        @suggestion_text || (@suggestion_link_text && @suggestion_link_url)
      end

    private

      attr_reader :accessible_text_suffix, :query_string, :params, :suggestion_text, :suggestion_link_text, :suggestion_link_url
    end
  end
end
