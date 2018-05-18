require 'govuk_component_test_helper'

class LeadParagraphTest < ComponentTestCase
  NBSP = HTMLEntities.new.decode('&nbsp;')

  def component_name
    "lead_paragraph"
  end

  def assert_lead_paragraph_matches(text, expected_text)
    render_component(text: text)
    assert_select ".pub-c-lead-paragraph", text: expected_text
  end

  test "renders nothing without a description" do
    assert_empty render_component({})
  end

  test "renders a lead paragraph" do
    render_component(text: 'UK Visas and Immigration is making changes to the Immigration Rules affecting various categories.')
    assert_select ".pub-c-lead-paragraph", text: "UK Visas and Immigration is making changes to the Immigration Rules affecting various#{NBSP}categories."
  end

  [
    { text: 'this and that', expected: "this and#{NBSP}that", description: 'non breaking space between last two words' },
    { text: 'this and that.', expected: "this and#{NBSP}that.", description: 'non breaking space between last two words with trailing space' },
    { text: 'this and that.', expected: "this and#{NBSP}that.", description: 'non breaking space between last two words at end of sentence' },
    { text: 'this and that. ', expected: "this and#{NBSP}that.", description: 'non breaking space between last two words with trailing space after sentence' },
    { text: "multiline\nthis and that", expected: "multiline\nthis and#{NBSP}that", description: 'non breaking space between last two words with new lines' },
    { text: "this and that\n\n", expected: "this and#{NBSP}that", description: 'non breaking space between last two words with multiline input' },
    { text: "this", expected: "this", description: 'single word input gives single word output' },
    { text: "&lt;b&gt;this&lt;b&gt; &amp; that&nbsp;thing", expected: "<b>this<b> & that#{NBSP}thing", description: 'non breaking space output is not unsafe given special characters' },
    { text: "&lt;b&gt;this&lt;b&gt; &amp;&nbsp;that", expected: "<b>this<b> &#{NBSP}that", description: 'non breaking space output is not unsafe given concatenated special characters' }
  ].each do |test_params|
    test test_params[:description] do
      assert_lead_paragraph_matches(test_params[:text], test_params[:expected])
    end
  end
end
