require "spec_helper"

describe GovukPublishingComponents do
  describe ".render" do
    it "can render a component" do
      rendered = described_class.render(
        "govuk_publishing_components/components/button",
      )

      expect(rendered).to match(/<button/)
    end

    it "can pass the component options" do
      rendered = described_class.render(
        "govuk_publishing_components/components/button",
        text: "My Button",
      )

      expect(rendered).to match(/My Button/)
    end

    it "can specify the locale to render the component in" do
      rendered = described_class.render(
        "govuk_publishing_components/components/back_link",
        locale: "cy",
        href: "./",
      )

      expect(rendered).to match(/Nôl/)
    end
  end
end
