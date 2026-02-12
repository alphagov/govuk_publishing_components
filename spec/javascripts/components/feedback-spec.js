/* eslint-env jasmine */
/* global GOVUK */

describe('Feedback component', function () {
  var feedbackComponent
  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = `
    <div data-module="feedback ga4-event-tracker" class="gem-c-feedback govuk-!-display-none-print">
      <div class="gem-c-feedback__prompt gem-c-feedback__js-show js-prompt" tabindex="-1">
        <div class="gem-c-feedback__prompt-content">
          <div class="gem-c-feedback__prompt-questions js-prompt-questions" hidden>
            <div class="gem-c-feedback__prompt-question-answer">
              <h2 class="gem-c-feedback__prompt-question">Is this page useful?</h2>
              <ul class="gem-c-feedback__option-list">
                <li class="gem-c-feedback__option-list-item govuk-visually-hidden" hidden>
                  <a class="gem-c-feedback__prompt-link" role="button" hidden="hidden" aria-hidden="true"
                    href="/contact/govuk">
                    Maybe
                  </a>
                </li>
                <li class="gem-c-feedback__option-list-item">
                  <button class="govuk-button gem-c-feedback__prompt-link js-page-is-useful"
                    data-ga4-event="{'event_name':'form_submit','type':'feedback','text':'Yes','section':'Is this page useful?','tool_name':'Is this page useful?'}">
                    Yes <span class="govuk-visually-hidden">this page is useful</span>
                  </button>
                </li>
                <li class="gem-c-feedback__option-list-item">
                  <button class="govuk-button gem-c-feedback__prompt-link js-toggle-form js-page-is-not-useful"
                    aria-controls="page-is-not-useful"
                    data-ga4-event="{'event_name':'form_submit','type':'feedback','text':'No','section':'Is this page useful?','tool_name':'Is this page useful?'}">
                    No <span class="govuk-visually-hidden">this page is not useful</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="gem-c-feedback__prompt-questions gem-c-feedback__prompt-success js-prompt-success" role="alert"
            hidden>
            Thank you for your feedback
          </div>
          <div
            class="gem-c-feedback__prompt-questions gem-c-feedback__prompt-questions--something-is-wrong js-prompt-questions"
            hidden>
            <button class="govuk-button gem-c-feedback__prompt-link js-toggle-form js-something-is-wrong"
              aria-controls="something-is-wrong"
              data-ga4-event="{'event_name':'form_submit','type':'feedback','text':'Report a problem with this page','section':'Is this page useful?','tool_name':'Is this page useful?'}">
              Report a problem with this page
            </button>
          </div>
        </div>
      </div>

      <form action="/contact/govuk/problem_reports" id="something-is-wrong" class="gem-c-feedback__form js-feedback-form"
        method="post" hidden>
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <div class="gem-c-feedback__error-summary gem-c-feedback__js-show js-errors" tabindex="-1" hidden>
            </div>

            <input type="hidden" name="url" value="http://example.com/path/to/page">

            <h2 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h2>
            <p id="feedback_explanation" class="gem-c-feedback__form-paragraph">Don’t include personal or
              financial information like your National Insurance number or credit card details.</p>

            <div class="govuk-visually-hidden" aria-hidden="true">
              <label for="giraffe">This field is for robots only. Please leave blank</label>
              <input id="giraffe" name="giraffe" type="text" pattern=".{0}" tabindex="-1" autocomplete="off">
            </div>

            <div class="gem-c-textarea govuk-form-group govuk-!-margin-bottom-6">
              <label for="textarea-edc33d56" class="gem-c-label govuk-label">What were you doing?</label>
              <textarea name="what_doing" class="govuk-textarea" id="textarea-edc33d56" rows="3" spellcheck="true"
                aria-describedby="feedback_explanation">
              </textarea>
            </div>

            <div class="gem-c-textarea govuk-form-group govuk-!-margin-bottom-6">
              <label for="textarea-d9d79a09" class="gem-c-label govuk-label">What went wrong?</label>
              <textarea name="what_wrong" class="govuk-textarea" id="textarea-d9d79a09" rows="3"
                spellcheck="true"></textarea>
            </div>

            <button class="gem-c-button govuk-button" type="submit"
              data-ga4-event="{'event_name':'form_submit','type':'feedback','text':'Send','section':'Help us improve GOV.UK','tool_name':'Help us improve GOV.UK'}">
              Send
            </button>
            <button class="govuk-button govuk-button--secondary gem-c-feedback__close gem-c-feedback__js-show js-close-form"
              aria-controls="something-is-wrong">
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div id="page-is-not-useful"
        class="gem-c-feedback__form gem-c-feedback__form--email gem-c-feedback__js-show js-feedback-form">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds" id="survey-wrapper">
            <div class="gem-c-feedback__error-summary js-errors" tabindex="-1" hidden></div>

            <h2 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h2>
            <p id="survey_explanation" class="gem-c-feedback__form-paragraph">
              To help us improve GOV.UK, we’d like to know more about your visit today.
              <a href="https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=no-js" class="govuk-link" target="_blank"
                rel="noopener noreferrer external">Please fill in this survey (opens in a new
                tab<noscript> and requires JavaScript</noscript>)</a>.
            </p>
            <button class="govuk-button govuk-button--secondary js-close-form" aria-controls="page-is-not-useful" hidden>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `

    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('hides the forms', function () {
    loadFeedbackComponent()

    expect(document.querySelector('.gem-c-feedback .js-feedback-form').hidden).toBe(true)
  })

  it('shows the prompt', function () {
    loadFeedbackComponent()

    expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
    expect(document.querySelector('.gem-c-feedback .js-prompt-questions').hidden).toBe(false)
  })

  // note that this test will fail in the browser 'run tests in random order' is disabled
  // or any link in the jasmine window is clicked e.g. a specific test suite
  // because the referrer will be localhost, not 'unknown'
  it('should append a hidden "referrer" field to the form', function () {
    loadFeedbackComponent()

    expect(document.querySelector('#something-is-wrong [name=referrer]').value).toBe('unknown')
  })

  describe('clicking the "page was useful" link', function () {
    it('displays a success message', function () {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-useful').click()

      var $success = document.querySelector('.js-prompt-success')

      expect($success.hidden).toBe(false)
      expect($success.textContent).toContain('Thank you for your feedback')
    })

    it('hides the question links', function () {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-useful').click()

      expect(document.querySelector('.js-prompt-questions').hidden).toBe(true)
    })
  })

  describe('clicking the "page was not useful" link', function () {
    it('shows the feedback form', function () {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()

      expect(document.querySelector('.gem-c-feedback .js-feedback-form#page-is-not-useful').hidden).toBe(false)
    })

    it('hides the prompt', function () {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()

      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(true)
    })

    it('has the page path in the survey', function () {
      var testPath = '/government/organisations/government-digital-service'
      var expectedUrl = 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + testPath

      loadFeedbackComponent(function () {
        spyOn(feedbackComponent, 'getPagePath').and.returnValue(testPath)
      })

      document.querySelector('.js-page-is-not-useful').click()
      expect(document.querySelector('#survey_explanation a').getAttribute('href')).toBe(expectedUrl)
    })

    it('hides the path in the survey link if it contains an @ symbol', function () {
      var testPath = '/contact/email@example.com'
      var expectedUrl = 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + '%5Bemail%5D'

      loadFeedbackComponent(function () {
        spyOn(feedbackComponent, 'getPagePath').and.returnValue(testPath)
      })

      document.querySelector('.js-page-is-not-useful').click()
      expect(document.querySelector('#survey_explanation a').getAttribute('href')).toBe(expectedUrl)
    })
  })

  describe('Clicking the "is there anything wrong with this page" link', function () {
    it('shows the form', function () {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()

      expect(document.querySelector('.gem-c-feedback .js-feedback-form#something-is-wrong').hidden).toBe(false)
    })

    it('hides the prompt', function () {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()

      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(true)
    })

    it('focusses the first field in the form', function () {
      loadFeedbackComponent()
      var $input = document.querySelector('#something-is-wrong .govuk-textarea')
      spyOn($input, 'focus')
      document.querySelector('.js-something-is-wrong').click()

      expect($input.focus).toHaveBeenCalled()
    })
  })

  describe('Clicking the close link in the "something is wrong" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()
      document.querySelector('#something-is-wrong .js-close-form').click()
    })

    it('hides the form', function () {
      expect(document.querySelector('.gem-c-feedback #something-is-wrong').hidden).toBe(true)
    })

    it('shows the prompt', function () {
      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
      expect(document.activeElement).toBe(document.querySelector('.js-something-is-wrong'))
    })
  })

  describe('Clicking the close link in the "not useful" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()
      document.querySelector('#page-is-not-useful .js-close-form').click()
    })

    it('hides the form', function () {
      expect(document.querySelector('.gem-c-feedback #page-is-not-useful').hidden).toBe(true)
    })

    it('shows the prompt', function () {
      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
      expect(document.activeElement).toBe(document.querySelector('.js-page-is-not-useful'))
    })
  })

  describe('successfully submitting the "is there anything wrong with this page" form', function () {
    beforeEach(function () {
      jasmine.Ajax.install()
    })

    afterEach(function () {
      jasmine.Ajax.uninstall()
    })

    // note that this test will fail if the jasmine:browser
    // 'run tests in random order' is disabled or any link in
    // the jasmine window is clicked e.g. a specific test
    // suite because the referrer will be localhost, not 'unknown'
    it('submits the feedback to the feedback frontend', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      var request = jasmine.Ajax.requests.mostRecent()
      expect(request.url).toBe('/contact/govuk/problem_reports')
      expect(request.method).toBe('POST')
      expect(request.data()).toEqual({
        url: ['http://example.com/path/to/page'],
        what_doing: ['I was looking for some information about local government.'],
        what_wrong: ['The background should be green.'],
        referrer: ['unknown'],
        javascript_enabled: ['true'],
        timer: ['0'],
        giraffe: ['']
      })
    })

    it('displays a success message', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      })

      var $success = document.querySelector('.js-prompt-success')

      expect($success.hidden).toBe(false)
      expect($success.textContent).toContain('Thank you for your feedback')
    })

    it('focusses the success message', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      })

      expect(document.activeElement).toBe(document.querySelector('.gem-c-feedback .js-prompt'))
    })

    it('hides the form', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      })

      expect(document.querySelector('#something-is-wrong').hidden).toBe(true)
    })

    it('hides the links to show the feedback form', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      })

      expect(document.querySelector('.js-prompt-questions').hidden).toBe(true)
    })
  })

  describe('submitting the "is something wrong with this page" form with invalid data', function () {
    beforeEach(function () {
      jasmine.Ajax.install()
    })

    afterEach(function () {
      jasmine.Ajax.uninstall()
    })

    it('disables the submit button until the server responds', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(true)

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      })

      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(false)
    })

    it('retains the feedback the user originally entered', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      })

      expect(document.querySelector('[name=what_doing]').value).toEqual('I was looking for some information about local government.')
      expect(document.querySelector('[name=what_wrong]').value).toEqual('The background should be green.')
    })

    it('displays a generic error if the field isn\'t a visible part of the form', function () {
      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      })

      expect(document.querySelector('#something-is-wrong .js-errors').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })

    it('focusses the error message', function () {
      loadFeedbackComponent()
      var $input = document.querySelector('#something-is-wrong .js-errors')
      spyOn($input, 'focus')
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{}'
      })

      expect($input.focus).toHaveBeenCalled()
    })
  })

  describe('submitting a form that fails because email_survey_signup[survey_source] is missing', function () {
    beforeEach(function () {
      jasmine.Ajax.install()

      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"message":"email survey sign up failure","errors":{"survey_source":["can\'t be blank"]}}'
      })
    })

    afterEach(function () {
      jasmine.Ajax.uninstall()
    })

    it('displays the generic error message in place of the less helpful "email survey sign up failure"', function () {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).not.toContain('email survey sign up failure')
    })
  })

  describe('submitting a form that fails for some reason', function () {
    beforeEach(function () {
      jasmine.Ajax.install()

      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        contentType: 'text/plain',
        responseText: ''
      })
    })

    afterEach(function () {
      jasmine.Ajax.uninstall()
    })

    it('displays a generic error message', function () {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })

    it('retains the feedback the user originally entered', function () {
      expect(document.querySelector('[name=what_doing]').value).toEqual('I was looking for some information about local government.')
      expect(document.querySelector('[name=what_wrong]').value).toEqual('The background should be green.')
    })

    it('re-enables the submit button', function () {
      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(false)
    })
  })

  describe('submitting a form that times out', function () {
    beforeEach(function () {
      jasmine.Ajax.install()
      jasmine.clock().install()

      loadFeedbackComponent()
      fillAndSubmitSomethingIsWrongForm()
      jasmine.Ajax.requests.mostRecent().responseTimeout()
    })

    afterEach(function () {
      jasmine.Ajax.uninstall()
      jasmine.clock().uninstall()
    })

    it('displays a generic error message', function () {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })
  })

  describe('testing honeypot metadata on the "report a problem" form', function () {
    beforeEach(function () {
      jasmine.clock().install()
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()
    })

    afterEach(function () {
      jasmine.clock().uninstall()
    })

    it('has an incrementing timer field', function () {
      var $form = document.querySelector('.gem-c-feedback #something-is-wrong')
      var $timer = $form.querySelector('input[name=timer]')
      expect($timer.value).toBe('0')
      jasmine.clock().tick(1000)
      expect($timer.value).toBe('1')
      jasmine.clock().tick(3000)
      expect($timer.value).toBe('4')
    })
  })

  function loadFeedbackComponent (feedbackSpies) {
    feedbackComponent = new GOVUK.Modules.Feedback(document.querySelector('.gem-c-feedback'))
    // Allows spies to be added before .init() is run
    if (feedbackSpies) {
      feedbackSpies()
    }
    feedbackComponent.init()
  }

  function fillAndSubmitSomethingIsWrongForm () {
    document.querySelector('.js-something-is-wrong').click()
    var $form = document.querySelector('.gem-c-feedback #something-is-wrong')
    $form.querySelector('[name=what_doing]').value = 'I was looking for some information about local government.'
    $form.querySelector('[name=what_wrong]').value = 'The background should be green.'
    $form.querySelector('[type=submit]').click()
  }
})
