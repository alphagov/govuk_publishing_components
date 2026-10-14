/* global fetch, DOMException, AbortController */
(function (Modules) {
  class SinglePageNotificationButton {
    constructor ($module) {
      this.$module = $module
      this.basePathInput = this.$module.querySelector('input[name="base_path"]')
      this.button = this.$module.querySelector('.gem-c-button__outline--notification')
      this.buttonLocation = this.$module.getAttribute('data-button-location')
      this.customSubscribeText = this.$module.getAttribute('data-button-text-subscribe')
      this.customUnsubscribeText = this.$module.getAttribute('data-button-text-unsubscribe')
      this.buttonVisibleClass = 'gem-c-single-page-notification-button--visible'
    }

    async init () {
      try {
        if (this.basePathInput === null) {
          return
        }

        const personalisationEndpoint = this.getPersonalisationEndpoint(this.basePathInput.value, this.buttonLocation)
        const personalisationData = await this.getPersonalisationData(personalisationEndpoint, 10000)
        const customButtonText = this.getCustomButtonText(personalisationData.active, this.customSubscribeText, this.customUnsubscribeText)

        if (customButtonText) {
          this.button.textContent = customButtonText
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.makeVisible(this.$module)
      }
    }

    getPersonalisationEndpoint (basePath, buttonLocation) {
      const checkEmailSubscriptionEndpoint = '/api/personalisation/check-email-subscription'

      if (buttonLocation) {
        return `${checkEmailSubscriptionEndpoint}?base_path=${basePath}&button_location=${buttonLocation}`
      }

      return `${checkEmailSubscriptionEndpoint}?base_path=${basePath}`
    }

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

      return await response.json()
    }

    makeVisible (target) {
      target.classList.add(this.buttonVisibleClass)
    }

    getCustomButtonText (activeState, customSubscribeText, customUnsubscribeText) {
      if (typeof activeState !== 'boolean') return
      // Only set custom button text if both text items are provided
      if (!customSubscribeText || !customUnsubscribeText) {
        return
      }

      if (activeState === true) return customUnsubscribeText
      if (activeState === false) return customSubscribeText
    }
  }

  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
