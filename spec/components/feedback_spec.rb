require 'rails_helper'

describe "Feedback", type: :view do
  def component_name
    "feedback"
  end

  it "asks the user if the page is useful without javascript enabled" do
    render_component({})

    assert_select ".gem-c-feedback .gem-c-feedback__prompt-link--useful[href='/contact/govuk']", text: 'Yes this page is useful'
    assert_select ".gem-c-feedback .gem-c-feedback__prompt-link.js-page-is-not-useful[href='/contact/govuk']", text: 'No this page is not useful'
  end

  it "asks the user if there is anything wrong with the page without javascript enabled" do
    render_component({})

    assert_select ".gem-c-feedback .gem-c-feedback__prompt-link--wrong[href='/contact/govuk']", text: 'Is there anything wrong with this page?'
  end

  it "removes top margin when margin_top flag is set" do
    render_component(margin_top: 0)

    assert_select ".gem-c-feedback.gem-c-feedback--margin-top", false
  end

  describe "ASCII characters" do
    let(:ascii_agent)   { 'áscii_user_ágent%EE%90%80'.force_encoding('ASCII-8BIT') }
    let(:utf8_agent)    { ascii_agent.encode }
    let(:ascii_url)     { 'http://www.test.com/test?áscii=%EE%90%80'.force_encoding('ASCII-8BIT') }
    let(:utf8_url)      { ascii_url.encode }

    before do
      allow_any_instance_of(ActionDispatch::Request).to receive(:user_agent).and_return(ascii_agent)
      allow_any_instance_of(ActionDispatch::Request).to receive(:original_url).and_return(ascii_url)
    end

    it "encodes user-agents to UTF-8" do
      render_component({})

      expect(response.body).to include(utf8_agent)
    end

    it "encodes URL params to UTF-8" do
      render_component({})

      expect(response.body).to include(utf8_url)
    end

    it "doesn't encode if the user-agent is nil" do
      allow_any_instance_of(ActionDispatch::Request).to receive(:user_agent).and_return(nil)

      expect { render_component({}) }.to_not raise_error
    end
  end
end
