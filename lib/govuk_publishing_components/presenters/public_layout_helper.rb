module GovukPublishingComponents
  module Presenters
    class PublicLayoutHelper
      BLUE_BAR_BACKGROUND_COLOURS = %w[browse].freeze
      FOOTER_NAVIGATION_COLUMNS = [2, 1].freeze
      FOOTER_TRACK_ACTIONS = %w[topicsLink governmentactivityLink].freeze
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
        @footer_meta = local_assigns[:footer_meta] || { items: add_data_attributes_to_links(FOOTER_META[:items], "supportLink") }
        @cookie_banner_data = local_assigns[:cookie_banner_data] || {}
      end

      def navigation_link_generation_from_locale(links)
        links.each_with_index.map do |menu, i|
          {
            title: menu[:title],
            columns: footer_navigation_columns[i],
            items: add_data_attributes_to_links(menu[:menu_contents], footer_track_actions[i]),
          }
        end
      end

      def footer_navigation_columns
        FOOTER_NAVIGATION_COLUMNS
      end

      def footer_track_actions
        FOOTER_TRACK_ACTIONS
      end

      def blue_bar_background_colours
        BLUE_BAR_BACKGROUND_COLOURS
      end

      def generate_data_attribute(link, track_action)
        {
          track_category: "footerClicked",
          track_action:,
          track_label: link[:href],
          track_options: {
            dimension29: link[:text],
          },
        }
      end

      def add_data_attributes_to_links(items, track_action)
        items.map do |item|
          item.deep_merge({ attributes: { data: generate_data_attribute(item, track_action) } })
        end
      end
    end
  end
end
