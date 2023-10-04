module GovukPublishingComponents
  module Presenters
    class LayoutFooterHelper
      attr_reader :ga4_index_section_count, :ga4_ogl_link_index_section, :ga4_copyright_link_index_section

      def initialize(footer_navigation_section, footer_meta_section)
        @ga4_index_section_count = footer_navigation_section.length
        @amount_of_meta_sections = 0

        if footer_meta_section.any?
          @amount_of_meta_sections = 1
          @ga4_index_section_count += 1
        end

        # For our GOVUK footer links, we need to add 2 to the index_section_count. This is due to the "Open Government License" and "Crown Copyright" links being defined separately to the rest of our footer links.
        @ga4_index_section_count += 2

        @ga4_ogl_link_index_section = footer_navigation_section.length + @amount_of_meta_sections + 1
        @ga4_copyright_link_index_section = @ga4_ogl_link_index_section + 1
      end

      def generate_ga4_link_attribute(index_link, index_section, section, index_total)
        {
          "event_name": "navigation",
          "type": "footer",
          "index_link": (index_link + 1).to_s,
          "index_section": (index_section + 1).to_s,
          "index_section_count": @ga4_index_section_count.to_s,
          "index_total": index_total.to_s,
          "section": section,
        }
      end
    end
  end
end
