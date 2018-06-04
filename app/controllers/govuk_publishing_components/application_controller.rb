module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    helper ::Rails.application.helpers
    include Slimmer::Headers
    protect_from_forgery with: :exception
    before_action :set_custom_slimmer_headers
    before_action :set_x_frame_options_header

  private

    def set_custom_slimmer_headers
      set_slimmer_headers(remove_search: true)
    end

    def set_x_frame_options_header
      response.headers["X-Frame-Options"] = "ALLOWALL"
    end
  end
end
