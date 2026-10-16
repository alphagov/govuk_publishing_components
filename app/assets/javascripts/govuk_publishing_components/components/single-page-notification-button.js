/* global fetch, DOMException, AbortController */

(function (Modules) {
  class SinglePageNotificationButton {
    constructor ($module) {
      /** @type {HTMLDivElement} */
      this.$module = $module

      /** @type {HTMLInputElement | null} */
      this.basePathInput = this.$module.querySelector('input[name="base_path"]')

      /** @type {HTMLButtonElement | null} */
      this.button = this.$module.querySelector('.gem-c-button__outline--notification')

      /** @type {String | null} */
      this.buttonLocation = this.$module.getAttribute('data-button-location')

      /** @type {String | null} */
      this.customSubscribeText = this.$module.getAttribute('data-button-text-subscribe')

      /** @type {String | null} */
      this.customUnsubscribeText = this.$module.getAttribute('data-button-text-unsubscribe')

      /** @type {String} */
      this.buttonVisibleClass = 'gem-c-single-page-notification-button--visible'
    }

    /**
     * Initialise the single page notification button
     *
     */
    async init () {
      try {
        if (this.basePathInput === null) {
          return
        }

        const personalisationEndpoint = this.getPersonalisationEndpoint(this.basePathInput.value, this.buttonLocation)
        const personalisationData = await this.getPersonalisationData(personalisationEndpoint, 10000)

        this.setCustomButtonText(personalisationData.active, this.customSubscribeText, this.customUnsubscribeText)
      } catch (error) {
        console.error('Timeout')
      }

      this.makeVisible(this.$module)
    }

    /**
     * Get the personalisation data endpoint
     *
     * @param {String} basePath The base path to use
     * @param {String | null} buttonLocation This attribute is passed through to the personalisation API to ensure the updated button has the same button_location for analytics
     * @returns {String} The endpoint to use
     */
    getPersonalisationEndpoint (basePath, buttonLocation) {
      const checkEmailSubscriptionEndpoint = '/api/personalisation/check-email-subscription'

      if (buttonLocation) {
        return `${checkEmailSubscriptionEndpoint}?base_path=${basePath}&button_location=${buttonLocation}`
      }

      return `${checkEmailSubscriptionEndpoint}?base_path=${basePath}`
    }

    /**
     * Fetch data from the personalisation endpoint for checking if an email subscription is active
     *
     * @param {String} personalisationEndpoint The personalisation URL to fetch data from
     * @param {Number} timer Set the time in milliseconds when the fetch request should abort
     * @returns {Promise<EmailSubscriptionData>}
     * @throws {DOMException} if the request times out
     * @throws {Error} if the request response is not ok
     */
    async getPersonalisationData (personalisationEndpoint, timer) {
      const abortController = new AbortController()
      setTimeout(() => abortController.abort(new DOMException('Timeout', 'AbortError')), timer)

      const response = await fetch(personalisationEndpoint, {
        headers: { Accept: 'application/json' },
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      /** @type {EmailSubscriptionData} */
      const emailSubscriptionData = await response.json()
      return emailSubscriptionData
    }

    /**
     * Make the single page notification button visible
     *
     * @param {HTMLDivElement} module The element to add the visible class to
     *
     */
    makeVisible (module) {
      module.classList.add(this.buttonVisibleClass)
    }

    /**
     * Set custom button text depending on whether the email subscription is active
     *
     * @param {Boolean} activeState If the user has an email subscription to the base path
     * @param {String | null} customSubscribeText The custom subscribe text used when the active state is false
     * @param {String | null} customUnsubscribeText The custom subscribe text used when the active state is true
     *
     */
    setCustomButtonText (activeState, customSubscribeText, customUnsubscribeText) {
      if (!this.button) {
        return
      }

      // Only set custom button text if both text items are provided
      if (!customSubscribeText || !customUnsubscribeText) {
        return
      }

      if (activeState === true) {
        this.button.textContent = this.customUnsubscribeText
      }

      if (activeState === false) {
        this.button.textContent = this.customSubscribeText
      }
    }
  }

  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)

/**
 * @typedef {object} EmailSubscriptionData
 * @property {string} base_path the base_path parameter
 * @property {boolean} active whether the email subscription is active
 *
 * @see {@link https://docs.publishing.service.gov.uk/repos/account-api/api.html#get-apipersonalisationcheck-email-subscription}
 *
 */
