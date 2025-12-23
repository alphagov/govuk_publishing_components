require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::OrganisationLogoHelper do
  describe "#initialize" do
    it "errors if nothing is passed" do
      expect { described_class.new({}) }.to raise_error("Component requires an organisation including a name")
    end

    it "errors if an organisation is passed without a name" do
      expect { described_class.new({ organisation: { url: "#" } }) }.to raise_error("Component requires an organisation including a name")
    end
  end

  describe "#logo_content" do
    it "returns a basic image" do
      logo = described_class.new({ organisation: { name: "org", image: { url: "img_url" } } })
      expect(logo.logo_content).to eq('<img class="gem-c-organisation-logo__image" src="/images/img_url" />')
    end

    it "returns an image with alt text" do
      logo = described_class.new({ organisation: { name: "org", image: { url: "img_url", alt_text: "alt" } } })
      expect(logo.logo_content).to eq('<img alt="alt" class="gem-c-organisation-logo__image" src="/images/img_url" />')
    end

    it "returns a span if there is no image" do
      logo = described_class.new({ organisation: { name: "org" } })
      expect(logo.logo_content).to eq('<span class="gem-c-organisation-logo__name">org</span>')
    end
  end

  describe "#logo_container_class" do
    it "provides the base class" do
      logo = described_class.new({ organisation: { name: "org" } })
      expect(logo.logo_container_class).to eq("gem-c-organisation-logo__container")
    end

    it "accepts a link" do
      logo = described_class.new({ organisation: { name: "org", url: "#" } })
      expect(logo.logo_container_class).to eq("gem-c-organisation-logo__container gem-c-organisation-logo__link")
    end

    it "detects hide_underline" do
      logo = described_class.new({ organisation: { name: "org" }, hide_underline: true })
      expect(logo.logo_container_class).to eq("gem-c-organisation-logo__container gem-c-organisation-logo__link-hide-underline")
    end

    it "responds to a crest without visual identity" do
      logo = described_class.new({ organisation: { name: "org", crest: "toothpaste" } })
      expect(logo.logo_container_class).to eq("gem-c-organisation-logo__container gem-c-organisation-logo__crest gem-c-organisation-logo__crest--toothpaste")
    end

    it "responds to a crest with visual identity" do
      logo = described_class.new({ organisation: { name: "org", crest: "no-identity" } })
      expect(logo.logo_container_class).to eq("gem-c-organisation-logo__container")
    end
  end
end
