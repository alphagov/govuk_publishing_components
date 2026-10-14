/* global XMLHttpRequest */
(function (Modules) {
  class SinglePageNotificationButton {
    constructor ($module) {
      this.$module = $module
      this.basePathInput = this.$module.querySelector('input[name="base_path"]')
      this.button = this.$module.querySelector('.gem-c-button__outline--notification')
      this.buttonLocation = this.$module.getAttribute('data-button-location')
      this.buttonVisibleClass = 'gem-c-single-page-notification-button--visible'

      this.personalisationEndpoint = '/api/personalisation/check-email-subscription?base_path=' + this.basePath
      // This attribute is passed through to the personalisation API to ensure the updated button has the same button_location for analytics
      if (this.buttonLocation) this.personalisationEndpoint += '&button_location=' + this.buttonLocation
    }

    async init () {
      try {
        if (this.basePathInput === null) {
          return
        }

        const personalisationData = await this.getPersonalisationData(this.personalisationEndpoint, 10000)

        var customSubscribeText = this.$module.getAttribute('data-button-text-subscribe')
        var customUnsubscribeText = this.$module.getAttribute('data-button-text-unsubscribe')
        // Only set custom button text if both text items are provided
        var customText = customSubscribeText && customUnsubscribeText

        // If response returns active, user has subscribed to notifications
        if (personalisationData.active === true) {
          if (customText) {
            this.$module.querySelector('.gem-c-button__outline--notification').textContent = customUnsubscribeText
          }
        } else {
          if (customText) {
            this.$module.querySelector('.gem-c-button__outline--notification').textContent = customSubscribeText
          }
        }
      } catch (error) {
        this.makeVisible(this.$module)
        console.error(error)
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
  }

  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
