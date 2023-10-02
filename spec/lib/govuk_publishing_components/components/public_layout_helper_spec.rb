RSpec.describe GovukPublishingComponents::Presenters::PublicLayoutHelper do
  describe "Public layout helper" do
    before(:each) do
      @input = [
        {
          title: "Column 1",
          menu_contents: [
            {
              href: "/help",
              text: "Help",
              attributes: {
                an_attribute: "still present",
              },
            },
          ],
        },
        {
          title: "Column 2",
          menu_contents: [
            {
              href: "/contact",
              text: "contact",
            },
          ],
        },
      ]

      @plh = GovukPublishingComponents::Presenters::PublicLayoutHelper.new({})
    end

    it "generates correct data tracking attributes from a link and track action" do
      track_action = "track_action"

      res = {
        track_category: "footerClicked",
        track_action:,
        track_label: "/help",
        track_options: {
          dimension29: "Help",
        },
      }

      expect(@plh.generate_data_attribute(@input[0][:menu_contents][0], track_action)).to eql(res)
    end

    it "adds correct data tracking attributes to each link in a list and keeps existing attributes of links" do
      track_action = "track_action"

      res = [
        {
          href: "/help",
          text: "Help",
          attributes: {
            an_attribute: "still present",
            data: {
              track_category: "footerClicked",
              track_action:,
              track_label: "/help",
              track_options: {
                dimension29: "Help",
              },
            },
          },
        },
      ]

      expect(@plh.add_data_attributes_to_links(@input[0][:menu_contents], track_action)).to eql(res)
    end

    it "adds column sizing to each list of links and data tracking attributes to each link in that list" do
      res = [
        {
          title: "Column 1",
          columns: @plh.footer_navigation_columns[0],
          items: [
            {
              href: "/help",
              text: "Help",
              attributes: {
                an_attribute: "still present",
                data: {
                  track_category: "footerClicked",
                  track_action: @plh.footer_track_actions[0],
                  track_label: "/help",
                  track_options: {
                    dimension29: "Help",
                  },
                },
              },
            },
          ],
        },
        {
          title: "Column 2",
          columns: @plh.footer_navigation_columns[1],
          items: [
            {
              href: "/contact",
              text: "contact",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: @plh.footer_track_actions[1],
                  track_label: "/contact",
                  track_options: {
                    dimension29: "contact",
                  },
                },
              },
            },
          ],
        },
      ]

      expect(@plh.navigation_link_generation_from_locale(@input)).to eql(res)
    end
  end
end
