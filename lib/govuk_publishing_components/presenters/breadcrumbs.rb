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
          Breadcrumb.new(crumb, index).item_list_element(@request_path)
        end
      end
    end

    class Breadcrumb
      extend Forwardable
      def_delegators :@crumb, :[]

      def initialize(crumb, index)
        @crumb = crumb
        @index = index + 1
      end

      def item_list_element(request_path)
        {
          "@type" => "ListItem",
          "position" => index,
          "item" => list_item_item(request_path)
        }
      end

      def is_link?
        crumb[:url].present? || crumb[:is_current_page]
      end

      def path
        crumb[:is_current_page] ? '#content' : crumb[:url]
      end

      def aria_current
        crumb[:is_current_page] ? 'page' : 'false'
      end

      def tracking_data(breadcrumbs_length)
        data = {
          track_category: 'breadcrumbClicked',
          track_action: index,
          track_label: path,
          track_options: {
              dimension28: breadcrumbs_length.to_s,
              dimension29: crumb[:title]
          }
        }

        is_homepage = crumb[:url] == "/"

        if is_homepage
          data[:track_category] = 'homeLinkClicked'
          data[:track_action] = 'homeBreadcrumb'
          data[:track_label] = ''
          data[:track_options] = '{}'
        end

        data
      end

    private

      attr_reader :crumb, :index

      def list_item_item(request_path)
        path = crumb[:is_current_page] ? request_path : crumb[:url]
        item = { "name" => crumb[:title] }
        item["@id"] = Plek.new.website_root + path if path
        item
      end
    end
  end
end
