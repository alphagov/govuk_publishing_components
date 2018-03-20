window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  Modules.Feedback = function () {

    this.start = function ($element) {
      this.$prompt = $element.find('.js-prompt');
      this.$fields = $element.find('.gem-c-feedback__form-field');
      this.$forms = $element.find('.js-feedback-form');
      this.$toggleForms = $element.find('.js-toggle-form');
      this.$closeForms = $element.find('.js-close-form');
      this.$activeForm = false;
      this.$pageIsUsefulButton = $element.find('.js-page-is-useful');
      this.$pageIsNotUsefulButton = $element.find('.js-page-is-not-useful');
      this.$somethingIsWrongButton = $element.find('.js-something-is-wrong');
      this.$promptQuestions = $element.find('.js-prompt-questions');
      this.$promptSuccessMessage = $element.find('.js-prompt-success');
      this.$somethingIsWrongForm = $element.find('#something-is-wrong');

      var that = this;
      var jshiddenClass = 'js-hidden';

      setInitialAriaAttributes();
      setHiddenValues();

      this.$toggleForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        trackEvent(getTrackEventParams($(this)));
        updateAriaAttributes($(this));
      });

      this.$closeForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        trackEvent(getTrackEventParams($(this)));
        setInitialAriaAttributes();
        revealInitialPrompt();
      });

      this.$pageIsUsefulButton.on('click', function(e) {
        e.preventDefault();
        trackEvent(getTrackEventParams(that.$pageIsUsefulButton));
        showFormSuccess();
        revealInitialPrompt();
      });

      $element.find('form').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        $.ajax({
          type: "POST",
          url: $form.attr('action'),
          dataType: "json",
          data: $form.serialize(),
          beforeSend: disableSubmitFormButton($form),
          timeout: 6000
        }).done(function (xhr) {
          trackEvent(getTrackEventParams($form));
          showFormSuccess(xhr.message);
          revealInitialPrompt();
          setInitialAriaAttributes();
          that.$activeForm.toggleClass(jshiddenClass);
        }).fail(function (xhr) {
          showError(xhr);
          enableSubmitFormButton($form);
        });
      });

      function disableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').prop('disabled', true);
      }

      function enableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').removeAttr('disabled');
      }

      function setInitialAriaAttributes () {
        that.$forms.attr('aria-hidden', true);
        that.$pageIsNotUsefulButton.attr('aria-expanded', false);
        that.$somethingIsWrongButton.attr('aria-expanded', false);
      }

      function setHiddenValues () {
        that.$somethingIsWrongForm.append('<input type="hidden" name="javascript_enabled" value="true"/>');
        that.$somethingIsWrongForm.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"));
      }

      function updateAriaAttributes (linkClicked) {
        linkClicked.attr('aria-expanded', true);
        $('#' + linkClicked.attr('aria-controls')).attr('aria-hidden', false);
      }

      function toggleForm (formId) {
        that.$activeForm = $element.find('#' + formId);
        that.$activeForm.toggleClass(jshiddenClass);
        that.$prompt.toggleClass(jshiddenClass);

        var formIsVisible = !that.$activeForm.hasClass(jshiddenClass);

        if (formIsVisible) {
          that.$activeForm.find('.gem-c-input').first().focus();
        } else {
          that.$activeForm = false;
        }
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

      function showError (error) {
        var error = [
          '<h2 class="gem-c-feedback__heading">',
          '  Sorry, we’re unable to receive your message right now. ',
          '</h2>',
          '<p>If the problem persists, we have other ways for you to provide',
          ' feedback on the <a href="/contact/govuk">contact page</a>.</p>'
        ].join('');

        if (typeof(error.responseJSON) !== 'undefined') {
          error = typeof(error.responseJSON.message) == 'undefined' ? error : error.responseJSON.message;
        }
        var $errors = that.$activeForm.find('.js-errors');
        $errors.html(error).removeClass(jshiddenClass).focus();
      }

      function showFormSuccess () {
        that.$promptQuestions.addClass(jshiddenClass);
        that.$promptSuccessMessage.removeClass(jshiddenClass).focus();
      }

      function revealInitialPrompt () {
        that.$prompt.removeClass(jshiddenClass);
        that.$prompt.focus();
      }
    }

  };
})(window.GOVUK.Modules);
