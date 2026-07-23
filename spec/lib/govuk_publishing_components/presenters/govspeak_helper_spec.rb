RSpec.describe GovukPublishingComponents::Presenters::GovspeakHelper do
  describe "Govspeak helper" do
    describe "#parse_govspeak" do
      it "converts basic govspeak into markup" do
        instance = described_class.new
        expect(instance.parse_govspeak("#heading")).to eq("<h1 id=\"heading\">heading</h1>")
      end
    end

    describe "#is_html?" do
      it "recognises HTML" do
        instance = described_class.new
        expect(instance.is_html?("<h2>heading</h2>")).to be(true)
      end

      it "does not recognise non-HTML" do
        instance = described_class.new
        expect(instance.is_html?("heading")).to be(false)
      end
    end
  end
end
