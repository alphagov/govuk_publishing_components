/*
  questions

  - if I submit successfully, what is shown? Just the success message? Success message and collapsed, reset component?
  - if I close one of the forms, should it remember what I've typed in and any error messages?
  - what do error messages look like?
  - what do success messages look like?
  - what tracking is needed?
*/

(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  Modules.Feedback = function () {

    this.start = function ($element) {
      this.$prompt = $element.find('.js-prompt');
      this.$success = $element.find('.js-success');
      this.$fields = $element.find('.gem-c-feedback__form-field');
      this.$forms = $element.find('.js-feedback-form');
      this.$toggleForms = $element.find('.js-toggle-form');
      this.$closeForms = $element.find('.js-close-form');
      this.$activeForm = false;
      this.$pageIsUsefulButton = $element.find('.js-page-is-useful');
      this.$pageIsNotUsefulButton = $element.find('.js-page-is-not-useful');
      this.$somethingIsWrongButton = $element.find('.js-something-is-wrong');
      var that = this;

      setInitialAriaAttributes();

      this.$toggleForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        trackEvent(getTrackEventParams($(this)));
        updateAriaAttributes($(this));
      });

      this.$closeForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        setInitialAriaAttributes();
      });

      this.$pageIsUsefulButton.on('click', function(e) {
        e.preventDefault();
        trackEvent(getTrackEventParams(that.$pageIsUsefulButton));
        showFormSuccess();
      });

      $element.find('form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: $(this).attr('action'),
          dataType: "json",
          data: $(this).serialize(),
          //beforeSend: view.disableSubmitFeedbackButton //fixme
        }).done(function (xhr) {
          console.log('ajax success', xhr);
          trackEvent(getTrackEventParams($(this)));
          showFormSuccess(xhr.message);
          // FIXME need to actually hide the form/show the prompt here as well
          setInitialAriaAttributes();
          that.$activeForm.toggleClass('js-hidden');
        }).fail(function (xhr) {
          console.log('ajax fail', JSON.stringify(xhr))
          //showError(xhr); //FIXME this is needed but currently causing a test to fail
        });
      });

      function setInitialAriaAttributes () {
        that.$forms.attr('aria-hidden', true);
        that.$pageIsNotUsefulButton.attr('aria-expanded', false);
        that.$somethingIsWrongButton.attr('aria-expanded', false);
      }

      function updateAriaAttributes (linkClicked) {
        linkClicked.attr('aria-expanded', true);
        $('#' + linkClicked.attr('aria-controls')).attr('aria-hidden', false);
      }

      function toggleForm (formId) {
        that.$activeForm = $element.find('#' + formId);
        that.$activeForm.toggleClass('js-hidden');
        that.$prompt.toggleClass('js-hidden');

        var formIsVisible = !that.$activeForm.hasClass('js-hidden');

        //that.updateAriaAttributes(formIsVisible);

        if (formIsVisible) {
          that.$activeForm.find('.gem-c-feedback__form-field').first().focus();
        } else {
          that.$activeForm = false;
        }
        //FIXME what is focussed when you close the form?
      }

      function getTrackEventParams ($node) {
        return {
          category: $node.data('track-category'),
          action: $node.data('track-action')
        }
      }

      function trackEvent (trackEventParams) {
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action);
        }
      }

      function clearMessages () {
        $element.find('.js-errors').html('').addClass('js-hidden');
        $element.find('.js-success').html('');
      }

      function showError (error) {
        var error = typeof(error.responseJSON.message) == 'undefined' ? "Sorry, but an error occurred." : error.responseJSON.message;
        var $errors = that.$activeForm.find('.js-errors');
        $errors.html(error).removeClass('js-hidden').focus();
      }

      function clearAllInputs () {
        that.$fields.val('');
      }

      function showFormSuccess () {
        that.$prompt.html('<span id="feedback-success-message">Thanks for your feedback.</span>');
        that.$prompt.attr('aria-labelledby', 'feedback-success-message');
        that.$prompt.removeClass('js-hidden');
        that.$prompt.focus();
      }
    }

  };
})(window.GOVUK.Modules);
