require 'gds_api/rummager'

module GovukPublishingComponents
  module AppHelpers
    # @private
    module Services
      def self.rummager
        @rummager ||= GdsApi::Rummager.new(Plek.find('rummager'))
      end
    end
  end
end
