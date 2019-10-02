module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    helper ::Rails.application.helpers
    protect_from_forgery with: :exception
    before_action :set_x_frame_options_header
    before_action :set_disable_slimmer_header

    content_security_policy do |p|
      # don't do anything if the app doesn't have a content security policy
      next unless p.directives.any?

      # Unfortunately the axe core script uses a dependency that uses eval
      # see: https://github.com/dequelabs/axe-core/issues/1175
      # Thus all components shown by govuk_publishing_components need this
      # enabled
      p.script_src(*p.script_src, :unsafe_eval)
    end

  private

    def set_x_frame_options_header
      response.headers["X-Frame-Options"] = "ALLOWALL"
    end

    def set_disable_slimmer_header
      response.headers["X-Slimmer-Skip"] = "true"
    end
  end
end
