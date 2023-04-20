module GovukPublishingComponents
  module Presenters
    class LayoutFooterHelper
      attr_reader :ga4_index_total, :ga4_index_section_count, :ga4_ogl_link_index_section, :ga4_copyright_link_index_section

      def initialize(footer_navigation_section, footer_meta_section)
        @ga4_index_total = 0
        @ga4_index_section_count = 0
        @amount_of_meta_sections = 0

        footer_navigation_section.each do |section|
          @ga4_index_section_count += 1
          if section[:items]
            @ga4_index_total += section[:items].length
          end
        end

        if footer_meta_section.any?
          @amount_of_meta_sections = 1
          @ga4_index_section_count += 1
          @ga4_index_total += footer_meta_section[:items].length
        end

        # For our GOVUK footer links, we need to add 2 to the index_total and index_section_count. This is due to the "Open Government License" and "Crown Copyright" links being defined separately to the rest of our footer links.
        @ga4_index_total += 2
        @ga4_index_section_count += 2

        @ga4_ogl_link_index_section = footer_navigation_section.length + @amount_of_meta_sections + 1
        @ga4_copyright_link_index_section = footer_navigation_section.length + @amount_of_meta_sections + 2
      end

      def generate_ga4_link_attribute(index_link, index_section, section)
        {
          "event_name": "navigation",
          "type": "footer",
          "index": {
            "index_link": (index_link + 1).to_s,
            "index_section": (index_section + 1).to_s,
            "index_section_count": @ga4_index_section_count.to_s,
          },
          "index_total": @ga4_index_total.to_s,
          "section": section,
        }
      end
    end
  end
end
