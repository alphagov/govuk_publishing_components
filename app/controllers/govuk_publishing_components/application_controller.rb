module GovukPublishingComponents
  class ApplicationController < ActionController::Base
    helper ::Rails.application.helpers
    protect_from_forgery with: :exception
  end
end
