/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Feedback component', function () {
  var FIXTURE =
  '<div class="gem-c-feedback">' +
    '<div class="gem-c-feedback__prompt js-prompt" tabindex="-1">' +
      '<div class="js-prompt-questions">' +
        '<h3 class="gem-c-feedback__is-useful-question">Is this page useful?</h3>' +
        '<ul class="gem-c-feedback__option-list">' +
          '<li class="gem-c-feedback__option-list-item gem-c-feedback__option-list-item--useful">' +
            '<button class="gem-c-feedback__prompt-link js-page-is-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffYesClick">' +
                'Yes <span class="visually-hidden">this page is useful</span>' +
            '</button>' +
          '</li>' +
          '<li class="gem-c-feedback__option-list-item gem-c-feedback__option-list-item--not-useful">' +
            '<button class="gem-c-feedback__prompt-link js-toggle-form js-page-is-not-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffNoClick" aria-controls="page-is-not-useful" aria-expanded="false">' +
              'No <span class="visually-hidden">this page is not useful</span>' +
            '</button>' +
          '</li>' +
          '<li class="gem-c-feedback__option-list-item gem-c-feedback__option-list-item--wrong">' +
            '<button class="gem-c-feedback__prompt-link js-toggle-form js-something-is-wrong" data-track-category="Onsite Feedback" data-track-action="GOV.UK Open Form" aria-controls="something-is-wrong" aria-expanded="false">' +
              'Is there anything wrong with this page?' +
            '</button>' +
          '</li>' +
        '</ul>' +
      '</div>' +
      '<div class="gem-c-feedback__prompt-success js-prompt-success js-hidden" tabindex="-1">' +
        'Thanks for your feedback.' +
      '</div>' +
    '</div>' +

    '<form action="/contact/govuk/page_improvements" id="something-is-wrong" class="gem-c-feedback__form js-feedback-form js-hidden" data-track-category="Onsite Feedback" data-track-action="GOV.UK Send Form">' +
      '<button class="govuk-button govuk-button--secondary gem-c-feedback__close gem-c-feedback__js-show js-close-form" data-track-category="Onsite Feedback" data-track-action="GOV.UK Close Form" aria-controls="something-is-wrong">Close</button>' +
      '<div class="grid-row">' +
        '<div class="column-two-thirds" id="survey-wrapper">' +
          '<div class="gem-c-feedback__error-summary js-hidden js-errors" tabindex="-1"></div>' +

          '<input type="hidden" name="url" value="http://example.com/path/to/page">' +

          '<h2 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h2>' +
          '<p class="gem-c-feedback__form-paragraph">Don\'t include personal or financial information like your National Insurance number or credit card details.</p>' +

          '<div class="gem-c-label">' +
            '<label class="gem-c-label__text" for="input-29a3904f">' +
              'What were you doing?' +
            '</label>' +
          '</div>' +
          '<input class="gem-c-input " id="input-29a3904f" name="what_doing" type="text">' +

          '<div class="gem-c-label">' +
            '<label class="gem-c-label__text" for="input-3ad718b1">' +
              'What went wrong?' +
            '</label>' +
          '</div>' +
          '<input class="gem-c-input " id="input-3ad718b1" name="what_wrong" type="text">' +

          '<input class="gem-c-feedback__submit" type="submit" value="Submit">' +
        '</div>' +
      '</div>' +
    '</form>' +

    '<form action="/contact/govuk/email-survey-signup" id="page-is-not-useful" class="gem-c-feedback__form js-feedback-form js-hidden" data-track-category="yesNoFeedbackForm" data-track-action="Send Form">' +
      '<button class="govuk-button govuk-button--secondary gem-c-feedback__close js-close-form" data-track-category="yesNoFeedbackForm" data-track-action="ffFormClose" aria-controls="page-is-not-useful">Close</button>' +
      '<div class="grid-row">' +
        '<div class="column-two-thirds">' +
          '<div class="gem-c-feedback__error-summary js-hidden js-errors" tabindex="-1"></div>' +
          '<input name="email_survey_signup[survey_source]" type="hidden" value="a_source">' +
          '<input name="email_survey_signup[survey_id]" type="hidden" value="an_id">' +

          '<h2 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h2>' +
          '<p class="gem-c-feedback__form-paragraph">To help us improve GOV.UK, we\'d like to know more about your visit today. We\'ll send you a link to a feedback form. It will take only 2 minutes to fill in. Don\'t worry we won\'t send you spam or share your email address with anyone.</p>' +

          '<div class="gem-c-label">' +
            '<label class="gem-c-label__text" for="input-111111">' +
              'Email address' +
            '</label>' +
          '</div>' +
          '<input class="gem-c-input " id="input-111111" name="email_survey_signup[email_address]" type="text">' +

          '<input class="gem-c-feedback__submit" type="submit" value="Send me the survey">' +
        '</div>' +
      '</div>' +
    '</form>' +
  '</div>'

  beforeEach(function () {
    window.setFixtures(FIXTURE)
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('hides the forms', function () {
    loadFeedbackComponent()

    expect($('.gem-c-feedback .js-feedback-form')).toHaveClass('js-hidden')
  })

  it('shows the prompt', function () {
    loadFeedbackComponent()

    expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden')
    expect($('.gem-c-feedback .js-prompt-questions')).not.toHaveClass('js-hidden')
  })

  it('conveys that the feedback forms are hidden', function () {
    loadFeedbackComponent()

    expect($('.js-feedback-form#something-is-wrong').attr('aria-hidden')).toBe('true')
    expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('true')
  })

  it('conveys that the form is not expanded', function () {
    loadFeedbackComponent()

    expect($('.js-toggle-form[aria-controls="page-is-not-useful"]').attr('aria-expanded')).toBe('false')
    expect($('.js-toggle-form[aria-controls="something-is-wrong"]').attr('aria-expanded')).toBe('false')
  })

  // note that this test will fail in the browser 'run tests in random order' is disabled
  // or any link in the jasmine window is clicked e.g. a specific test suite
  // because the referrer will be localhost, not 'unknown'
  it('should append a hidden "referrer" field to the form', function () {
    loadFeedbackComponent()

    expect($('#something-is-wrong').find('[name=referrer]').val()).toBe('unknown')
  })

  it('should append a hidden "ga_client_id" field to the form with the appropriate value', function () {
    loadFeedbackComponent()
    GOVUK.setCookie('_ga', 'GA1.3.512324446.1561716924', {})
    $('.js-page-is-not-useful')[0].click()
    expect($('#page-is-not-useful').find("[name='email_survey_signup[ga_client_id]']").val()).toBe('512324446.1561716924')
  })

  it('should append a hidden "ga_client_id" field to the from with a default value if no client id is present', function () {
    loadFeedbackComponent()
    GOVUK.setCookie('_ga', '', {})
    $('.js-page-is-not-useful')[0].click()
    expect($('#page-is-not-useful').find("[name='email_survey_signup[ga_client_id]']").val()).toBe('111111111.1111111111')
  })

  it('should append the "Don’t have an email address?" link at the bottom of the form', function () {
    loadFeedbackComponent()
    $('.js-page-is-not-useful')[0].click()

    expect($('#survey-wrapper').find('#take-survey').length).toBe(1)
  })

  describe('clicking the "page was useful" link', function () {
    it('displays a success message', function () {
      loadFeedbackComponent()
      $('.js-page-is-useful')[0].click()

      var $success = $('.js-prompt-success')

      expect($success).not.toHaveClass('js-hidden')
      expect($success).toHaveText('Thanks for your feedback.')
    })

    it('hides the question links', function () {
      loadFeedbackComponent()
      $('.js-page-is-useful')[0].click()

      expect($('.js-prompt-questions')).toHaveClass('js-hidden')
    })

    it('triggers a Google Analytics event', function () {
      loadFeedbackComponent()
      $('.js-page-is-useful')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'ffYesClick')
    })
  })

  describe('clicking the "page was not useful" link', function () {
    it('shows the feedback form', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.gem-c-feedback .js-feedback-form#page-is-not-useful')).not.toHaveClass('js-hidden')
    })

    it('hides the prompt', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.gem-c-feedback .js-prompt')).toHaveClass('js-hidden')
    })

    it('conveys that the form is now visible', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('false')
    })

    it('conveys that the form is now expanded', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('true')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false')
    })

    it('focusses the first field in the form', function () {
      loadFeedbackComponent()
      var $input = $('#page-is-not-useful .gem-c-input')[0]
      spyOn($input, 'focus')
      $('.js-page-is-not-useful')[0].click()

      expect($input.focus).toHaveBeenCalled()
    })

    it('triggers a Google Analytics event', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'ffNoClick')
    })
  })

  describe('Clicking the "is there anything wrong with this page" link', function () {
    it('shows the form', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.gem-c-feedback .js-feedback-form#something-is-wrong')).not.toHaveClass('js-hidden')
    })

    it('hides the prompt', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.gem-c-feedback .js-prompt')).toHaveClass('js-hidden')
    })

    it('conveys that the form is now visible', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('false')
    })

    it('conveys that the form is now expanded', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true')
    })

    it('focusses the first field in the form', function () {
      loadFeedbackComponent()
      var $input = $('#something-is-wrong .gem-c-input')[0]
      spyOn($input, 'focus')
      $('.js-something-is-wrong')[0].click()

      expect($input.focus).toHaveBeenCalled()
    })

    it('triggers a Google Analytics event', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Open Form')
    })
  })

  describe('Clicking the close link in the "something is wrong" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()
      $('#something-is-wrong .js-close-form')[0].click()
    })

    it('hides the form', function () {
      expect($('.gem-c-feedback #something-is-wrong')).toHaveClass('js-hidden')
    })

    it('shows the prompt', function () {
      expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden')
      expect(document.activeElement).toBe($('.js-something-is-wrong').get(0))
    })

    it('conveys that the feedback form is hidden', function () {
      loadFeedbackComponent()

      expect($('#something-is-wrong.js-feedback-form').attr('aria-hidden')).toBe('true')
    })

    it('conveys that the form is not expanded', function () {
      loadFeedbackComponent()

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false')
    })

    it('triggers a Google Analytics event', function () {
      $('#something-is-wrong .js-close-form')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Close Form')
    })
  })

  describe('Clicking the close link in the "not useful" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()
      $('#page-is-not-useful .js-close-form')[0].click()
    })

    it('hides the form', function () {
      expect($('.gem-c-feedback #page-is-not-useful')).toHaveClass('js-hidden')
    })

    it('shows the prompt', function () {
      expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden')
      expect(document.activeElement).toBe($('.js-page-is-not-useful').get(0))
    })

    it('conveys that the feedback form is hidden', function () {
      loadFeedbackComponent()

      expect($('#page-is-not-useful.js-feedback-form').attr('aria-hidden')).toBe('true')
    })

    it('conveys that the form is not expanded', function () {
      loadFeedbackComponent()

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false')
    })

    it('triggers a Google Analytics event', function () {
      $('#page-is-not-useful .js-close-form')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'ffFormClose')
    })
  })

  // this check prevents these tests being run if in IE11 or below
  // because the JS doesn't work for form submissions on IE
  if (typeof window.URLSearchParams === 'function') {
    describe('successfully submitting the "is there anything wrong with this page" form', function () {
      beforeEach(function () {
        jasmine.Ajax.install()
      })

      afterEach(function () {
        jasmine.Ajax.uninstall()
      })

      it('triggers a Google Analytics event', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "message": "ok" }'
        })

        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Send Form')
      })

      // note that this test will fail in the browser 'run tests in random order' is disabled
      // or any link in the jasmine window is clicked e.g. a specific test suite
      // because the referrer will be localhost, not 'unknown'
      it('submits the feedback to the feedback frontend', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        var request = jasmine.Ajax.requests.mostRecent()
        expect(request.url).toBe('/contact/govuk/page_improvements')
        expect(request.method).toBe('POST')
        expect(request.data()).toEqual({
          url: ['http://example.com/path/to/page'],
          what_doing: ['I was looking for some information about local government.'],
          what_wrong: ['The background should be green.'],
          referrer: ['unknown'],
          javascript_enabled: ['true']
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

        var $success = $('.js-prompt-success')

        expect($success).not.toHaveClass('js-hidden')
        expect($success).toHaveText('Thanks for your feedback.')
      })

      it('focusses the success message', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0))
      })

      it('hides the form', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('#something-is-wrong')).toHaveClass('js-hidden')
      })

      it('hides the links to show the feedback form', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('.js-prompt-questions')).toHaveClass('js-hidden')
      })
    })

    describe('successfully submitting the "page is not useful" form', function () {
      beforeEach(function () {
        jasmine.Ajax.install()
      })

      afterEach(function () {
        jasmine.Ajax.uninstall()
      })

      it('triggers a Google Analytics event', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "message": "ok" }'
        })

        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'Send Form')
      })

      it('submits the feedback to the feedback frontend', function () {
        GOVUK.setCookie('_ga', '', {})
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        var request = jasmine.Ajax.requests.mostRecent()
        expect(request.url).toBe('/contact/govuk/email-survey-signup')
        expect(request.method).toBe('POST')
        expect(request.data()).toEqual({
          'email_survey_signup[email_address]': ['test@test.com'],
          'email_survey_signup[ga_client_id]': ['111111111.1111111111'],
          'email_survey_signup[survey_source]': ['a_source'],
          'email_survey_signup[survey_id]': ['an_id']
        })
      })

      it('displays a success message', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        var $prompt = $('.js-prompt-success')

        expect($prompt).not.toHaveClass('js-hidden')
        expect($prompt).toHaveText('Thanks for your feedback.')
      })

      it('focusses the success message', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0))
      })

      it('hides the form', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('.js-feedback-form')).toHaveClass('js-hidden')
      })

      it('hides the links to show the feedback form', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('.js-prompt-questions')).toHaveClass('js-hidden')
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

        expect($('.gem-c-feedback form [type=submit]')).toBeDisabled()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"description": ["can\'t be blank"]}}'
        })

        expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled()
      })

      it('retains the feedback the user originally entered', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"description": ["can\'t be blank"]}}'
        })

        expect($('[name=what_doing]').val()).toEqual('I was looking for some information about local government.')
        expect($('[name=what_wrong]').val()).toEqual('The background should be green.')
      })

      it('displays a generic error if the field isn\'t a visible part of the form', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
        })

        expect($('#something-is-wrong .js-errors').html()).toContainText(
          'Sorry, we’re unable to receive your message right now. ' +
          'If the problem persists, we have other ways for you to provide ' +
          'feedback on the contact page.'
        )
      })

      it('focusses the error message', function () {
        loadFeedbackComponent()
        var $input = $('#something-is-wrong .js-errors')[0]
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

    describe('Submitting the "page is not useful" form with invalid data', function () {
      beforeEach(function () {
        jasmine.Ajax.install()
      })

      afterEach(function () {
        jasmine.Ajax.uninstall()
      })

      it('disables the submit button until the server responds', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        expect($('.gem-c-feedback form [type=submit]')).toBeDisabled()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"description": ["can\'t be blank"]}}'
        })

        expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled()
      })

      it('retains the feedback the user originally entered', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"description": ["can\'t be blank"]}}'
        })

        expect($("[name='email_survey_signup[email_address]']").val()).toEqual('test@test.com')
      })

      it('displays a generic error if the field isn\'t a visible part of the form', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
        })

        expect($('#page-is-not-useful .js-errors').html()).toContainText(
          'Sorry, we’re unable to receive your message right now. ' +
          'If the problem persists, we have other ways for you to provide ' +
          'feedback on the contact page.'
        )
      })

      it('focusses the generic error', function () {
        loadFeedbackComponent()
        var $input = $('#page-is-not-useful .js-errors')[0]
        spyOn($input, 'focus')
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 422,
          contentType: 'application/json',
          responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
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
        expect($('.gem-c-feedback__error-summary').html()).toContainText(
          'Sorry, we’re unable to receive your message right now. ' +
          'If the problem persists, we have other ways for you to provide ' +
          'feedback on the contact page.'
        )
        expect($('.gem-c-feedback__error-summary').html()).not.toContainText('email survey sign up failure')
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
        expect($('.gem-c-feedback__error-summary').html()).toContainText(
          'Sorry, we’re unable to receive your message right now. ' +
          'If the problem persists, we have other ways for you to provide ' +
          'feedback on the contact page.'
        )
      })

      it('retains the feedback the user originally entered', function () {
        expect($('[name=what_doing]').val()).toEqual('I was looking for some information about local government.')
        expect($('[name=what_wrong]').val()).toEqual('The background should be green.')
      })

      it('re-enables the submit button', function () {
        expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled()
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
        expect($('.gem-c-feedback__error-summary').html()).toContainText(
          'Sorry, we’re unable to receive your message right now. ' +
          'If the problem persists, we have other ways for you to provide ' +
          'feedback on the contact page.'
        )
      })
    })
  }

  function loadFeedbackComponent () {
    var feedback = new GOVUK.Modules.Feedback()
    feedback.start($('.gem-c-feedback'))
  }

  function fillAndSubmitSomethingIsWrongForm () {
    $('.js-something-is-wrong')[0].click()
    var $form = $('.gem-c-feedback #something-is-wrong')
    $form.find('[name=what_doing]').val('I was looking for some information about local government.')
    $form.find('[name=what_wrong]').val('The background should be green.')
    $form.find('[type=submit]')[0].click()
  }

  function fillAndSubmitPageIsNotUsefulForm () {
    $('.js-page-is-not-useful')[0].click()
    var $form = $('.gem-c-feedback #page-is-not-useful')
    $form.find('[name="email_survey_signup[email_address]"]').val('test@test.com')
    $form.find('[type=submit]')[0].click()
  }
})
