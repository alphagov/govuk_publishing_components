module GovukPublishingComponents
  module Presenters
    class PublicLayoutHelper
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

      attr_reader :footer_navigation, :footer_meta, :cookie_banner_data, :footer_links_count

      def initialize(local_assigns)
        @footer_links_count = generate_ga4_footer_links_count(local_assigns)
        @footer_navigation = local_assigns[:footer_navigation] || navigation_link_generation_from_locale(I18n.t("components.layout_footer.navigation_links"))
        @footer_meta = local_assigns[:footer_meta] || { items: add_data_attributes_to_links(FOOTER_META[:items], "supportLink", { section: "Support links", index_section: 3 }) }
        @cookie_banner_data = local_assigns[:cookie_banner_data] || {}
      end

      def generate_ga4_footer_links_count(local_assigns)
        footer_links_count = 0

        footer_nav = local_assigns[:footer_navigation] || I18n.t("components.layout_footer.navigation_links")

        footer_nav.each do |column|
          if column[:items]
            footer_links_count += column[:items].length
          elsif column[:menu_contents]
            footer_links_count += column[:menu_contents].length
          end
        end

        footer_meta = local_assigns[:footer_meta] || FOOTER_META
        footer_links_count += footer_meta[:items].length

        footer_links_count += 2 # Amount of links to add to @footer_links_count. This accounts for the OGL link and Crown Copyright link.
        footer_links_count
      end

      def navigation_link_generation_from_locale(links)
        links.each_with_index.map do |menu, i|
          ga4_data = {
            section: menu[:title],
            index_section: i + 1,
          }
          {
            title: menu[:title],
            columns: footer_navigation_columns[i],
            items: add_data_attributes_to_links(menu[:menu_contents], footer_track_actions[i], ga4_data),
          }
        end
      end

      def footer_navigation_columns
        FOOTER_NAVIGATION_COLUMNS
      end

      def footer_track_actions
        FOOTER_TRACK_ACTIONS
      end

      def generate_data_attribute(link, track_action, ga4_attributes)
        ga4_link = {
          "event_name": "navigation",
          "type": "footer",
          "index": {
            "index_link": ga4_attributes[:index_link].to_s,
            "index_section": ga4_attributes[:index_section].to_s,
            "index_section_count": "5",
          },
          "index-total": @footer_links_count.to_s,
          "section": ga4_attributes[:section],
        }

        {
          track_category: "footerClicked",
          track_action: track_action,
          track_label: link[:href],
          track_options: {
            dimension29: link[:text],
          },
          ga4_link: ga4_link,
        }
      end

      def add_data_attributes_to_links(items, track_action, ga4_data)
        items.map.with_index do |item, index|
          ga4_attributes = {
            section: ga4_data[:section],
            index_link: index + 1,
            index_section: ga4_data[:index_section],
          }
          item.deep_merge({ attributes: { data: generate_data_attribute(item, track_action, ga4_attributes) } })
        end
      end
    end
  end
end
