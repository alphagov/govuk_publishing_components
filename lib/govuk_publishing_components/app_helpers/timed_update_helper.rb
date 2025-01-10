require "active_support/all"

module GovukPublishingComponents
  module AppHelpers
    module TimedUpdateHelper
      def self.before_update_time?(year:, month:, day:, hour:, minute:)
        Time.zone.now.before? Time.zone.local(year, month, day, hour, minute)
      end
    end
  end
end
