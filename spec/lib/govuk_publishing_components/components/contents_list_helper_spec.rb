require "spec_helper"
require "action_view"

RSpec.describe GovukPublishingComponents::Presenters::ContentsListHelper do
  include ActionView::Helpers::SanitizeHelper

  describe "Contents list helper" do
    it "wraps a number and text in separate span elements" do
      assert_split_number_and_text("1. Thing", "1.", "Thing")
      assert_split_number_and_text("10. Thing", "10.", "Thing")
      assert_split_number_and_text("100. Thing", "100.", "Thing")
    end

    it "accounts for trailing spaces in the heading" do
      assert_split_number_and_text(" 1. Thing", "1.", "Thing")
      assert_split_number_and_text(" 10. Thing ", "10.", "Thing")
      assert_split_number_and_text("100. Thing ", "100.", "Thing")
    end

    it "keeps a space between number and text for screen reader pronunciation" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      # 1.Thing can be pronounced "1 dot Thing"
      # 1. Thing is always pronounced "1 Thing"
      text = "1. Thing"
      wrapped_html = cl.wrap_numbers_with_spans("<a href=\"#link\">#{text}</a>")
      expect(strip_tags(wrapped_html)).to eql(text)
    end

    it "wraps a number and text in span elements if it's a number without a period" do
      assert_split_number_and_text("1 Thing", "1", "Thing")
    end

    it "wraps a number in the form X.Y" do
      assert_split_number_and_text("1.2 Vision", "1.2", "Vision")
    end

    it "does nothing if no number is found" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      input = "Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)
    end

    it "does nothing if it's just a number" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      input = "1"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)
    end

    it "does nothing if the number is part of the word" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      input = "1Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)

      input = "1.Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)
    end

    it "does nothing if it starts with a number longer than 3 digits" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      input = "2014 Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)

      input = "2014. Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)

      input = "10001. Vision"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)
    end

    it "does nothing if a number is present but not at the start" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      input = "Run an effective welfare system part 1. Social Care"
      expect(cl.wrap_numbers_with_spans(input)).to eql(input)
    end

    it "counts the number of links in the component" do
      contents = [
        {
          text: "test1",
          items: [
            {
              text: "test2",
            },
            {
              text: "test3",
              active: true,
            },
          ],
        },
        {
          text: "test3",
        },
      ]
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({ contents: })
      expect(cl.get_index_total).to eql(4)
    end

    it "returns the required GA4 event name" do
      cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
      expect(cl.get_ga4_event_name("#anchor")).to eql("select_content")
      expect(cl.get_ga4_event_name("https://www.gov.uk")).to eql("navigation")
    end
  end

  def assert_split_number_and_text(number_and_text, number, text)
    cl = GovukPublishingComponents::Presenters::ContentsListHelper.new({})
    number_class = "gem-c-contents-list__number"
    numbered_text_class = "gem-c-contents-list__numbered-text"

    expected = "<span class=\"#{number_class}\">#{number} </span><span class=\"#{numbered_text_class}\">#{text}</span>"
    expect(cl.wrap_numbers_with_spans(number_and_text)).to eql(expected)
  end
end
