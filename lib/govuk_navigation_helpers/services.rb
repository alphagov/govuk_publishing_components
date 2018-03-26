require 'gds_api/rummager'

module GovukNavigationHelpers
  module Services
    def self.rummager
      @rummager ||= GdsApi::Rummager.new(Plek.find('rummager'))
    end
  end
end
