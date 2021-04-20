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

  it "has required email survey signup form fields" do
    render_component({})

    assert_select ".gem-c-feedback #survey-wrapper [name='email_survey_signup[email_address]']"
    assert_select ".gem-c-feedback #survey-wrapper [name='email_survey_signup[survey_source]']"
    assert_select ".gem-c-feedback #survey-wrapper [name='email_survey_signup[survey_id]']"
  end

  describe "ASCII characters" do
    let(:ascii_url)     { "http://www.test.com/test?áscii=%EE%90%80".force_encoding("ASCII-8BIT") }
    let(:utf8_url)      { ascii_url.encode }

    before do
      allow_any_instance_of(ActionDispatch::Request).to receive(:original_url).and_return(ascii_url)
    end

    it "encodes URL params to UTF-8" do
      render_component({})

      expect(response.body).to include(utf8_url)
    end
  end
end
