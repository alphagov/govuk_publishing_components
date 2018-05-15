module GovukPublishingComponents
  module Presenters
    class Breadcrumbs
      def initialize(breadcrumbs, request_path)
        @breadcrumbs = breadcrumbs
        @request_path = request_path
      end

      def structured_data
        {
          "@context" => "http://schema.org",
          "@type" => "BreadcrumbList",
          "itemListElement" => item_list_element,
        }
      end

    private

      attr_reader :breadcrumbs, :request_path

      def item_list_element
        breadcrumbs.each_with_index.map do |crumb, index|
          {
            "@type" => "ListItem",
            "position" => index + 1,
            "item" => list_item_item(crumb)
          }
        end
      end

      def list_item_item(crumb)
        path = crumb[:is_current_page] ? request_path : crumb[:url]
        item = { "name" => crumb[:title] }
        item["@id"] = Plek.new.website_root + path if path
        item
      end
    end
  end
end
