module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    helper ::Rails.application.helpers
    include Slimmer::GovukComponents
    include Slimmer::Headers
    protect_from_forgery with: :exception
    before_action :set_custom_slimmer_headers
    before_action :set_x_frame_options_header
    before_action :set_no_banner_cookie

  private

    def set_custom_slimmer_headers
      set_slimmer_headers(report_a_problem: 'false', remove_search: true)
    end

    def set_x_frame_options_header
      response.headers["X-Frame-Options"] = "ALLOWALL"
    end

    def set_no_banner_cookie
      cookies['govuk_takenUserSatisfactionSurvey'] = {
        value: 'yes',
        domain: 'localhost',
        path: '/component-guide'
      }

      cookies['seen_cookie_message'] = {
        value: 'yes',
        domain: 'localhost',
        path: '/component-guide'
      }
    end
  end
end
