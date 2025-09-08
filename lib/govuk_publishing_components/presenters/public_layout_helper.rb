module GovukPublishingComponents
  module Presenters
    class PublicLayoutHelper
      FOOTER_NAVIGATION_COLUMNS = [2, 1].freeze
      FOOTER_META = {
        items: [
          {
            href: "/help",
            text: "Help",
          },
          {
            href: "/help/privacy-notice",
            text: "Privacy",
          },
          {
            href: "/help/cookies",
            text: "Cookies",
          },
          {
            href: "/help/accessibility-statement",
            text: "Accessibility statement",
          },
          {
            href: "/contact",
            text: "Contact",
          },
          {
            href: "/help/terms-conditions",
            text: "Terms and conditions",
          },
          {
            href: "/cymraeg",
            text: "Rhestr o Wasanaethau Cymraeg",
            attributes: {
              lang: "cy",
            },
          },
          {
            href: "/government/organisations/government-digital-service",
            text: "Government Digital Service",
          },
        ],
      }.freeze

      attr_reader :footer_navigation, :footer_meta, :cookie_banner_data

      def initialize(local_assigns)
        @footer_navigation = local_assigns[:footer_navigation] || navigation_link_generation_from_locale(I18n.t("components.layout_footer.navigation_links"))
        @footer_meta = local_assigns[:footer_meta] || { items: FOOTER_META[:items] }
        @cookie_banner_data = local_assigns[:cookie_banner_data] || {}
      end

      def navigation_link_generation_from_locale(links)
        links.each_with_index.map do |menu, i|
          {
            title: menu[:title],
            columns: footer_navigation_columns[i],
            items: menu[:menu_contents],
          }
        end
      end

      def footer_navigation_columns
        FOOTER_NAVIGATION_COLUMNS
      end
    end
  end
end
