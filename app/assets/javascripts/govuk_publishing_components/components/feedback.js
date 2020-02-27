/* eslint-env jquery */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.Feedback = function () {
    this.start = function ($element) {
      this.$prompt = $element.find('.js-prompt')
      this.$fields = $element.find('.gem-c-feedback__form-field')
      this.$forms = $element.find('.js-feedback-form')
      this.$toggleForms = $element.find('.js-toggle-form')
      this.$closeForms = $element.find('.js-close-form')
      this.$activeForm = false
      this.$pageIsUsefulButton = $element.find('.js-page-is-useful')
      this.$pageIsNotUsefulButton = $element.find('.js-page-is-not-useful')
      this.$somethingIsWrongButton = $element.find('.js-something-is-wrong')
      this.$promptQuestions = $element.find('.js-prompt-questions')
      this.$promptSuccessMessage = $element.find('.js-prompt-success')
      this.$somethingIsWrongForm = $element.find('#something-is-wrong')
      this.$surveyForm = $element.find('#page-is-not-useful')
      this.$surveyWrapper = $element.find('#survey-wrapper')

      var that = this
      var jshiddenClass = 'js-hidden'

      setInitialAriaAttributes()
      setHiddenValues()

      this.$toggleForms.on('click', function (e) {
        e.preventDefault()
        toggleForm($(e.target).attr('aria-controls'))
        trackEvent(getTrackEventParams($(this)))
        updateAriaAttributes($(this))
      })

      this.$closeForms.on('click', function (e) {
        e.preventDefault()
        toggleForm($(e.target).attr('aria-controls'))
        trackEvent(getTrackEventParams($(this)))
        setInitialAriaAttributes()
        revealInitialPrompt()
        var refocusClass = '.js-' + $(e.target).attr('aria-controls')
        $element.find(refocusClass).focus()
      })

      this.$pageIsUsefulButton.on('click', function (e) {
        e.preventDefault()
        trackEvent(getTrackEventParams(that.$pageIsUsefulButton))
        showFormSuccess()
        revealInitialPrompt()
      })

      this.$pageIsNotUsefulButton.on('click', function (e) {
        var gaClientId
        var dummyGaClientId = '111111111.1111111111'
        if (window.GOVUK.cookie('_ga') === null || window.GOVUK.cookie('_ga') === '') {
          gaClientId = dummyGaClientId
        } else {
          gaClientId = window.GOVUK.cookie('_ga').split('.').slice(-2).join('.')
        }
        setHiddenValuesNotUsefulForm(gaClientId)
      })

      $element.find('form').on('submit', function (e) {
        e.preventDefault()
        var $form = $(this)
        $.ajax({
          type: 'POST',
          url: $form.attr('action'),
          dataType: 'json',
          data: $form.serialize(),
          beforeSend: disableSubmitFormButton($form),
          timeout: 6000
        }).done(function (xhr) {
          trackEvent(getTrackEventParams($form))
          showFormSuccess(xhr.message)
          revealInitialPrompt()
          setInitialAriaAttributes()
          that.$activeForm.toggleClass(jshiddenClass)
        }).fail(function (xhr) {
          showError(xhr)
          enableSubmitFormButton($form)
        })
      })

      function disableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').prop('disabled', true)
      }

      function enableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').removeAttr('disabled')
      }

      function setInitialAriaAttributes () {
        that.$forms.attr('aria-hidden', true)
        that.$pageIsNotUsefulButton.attr('aria-expanded', false)
        that.$somethingIsWrongButton.attr('aria-expanded', false)
      }

      function setHiddenValues () {
        that.$somethingIsWrongForm.append('<input type="hidden" name="javascript_enabled" value="true"/>')
        that.$somethingIsWrongForm.append($('<input type="hidden" name="referrer">').val(document.referrer || 'unknown'))
      }

      function setHiddenValuesNotUsefulForm (gaClientId) {
        var currentPathName = window.location.pathname.replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
        var finalPathName = encodeURI(currentPathName)

        if (document.querySelectorAll('[name="email_survey_signup[ga_client_id]"]').length === 0) {
          that.$surveyForm.append($('<input name="email_survey_signup[ga_client_id]" type="hidden">').val(gaClientId || '0'))
        }

        if (document.querySelectorAll('.gem-c-feedback__email-link#take-survey').length === 0) {
          that.$surveyWrapper.append('<a href="https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + finalPathName + '&amp;gcl=' + gaClientId + '" class="gem-c-feedback__email-link govuk-link" id="take-survey" target="_blank" rel="noopener noreferrer">Don’t have an email address?</a>')
        }
      }

      function updateAriaAttributes (linkClicked) {
        linkClicked.attr('aria-expanded', true)
        $('#' + linkClicked.attr('aria-controls')).attr('aria-hidden', false)
      }

      function toggleForm (formId) {
        that.$activeForm = $element.find('#' + formId)
        that.$activeForm.toggleClass(jshiddenClass)
        that.$prompt.toggleClass(jshiddenClass)

        var formIsVisible = !that.$activeForm.hasClass(jshiddenClass)

        if (formIsVisible) {
          that.$activeForm.find('.gem-c-input').first().focus()
        } else {
          that.$activeForm = false
        }
      }

      function getTrackEventParams ($node) {
        return {
          category: $node.data('track-category'),
          action: $node.data('track-action')
        }
      }

      function trackEvent (trackEventParams) {
        if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
          window.GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action)
        }
      }

      function showError (error) {
        var genericError = [
          '<h2>',
          '  Sorry, we’re unable to receive your message right now. ',
          '</h2>',
          '<p>If the problem persists, we have other ways for you to provide',
          ' feedback on the <a href="/contact/govuk">contact page</a>.</p>'
        ].join('')

        // if the response is not a 404 or 500, show the error message if it exists
        // otherwise show the generic message
        // this covers the 422 status the feedback application return for empty fields
        // for all other, show generic error
        if (typeof (error.responseJSON) !== 'undefined') {
          error = typeof (error.responseJSON.message) === 'undefined' ? genericError : error.responseJSON.message

          if (error === 'email survey sign up failure') {
            error = genericError
          }
        } else {
          error = genericError
        }
        var $errors = that.$activeForm.find('.js-errors')
        $errors.html(error).removeClass(jshiddenClass).focus()
      }

      function showFormSuccess () {
        that.$promptQuestions.addClass(jshiddenClass)
        that.$promptSuccessMessage.removeClass(jshiddenClass).focus()
      }

      function revealInitialPrompt () {
        that.$prompt.removeClass(jshiddenClass)
        that.$prompt.focus()
      }
    }
  }
})(window.GOVUK.Modules)
