require 'gds_api/rummager'

module GovukPublishingComponents
  module Presenters
    # @private
    module Services
      def self.rummager
        @rummager ||= GdsApi::Rummager.new(Plek.find('search'))
      end
    end
  end
end
