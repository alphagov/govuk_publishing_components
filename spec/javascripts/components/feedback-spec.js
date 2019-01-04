describe("Feedback component", function () {
   var FIXTURE =
    '<div class="gem-c-feedback">' +
      '<div class="gem-c-feedback__prompt js-prompt" tabindex="-1">' +
        '<div class="js-prompt-questions">' +
          '<h3 class="gem-c-feedback__is-useful-question">Is this page useful?</h3>' +
          '<a href="/contact/govuk" class="gem-c-feedback__prompt-link gem-c-feedback__prompt-link--useful js-page-is-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffYesClick">Yes <span class="visually-hidden">this page is useful</span></a>' +
          '<a href="/contact/govuk" class="gem-c-feedback__prompt-link js-toggle-form js-page-is-not-useful" data-track-category="yesNoFeedbackForm" data-track-action="ffNoClick" aria-controls="page-is-not-useful" aria-expanded="false">No <span class="visually-hidden">this page is not useful</span></a>' +
          '<a href="/contact/govuk" class="gem-c-feedback__prompt-link gem-c-feedback__prompt-link--wrong js-toggle-form js-something-is-wrong" data-track-category="Onsite Feedback" data-track-action="GOV.UK Open Form" aria-controls="something-is-wrong" aria-expanded="false">Is there anything wrong with this page?</a>' +
        '</div>' +

        '<div class="gem-c-feedback__prompt-success js-prompt-success js-hidden" tabindex="-1">' +
          'Thanks for your feedback.' +
        '</div>' +
      '</div>' +

      '<form action="/contact/govuk/page_improvements" id="something-is-wrong" class="gem-c-feedback__form js-feedback-form js-hidden" data-track-category="Onsite Feedback" data-track-action="GOV.UK Send Form">' +
        '<a href="#" class="gem-c-feedback__close js-close-form" aria-controls="something-is-wrong" aria-expanded="true" data-track-category="Onsite Feedback" data-track-action="GOV.UK Close Form">Close</a>' +

        '<div class="grid-row">' +
          '<div class="column-two-thirds">' +
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
        '<a href="#" class="gem-c-feedback__close js-close-form" aria-controls="page-is-not-useful" aria-expanded="true" data-track-category="yesNoFeedbackForm" data-track-action="ffFormClose">Close</a>' +

        '<div class="grid-row">' +
          '<div class="column-two-thirds">' +
            '<div class="gem-c-feedback__error-summary js-hidden js-errors" tabindex="-1"></div>' +

            '<input type="hidden" name="url" value="http://example.com/path/to/page">' +

            '<h2 class="gem-c-feedback__form-heading">Help us improve GOV.UK</h2>' +
            '<p class="gem-c-feedback__form-paragraph">To help us improve GOV.UK, we\'d like to know more about your visit today. We\'ll send you a link to a feedback form. It will take only 2 minutes to fill in. Don\'t worry we won\'t send you spam or share your email address with anyone.</p>' +

            '<div class="gem-c-label">' +
              '<label class="gem-c-label__text" for="input-111111">' +
                'Email address' +
              '</label>' +
            '</div>' +
            '<input class="gem-c-input " id="input-111111" name="email_survey_signup[email_address]" type="text">' +

            '<input class="gem-c-feedback__submit" type="submit" value="Send me the survey">' +
            '<a href="FIXME" class="">Don\'t have an email address?</a>' +
          '</div>' +
        '</div>' +
      '</form>' +
    '</div>';

  beforeEach(function () {
    setFixtures(FIXTURE);
  });

  it("hides the forms", function () {
    loadFeedbackComponent();

    expect($('.gem-c-feedback .js-feedback-form')).toHaveClass('js-hidden');
  });

  it("shows the prompt", function () {
    loadFeedbackComponent();

    expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
    expect($('.gem-c-feedback .js-prompt-questions')).not.toHaveClass('js-hidden');
  });

  it("conveys that the feedback forms are hidden", function() {
    loadFeedbackComponent();

    expect($('.js-feedback-form#something-is-wrong').attr('aria-hidden')).toBe('true');
    expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('true');
  });

  it("conveys that the form is not expanded", function () {
    loadFeedbackComponent();

    expect($('.js-toggle-form[aria-controls="page-is-not-useful"]').attr('aria-expanded')).toBe('false');
    expect($('.js-toggle-form[aria-controls="something-is-wrong"]').attr('aria-expanded')).toBe('false');
  });

  it("should append a hidden 'referrer' field to the form", function() {
    loadFeedbackComponent();

    expect($('#something-is-wrong').find("[name=referrer]").val()).toBe("unknown");
  });

  describe("clicking the 'page was useful' link", function () {
    it("displays a success message", function () {
      loadFeedbackComponent();
      $('a.js-page-is-useful').click();

      var $success = $('.js-prompt-success');

      expect($success).not.toHaveClass('js-hidden');
      expect($success).toHaveText("Thanks for your feedback.");
    });

    it("hides the question links", function () {
      loadFeedbackComponent();
      $('a.js-page-is-useful').click();

      expect($('.js-prompt-questions')).toHaveClass('js-hidden');
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadFeedbackComponent();
      $('a.js-page-is-useful').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('yesNoFeedbackForm', 'ffYesClick');
    });
  });

  describe("clicking the 'page was not useful' link", function () {
    it("shows the feedback form", function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect($('.gem-c-feedback .js-feedback-form#page-is-not-useful')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect($('.gem-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('true');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });

    it("focusses the first field in the form", function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect(document.activeElement).toBe($('#page-is-not-useful .gem-c-input').get(0));
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('yesNoFeedbackForm', 'ffNoClick');
    });
  });

  describe("Clicking the 'is there anything wrong with this page' link", function () {
    it("shows the form", function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect($('.gem-c-feedback .js-feedback-form#something-is-wrong')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect($('.gem-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true');
    });

    it("focusses the first field in the form", function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect(document.activeElement).toBe($('#something-is-wrong .gem-c-input').get(0));
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Open Form');
    });
  });

  describe("Clicking the close link in the 'something is wrong' form", function () {
    beforeEach(function () {
      loadFeedbackComponent();
      $('a.js-something-is-wrong').click();
      $('#something-is-wrong a.js-close-form').click();
    });

    it("hides the form", function() {
      expect($('.gem-c-feedback #something-is-wrong')).toHaveClass('js-hidden');
    });

    it("shows the prompt", function() {
      expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
      expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0));
    });

    it("conveys that the feedback form is hidden", function() {
      loadFeedbackComponent();

      expect($('#something-is-wrong.js-feedback-form').attr('aria-hidden')).toBe('true');
    });

    it("conveys that the form is not expanded", function () {
      loadFeedbackComponent();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      $('#something-is-wrong a.js-close-form').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Close Form');
    });
  })

  describe("Clicking the close link in the 'not useful' form", function () {
    beforeEach(function () {
      loadFeedbackComponent();
      $('a.js-page-is-not-useful').click();
      $('#page-is-not-useful a.js-close-form').click();
    })

    it("hides the form", function() {
      expect($('.gem-c-feedback #page-is-not-useful')).toHaveClass('js-hidden');
    });

    it("shows the prompt", function() {
      expect($('.gem-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
      expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0));
    });

    it("conveys that the feedback form is hidden", function() {
      loadFeedbackComponent();

      expect($('#page-is-not-useful.js-feedback-form').attr('aria-hidden')).toBe('true');
    });

    it("conveys that the form is not expanded", function () {
      loadFeedbackComponent();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      $('#page-is-not-useful a.js-close-form').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('yesNoFeedbackForm', 'ffFormClose');
    });
  })

  describe("successfully submitting the 'is there anything wrong with this page' form", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "message": "ok" }'
      });

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('Onsite Feedback', 'GOV.UK Send Form');
    });

    it("submits the feedback to the feedback frontend", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/contact/govuk/page_improvements');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({
        url: ["http://example.com/path/to/page"],
        what_doing: ["I was looking for some information about local government."],
        what_wrong: ["The background should be green."],
        referrer: ["unknown"],
        javascript_enabled: ["true"]
      });
    });

    it("displays a success message", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $success = $('.js-prompt-success');

      expect($success).not.toHaveClass('js-hidden');
      expect($success).toHaveText("Thanks for your feedback.");
    });

    it("focusses the success message", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0));
    })

    it("hides the form", function() {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('#something-is-wrong')).toHaveClass('js-hidden');
    });

    it("hides the links to show the feedback form", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-prompt-questions')).toHaveClass('js-hidden');
    });
  });

  describe("successfully submitting the 'page is not useful' form", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("triggers a Google Analytics event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "message": "ok" }'
      });

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('yesNoFeedbackForm', 'Send Form');
    });

    it("submits the feedback to the feedback frontend", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/contact/govuk/email-survey-signup');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({
        url: ["http://example.com/path/to/page"],
        'email_survey_signup[email_address]': ["test@test.com"]
      });
    });

    it("displays a success message", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $prompt = $('.js-prompt-success');

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    it("focusses the success message", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(document.activeElement).toBe($('.gem-c-feedback .js-prompt').get(0));
    })

    it("hides the form", function() {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-feedback-form')).toHaveClass('js-hidden');
    });

    it("hides the links to show the feedback form", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-prompt-questions')).toHaveClass('js-hidden');
    });
  });

  describe("submitting the 'is something wrong with this page' form with invalid data", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("disables the submit button until the server responds", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      expect($('.gem-c-feedback form [type=submit]')).toBeDisabled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled();
    });

    it('retains the feedback the user originally entered', function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=what_doing]').val()).toEqual("I was looking for some information about local government.");
      expect($('[name=what_wrong]').val()).toEqual("The background should be green.");
    });

    it("displays a generic error if the field isn't a visible part of the form", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      });

      expect($('#something-is-wrong .js-errors').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });

    it("focusses the error message", function () {
      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $shouldBe = $('#something-is-wrong .js-errors').get(0);
      expect(document.activeElement).toBe($shouldBe);
    });
  });

  describe("Submitting the 'page is not useful' form with invalid data", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("disables the submit button until the server responds", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      expect($('.gem-c-feedback form [type=submit]')).toBeDisabled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled();
    });

    it('retains the feedback the user originally entered', function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($("[name='email_survey_signup[email_address]']").val()).toEqual("test@test.com");
    });

    it("displays a generic error if the field isn't a visible part of the form", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      });

      expect($('#page-is-not-useful .js-errors').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });

    it("focusses the generic error", function () {
      loadFeedbackComponent();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('#page-is-not-useful .js-errors').get(0));
    });
  });

  describe("submitting a form that fails for some reason", function () {
    beforeEach(function() {
      jasmine.Ajax.install();

      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        contentType: 'text/plain',
        responseText: ''
      });
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("displays a generic error message", function () {
      expect($('.gem-c-feedback__error-summary').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });

    it('retains the feedback the user originally entered', function () {
      expect($('[name=what_doing]').val()).toEqual('I was looking for some information about local government.');
      expect($('[name=what_wrong]').val()).toEqual('The background should be green.');
    });

    it('re-enables the submit button', function () {
      expect($('.gem-c-feedback form [type=submit]')).not.toBeDisabled();
    });
  });

  describe("submitting a form that times out", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
      jasmine.clock().install();

      loadFeedbackComponent();
      fillAndSubmitSomethingIsWrongForm();
      jasmine.Ajax.requests.mostRecent().responseTimeout();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
      jasmine.clock().uninstall();
    });

    it('displays a generic error message', function () {
      expect($('.gem-c-feedback__error-summary').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });
  });

  function loadFeedbackComponent () {
    var feedback = new GOVUK.Modules.Feedback();
    feedback.start($('.gem-c-feedback'));
  }

  function fillAndSubmitSomethingIsWrongForm () {
    $('a.js-something-is-wrong').click();
    $form = $('.gem-c-feedback #something-is-wrong');
    $form.find("[name=what_doing]").val("I was looking for some information about local government.");
    $form.find("[name=what_wrong]").val("The background should be green.");
    $form.find("[type=submit]").click();
  }

  function fillAndSubmitPageIsNotUsefulForm () {
    $('a.js-page-is-not-useful').click();
    $form = $('.gem-c-feedback #page-is-not-useful');
    $form.find("[name='email_survey_signup[email_address]']").val("test@test.com");
    $form.find("[type=submit]").click();
  }
});
