/* global XMLHttpRequest, FormData */

((Modules) => {
  class Feedback {
    constructor($module) {
      this.$module = $module
      this.somethingIsWrongForm = this.$module.querySelector('#something-is-wrong')
      this.surveyForm = this.$module.querySelector('#page-is-not-useful')
      this.prompt = this.$module.querySelector('.js-prompt')
      this.forms = this.$module.querySelectorAll('.js-feedback-form')
      this.toggleForms = this.$module.querySelectorAll('.js-toggle-form')
      this.closeForms = this.$module.querySelectorAll('.js-close-form')
      this.activeForm = false
      this.pageIsUsefulButton = this.$module.querySelector('.js-page-is-useful')
      this.somethingIsWrongButton = this.$module.querySelector('.js-something-is-wrong')
      this.promptQuestions = this.$module.querySelectorAll('.js-prompt-questions')
      this.promptSuccessMessage = this.$module.querySelector('.js-prompt-success')
      this.surveyWrapper = this.$module.querySelector('#survey-wrapper')
      this.whatDoingInput = this.$module.querySelector('[name=what_doing]')
      this.whatWrongInput = this.$module.querySelector('[name=what_wrong]')

      this.timer = 0
      this.timerInterval = null
      this.timerHoneyPot = null
    }

    init() {
      this.setHiddenValues()
      this.setSurveyPath()
      this.prompt.hidden = false

      for (const question of this.promptQuestions) {
        question.hidden = false
      }

      this.surveyForm.hidden = true

      for (const toggle of this.toggleForms) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault()
          const button = e.target.closest('button')
          this.toggleForm(button.getAttribute('aria-controls'))
        })
      }

      for (const closeBtn of this.closeForms) {
        closeBtn.hidden = false
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault()
          const formToToggle = e.target.getAttribute('aria-controls')
          this.toggleForm(formToToggle)
          this.revealInitialPrompt()
          this.$module.querySelector(`.js-${formToToggle}`).focus()
        })
      }

      this.pageIsUsefulButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.showFormSuccess()
        this.revealInitialPrompt()
      })

      this.somethingIsWrongButton.addEventListener('click', () => {
        this.timerInterval = setInterval(() => {
          this.timer += 1
          this.timerHoneyPot.setAttribute('value', this.timer)
        }, 1000)
      })

      for (const form of this.forms) {
        form.addEventListener('submit', (e) => {
          e.preventDefault()
          const $form = e.target
          const xhr = new XMLHttpRequest()
          const url = $form.getAttribute('action')
          const params = new URLSearchParams(new FormData($form)).toString()

          const handleLoadEnd = () => {
            if (xhr.status === 200) {
              this.showFormSuccess(xhr.message)
              this.revealInitialPrompt()
              this.activeForm.hidden = true
              clearInterval(this.timerInterval)
            } else {
              this.showError(xhr)
              this.enableSubmitFormButton($form)
            }
          }

          xhr.addEventListener('loadend', handleLoadEnd)
          xhr.open('POST', url, true)
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

          this.disableSubmitFormButton($form)
          xhr.send(params)
        })
      }
    }

    disableSubmitFormButton($form) {
      const formButton = $form.querySelector('[type="submit"]')
      formButton.setAttribute('disabled', 'true')
    }

    enableSubmitFormButton($form) {
      const formButton = $form.querySelector('[type="submit"]')
      formButton.removeAttribute('disabled')
    }

    setHiddenValues() {
      const javascriptEnabled = document.createElement('input')
      javascriptEnabled.setAttribute('type', 'hidden')
      javascriptEnabled.setAttribute('name', 'javascript_enabled')
      javascriptEnabled.setAttribute('value', 'true')
      this.somethingIsWrongForm.appendChild(javascriptEnabled)

      const referrer = document.createElement('input')
      referrer.setAttribute('type', 'hidden')
      referrer.setAttribute('name', 'referrer')
      referrer.setAttribute('value', document.referrer || 'unknown')
      this.somethingIsWrongForm.appendChild(referrer)

      this.somethingIsWrongForm.invalidInfoError = `
        <h2>Sorry, we’re unable to send your message as you haven’t given us any information.</h2>
        <p>Please tell us what you were doing or what went wrong</p>
      `

      this.timer = 0
      this.timerHoneyPot = document.createElement('input')
      this.timerHoneyPot.setAttribute('type', 'hidden')
      this.timerHoneyPot.setAttribute('name', 'timer')
      this.timerHoneyPot.setAttribute('value', this.timer)
      this.somethingIsWrongForm.appendChild(this.timerHoneyPot)
    }

    // This getter is needed for spyOn in tests
    getPagePath() {
      return window.location.pathname
    }

    setSurveyPath() {
      const surveyLink = this.$module.querySelector('#survey_explanation a')

      if (surveyLink) {
        const pathWithoutEmailPII = this.getPagePath().replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
        const encodedPath = encodeURI(pathWithoutEmailPII)
        surveyLink.setAttribute('href', `https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=${encodedPath}`)
      }
    }

    toggleForm(formId) {
      this.activeForm = this.$module.querySelector(`#${formId}`)
      this.activeForm.hidden = !this.activeForm.hidden
      this.prompt.hidden = !this.prompt.hidden

      if (!this.activeForm.hidden) {
        const inputs = this.activeForm.querySelectorAll('.gem-c-textarea .govuk-textarea, .gem-c-input.govuk-input')
        if (inputs.length > 0) {
          inputs[0].focus()
        }
      } else {
        this.activeForm = false
        clearInterval(this.timerInterval)
      }
    }

    showError(error) {
      const genericError = `
        <h2>Sorry, we’re unable to receive your message right now.</h2>
        <p>If the problem persists, we have other ways for you to provide
        feedback on the <a href="/contact/govuk">contact page</a>.</p>
      `
      let formattedError = genericError

      if ('response' in error) {
        if (typeof error.response === 'object' && error.response !== null) {
          formattedError = error.response.message === 'email survey sign up failure'
            ? genericError
            : error.response.message
        }
      } else if (error.status === 422) {
        // there's clobbering by nginx on all 422 requests, which is why the response returns a rendered html page instead of the expected JSON
        // this is a temporary workaround to ensure that we are displaying relevant error messages to the users
        formattedError = this.activeForm.invalidInfoError || genericError
      }

      const $errors = this.activeForm.querySelector('.js-errors')
      $errors.innerHTML = formattedError
      $errors.hidden = false
      $errors.focus()
    }

    showFormSuccess() {
      for (const question of this.promptQuestions) {
        question.hidden = true
      }
      this.promptSuccessMessage.hidden = false
      this.promptSuccessMessage.focus()
    }

    revealInitialPrompt() {
      this.prompt.hidden = false
      this.prompt.focus()
    }
  }

  Modules.Feedback = Feedback
})(window.GOVUK.Modules)
