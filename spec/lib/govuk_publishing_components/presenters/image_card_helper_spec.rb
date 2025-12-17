require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ImageCardHelper do
  describe "#initialize" do
    it "sets basic options" do
      image = described_class.new({ href: "#href", image_src: "src", image_loading: "load", large: "large", two_thirds: "thirds", large_font_size_mobile: "mobile", heading_text: "head", extra_details_no_indent: "extra", metadata: "meta", lang: "lang" })
      expect(image.href).to eq("#href")
      expect(image.image_src).to eq("src")
      expect(image.image_loading).to eq("load")
      expect(image.large).to eq("large")
      expect(image.two_thirds).to eq("thirds")
      expect(image.large_font_size_mobile).to eq("mobile")
      expect(image.heading_text).to eq("head")
      expect(image.extra_details_no_indent).to eq("extra")
      expect(image.metadata).to eq("meta")
      expect(image.lang).to eq("lang")
    end

    it "sets defaults if some options are not passed" do
      image = described_class.new({})
      expect(image.extra_details).to eq([])
      expect(image.image_loading).to eq("auto")
    end
  end

  describe "#large_mobile_font_size?" do
    it "is false by default" do
      image = described_class.new({})
      expect(image.large_mobile_font_size?).to be(false)
    end

    it "is true when two thirds and large font size mobile are true" do
      image = described_class.new({ two_thirds: true, large_font_size_mobile: true })
      expect(image.large_mobile_font_size?).to be(true)
    end
  end

  describe "#media" do
    it "does nothing without options passed" do
      image = described_class.new({})
      expect(image.media).to be_nil
    end

    it "creates an image" do
      image = described_class.new({ image_src: "moo.jpg" })
      expect(image.media).to eq('<figure class="gem-c-image-card__image-wrapper"><img class="gem-c-image-card__image" alt="" loading="auto" height="200" width="300" src="/images/moo.jpg" /></figure>')
    end

    it "creates an image with basic passed options" do
      image = described_class.new({ image_src: "moo.jpg", image_alt: "alt text", image_loading: "lazy" })
      expect(image.media).to eq('<figure class="gem-c-image-card__image-wrapper"><img class="gem-c-image-card__image" alt="alt text" loading="lazy" height="200" width="300" src="/images/moo.jpg" /></figure>')
    end

    it "creates an image with passed sizes" do
      image = described_class.new({ image_src: "moo.jpg", sizes: "(max-width: 640px) 100vw, (max-width: 1020px) 33vw, 300px" })
      expect(image.media).to eq('<figure class="gem-c-image-card__image-wrapper"><img class="gem-c-image-card__image" alt="" loading="auto" sizes="(max-width: 640px) 100vw, (max-width: 1020px) 33vw, 300px" height="200" width="300" src="/images/moo.jpg" /></figure>')
    end

    it "creates an image with a srcset" do
      srcset = {
        "/moo.jpg": "610w",
        "/moo-480.jpg": "480w",
        "/moo-320.jpg": "320w",
        "/moo-240.jpg": "240w",
        "/moo-170.jpg": "170w",
      }
      image = described_class.new({ image_src: "moo.jpg", srcset: srcset })
      expect(image.media).to eq('<figure class="gem-c-image-card__image-wrapper"><img class="gem-c-image-card__image" alt="" loading="auto" srcset="/moo.jpg 610w, /moo-480.jpg 480w, /moo-320.jpg 320w, /moo-240.jpg 240w, /moo-170.jpg 170w" height="200" width="300" src="/images/moo.jpg" /></figure>')
    end

    it "sets a different width and height when two_thirds is given" do
      image = described_class.new({ image_src: "moo.jpg", two_thirds: true })
      expect(image.media).to eq('<figure class="gem-c-image-card__image-wrapper"><img class="gem-c-image-card__image" alt="" loading="auto" height="90" width="90" src="/images/moo.jpg" /></figure>')
    end
  end

  describe "#context" do
    it "does nothing without options passed" do
      image = described_class.new({})
      expect(image.context).to be_nil
    end

    it "accepts a context with no date" do
      context = {
        text: "Press release",
      }
      image = described_class.new({ context: context })
      expect(image.context).to eq('<p class="gem-c-image-card__context">Press release</p>')
    end

    it "accepts a context with a date object" do
      context = {
        date: Date.parse("2016-06-27 10:29:44"),
        text: "Press release",
      }
      image = described_class.new({ context: context })
      expect(image.context).to eq('<p class="gem-c-image-card__context"><time datetime="2016-06-27" lang="en">27 June 2016</time><span aria-hidden="true"> — </span>Press release</p>')
    end

    it "accepts a context with a date string" do
      context = {
        date: "2016-06-27 10:29:44",
        text: "Press release",
      }
      image = described_class.new({ context: context })
      expect(image.context).to eq('<p class="gem-c-image-card__context"><time datetime="2016-06-27" lang="en">27 June 2016</time><span aria-hidden="true"> — </span>Press release</p>')
    end
  end

  describe "#description" do
    it "returns nothing without a description" do
      image = described_class.new({})
      expect(image.description).to be_nil
    end

    it "returns a description" do
      image = described_class.new({ description: "This is the description" })
      expect(image.description).to eq('<div class="gem-c-image-card__description">This is the description</div>')
    end

    it "returns a description with a large mobile font size" do
      image = described_class.new({ description: "This is the description", two_thirds: true, large_font_size_mobile: true })
      expect(image.description).to eq('<div class="gem-c-image-card__description gem-c-image-card__description--large-font-size-mobile">This is the description</div>')
    end
  end
end
