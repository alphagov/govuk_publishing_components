RSpec.describe GovukPublishingComponents::Presenters::LayoutFooterHelper do
  describe "Footer helper" do
    let(:navigation) do
      [
        {
          items: [
            {
              href: "/help",
              text: "Help",
            },
          ],
        },
      ]
    end

    let(:meta) do
      {
        items: [
          {
            href: "/help",
            text: "Help",
          },
          {
            href: "/help/privacy-notice",
            text: "Privacy",
          },
        ],
      }
    end

    it "generates correct counts for ga4 tracking" do
      footer_helper = described_class.new(navigation, meta)

      expect(footer_helper.ga4_index_section_count).to be(4)
      expect(footer_helper.ga4_ogl_link_index_section).to be(3)
      expect(footer_helper.ga4_copyright_link_index_section).to be(4)

      # Add a new section
      navigation.append({
        items: [
          {
            href: "/browse",
            text: "Browse",
          },
        ],
      })

      footer_helper = described_class.new(navigation, meta)

      expect(footer_helper.ga4_index_section_count).to be(5)
      expect(footer_helper.ga4_ogl_link_index_section).to be(4)
      expect(footer_helper.ga4_copyright_link_index_section).to be(5)
    end

    it "generates the correct ga4_link JSON for ga4 tracking" do
      footer_helper = described_class.new(navigation, meta)

      expected = {
        "event_name": "navigation",
        "type": "footer",
        "index_link": "1",
        "index_section": "1",
        "index_section_count": "4",
        "index_total": "5",
        "section": "Test",
      }

      expect(footer_helper.generate_ga4_link_attribute(0, 0, "Test", 5)).to eql(expected)
    end
  end
end
