/* global XMLHttpRequest, FormData */
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.Feedback = function () {
    this.start = function ($element) {
      this.element = $element[0]
      this.somethingIsWrongForm = this.element.querySelector('#something-is-wrong')
      this.surveyForm = this.element.querySelector('#page-is-not-useful')
      this.prompt = this.element.querySelector('.js-prompt')
      this.forms = this.element.querySelectorAll('.js-feedback-form')
      this.toggleForms = this.element.querySelectorAll('.js-toggle-form')
      this.closeForms = this.element.querySelectorAll('.js-close-form')
      this.activeForm = false
      this.pageIsUsefulButton = this.element.querySelector('.js-page-is-useful')
      this.pageIsNotUsefulButton = this.element.querySelector('.js-page-is-not-useful')
      this.somethingIsWrongButton = this.element.querySelector('.js-something-is-wrong')
      this.promptQuestions = this.element.querySelectorAll('.js-prompt-questions')
      this.promptSuccessMessage = this.element.querySelector('.js-prompt-success')
      this.surveyWrapper = this.element.querySelector('#survey-wrapper')

      var thisModule = this
      var jshiddenClass = 'js-hidden'

      setInitialAriaAttributes()
      setHiddenValues()

      for (var j = 0; j < this.toggleForms.length; j++) {
        this.toggleForms[j].addEventListener('click', function (e) {
          e.preventDefault()
          var el = e.target
          toggleForm(el.getAttribute('aria-controls'))
          trackEvent(getTrackEventParams(el))
          updateAriaAttributes(el)
        })
      }

      for (var i = 0; i < this.closeForms.length; i++) {
        this.closeForms[i].addEventListener('click', function (e) {
          e.preventDefault()
          var el = e.target
          var formToToggle = el.getAttribute('aria-controls')
          toggleForm(formToToggle)
          trackEvent(getTrackEventParams(el))
          setInitialAriaAttributes()
          revealInitialPrompt()
          var refocusClass = '.js-' + formToToggle
          thisModule.element.querySelector(refocusClass).focus()
        })
      }

      this.pageIsUsefulButton.addEventListener('click', function (e) {
        e.preventDefault()
        trackEvent(getTrackEventParams(thisModule.pageIsUsefulButton))
        showFormSuccess()
        revealInitialPrompt()
      })

      this.pageIsNotUsefulButton.addEventListener('click', function (e) {
        var gaClientId
        var dummyGaClientId = '111111111.1111111111'
        if (window.GOVUK.cookie('_ga') === null || window.GOVUK.cookie('_ga') === '') {
          gaClientId = dummyGaClientId
        } else {
          gaClientId = window.GOVUK.cookie('_ga').split('.').slice(-2).join('.')
        }
        setHiddenValuesNotUsefulForm(gaClientId)
      })

      // much of the JS needed to support sending the form contents via this script is
      // unsupported by IE, even IE11. This check causes IE to not intercept form submits
      // and let them happen normally, which is handled already by the backend
      if (typeof window.URLSearchParams === 'function') {
        for (var f = 0; f < this.forms.length; f++) {
          this.forms[f].addEventListener('submit', function (e) {
            e.preventDefault()
            var $form = e.target
            var xhr = new XMLHttpRequest()
            var url = $form.getAttribute('action')
            var params = new FormData($form)
            params = new URLSearchParams(params).toString()

            xhr.open('POST', url, true)
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                trackEvent(getTrackEventParams($form))
                showFormSuccess(xhr.message)
                revealInitialPrompt()
                setInitialAriaAttributes()
                thisModule.activeForm.classList.toggle(jshiddenClass)
              } else {
                showError(xhr)
                enableSubmitFormButton($form)
              }
            }

            disableSubmitFormButton($form)
            xhr.send(params)
          })
        }
      }

      function disableSubmitFormButton ($form) {
        var formButton = $form.querySelector('[type="submit"]')
        formButton.setAttribute('disabled', true)
      }

      function enableSubmitFormButton ($form) {
        var formButton = $form.querySelector('[type="submit"]')
        formButton.removeAttribute('disabled')
      }

      function setInitialAriaAttributes () {
        for (var i = 0; i < thisModule.forms.length; i++) {
          thisModule.forms[i].setAttribute('aria-hidden', true)
        }
        thisModule.pageIsNotUsefulButton.setAttribute('aria-expanded', false)
        thisModule.somethingIsWrongButton.setAttribute('aria-expanded', false)
      }

      function setHiddenValues () {
        var javascriptEnabled = document.createElement('input')
        javascriptEnabled.setAttribute('type', 'hidden')
        javascriptEnabled.setAttribute('name', 'javascript_enabled')
        javascriptEnabled.setAttribute('value', true)
        thisModule.somethingIsWrongForm.appendChild(javascriptEnabled)

        var referrer = document.createElement('input')
        referrer.setAttribute('type', 'hidden')
        referrer.setAttribute('name', 'referrer')
        referrer.setAttribute('value', document.referrer || 'unknown')
        thisModule.somethingIsWrongForm.appendChild(referrer)
        thisModule.somethingIsWrongForm.invalidInfoError = [
          '<h2>Sorry, we’re unable to send your message as you haven’t given us any information.</h2>',
          ' <p>Please tell us what you were doing or what went wrong</p>'
        ].join('')
      }

      function setHiddenValuesNotUsefulForm (gaClientId) {
        var currentPathName = window.location.pathname.replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
        var finalPathName = encodeURI(currentPathName)
        thisModule.surveyForm.invalidInfoError = [
          '<h2>Sorry, we’re unable to send your message as you haven’t given us a valid email address.</h2>',
          ' <p>Enter an email address in the correct format, like name@example.com</p>'
        ].join('')
        if (document.querySelectorAll('[name="email_survey_signup[ga_client_id]"]').length === 0) {
          var hiddenInput = document.createElement('input')
          hiddenInput.setAttribute('type', 'hidden')
          hiddenInput.setAttribute('name', 'email_survey_signup[ga_client_id]')
          hiddenInput.setAttribute('value', gaClientId || '0')
          thisModule.surveyForm.appendChild(hiddenInput)
        }

        if (document.querySelectorAll('.gem-c-feedback__email-link#take-survey').length === 0) {
          var takeSurvey = document.createElement('a')
          takeSurvey.setAttribute('href', 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + finalPathName + '&amp;gcl=' + gaClientId)
          takeSurvey.setAttribute('class', 'gem-c-feedback__email-link govuk-link')
          takeSurvey.setAttribute('id', 'take-survey')
          takeSurvey.setAttribute('target', '_blank')
          takeSurvey.setAttribute('rel', 'noopener noreferrer')
          takeSurvey.innerHTML = 'Don’t have an email address?'
          thisModule.surveyWrapper.appendChild(takeSurvey)
        }
      }

      function updateAriaAttributes (linkClicked) {
        linkClicked.setAttribute('aria-expanded', true)
        var controls = linkClicked.getAttribute('aria-controls')
        var ariaControls = document.querySelector('#' + controls)
        ariaControls.setAttribute('aria-hidden', false)
      }

      function toggleForm (formId) {
        thisModule.activeForm = thisModule.element.querySelector('#' + formId)
        thisModule.activeForm.classList.toggle(jshiddenClass)
        thisModule.prompt.classList.toggle(jshiddenClass)

        var formIsVisible = !thisModule.activeForm.classList.contains(jshiddenClass)

        if (formIsVisible) {
          thisModule.activeForm.querySelector('.gem-c-input').focus()
        } else {
          thisModule.activeForm = false
        }
      }

      function getTrackEventParams ($node) {
        return {
          category: $node.getAttribute('data-track-category'),
          action: $node.getAttribute('data-track-action')
        }
      }

      function trackEvent (trackEventParams) {
        if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
          window.GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action)
        }
      }

      function showError (error) {
        var genericError = [
          '<h2>Sorry, we’re unable to receive your message right now.</h2>',
          ' <p>If the problem persists, we have other ways for you to provide',
          ' feedback on the <a href="/contact/govuk">contact page</a>.</p>'
        ].join('')
        // if the response is not a 404 or 500, show the error message if it exists
        // otherwise show the generic message
        if ('response' in error) {
          if (typeof error.response === 'object' && error.response !== null) {
            error = error.response.message === 'email survey sign up failure' ? genericError : error.response.message
          } else {
            error = genericError
          }
        } else if (error.status === 422) {
          // there's clobbering by nginx on all 422 requests, which is why the response returns a rendered html page instead of the expected JSON
          // this is a temporary workaround to ensure that we are displaying relevant error messages to the users
          error = thisModule.activeForm.invalidInfoError || genericError
        } else {
          error = genericError
        }
        var $errors = thisModule.activeForm.querySelector('.js-errors')
        $errors.innerHTML = error
        $errors.classList.remove(jshiddenClass)
        $errors.focus()
      }

      function showFormSuccess () {
        for (var i = 0; i < thisModule.promptQuestions.length; i++) {
          thisModule.promptQuestions[i].classList.add(jshiddenClass)
        }
        thisModule.promptSuccessMessage.classList.remove(jshiddenClass)
        thisModule.promptSuccessMessage.focus()
      }

      function revealInitialPrompt () {
        thisModule.prompt.classList.remove(jshiddenClass)
        thisModule.prompt.focus()
      }
    }
  }
})(window.GOVUK.Modules)
