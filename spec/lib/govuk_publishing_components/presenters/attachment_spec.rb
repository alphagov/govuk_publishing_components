require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::AttachmentHelper do
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

  describe "#opendocument?" do
    it "returns true if content type is an OpenDocument" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "application/vnd.oasis.opendocument.text",
      )
      expect(attachment.opendocument?).to be true
    end

    it "returns false if content type is an OpenDocument" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "application/msword",
      )
      expect(attachment.opendocument?).to be false
    end
  end

  describe "#document?" do
    it "returns true for content types specified as a document" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "application/msword",
      )
      expect(attachment.document?).to be true
    end

    it "returns false for a content type not specified as a document" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/plain",
      )
      expect(attachment.document?).to be false
    end
  end

  describe "#spreadsheet?" do
    it "returns true for content types specified as a document" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
      )
      expect(attachment.spreadsheet?).to be true
    end

    it "returns false for a content type not specified as a spreadsheet" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/plain",
      )
      expect(attachment.spreadsheet?).to be false
    end
  end

  describe "#pdf?" do
    it "returns true for content types specified as a pdf" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "application/pdf",
      )
      expect(attachment.pdf?).to be true
    end

    it "returns false for a content type not specified as a spreadsheet" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/plain",
      )
      expect(attachment.pdf?).to be false
    end
  end

  describe "#reference" do
    context "when reference details are provided" do
      it "returns a well formatted reference string" do
        attachment = described_class.new(
          title: "test",
          url: "test",
          content_type: "text/csv",
          isbn: "111",
          unique_reference: "222",
          command_paper_number: "333",
          hoc_paper_number: "444",
          parliamentary_session: "555",
        )
        expect(attachment.reference).to eq("ISBN 111, 222, 333, HC 444 555")
      end

      it "returns an empty string is no reference details are provided" do
        attachment = described_class.new(
          title: "test",
          url: "test",
          content_type: "text/csv",
        )
        expect(attachment.reference).to eq("")
      end
    end
  end

  describe "#unnumbered_reference" do
    it "returns 'Unnumbered command paper' if unnumbered_command_paper is true" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        command_paper_number: "",
        unnumbered_command_paper: true,
      )
      expect(attachment.unnumbered_reference).to eq("Unnumbered command paper")
    end

    it "returns 'Unnumbered act paper' if unnumbered_hoc_paper is true" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        hoc_paper_number: "",
        unnumbered_hoc_paper: true,
      )
      expect(attachment.unnumbered_reference).to eq("Unnumbered act paper")
    end

    it "returns nil if unnumbered_command_paper is true and command_paper_number is set" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        command_paper_number: "333",
        unnumbered_command_paper: true,
      )
      expect(attachment.unnumbered_reference).to be nil
    end

    it "returns nil if unnumbered_hoc_paper is true and hoc_paper_number is set" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        hoc_paper_number: "444",
        unnumbered_hoc_paper: true,
      )
      expect(attachment.unnumbered_reference).to be nil
    end
  end

  describe "#is_official_document" do
    it "returns true if command_paper_number is set" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        command_paper_number: "333",
      )
      expect(attachment.is_official_document).to be true
    end

    it "returns true if hoc_paper_number is set" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
        hoc_paper_number: "444",
      )
      expect(attachment.is_official_document).to be true
    end

    it "returns false if no command_paper_number or hoc_paper_number are set" do
      attachment = described_class.new(
        title: "test",
        url: "test",
        content_type: "text/csv",
      )
      expect(attachment.is_official_document).to be false
    end
  end
end
