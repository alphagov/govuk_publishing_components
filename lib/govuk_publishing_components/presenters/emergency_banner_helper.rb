module GovukPublishingComponents
  module Presenters
    class EmergencyBannerHelper
      EMERGENCY_TYPES = %w[notable-death national-emergency local-emergency].freeze

      def initialize(options); end

      def emergency_types
        EMERGENCY_TYPES
      end

      def is_a_valid_emergency_type?(type)
        EMERGENCY_TYPES.include?(type)
      end
    end
  end
end
