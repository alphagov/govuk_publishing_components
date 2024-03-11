/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Feedback component', function () {
  var FIXTURE =
  '<div class="gem-c-feedback govuk-!-display-none-print" data-module="feedback">' +

    '<div class="gem-c-feedback__prompt gem-c-feedback__js-show js-prompt" tabindex="-1">' +
      '<div class="gem-c-feedback__prompt-content">' +
        '<div class="gem-c-feedback__prompt-questions js-prompt-questions" hidden>' +
          '<div class="gem-c-feedback__prompt-question-answer">' +
            '<h2 class="gem-c-feedback__prompt-question js-prompt-question">Is this page useful?</h2>' +
            '<ul class="gem-c-feedback__option-list">' +
              '<li class="gem-c-feedback__option-list-item govuk-visually-hidden" style="display: none" hidden>' +
                '<a class="gem-c-feedback__prompt-link" data-track-category="yesNoFeedbackForm" data-track-action="ffMaybeClick" role="button" style="display: none" hidden="hidden" aria-hidden="true" href="/contact/govuk">' +
                  'Maybe' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-feedback__option-list-item">' +
                '<button class="govuk-button gem-c-feedback__prompt-link js-page-is-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffYesClick">' +
                  'Yes <span class="govuk-visually-hidden">this page is useful</span>' +
                '</button>' +
              '</li>' +
              '<li class="gem-c-feedback__option-list-item">' +
                '<button class="govuk-button gem-c-feedback__prompt-link js-toggle-form js-page-is-not-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffNoClick" data-feedback-no-translation="No" data-feedback-close-translation="Cancel" aria-controls="page-is-not-useful" aria-expanded="false">' +
                  '<span class="js-prompt-button-text" aria-hidden="true">' +
                    'No' +
                  '</span>' +
                  '<span span class="govuk-visually-hidden">' +
                    'No this page is not useful' +
                  '</span>' +
                '</button>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="gem-c-feedback__prompt-questions gem-c-feedback__prompt-success js-prompt-success" role="alert" hidden>' +
          'Thank you for your feedback' +
        '</div>' +
        '<div class="gem-c-feedback__prompt-questions gem-c-feedback__prompt-questions--something-is-wrong js-prompt-questions" hidden>' +
          '<button class="govuk-button gem-c-feedback__prompt-link js-toggle-form js-something-is-wrong" data-track-category="Onsite Feedback" data-track-action="GOV.UK Open Form" aria-controls="something-is-wrong" data-feedback-something-wrong-translation="Report a problem with this page" data-feedback-close-translation="Cancel" aria-expanded="false">' +
            '<span class="js-prompt-button-text" aria-hidden="true">' +
              'Report a problem with this page' +
            '</span>' +
            '<span span class="govuk-visually-hidden">' +
              'Report a problem with this page' +
            '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<form action="/contact/govuk/problem_reports" id="something-is-wrong" class="gem-c-feedback__form js-feedback-form" data-track-category="Onsite Feedback" data-track-action="GOV.UK Send Form" method="post" hidden>' +
      '<div class="govuk-grid-row">' +
        '<div class="govuk-grid-column-two-thirds">' +
          '<div class="gem-c-feedback__error-summary gem-c-feedback__js-show js-errors" tabindex="-1" hidden></div>' +
          '<input type="hidden" name="url" value="http://example.com/path/to/page">' +

          '<h3 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h3>' +
          '<p id="feedback_explanation" class="gem-c-feedback__form-paragraph">Don\'t include personal or financial information like your National Insurance number or credit card details.</p>' +

          '<div class="govuk-visually-hidden" aria-hidden="true">' +
            '<label for="giraffe">This field is for robots only. Please leave blank</label>' +
            '<input id="giraffe" name="giraffe" type="text" pattern=".{0}" tabindex="-1" autocomplete="off">' +
          '</div>' +

          '<div class="gem-c-textarea govuk-form-group govuk-!-margin-bottom-6">' +
            '<label for="textarea-4d591836" class="gem-c-label govuk-label">' +
              'What were you doing?' +
            '</label>' +
            '<textarea name="what_doing" class="govuk-textarea" id="textarea-4d591836" rows="3" spellcheck="true aria-describedby="feedback_explanation"></textarea>' +
          '</div>' +

          '<div class="gem-c-textarea govuk-form-group govuk-!-margin-bottom-6">' +
            '<label for="textarea-f10d1d59" class="gem-c-label govuk-label">What went wrong?</label>' +
            '<textarea name="what_wrong" class="govuk-textarea" id="textarea-f10d1d59" rows="3" spellcheck="true"></textarea>' +
          '</div>' +

          '<button class="gem-c-button govuk-button" type="submit">Send</button>' +

        '</div>' +
      '</div>' +
    '</form>' +

    '<form action="/contact/govuk/email-survey-signup" id="page-is-not-useful" class="gem-c-feedback__form gem-c-feedback__form--email gem-c-feedback__js-show js-feedback-form" data-track-category="yesNoFeedbackForm" data-track-action="Send Form" method="post">' +
      '<div class="govuk-grid-row">' +
        '<div class="govuk-grid-column-two-thirds" id="survey-wrapper">' +
          '<div class="gem-c-feedback__error-summary js-errors" tabindex="-1" hidden></div>' +
          '<input name="email_survey_signup[survey_id]" type="hidden" value="an_id">' +
          '<input name="email_survey_signup[survey_source]" type="hidden" value="a_source">' +

          '<h3 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h3>' +
          '<p id="survey_explanation" class="gem-c-feedback__form-paragraph">To help us improve GOV.UK, we\'d like to know more about your visit today. We\'ll send you a link to a feedback form. It will take only 2 minutes to fill in. Don\'t worry we won\'t send you spam or share your email address with anyone.</p>' +

          '<div class="govuk-form-group">' +
            '<label for="input-11111111" class="gem-c-label govuk-label">Email address</label>' +
            '<input aria-describedby="survey_explanation" autocomplete="email" class="gem-c-input govuk-input" id="input-11111111" name="email_survey_signup[email_address]" spellcheck="false" type="email">' +
          '</div>' +

          '<button class="gem-c-button govuk-button" type="submit">Send me the survey</button>' +

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

    expect($('.gem-c-feedback .js-feedback-form').prop('hidden')).toBe(true)
  })

  it('shows the prompt', function () {
    loadFeedbackComponent()

    expect($('.gem-c-feedback .js-prompt').prop('hidden')).toBe(false)
    expect($('.gem-c-feedback .js-prompt-questions').prop('hidden')).toBe(false)
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

      expect(($success).prop('hidden')).toBe(false)
      expect($success).toHaveText('Thank you for your feedback')
    })

    it('hides the question links', function () {
      loadFeedbackComponent()
      $('.js-page-is-useful')[0].click()

      expect($('.js-prompt-questions').prop('hidden')).toBe(true)
    })

    it('triggers a Google Analytics event', function () {
      loadFeedbackComponent()
      $('.js-page-is-useful')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'ffYesClick')
    })
  })

  describe('clicking the "page was not useful" link', function () {
    it('sets the text of the link to Cancel', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()
      
      expect($('.js-page-is-not-useful .js-prompt-button-text')).toHaveText("Cancel")
    })

    it('shows the feedback form', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.gem-c-feedback .js-feedback-form#page-is-not-useful').prop('hidden')).toBe(false)
    })

    it('hides the prompts', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.js-prompt-question').prop('hidden')).toBe(true)
      expect($('.js-page-is-useful').prop('hidden')).toBe(true)
      expect($('.gem-c-feedback__prompt-questions--something-is-wrong').prop('hidden')).toBe(true)
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

    it('adds the appropriate CSS classes', function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()

      expect($('.gem-c-feedback__prompt-content')[0]).toHaveClass('js-prompt-content')
      expect($('.js-page-is-not-useful')[0].parentElement).toHaveClass('govuk-!-margin-0')
      expect($('.js-page-is-not-useful')[0].parentElement).toHaveClass('govuk-!-width-full')
    })
  })

  describe('Clicking the "is there anything wrong with this page" link', function () {
    it('sets the text of the link to Cancel', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.js-something-is-wrong .js-prompt-button-text')).toHaveText("Cancel")
    })

    it('shows the form', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.gem-c-feedback .js-feedback-form#something-is-wrong').prop('hidden')).toBe(false)
    })

    it('hides the prompts', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.js-prompt-questions')[0].hidden).toBe(true)
    })

    it('conveys that the form is now expanded', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true')
    })

    it('focusses the first field in the form', function () {
      loadFeedbackComponent()
      var $input = $('#something-is-wrong .govuk-textarea')[0]
      spyOn($input, 'focus')
      $('.js-something-is-wrong')[0].click()

      expect($input.focus).toHaveBeenCalled()
    })

    it('triggers a Google Analytics event', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Open Form')
    })

    it('adds the appropriate CSS classes', function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()

      expect($('.gem-c-feedback__prompt-content')[0]).toHaveClass('js-prompt-content')
      expect($('.js-something-is-wrong')[0].parentElement).toHaveClass('js-no-border-top')
    })
  })

  describe('Clicking the close link in the "something is wrong" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()
      $('.js-something-is-wrong')[0].click()
    })

    it('sets the text of the link to Report a problem with this page', function () {
      expect($('.js-something-is-wrong .js-prompt-button-text')).toHaveText("Report a problem with this page")
    })

    it('hides the form', function () {
      expect($('.gem-c-feedback #something-is-wrong').prop('hidden')).toBe(true)
    })

    it('shows the prompts', function () {
      expect($('.js-prompt-questions')[0].hidden).toBe(false)
      expect($('.js-prompt-questions')[1].hidden).toBe(false)
      expect(document.activeElement).toBe($('.js-something-is-wrong').get(0))
    })

    it('conveys that the form is not expanded', function () {
      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false')
    })

    it('triggers a Google Analytics event', function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Close Form')
    })

    it('remove the appropriate CSS classes', function () {
      expect($('.gem-c-feedback__prompt-content')[0]).not.toHaveClass('js-prompt-content')
      expect($('.js-something-is-wrong')[0].parentElement).not.toHaveClass('js-no-border-top')
    })
  })
  
  describe('Clicking the close link in the "not useful" form', function () {
    beforeEach(function () {
      loadFeedbackComponent()
      $('.js-page-is-not-useful')[0].click()
      $('.js-page-is-not-useful')[0].click()
    })

    it('sets the text of the link to No', function () {
      expect($('.js-page-is-not-useful .js-prompt-button-text')).toHaveText("No")
    })

    it('hides the form', function () {
      expect($('.gem-c-feedback #page-is-not-useful').prop('hidden')).toBe(true)
    })

    it('shows the prompts', function () {
      expect($('.js-prompt-question').prop('hidden')).toBe(false)
      expect($('.js-page-is-useful').prop('hidden')).toBe(false)
      expect($('.gem-c-feedback__prompt-questions--something-is-wrong').prop('hidden')).toBe(false)
      expect(document.activeElement).toBe($('.js-page-is-not-useful').get(0))
    })

    it('conveys that the form is not expanded', function () {
      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false')
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false')
    })

    it('triggers a Google Analytics event', function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('yesNoFeedbackForm', 'ffFormClose')
    })

    it('removes the appropriate CSS classes', function () {
      expect($('.gem-c-feedback__prompt-content')[0]).not.toHaveClass('js-prompt-content')
      expect($('.js-page-is-not-useful')[0].parentElement).not.toHaveClass('govuk-!-margin-0')
      expect($('.js-page-is-not-useful')[0].parentElement).not.toHaveClass('govuk-!-width-full')
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

        var $success = $('.js-prompt-success')

        expect(($success).prop('hidden')).toBe(false)
        expect($success).toHaveText('Thank you for your feedback')
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

        expect($('#something-is-wrong').prop('hidden')).toBe(true)
      })

      it('hides the links to show the feedback form', function () {
        loadFeedbackComponent()
        fillAndSubmitSomethingIsWrongForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('.js-prompt-questions').prop('hidden')).toBe(true)
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

        expect(($prompt).prop('hidden')).toBe(false)
        expect($prompt).toHaveText('Thank you for your feedback')
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

        expect($('.js-feedback-form').prop('hidden')).toBe(true)
      })

      it('hides the links to show the feedback form', function () {
        loadFeedbackComponent()
        fillAndSubmitPageIsNotUsefulForm()

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText: '{}'
        })

        expect($('.js-prompt-questions').prop('hidden')).toBe(true)
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

  describe('testing honeypot metadata on the "report a problem" form', function () {
    beforeEach(function () {
      jasmine.clock().install()
      loadFeedbackComponent()
      $('.js-something-is-wrong')[0].click()
    })

    afterEach(function () {
      jasmine.clock().uninstall()
    })

    it('has an incrementing timer field', function () {
      var $form = $('.gem-c-feedback #something-is-wrong')
      var $timer = $form.find('input[name=timer]')
      expect($timer.val()).toBe('0')
      jasmine.clock().tick(1000)
      expect($timer.val()).toBe('1')
      jasmine.clock().tick(3000)
      expect($timer.val()).toBe('4')
    })
  })

  function loadFeedbackComponent () {
    new GOVUK.Modules.Feedback($('.gem-c-feedback')[0]).init()
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
