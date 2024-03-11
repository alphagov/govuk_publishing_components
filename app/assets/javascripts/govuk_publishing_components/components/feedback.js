/* global XMLHttpRequest, FormData */
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Feedback ($module) {
    this.$module = $module
    this.somethingIsWrongForm = this.$module.querySelector('#something-is-wrong')
    this.surveyForm = this.$module.querySelector('#page-is-not-useful')
    this.prompt = this.$module.querySelector('.js-prompt')
    this.forms = this.$module.querySelectorAll('.js-feedback-form')
    this.toggleForms = this.$module.querySelectorAll('.js-toggle-form')
    this.activeForm = false
    this.pageIsUsefulButton = this.$module.querySelector('.js-page-is-useful')
    this.pageIsNotUsefulButton = this.$module.querySelector('.js-page-is-not-useful')
    this.somethingIsWrongButton = this.$module.querySelector('.js-something-is-wrong')
    this.promptQuestions = this.$module.querySelectorAll('.js-prompt-questions')
    this.promptSuccessMessage = this.$module.querySelector('.js-prompt-success')
    this.surveyWrapper = this.$module.querySelector('#survey-wrapper')
    this.jshiddenClass = 'js-hidden'
    this.whatDoingInput = this.$module.querySelector('[name=what_doing]')
    this.whatWrongInput = this.$module.querySelector('[name=what_wrong]')
    this.pageIsUsefulHeading = this.$module.querySelector('.js-prompt-question')
    this.pageIsUsefulYesButton = this.$module.querySelector('.js-page-is-useful')
    this.pageIsUsefulNoButton = this.$module.querySelector('.js-page-is-not-useful')
    this.feedbackPrompt = this.$module.querySelector('.gem-c-feedback__prompt-content')
    this.feedbackTrackingData = this.initialiseFeedbackTrackingData()
  }

  Feedback.prototype.init = function () {
    this.setInitialAriaAttributes()
    this.setHiddenValues()

    this.prompt.hidden = false
    for (var k = 0; k < this.promptQuestions.length; k++) {
      this.promptQuestions[k].hidden = false
    }
    this.surveyForm.hidden = true

    for (var j = 0; j < this.toggleForms.length; j++) {
      this.toggleForms[j].addEventListener('click', function (e) {
        e.preventDefault()
        var el = e.target.closest('button')
        this.toggleForm(el.getAttribute('aria-controls'), el)
        this.trackEvent(this.getTrackEventParams(el))
        this.updateAriaAttributes(el)

        // if closing the form, shift focus back to the button that controls it
        if(!this.activeForm) {
          var formToToggle = el.getAttribute('aria-controls')
          var refocusClass = '.js-' + formToToggle
          this.$module.querySelector(refocusClass).focus()
        }
      }.bind(this))
    }

    this.pageIsUsefulButton.addEventListener('click', function (e) {
      e.preventDefault()
      this.trackEvent(this.getTrackEventParams(this.pageIsUsefulButton))
      this.showFormSuccess()
      this.revealInitialPrompt()
    }.bind(this))

    this.pageIsNotUsefulButton.addEventListener('click', function (e) {
      var gaClientId
      var dummyGaClientId = '111111111.1111111111'
      if (window.GOVUK.cookie('_ga') === null || window.GOVUK.cookie('_ga') === '') {
        gaClientId = dummyGaClientId
      } else {
        gaClientId = window.GOVUK.cookie('_ga').split('.').slice(-2).join('.')
      }
      this.setHiddenValuesNotUsefulForm(gaClientId)
    }.bind(this))

    this.somethingIsWrongButton.addEventListener('click', function (e) {
      this.timerInterval = setInterval(function () {
        this.timer = this.timer + 1
        this.timerHoneyPot.setAttribute('value', this.timer)
      }.bind(this), 1000)
    }.bind(this))

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

          this.done = function () {
            if (xhr.status === 200) {
              this.trackEvent(this.getTrackEventParams($form))
              this.showFormSuccess(xhr.message)
              this.revealInitialPrompt()
              this.setInitialAriaAttributes()
              this.activeForm.hidden = true
              clearInterval(this.timerInterval)
            } else {
              this.showError(xhr)
              this.enableSubmitFormButton($form)
            }
          }.bind(this)

          xhr.addEventListener('loadend', this.done)
          xhr.open('POST', url, true)
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

          this.disableSubmitFormButton($form)
          xhr.send(params)
        }.bind(this))
      }
    }
  }

  Feedback.prototype.disableSubmitFormButton = function ($form) {
    var formButton = $form.querySelector('[type="submit"]')
    formButton.setAttribute('disabled', true)
  }

  Feedback.prototype.enableSubmitFormButton = function ($form) {
    var formButton = $form.querySelector('[type="submit"]')
    formButton.removeAttribute('disabled')
  }

  Feedback.prototype.setInitialAriaAttributes = function () {
    this.pageIsNotUsefulButton.setAttribute('aria-expanded', false)
    this.somethingIsWrongButton.setAttribute('aria-expanded', false)
  }

  Feedback.prototype.setHiddenValues = function () {
    var javascriptEnabled = document.createElement('input')
    javascriptEnabled.setAttribute('type', 'hidden')
    javascriptEnabled.setAttribute('name', 'javascript_enabled')
    javascriptEnabled.setAttribute('value', true)
    this.somethingIsWrongForm.appendChild(javascriptEnabled)

    var referrer = document.createElement('input')
    referrer.setAttribute('type', 'hidden')
    referrer.setAttribute('name', 'referrer')
    referrer.setAttribute('value', document.referrer || 'unknown')
    this.somethingIsWrongForm.appendChild(referrer)
    this.somethingIsWrongForm.invalidInfoError = [
      '<h2>Sorry, we’re unable to send your message as you haven’t given us any information.</h2>',
      ' <p>Please tell us what you were doing or what went wrong</p>'
    ].join('')

    this.timer = 0

    this.timerHoneyPot = document.createElement('input')
    this.timerHoneyPot.setAttribute('type', 'hidden')
    this.timerHoneyPot.setAttribute('name', 'timer')
    this.timerHoneyPot.setAttribute('value', this.timer)
    this.somethingIsWrongForm.appendChild(this.timerHoneyPot)
  }

  Feedback.prototype.setHiddenValuesNotUsefulForm = function (gaClientId) {
    var currentPathName = window.location.pathname.replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
    var finalPathName = encodeURI(currentPathName)
    this.surveyForm.invalidInfoError = [
      '<h2>Sorry, we’re unable to send your message as you haven’t given us a valid email address.</h2>',
      ' <p>Enter an email address in the correct format, like name@example.com</p>'
    ].join('')
    if (document.querySelectorAll('[name="email_survey_signup[ga_client_id]"]').length === 0) {
      var hiddenInput = document.createElement('input')
      hiddenInput.setAttribute('type', 'hidden')
      hiddenInput.setAttribute('name', 'email_survey_signup[ga_client_id]')
      hiddenInput.setAttribute('value', gaClientId || '0')
      this.surveyForm.appendChild(hiddenInput)
    }

    if (document.querySelectorAll('.gem-c-feedback__email-link#take-survey').length === 0) {
      var takeSurvey = document.createElement('a')
      takeSurvey.setAttribute('href', 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + finalPathName + '&amp;gcl=' + gaClientId)
      takeSurvey.setAttribute('class', 'gem-c-feedback__email-link govuk-link')
      takeSurvey.setAttribute('id', 'take-survey')
      takeSurvey.setAttribute('target', '_blank')
      takeSurvey.setAttribute('rel', 'noopener noreferrer')
      takeSurvey.innerHTML = 'Don’t have an email address?'
      this.surveyWrapper.appendChild(takeSurvey)
    }
  }

  Feedback.prototype.updateAriaAttributes = function (linkClicked) {
    this.ariaExpanded = linkClicked.getAttribute('aria-expanded')

    if(this.ariaExpanded === 'false') {
      linkClicked.setAttribute('aria-expanded', true)
    }
    else {
      linkClicked.setAttribute('aria-expanded', false)
    }
  }

  Feedback.prototype.toggleForm = function (formId, el) {
    this.activeForm = this.$module.querySelector('#' + formId)
    this.activeForm.hidden ? this.activeForm.hidden = false : this.activeForm.hidden = true

    if (!this.activeForm.hidden) {
      var elementsToHide = [this.promptQuestions[1], this.pageIsUsefulHeading, this.pageIsUsefulYesButton]

      el.querySelector('.js-prompt-button-text').textContent = el.dataset.feedbackCloseTranslation
      this.hidePrompts(el, elementsToHide)
      this.toggleFeedbackTrackingDataAttributes(el)
      this.activeForm.querySelectorAll('.gem-c-textarea .govuk-textarea, .gem-c-input.govuk-input')[0]
        .focus()
    } else {
      var buttonText = this.isSomethingIsWrongButton(el) ? el.dataset.feedbackSomethingWrongTranslation : el.dataset.feedbackNoTranslation
      var elementsToShow = [this.promptQuestions[0], this.promptQuestions[1], this.pageIsUsefulHeading, this.pageIsUsefulYesButton]
      
      el.querySelector('.js-prompt-button-text').textContent = buttonText
      this.showPrompts(elementsToShow)
      this.toggleFeedbackTrackingDataAttributes(el)
      this.activeForm = false
      clearInterval(this.timerInterval)
    }
  }

  Feedback.prototype.hidePrompts = function(el, elementsToHide) {
    this.feedbackPrompt.classList.add('js-prompt-content')

    if(this.isSomethingIsWrongButton(el)) {
      this.promptQuestions[0].setAttribute('hidden', true)
      this.somethingIsWrongButton.parentElement.classList.add('js-no-border-top')
    }
    else if (this.isPageIsNotUsefulButton(el)) {
      for(var i = 0; i < elementsToHide.length; i++) {
        elementsToHide[i].setAttribute('hidden', true)
      }
      this.toggleStyling(true)
    }
  }

  Feedback.prototype.showPrompts = function(elementsToShow) {
    this.feedbackPrompt.classList.remove('js-prompt-content')

    for(var i = 0; i < elementsToShow.length; i++) {
      elementsToShow[i].removeAttribute('hidden')
    }
    
    this.toggleStyling(false)
  }

  Feedback.prototype.toggleStyling = function(addStyling) {
    if(addStyling) {
      this.pageIsUsefulNoButton.parentElement.classList.add('govuk-!-margin-0')
      this.pageIsUsefulNoButton.parentElement.classList.add('govuk-!-width-full')
    }
    else {
      this.somethingIsWrongButton.parentElement.classList.remove('js-no-border-top')
      this.pageIsUsefulNoButton.parentElement.classList.remove('govuk-!-margin-0')
      this.pageIsUsefulNoButton.parentElement.classList.remove('govuk-!-width-full')
    }
  }

  Feedback.prototype.isSomethingIsWrongButton = function(el) {
    return el.classList.contains('js-something-is-wrong')
  }

  Feedback.prototype.isPageIsNotUsefulButton = function(el) {
    return el.classList.contains('js-page-is-not-useful')
  }

  Feedback.prototype.toggleFeedbackTrackingDataAttributes = function(el) {
    this.clearFeedbackTrackingDataAttributes(el)
    var data;

    if(this.isSomethingIsWrongButton(el)) {
      data = this.feedbackTrackingData.somethingWrongTrackingData
    }
    else if(this.isPageIsNotUsefulButton(el)) {
      data = this.feedbackTrackingData.pageIsNotUsefulTrackingData
    }

    this.setFeedbackTrackingDataAttributes(el, data)
  }

  Feedback.prototype.clearFeedbackTrackingDataAttributes = function(el) {
    if(el) {
      for(var prop in el.dataset){
        delete el.dataset[prop]
      }
    }
  }

  Feedback.prototype.setFeedbackTrackingDataAttributes = function(el, data){
    if(el && data) {
      var data = !this.activeForm.hidden ? data.collapsedDataAttributes : data.expandedDataAttributes
      for(var prop in data) {
        el.dataset[prop] = data[prop]
      }
    }
  }

  Feedback.prototype.initialiseFeedbackTrackingData = function() {
    var initialSomethingWrongTrackingData = this.somethingIsWrongButton.dataset
    var initialPageIsNotUsefulTrackingData = this.pageIsNotUsefulButton.dataset

    return {
      somethingWrongTrackingData: {
        // Convert expandedDataAttributes from a DOMStringMap to an object. This makes it easier to toggle the data attributes.
        expandedDataAttributes: window.GOVUK.extendObject({}, initialSomethingWrongTrackingData),
        collapsedDataAttributes: {
          trackCategory: "Onsite Feedback",
          trackAction: "GOV.UK Close Form",
          feedbackSomethingWrongTranslation: initialSomethingWrongTrackingData.feedbackSomethingWrongTranslation,
          feedbackCloseTranslation: initialSomethingWrongTrackingData.feedbackCloseTranslation
        }
      },
      pageIsNotUsefulTrackingData: {
        // Convert expandedDataAttributes from a DOMStringMap to an object. This makes it easier to toggle the data attributes.
        expandedDataAttributes: window.GOVUK.extendObject({}, initialPageIsNotUsefulTrackingData),
        collapsedDataAttributes: {
          trackCategory: "yesNoFeedbackForm",
          trackAction: "ffFormClose",
          feedbackNoTranslation: initialPageIsNotUsefulTrackingData.feedbackNoTranslation,
          feedbackCloseTranslation: initialPageIsNotUsefulTrackingData.feedbackCloseTranslation
        }
      }
    }
  }

  Feedback.prototype.getTrackEventParams = function ($node) {
    return {
      category: $node.getAttribute('data-track-category'),
      action: $node.getAttribute('data-track-action')
    }
  }

  Feedback.prototype.trackEvent = function (trackEventParams) {
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action)
    }
  }

  Feedback.prototype.showError = function (error) {
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
      error = this.activeForm.invalidInfoError || genericError
    } else {
      error = genericError
    }
    var $errors = this.activeForm.querySelector('.js-errors')
    $errors.innerHTML = error
    $errors.hidden = false
    $errors.focus()
  }

  Feedback.prototype.showFormSuccess = function () {
    for (var i = 0; i < this.promptQuestions.length; i++) {
      this.promptQuestions[i].hidden = true
    }
    this.promptSuccessMessage.hidden = false
    this.promptSuccessMessage.focus()
  }

  Feedback.prototype.revealInitialPrompt = function () {
    this.prompt.hidden = false
    this.prompt.focus()
  }

  Modules.Feedback = Feedback
})(window.GOVUK.Modules)
