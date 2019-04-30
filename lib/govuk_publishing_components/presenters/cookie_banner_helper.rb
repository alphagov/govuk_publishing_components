module GovukPublishingComponents
  module Presenters
    class CookieBannerHelper
      attr_reader :local_assigns

      def initialize(local_assigns)
        @message = local_assigns[:message]
        @new_cookie_banner = local_assigns[:new_cookie_banner]
        @local_assigns = local_assigns
      end

      def message
        return @message if @message.present?

        if @new_cookie_banner
          "GOV.UK uses cookies to make the site simpler."
        else
          'GOV.UK uses cookies to make the site simpler. <a class="govuk-link" href="/help/cookies" data-module="track-click" data-track-category="cookieBanner" data-track-action="Cookie banner clicked">Find out more about cookies</a> <span class="gem-c-cookie-banner__hide-link">or <a class="govuk-link" href="#" data-hide-cookie-banner="true" data-module="track-click" data-track-category="cookieBanner" data-track-action="Cookie banner hidden">hide this message</a></span>'.html_safe
        end
      end
    end
  end
end
