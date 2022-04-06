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
        @footer_navigation = local_assigns[:footer_navigation] || I18n.t("components.layout_footer.navigation_links").each_with_index.map do |menu, i|
          {
            title: menu[:title],
            columns: FOOTER_NAVIGATION_COLUMNS[i],
            items: menu[:menu_contents].map do |item|
              item.merge({
                attributes: {
                  data: {
                    track_category: "footerClicked",
                    track_action: "footerLinks",
                    track_label: item[:text],
                  },
                },
              })
            end,
          }
        end
        @footer_meta = local_assigns[:footer_meta] || FOOTER_META
        @cookie_banner_data = local_assigns[:cookie_banner_data] || {}
      end
    end
  end
end
