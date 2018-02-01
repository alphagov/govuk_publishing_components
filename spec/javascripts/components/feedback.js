describe("Improve this page", function () {
   var FIXTURE =
    '<div class="pub-c-feedback">' +
      '<div class="pub-c-feedback__prompt js-prompt" tabindex="-1">' +
        '<h3 class="pub-c-feedback__is-useful-question">Is this page useful?</h3>' +
        '<a href="/contact/govuk" class="pub-c-feedback__prompt-link pub-c-feedback__prompt-link--useful js-page-is-useful" data-track-category="manualFeedbackForm" data-track-action="ffYesClick">Yes <span class="visually-hidden">this page is useful</span></a>' +
        '<a href="/contact/govuk" class="pub-c-feedback__prompt-link js-toggle-form js-page-is-not-useful" data-track-category="manualFeedbackForm" data-track-action="ffNoClick" aria-controls="page-is-not-useful" aria-expanded="false">No <span class="visually-hidden">this page is not useful</span></a>' +
        '<a href="/contact/govuk" class="pub-c-feedback__prompt-link pub-c-feedback__prompt-link--wrong js-toggle-form js-something-is-wrong" data-track-category="manualFeedbackForm" data-track-action="ffWrongClick" aria-controls="something-is-wrong" aria-expanded="false">Is there anything wrong with this page?</a>' +
      '</div>' +

      '<form action="/contact/govuk/page_improvements" id="something-is-wrong" class="pub-c-feedback__form js-feedback-form js-hidden" data-track-category="manualFeedbackForm" data-track-action="ffFormSubmit">' +
        '<a href="#" class="pub-c-feedback__close js-close-form" aria-controls="something-is-wrong" aria-expanded="true">Close</a>' +

        '<div class="grid-row">' +
          '<div class="column-two-thirds">' +
            '<div class="js-errors"></div>' +

            '<input type="hidden" name="url" value="http://example.com/path/to/page">' +
            '<input type="hidden" name="user_agent" value="Safari">' +

            '<h2 class="pub-c-feedback__form-heading">Help us improve GOV.UK</h2>' +
            '<p class="pub-c-feedback__form-paragraph">Don\'t include personal or financial information like your National Insurance number or credit card details.</p>' +

            '<div class="pub-c-feedback__form-group js-form-group">' +
              '<label class="pub-c-feedback__form-label" for="description-field">' +
                'What were you doing on this page?' +
              '</label>' +
              '<textarea id="what_doing" class="pub-c-feedback__form-field" name="what_doing" rows="4" aria-required="true"></textarea>' +
            '</div>' +

            '<div class="pub-c-feedback__form-group js-form-group">' +
              '<label class="pub-c-feedback__form-label" for="wrong-field">' +
                'What is wrong with this page?' +
              '</label>' +
              '<textarea id="what_wrong" class="pub-c-feedback__form-field" name="what_wrong" rows="4" aria-required="true"></textarea>' +
            '</div>' +

            '<input class="pub-c-feedback__submit" type="submit" value="Submit">' +
          '</div>' +
        '</div>' +
      '</form>' +

      '<form action="/contact/govuk/email-survey-signup" id="page-is-not-useful" class="pub-c-feedback__form js-feedback-form js-hidden" data-track-category="FIXME" data-track-action="FIXME">' +
        '<a href="#" class="pub-c-feedback__close js-close-form" aria-controls="page-is-not-useful" aria-expanded="true">Close</a>' +

        '<div class="grid-row">' +
          '<div class="column-two-thirds">' +
            '<div class="js-errors"></div>' +

            '<input type="hidden" name="url" value="http://example.com/path/to/page">' +
            '<input type="hidden" name="user_agent" value="Safari">' +

            '<h2 class="pub-c-feedback__form-heading">Help us improve GOV.UK</h2>' +
            '<p class="pub-c-feedback__form-paragraph">To help us improve GOV.UK, we\'d like to know more about your visit today. We\'ll send you a link to a feedback form. It will take only 2 minutes to fill in. Don\'t worry we won\'t send you spam or share your email address with anyone.</p>' +

            '<div class="pub-c-feedback__form-group js-form-group">' +
              '<label class="pub-c-feedback__form-label" for="email-field">Email address</label>' +
              '<input id="email-field" class="pub-c-feedback__form-field" type="text" name="email_survey_signup[email_address]">' +
            '</div>' +

            '<input class="pub-c-feedback__submit" type="submit" value="Send me the survey">' +
            '<a href="FIXME" class="">Don\'t have an email address?</a>' +
          '</div>' +
        '</div>' +
      '</form>' +
    '</div>';

  beforeEach(function () {
    setFixtures(FIXTURE);
  });

  it("hides the form", function () {
    loadImproveThisPage();

    expect($('.js-feedback-form')).toHaveClass('js-hidden');
  });

  it("shows the prompt", function () {
    loadImproveThisPage();

    expect($('.pub-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
  });

  it("conveys that the feedback forms are hidden", function() {
    loadImproveThisPage();

    expect($('.js-feedback-form#something-is-wrong').attr('aria-hidden')).toBe('true');
    expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('true');
  });

  it("conveys that the form is not expanded", function () {
    loadImproveThisPage();

    expect($('.js-toggle-form[aria-controls="page-is-not-useful"]').attr('aria-expanded')).toBe('false');
    expect($('.js-toggle-form[aria-controls="something-is-wrong"]').attr('aria-expanded')).toBe('false');
  });

  describe("Clicking the 'page was useful' link", function () {
    it("displays a success message", function () {
      loadImproveThisPage();
      $('a.js-page-is-useful').click();

      var $prompt = $('.pub-c-feedback .js-prompt');

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-page-is-useful').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('manualFeedbackForm', 'ffYesClick');
      });
    });
  });

  describe("Clicking the 'page was not useful' link", function () {
    it("shows the feedback form", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.pub-c-feedback .js-feedback-form#page-is-not-useful')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.pub-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.js-feedback-form#page-is-not-useful').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('true');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });

    it("focusses the first field in the form", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect(document.activeElement).toBe($('#page-is-not-useful .pub-c-feedback__form-field').get(0));
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-page-is-not-useful').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('manualFeedbackForm', 'ffNoClick');
      });
    });
  });

  describe("Clicking the 'something is wrong with the page' link", function () {
    it("shows the feedback form", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.pub-c-feedback .js-feedback-form#something-is-wrong')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.pub-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true');
    });

    it("focusses the first field in the form", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect(document.activeElement).toBe($('#something-is-wrong .pub-c-feedback__form-field').get(0));
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-something-is-wrong').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('manualFeedbackForm', 'ffWrongClick');
      });
    });
  });

  describe("Clicking the close link in the 'something is wrong' form", function () {
    beforeEach(function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();
      $('#something-is-wrong a.js-close-form').click();
    })

    it("hides the form", function() {
      expect($('.pub-c-feedback #something-is-wrong')).toHaveClass('js-hidden');
    });

    it("shows the prompt", function() {
      expect($('.pub-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
    });

    it("conveys that the feedback form is hidden", function() {
      loadImproveThisPage();

      expect($('#something-is-wrong.js-feedback-form').attr('aria-hidden')).toBe('true');
    });

    it("conveys that the form is not expanded", function () {
      loadImproveThisPage();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });
  })

  describe("Clicking the close link in the 'not useful' form", function () {
    beforeEach(function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();
      $('#page-is-not-useful a.js-close-form').click();
    })

    it("hides the form", function() {
      expect($('.pub-c-feedback #page-is-not-useful')).toHaveClass('js-hidden');
    });

    it("shows the prompt", function() {
      expect($('.pub-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
    });

    it("conveys that the feedback form is hidden", function() {
      loadImproveThisPage();

      expect($('#page-is-not-useful.js-feedback-form').attr('aria-hidden')).toBe('true');
    });

    it("conveys that the form is not expanded", function () {
      loadImproveThisPage();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });
  })

  describe("successfully submitting the something is wrong form", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();
        fillAndSubmitSomethingIsWrongForm();

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          message: 'ok'
        });

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('manualFeedbackForm', 'ffFormSubmit');
      });
    });

    it("submits the feedback to the feedback frontend", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/contact/govuk/page_improvements');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({
        url: ["http://example.com/path/to/page"],
        what_doing: ["I was looking for some information about local government."],
        what_wrong: ["The background should be green."],
        user_agent: ["Safari"]
      });
    });

    it("displays a success message", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $prompt = $('.pub-c-feedback .js-prompt');

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    it("focusses the success message", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(document.activeElement).toBe($('.pub-c-feedback .js-prompt').get(0));
    })

    it("hides the form", function() {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('#something-is-wrong')).toHaveClass('js-hidden');
    });

    it("removes the links to show the feedback form", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-page-is-not-useful, .js-something-is-wrong').length).toBe(0);
    });
  });

/*
  describe("Successfully submitting the survey form", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();
        fillAndSubmitPageIsNotUsefulForm();

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: ''
        });

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('manualFeedbackForm', 'ffFormSubmit');
      });
    });

    it("submits the feedback to the feedback frontend", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/contact/govuk/email-survey-signup');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({
        url: ["http://example.com/path/to/page"],
        'email_survey_signup[email_address]': ["test@test.com"],
        user_agent: ["Safari"]
      });
    });

    it("displays a success message", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $prompt = $('.pub-c-feedback .js-prompt');

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    it("focusses the success message", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(document.activeElement).toBe($('.pub-c-feedback .js-prompt').get(0));
    })

    it("hides the form", function() {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-feedback-form')).toHaveClass('js-hidden');
    });

    it("removes the links to show the feedback form", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-page-is-not-useful, .js-something-is-wrong').length).toBe(0);
    });
  });

  describe("Submitting the feedback form with invalid data", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("disables the submit button until the server responds", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      expect($('.pub-c-feedback form [type=submit]')).toBeDisabled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('.pub-c-feedback form [type=submit]')).not.toBeDisabled();
    });

    it('retains the feedback the user originally entered', function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=description]').val()).toEqual("I was looking for some information about local government.");
      expect($('[name=wrong]').val()).toEqual("The background should be green.");
    });

    it("displays validation errors in the label of each field", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('label[for=description-field]')).toContainText("Description can't be blank.");
    });

    it("marks fields with validation errors as invalid", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=description]')).toHaveAttr('aria-invalid', 'true');
    });

    it("focusses the first form group if there are no generic errors", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('[name=description]').get(0));
    });

    it("displays a generic error if the field isn't a visible part of the form", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      });

      expect($('.pub-c-feedback .js-error-summary')).toContainText("Path can't be blank. Another weird error.");
    });

    it("focusses the generic error if there is one", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('.js-error-summary').get(0));
    });

    it("associates the error summary with its message so screen readers will read it when the div is focussed", function () {
      loadImproveThisPage();
      fillAndSubmitSomethingIsWrongForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      var $genericErrorMessage = $('#generic-error-message');

      expect($('.js-error-summary').attr('aria-labelledby')).toEqual(
        $genericErrorMessage.attr('id')
      );
    });
  })

  describe("Submitting the page is not useful form with invalid data", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("disables the submit button until the server responds", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      expect($('.pub-c-feedback form [type=submit]')).toBeDisabled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('.pub-c-feedback form [type=submit]')).not.toBeDisabled();
    });

    it('retains the feedback the user originally entered', function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($("[name='email_survey_signup[email_address]']").val()).toEqual("test@test.com");
    });

    it("displays validation errors in the label of each field", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('label[for=description-field]')).toContainText("Description can't be blank.");
    });

    it("marks fields with validation errors as invalid", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=description]')).toHaveAttr('aria-invalid', 'true');
    });

    it("focusses the first form group if there are no generic errors", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('[name=description]').get(0));
    });

    it("displays a generic error if the field isn't a visible part of the form", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      });

      expect($('.pub-c-feedback .js-error-summary')).toContainText("Path can't be blank. Another weird error.");
    });

    it("focusses the generic error if there is one", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('#page-is-not-useful').find('.js-error-summary').get(0));
    });

    it("associates the error summary with its message so screen readers will read it when the div is focussed", function () {
      loadImproveThisPage();
      fillAndSubmitPageIsNotUsefulForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      var $genericErrorMessage = $('#generic-error-message');

      expect($('.js-error-summary').attr('aria-labelledby')).toEqual(
        $genericErrorMessage.attr('id')
      );
    });
  })

  describe("Submitting a form that fails for some reason", function () {
    beforeEach(function() {
      jasmine.Ajax.install();

      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

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
      expect($('.pub-c-feedback').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });

    it('retains the feedback the user originally entered', function () {
      expect($('[name=description]').val()).toEqual('The background should be green.');
      expect($('[name=name]').val()).toEqual('Henry');
      expect($('[name=email]').val()).toEqual('henry@example.com');
    });

    it('re-enables the submit button', function () {
      expect($('.pub-c-feedback form [type=submit]')).not.toBeDisabled();
    });
  })
*/

  function loadImproveThisPage () {
    var feedback = new GOVUK.Modules.Feedback();
    feedback.start($('.pub-c-feedback'));
  }

  function fillAndSubmitSomethingIsWrongForm () {
    $form = $('.pub-c-feedback #something-is-wrong');
    $form.find("[name=what_doing]").val("I was looking for some information about local government.");
    $form.find("[name=what_wrong]").val("The background should be green.");
    $form.find("[type=submit]").click();
  }

  function fillAndSubmitPageIsNotUsefulForm () {
    //$('a.js-page-is-not-useful').click();
    $form = $('.pub-c-feedback #page-is-not-useful');
    $form.find("[name='email_survey_signup[email_address]']").val("test@test.com");
    $form.find("[type=submit]").click();
  }
});
