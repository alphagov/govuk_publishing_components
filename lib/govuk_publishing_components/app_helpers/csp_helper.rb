module GovukPublishingComponents
  module AppHelpers
    class ContentSecurityPolicy
      def self.configure_policy_for_map(policy)
        # The map component makes use of maplibre
        policy.img_src(*policy.img_src, "https://tiles.openfreemap.org", :data)
        policy.connect_src(*policy.connect_src, "https://tiles.openfreemap.org", :data)
      end
    end
  end
end
