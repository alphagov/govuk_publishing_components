require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::Attachment do
  it "supports a hash with string keys" do
    attachment = described_class.new("title" => "test", "url" => "test")
    expect(attachment.title).to eq("test")
  end

  describe "#title" do
    it "returns the title" do
      attachment = described_class.new(title: "test")
      expect(attachment.title).to eq("test")
    end

    it "errors if a title wasn't provided at initialisation" do
      attachment = described_class.new({})
      expect { attachment.title }.to raise_error(KeyError)
    end
  end

  describe "#url" do
    it "returns the url" do
      attachment = described_class.new(url: "test")
      expect(attachment.url).to eq("test")
    end

    it "errors if a url wasn't provided at initialisation" do
      attachment = described_class.new({})
      expect { attachment.url }.to raise_error(KeyError)
    end
  end

  describe "#content_type" do
    context "when a supported content type is looked up" do
      it "returns a SupportedContentType" do
        attachment = described_class.new(title: "test", url: "test", content_type: "application/pdf")
        expect(attachment.content_type).to be_a(described_class::SupportedContentType)
        expect(attachment.content_type.name).to eq("Portable Document Format")
      end
    end

    context "when a supported content type with multiple extensions is looked up" do
      it "finds the one where the extension matches if there is one" do
        attachment = described_class.new(title: "test", url: "test", filename: "test.eps", content_type: "application/postscript")
        expect(attachment.content_type.abbr).to eq("EPS")
      end

      it "returns the first one if there isn't an extension match or one provided" do
        attachment = described_class.new(title: "test", url: "test", filename: "test.blah", content_type: "application/postscript")
        expect(attachment.content_type.abbr).to eq("PS")
        attachment = described_class.new(title: "test", url: "test", filename: "test", content_type: "application/postscript")
        expect(attachment.content_type.abbr).to eq("PS")
      end
    end

    context "when a content type is not found" do
      it "returns a UnsupportedContentType" do
        attachment = described_class.new(title: "test", url: "test", content_type: "non/existant")
        expect(attachment.content_type).to be_a(described_class::UnsupportedContentType)
        expect(attachment.content_type.name).to be_nil
      end
    end
  end

  describe "#readable_file_size" do
    it "returns nil if there isn't a file_size provided" do
      attachment = described_class.new(title: "test", url: "test")
      expect(attachment.readable_file_size).to be_nil
    end

    it "returns a human readable file size if file_size is provided" do
      attachment = described_class.new(title: "test", url: "test", file_size: 1024)
      expect(attachment.readable_file_size).to eq("1 KB")
    end
  end

  describe "#readable_number_of_pages" do
    it "returns nil if there isn't a number_of_pages provided" do
      attachment = described_class.new(title: "test", url: "test")
      expect(attachment.readable_number_of_pages).to be_nil
    end

    it "returns a pluralised number of pages if number_of_pages is provided" do
      attachment = described_class.new(title: "test", url: "test", number_of_pages: 3)
      expect(attachment.readable_number_of_pages).to eq("3 pages")
    end
  end
end
