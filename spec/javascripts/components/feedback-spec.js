/* eslint-env jasmine */
/* global GOVUK, DOMException, AbortSignal */

describe('Feedback component', () => {
  let feedbackComponent
  let container

  beforeEach(() => {
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
                  <a class="gem-c-feedback__prompt-link" role="button" hidden="hidden" href="/contact/govuk">
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
            <button class="govuk-button govuk-button--secondary gem-c-feedback__js-show js-close-form"
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

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('hides the forms', () => {
    loadFeedbackComponent()

    expect(document.querySelector('.gem-c-feedback .js-feedback-form').hidden).toBe(true)
  })

  it('shows the prompt', () => {
    loadFeedbackComponent()

    expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
    expect(document.querySelector('.gem-c-feedback .js-prompt-questions').hidden).toBe(false)
  })

  it('should append a hidden "referrer" field to the form', () => {
    loadFeedbackComponent()

    expect(document.querySelector('#something-is-wrong [name=referrer]').value).toBe('unknown')
  })

  describe('clicking the "page was useful" link', () => {
    it('displays a success message', () => {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-useful').click()

      const $success = document.querySelector('.js-prompt-success')

      expect($success.hidden).toBe(false)
      expect($success.textContent).toContain('Thank you for your feedback')
    })

    it('hides the question links', () => {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-useful').click()

      expect(document.querySelector('.js-prompt-questions').hidden).toBe(true)
    })
  })

  describe('clicking the "page was not useful" link', () => {
    it('shows the feedback form', () => {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()

      expect(document.querySelector('.gem-c-feedback .js-feedback-form#page-is-not-useful').hidden).toBe(false)
    })

    it('hides the prompt', () => {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()

      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(true)
    })

    it('has the page path in the survey', () => {
      const testPath = '/government/organisations/government-digital-service'
      const expectedUrl = `https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=${testPath}`

      loadFeedbackComponent(() => {
        spyOn(feedbackComponent, 'getPagePath').and.returnValue(testPath)
      })

      document.querySelector('.js-page-is-not-useful').click()
      expect(document.querySelector('#survey_explanation a').getAttribute('href')).toBe(expectedUrl)
    })

    it('hides the path in the survey link if it contains an @ symbol', () => {
      const testPath = '/contact/email@example.com'
      const expectedUrl = 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=%5Bemail%5D'

      loadFeedbackComponent(() => {
        spyOn(feedbackComponent, 'getPagePath').and.returnValue(testPath)
      })

      document.querySelector('.js-page-is-not-useful').click()
      expect(document.querySelector('#survey_explanation a').getAttribute('href')).toBe(expectedUrl)
    })
  })

  describe('Clicking the "is there anything wrong with this page" link', () => {
    it('shows the form', () => {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()

      expect(document.querySelector('.gem-c-feedback .js-feedback-form#something-is-wrong').hidden).toBe(false)
    })

    it('hides the prompt', () => {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()

      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(true)
    })

    it('focusses the first field in the form', () => {
      loadFeedbackComponent()
      const $input = document.querySelector('#something-is-wrong .govuk-textarea')
      spyOn($input, 'focus')
      document.querySelector('.js-something-is-wrong').click()

      expect($input.focus).toHaveBeenCalled()
    })
  })

  describe('Clicking the close link in the "something is wrong" form', () => {
    beforeEach(() => {
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()
      document.querySelector('#something-is-wrong .js-close-form').click()
    })

    it('hides the form', () => {
      expect(document.querySelector('.gem-c-feedback #something-is-wrong').hidden).toBe(true)
    })

    it('shows the prompt', () => {
      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
      expect(document.activeElement).toBe(document.querySelector('.js-something-is-wrong'))
    })
  })

  describe('Clicking the close link in the "not useful" form', () => {
    beforeEach(() => {
      loadFeedbackComponent()
      document.querySelector('.js-page-is-not-useful').click()
      document.querySelector('#page-is-not-useful .js-close-form').click()
    })

    it('hides the form', () => {
      expect(document.querySelector('.gem-c-feedback #page-is-not-useful').hidden).toBe(true)
    })

    it('shows the prompt', () => {
      expect(document.querySelector('.gem-c-feedback .js-prompt').hidden).toBe(false)
      expect(document.activeElement).toBe(document.querySelector('.js-page-is-not-useful'))
    })
  })

  describe('successfully submitting the "is there anything wrong with this page" form', () => {
    beforeEach(() => {
      stubSuccessfulFetch({})
    })

    it('submits the feedback to the feedback frontend', async () => {
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(window.fetch).toHaveBeenCalledWith(
        '/contact/govuk/problem_reports',
        jasmine.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: jasmine.any(AbortSignal),
          body: jasmine.any(String)
        })
      )

      const fetchArgs = window.fetch.calls.mostRecent().args
      const requestBody = new URLSearchParams(fetchArgs[1].body)
      expect(requestBody.get('url')).toBe('http://example.com/path/to/page')
      expect(requestBody.get('what_doing')).toBe('I was looking for some information about local government.')
      expect(requestBody.get('what_wrong')).toBe('The background should be green.')
      expect(requestBody.get('referrer')).toBe('unknown')
      expect(requestBody.get('javascript_enabled')).toBe('true')
      expect(requestBody.get('timer')).toBe('0')
      expect(requestBody.get('giraffe')).toBe('')
    })

    it('displays a success message', async () => {
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      const $success = document.querySelector('.js-prompt-success')

      expect($success.hidden).toBe(false)
      expect($success.textContent).toContain('Thank you for your feedback')
    })

    it('focusses the success message', async () => {
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(document.activeElement).toBe(document.querySelector('.gem-c-feedback .js-prompt'))
    })

    it('hides the form', async () => {
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(document.querySelector('#something-is-wrong').hidden).toBe(true)
    })

    it('hides the links to show the feedback form', async () => {
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(document.querySelector('.js-prompt-questions').hidden).toBe(true)
    })
  })

  describe('submitting the "is something wrong with this page" form with invalid data', () => {
    it('disables the submit button until the server responds', async () => {
      let resolveFetch
      spyOn(window, 'fetch').and.returnValue(new Promise((resolve) => {
        resolveFetch = resolve
      }))

      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()
      const $form = document.querySelector('.gem-c-feedback #something-is-wrong')
      $form.querySelector('[name=what_doing]').value = 'I was looking for some information about local government.'
      $form.querySelector('[name=what_wrong]').value = 'The background should be green.'
      $form.querySelector('[type=submit]').click()

      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(true)

      resolveFetch({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ errors: { description: ["can't be blank"] } })
      })

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(false)
    })

    it('retains the feedback the user originally entered', async () => {
      stubServerErrorFetch(422, { errors: { description: ["can't be blank"] } })
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(document.querySelector('[name=what_doing]').value).toEqual('I was looking for some information about local government.')
      expect(document.querySelector('[name=what_wrong]').value).toEqual('The background should be green.')
    })

    it('displays a generic error if the field isn\'t a visible part of the form', async () => {
      stubServerErrorFetch(422, { errors: { path: ["can't be blank"], another: ['weird error'] } })
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()

      expect(document.querySelector('#something-is-wrong .js-errors').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })

    it('focusses the error message', async () => {
      stubServerErrorFetch(422, {})
      loadFeedbackComponent()
      const $input = document.querySelector('#something-is-wrong .js-errors')
      spyOn($input, 'focus')
      await fillAndSubmitSomethingIsWrongForm()

      expect($input.focus).toHaveBeenCalled()
    })
  })

  describe('submitting a form that fails because email_survey_signup[survey_source] is missing', () => {
    beforeEach(async () => {
      stubServerErrorFetch(422, {
        message: 'email survey sign up failure',
        errors: { survey_source: ["can't be blank"] }
      })

      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()
    })

    it('displays the generic error message in place of the less helpful "email survey sign up failure"', () => {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).not.toContain('email survey sign up failure')
    })
  })

  describe('submitting a form that fails for some reason', () => {
    beforeEach(async () => {
      stubServerErrorFetch(500, {})
      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()
    })

    it('displays a generic error message', () => {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })

    it('retains the feedback the user originally entered', () => {
      expect(document.querySelector('[name=what_doing]').value).toEqual('I was looking for some information about local government.')
      expect(document.querySelector('[name=what_wrong]').value).toEqual('The background should be green.')
    })

    it('re-enables the submit button', () => {
      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(false)
    })
  })

  describe('submitting a form that times out', () => {
    beforeEach(async () => {
      stubTimeoutFetch()

      loadFeedbackComponent()
      await fillAndSubmitSomethingIsWrongForm()
    })

    it('displays a generic error message', () => {
      expect(document.querySelector('.gem-c-feedback__error-summary').textContent).toContain(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      )
    })

    it('re-enables the submit button', () => {
      expect(document.querySelector('.gem-c-feedback form [type=submit]').disabled).toBe(false)
    })
  })

  describe('testing honeypot metadata on the "report a problem" form', () => {
    beforeEach(() => {
      jasmine.clock().install()
      loadFeedbackComponent()
      document.querySelector('.js-something-is-wrong').click()
    })

    afterEach(() => {
      jasmine.clock().uninstall()
    })

    it('has an incrementing timer field', () => {
      const $form = document.querySelector('.gem-c-feedback #something-is-wrong')
      const $timer = $form.querySelector('input[name=timer]')
      expect($timer.value).toBe('0')
      jasmine.clock().tick(1000)
      expect($timer.value).toBe('1')
      jasmine.clock().tick(3000)
      expect($timer.value).toBe('4')
    })
  })

  const stubSuccessfulFetch = (responseData = {}) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(responseData)
    }))
  }

  const stubServerErrorFetch = (status = 500, responseData = {}) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve(responseData)
    }))
  }

  const stubTimeoutFetch = () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.reject(new DOMException('Request timed out', 'AbortError'))
    )
  }

  const loadFeedbackComponent = (feedbackSpies) => {
    feedbackComponent = new GOVUK.Modules.Feedback(document.querySelector('.gem-c-feedback'))
    if (feedbackSpies) {
      feedbackSpies()
    }
    feedbackComponent.init()
  }

  const fillAndSubmitSomethingIsWrongForm = async () => {
    document.querySelector('.js-something-is-wrong').click()
    const $form = document.querySelector('.gem-c-feedback #something-is-wrong')
    $form.querySelector('[name=what_doing]').value = 'I was looking for some information about local government.'
    $form.querySelector('[name=what_wrong]').value = 'The background should be green.'
    $form.querySelector('[type=submit]').click()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
})
