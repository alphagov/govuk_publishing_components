module GovukPublishingComponents
  module Presenters
    class AbsoluteLinksHelper
      def make_url_absolute(href)
        # If the URL is already absolute do nothing
        unless href.start_with?("/")
          return href
        end

        host = ENV["VIRTUAL_HOST"] || Plek.new.website_root

        unless host.start_with?("http://", "https://", "//")
          host = "//#{host}" # '//' preserves the current protocol, we shouldn't force https as that would break dev environments
        end

        "#{host}#{href}"
      end
    end
  end
end
