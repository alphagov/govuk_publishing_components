RSpec.describe GovukPublishingComponents::Presenters::PublicLayoutHelper do
  describe "Public layout helper" do
    let(:input) do
      [
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
    end
    let(:plh) { described_class.new({}) }

    it "adds column sizing to each list of links and data tracking attributes to each link in that list" do
      res = [
        {
          title: "Column 1",
          columns: plh.footer_navigation_columns[0],
          items: [
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
          columns: plh.footer_navigation_columns[1],
          items: [
            {
              href: "/contact",
              text: "contact",
            },
          ],
        },
      ]

      expect(plh.navigation_link_generation_from_locale(input)).to eql(res)
    end
  end
end
