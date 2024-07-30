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
    this.closeForms = this.$module.querySelectorAll('.js-close-form')
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
  }

  Feedback.prototype.init = function () {
    this.setInitialAriaAttributes()
    this.setHiddenValues()
    this.setSurveyPath()
    this.prompt.hidden = false
    for (var k = 0; k < this.promptQuestions.length; k++) {
      this.promptQuestions[k].hidden = false
    }
    this.surveyForm.hidden = true

    for (var j = 0; j < this.toggleForms.length; j++) {
      this.toggleForms[j].addEventListener('click', function (e) {
        e.preventDefault()
        var el = e.target.closest('button')
        this.toggleForm(el.getAttribute('aria-controls'))
        this.updateAriaAttributes(el)
      }.bind(this))
    }

    for (var i = 0; i < this.closeForms.length; i++) {
      this.closeForms[i].hidden = false
      this.closeForms[i].addEventListener('click', function (e) {
        e.preventDefault()
        var el = e.target
        var formToToggle = el.getAttribute('aria-controls')
        this.toggleForm(formToToggle)
        this.setInitialAriaAttributes()
        this.revealInitialPrompt()
        var refocusClass = '.js-' + formToToggle
        this.$module.querySelector(refocusClass).focus()
      }.bind(this))
    }

    this.pageIsUsefulButton.addEventListener('click', function (e) {
      e.preventDefault()
      this.showFormSuccess()
      this.revealInitialPrompt()
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

  // This getter is needed for spyOn in tests
  Feedback.prototype.getPagePath = function () {
    return window.location.pathname
  }

  Feedback.prototype.setSurveyPath = function () {
    var surveyLink = this.$module.querySelector('#survey_explanation a')

    if (surveyLink) {
      var pathWithoutEmailPII = this.getPagePath().replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
      var encodedPath = encodeURI(pathWithoutEmailPII)
      surveyLink.setAttribute('href', 'https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=' + encodedPath)
    }
  }

  Feedback.prototype.updateAriaAttributes = function (linkClicked) {
    linkClicked.setAttribute('aria-expanded', true)
  }

  Feedback.prototype.toggleForm = function (formId) {
    this.activeForm = this.$module.querySelector('#' + formId)
    this.activeForm.hidden ? this.activeForm.hidden = false : this.activeForm.hidden = true
    this.prompt.hidden ? this.prompt.hidden = false : this.prompt.hidden = true

    if (!this.activeForm.hidden) {
      var input = this.activeForm.querySelectorAll('.gem-c-textarea .govuk-textarea, .gem-c-input.govuk-input')
      if (input.length > 0) {
        input[0].focus()
      }
    } else {
      this.activeForm = false
      clearInterval(this.timerInterval)
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
