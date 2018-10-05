module GovukPublishingComponents
  module ApplicationHelper
    def using_slimmer?
      return false unless Object.const_defined?("Slimmer")
      Rails.application.middleware.include?(Slimmer::App)
    end
  end
end
