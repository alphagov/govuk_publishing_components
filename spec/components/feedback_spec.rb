require "rails_helper"

describe "Feedback", type: :view do
  def component_name
    "feedback"
  end

  it "asks the user if the page is useful without javascript enabled" do
    render_component({})

    assert_select ".gem-c-feedback .gem-c-feedback__option-list-item .js-page-is-useful", text: "Yes this page is useful"
    assert_select ".gem-c-feedback .gem-c-feedback__option-list-item .js-page-is-not-useful", text: "No this page is not useful"
  end

  it "asks the user if there is anything wrong with the page without javascript enabled" do
    render_component({})

    assert_select ".gem-c-feedback .gem-c-feedback__prompt-link.js-something-is-wrong", text: "Report a problem with this page"
  end

  it "has required email survey signup link" do
    render_component({})

    assert_select ".gem-c-feedback #survey-wrapper a.govuk-link"
  end

  describe "ASCII characters" do
    let(:ascii_url)     { "http://www.test.com/test?áscii=%EE%90%80".force_encoding("ASCII-8BIT") }
    let(:utf8_url)      { ascii_url.encode }

    before do
      # rubocop:disable RSpec/AnyInstance
      allow_any_instance_of(ActionDispatch::Request).to receive(:original_url).and_return(ascii_url)
      # rubocop:enable RSpec/AnyInstance
    end

    it "encodes URL params to UTF-8" do
      render_component({})

      expect(response.body).to include(utf8_url)
    end
  end

  it "has GA4 tracking" do
    render_component({})

    assert_select ".gem-c-feedback[data-module='feedback ga4-event-tracker']"

    # Yes button
    assert_select ".js-page-is-useful[data-ga4-event='{\"event_name\":\"form_submit\",\"type\":\"feedback\",\"text\":\"Yes\",\"section\":\"Is this page useful?\",\"tool_name\":\"Is this page useful?\"}']"

    # No button
    assert_select ".js-page-is-not-useful[data-ga4-event='{\"event_name\":\"form_submit\",\"type\":\"feedback\",\"text\":\"No\",\"section\":\"Is this page useful?\",\"tool_name\":\"Is this page useful?\"}']"

    # Report a problem button
    assert_select ".js-something-is-wrong[data-ga4-event='{\"event_name\":\"form_submit\",\"type\":\"feedback\",\"text\":\"Report a problem with this page\",\"section\":\"Is this page useful?\",\"tool_name\":\"Is this page useful?\"}']"

    # Report a problem submit
    assert_select ".govuk-button[data-ga4-event='{\"event_name\":\"form_submit\",\"type\":\"feedback\",\"text\":\"Send\",\"section\":\"Help us improve GOV.UK\",\"tool_name\":\"Help us improve GOV.UK\"}']"
  end

  it "can have its GA4 tracking disabled" do
    render_component({ disable_ga4: true })

    assert_select ".gem-c-feedback[data-module='feedback ga4-event-tracker']", false

    # Yes button
    assert_select ".js-page-is-useful[data-ga4-event]", false

    # No button
    assert_select ".js-page-is-not-useful[data-ga4-event]", false

    # Report a problem button
    assert_select ".js-something-is-wrong[data-ga4-event]", false

    # Report a problem submit / Send me the survey submit
    assert_select ".govuk-button[data-ga4-event]", false
  end

  it "The survey link exists, with c=no-js on the link by default" do
    render_component({})

    assert_select "#survey_explanation a[href='https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=no-js']"
  end

  it "The survey link opens in a new tab, with rel='noopener noreferrer external' and the new tab guidance text" do
    render_component({})

    assert_select "#survey_explanation a[target='_blank'][rel='noopener noreferrer external']", text: "Please fill in this survey (opens in a new tab)"
  end
end
