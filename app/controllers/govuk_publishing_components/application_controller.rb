module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    helper ::Rails.application.helpers
    protect_from_forgery with: :exception
    before_action :set_x_frame_options_header
    before_action :set_disable_slimmer_header

  private

    def set_x_frame_options_header
      response.headers["X-Frame-Options"] = "ALLOWALL"
    end

    def set_disable_slimmer_header
      response.headers["X-Slimmer-Skip"] = "true"
    end
  end
end
