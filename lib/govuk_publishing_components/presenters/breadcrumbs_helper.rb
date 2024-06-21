module GovukPublishingComponents
  module Presenters
    class Breadcrumbs
      def initialize(breadcrumbs)
        @breadcrumbs = breadcrumbs
      end

      def structured_data
        {
          "@context" => "http://schema.org",
          "@type" => "BreadcrumbList",
          "itemListElement" => item_list_element,
        }
      end

    private

      attr_reader :breadcrumbs

      def item_list_element
        breadcrumbs.each_with_index.map { |crumb, index| Breadcrumb.new(crumb, index) }
          .select(&:is_link?)
          .map(&:item_list_element)
      end
    end

    class Breadcrumb
      extend Forwardable
      def_delegators :@crumb, :[]

      def initialize(crumb, index)
        @crumb = crumb
        @index = index + 1
      end

      def item_list_element
        {
          "@type" => "ListItem",
          "position" => index,
          "item" => list_item_item,
        }
      end

      def is_link?
        crumb[:url].present?
      end

      def path
        crumb[:url]
      end

      def tracking_data(breadcrumbs_length)
        data = {
          ga4_link: {
            event_name: "navigation",
            type: "breadcrumb",
            index_link: index.to_s,
            index_total: breadcrumbs_length.to_s,
          },
        }

        is_homepage = crumb[:url] == "/"

        if is_homepage
          data[:track_category] = "homeLinkClicked"
          data[:track_action] = "homeBreadcrumb"
          data[:track_label] = ""
          data[:track_options] = "{}"
        end

        data
      end

    private

      attr_reader :crumb, :index

      def list_item_item
        path = crumb[:url]
        item = { "name" => crumb[:title] }
        item["@id"] = Plek.new.website_root + path if path
        item
      end
    end
  end
end
