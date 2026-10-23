/* global FormData */

((Modules) => {
  class Feedback {
    constructor($module) {
      /** @type {HTMLElement} */
      this.$module = $module

      /** @type {HTMLFormElement|null} */
      this.somethingIsWrongForm = this.$module.querySelector('#something-is-wrong')

      /** @type {HTMLFormElement|null} */
      this.surveyForm = this.$module.querySelector('#page-is-not-useful')

      /** @type {HTMLElement|null} */
      this.prompt = this.$module.querySelector('.js-prompt')

      /** @type {NodeListOf<HTMLFormElement>} */
      this.forms = this.$module.querySelectorAll('.js-feedback-form')

      /** @type {NodeListOf<HTMLElement>} */
      this.toggleForms = this.$module.querySelectorAll('.js-toggle-form')

      /** @type {NodeListOf<HTMLElement>} */
      this.closeForms = this.$module.querySelectorAll('.js-close-form')

      /** @type {HTMLFormElement|false} */
      this.activeForm = false

      /** @type {HTMLElement|null} */
      this.pageIsUsefulButton = this.$module.querySelector('.js-page-is-useful')

      /** @type {HTMLElement|null} */
      this.somethingIsWrongButton = this.$module.querySelector('.js-something-is-wrong')

      /** @type {NodeListOf<HTMLElement>} */
      this.promptQuestions = this.$module.querySelectorAll('.js-prompt-questions')

      /** @type {HTMLElement|null} */
      this.promptSuccessMessage = this.$module.querySelector('.js-prompt-success')

      /** @type {HTMLElement|null} */
      this.surveyWrapper = this.$module.querySelector('#survey-wrapper')

      /** @type {HTMLInputElement|null} */
      this.whatDoingInput = this.$module.querySelector('[name=what_doing]')

      /** @type {HTMLInputElement|null} */
      this.whatWrongInput = this.$module.querySelector('[name=what_wrong]')

      /** @type {number} */
      this.timer = 0

      /** @type {number|null} */
      this.timerInterval = null

      /** @type {HTMLInputElement|null} */
      this.timerHoneyPot = null
    }

    /**
     * Initialise the feedback component
     *
     * @returns {void}
     */
    init() {
      this.setHiddenValues()
      this.setSurveyPath()
      this.resetVisibility()
      this.addEvents()
    }

    /**
     * Resets initial DOM visibility states for prompt questions and feedback forms
     *
     * @returns {void}
     */
    resetVisibility() {
      this.prompt.hidden = false

      for (const question of this.promptQuestions) {
        question.hidden = false
      }

      this.surveyForm.hidden = true
    }

    /**
     * Adds DOM event listeners for toggles, dismissals, and asynchronous form submissions
     *
     * @returns {void}
     */
    addEvents() {
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
          const button = e.target.closest('button') || e.currentTarget
          const formToToggle = button.getAttribute('aria-controls')
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
        if (this.timerInterval) return

        this.timerInterval = setInterval(() => {
          this.timer += 1
          this.timerHoneyPot.setAttribute('value', this.timer)
        }, 1000)
      })

      for (const form of this.forms) {
        form.addEventListener('submit', (e) => this.handleFormSubmit(e))
      }
    }

    /**
     * Handles form submission with fetch, timeout abort, and error routing
     *
     * @param {SubmitEvent} e The native submit event
     * @returns {Promise<void>}
     */
    async handleFormSubmit(e) {
      e.preventDefault()
      const $form = e.currentTarget
      const url = $form.getAttribute('action')
      const body = new URLSearchParams(new FormData($form)).toString()
      const abortController = new AbortController()
      const fetchRequestTimeoutId = setTimeout(() => {
        abortController.abort(new DOMException('Request timed out', 'AbortError'))
      }, 10000)

      this.disableSubmitFormButton($form)

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: abortController.signal,
          body
        })

        if (response.ok) {
          this.showFormSuccess()
          this.revealInitialPrompt()

          if (this.activeForm) {
            this.activeForm.hidden = true
            this.activeForm = false
          }

          clearInterval(this.timerInterval)
          this.timerInterval = null
          return
        }

        // If the server returns a 422 with an Nginx HTML error page, responseData resolves to null
        const responseData = await response.json().catch(() => null)

        this.showError({
          status: response.status,
          ...(responseData && { response: responseData })
        })
        this.enableSubmitFormButton($form)
      } catch (networkError) {
        this.showError(networkError)
        this.enableSubmitFormButton($form)
      } finally {
        clearTimeout(fetchRequestTimeoutId)
      }
    }

    /**
     * Disables the primary submit button on a form to prevent duplicate submissions
     *
     * @param {HTMLFormElement} $form Form with submit button to disable
     * @returns {void}
     */
    disableSubmitFormButton($form) {
      const formButton = $form.querySelector('[type="submit"]')
      formButton.setAttribute('disabled', 'true')
    }

    /**
     * Re-enables the primary submit button on a form after an error or retry
     *
     * @param {HTMLFormElement} $form Form with submit button to re-enable
     * @returns {void}
     */
    enableSubmitFormButton($form) {
      const formButton = $form.querySelector('[type="submit"]')
      formButton.removeAttribute('disabled')
    }

    /**
     * Adds hidden tracking and bot mitigation fields to the problem report form,
     * including JavaScript detection, document referrer and a timer honeypot
     *
     * @returns {void}
     */
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

    /**
     * Gets the current window pathname.
     * Kept as a separate method to allow spyOn / mocking in test suites.
     *
     * @returns {string} The current location pathname
     */
    getPagePath() {
      return window.location.pathname
    }

    /**
     * Sanitises the current page path by stripping email patterns to protect
     * Personally Identifiable Information (PII) before updating the external survey URL
     *
     * @returns {void}
     */
    setSurveyPath() {
      const surveyLink = this.$module.querySelector('#survey_explanation a')

      if (surveyLink) {
        const pathWithoutEmailPII = this.getPagePath().replace(/[^\s=?&]+(?:@|%40)[^\s=?&]+/, '[email]')
        const encodedPath = encodeURI(pathWithoutEmailPII)
        surveyLink.setAttribute('href', `https://www.smartsurvey.co.uk/s/gov-uk-banner/?c=${encodedPath}`)
      }
    }

    /**
     * Toggles visibility between the initial prompt questions and the specified form container,
     * managing focus and resetting honeypot timers when forms are dismissed
     *
     * @param {string} formId HTML `id` attribute of the form to display or hide.
     * @returns {void}
     */
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
        this.timerInterval = null
      }
    }

    /**
     * Renders an error message in the active form's error container, handles Nginx 422
     * overrides, custom API error messages, and generic network error fallbacks
     *
     * @param {Object|Error} error An error object from an API response, status wrapper, or caught exception
     * @param {number} [error.status] The HTTP status code of the response
     * @param {Object} [error.response] The parsed JSON error payload, if available
     * @param {string} [error.response.message] Specific error description from the server
     * @returns {void}
     */
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
        // Nginx clobbers upstream JSON on 422 errors and serves an HTML error page
        // Fall back to the form's custom client-side error message if present
        const targetForm = this.activeForm || this.somethingIsWrongForm
        formattedError = (targetForm && targetForm.invalidInfoError) || genericError
      }

      const targetForm = this.activeForm || this.$module
      const $errors = targetForm ? targetForm.querySelector('.js-errors') : null

      if ($errors) {
        $errors.innerHTML = formattedError
        $errors.hidden = false
        $errors.focus()
      }
    }

    /**
     * Hides the prompt question controls and reveals the prompt success banner
     *
     * @returns {void}
     */
    showFormSuccess() {
      for (const question of this.promptQuestions) {
        question.hidden = true
      }
      this.promptSuccessMessage.hidden = false
      this.promptSuccessMessage.focus()
    }

    /**
     * Reveals the initial prompt question bar
     *
     * @returns {void}
     */
    revealInitialPrompt() {
      this.prompt.hidden = false
      this.prompt.focus()
    }
  }

  Modules.Feedback = Feedback
})(window.GOVUK.Modules)

 /**
   * @see {@link https://components.publishing.service.gov.uk/component-guide/feedback}
   */
