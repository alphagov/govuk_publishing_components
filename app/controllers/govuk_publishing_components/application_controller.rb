module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    include Slimmer::GovukComponents
    include Slimmer::Headers
    protect_from_forgery with: :exception
    before_action :set_custom_slimmer_headers

  private

    def set_custom_slimmer_headers
      set_slimmer_headers(report_a_problem: 'false', remove_search: true)
    end
  end
end
