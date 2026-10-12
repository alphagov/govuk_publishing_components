/* global fetch */

(function (Modules) {
  class SinglePageNotificationButton {
    constructor ($module) {
      this.$module = $module
      this.basePath = this.$module.querySelector('input[name="base_path"]').value
      this.button = this.$module.querySelector('.gem-c-button__outline--notification')
      this.buttonLocation = this.$module.getAttribute('data-button-location')
      this.buttonVisibleClass = 'gem-c-single-page-notification-button--visible'
      this.customSubscribeText = this.$module.getAttribute('data-button-text-subscribe')
      this.customUnsubscribeText = this.$module.getAttribute('data-button-text-unsubscribe')

      this.personalisationEndpoint = `/api/personalisation/check-email-subscription?base_path=${this.basePath}`

      // This attribute is passed through to the personalisation API to ensure the updated button has the same button_location for analytics
      if (this.buttonLocation) {
        this.personalisationEndpoint += `&button_location=${this.buttonLocation}`
      }
    }

    async init () {
      try {
        const personalisationData = await this.getPersonalisationData(10000)
        const customTextSet = this.customSubscribeText && this.customUnsubscribeText

        // Only set custom button text if both text items are provided
        if (personalisationData && customTextSet) {
            this.setCustomButtonText(personalisationData.active)
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Timeout");
        }
      }

      this.makeVisible(this.$module)
    }

    responseIsJSON (string) {
      try {
        JSON.parse(string)
      } catch (e) {
        return false
      }
      return true
    }

    makeVisible (target) {
      target.classList.add(this.buttonVisibleClass)
    }

    async getPersonalisationData (timer) {
      const abortController = new AbortController()
      setTimeout(() => abortController.abort(new DOMException('Timeout', 'AbortError')), timer)

      const response = await fetch(this.personalisationEndpoint, {
        headers: { Accept: 'application/json'},
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      return await response.json()
    }

    setCustomButtonText (activeState) {
      this.button.textContent = activeState === true ? this.customUnsubscribeText : this.customSubscribeText
    }
  }

  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
