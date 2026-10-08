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
        const personalisationData = await this.getPersonalisationData()

        // Only set custom button text if both text items are provided
        if (this.customSubscribeText && this.customUnsubscribeText) {
          this.setCustomButtonText(personalisationData.active)
        }

        this.makeVisible(this.$module)
      } catch (error) {
        console.error(error.message)
      }
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

    async getPersonalisationData () {
      const response = await fetch(this.personalisationEndpoint, { headers: { Accept: 'application/json' } })
      // if (!response.ok) {
      //   throw new Error(`Response status: ${response.status}`)
      // }
      const result = await response.json()
      return result
    }

    setCustomButtonText (activeState) {
      this.button.textContent = activeState === true ? this.customUnsubscribeText : this.customSubscribeText
    }
  }

  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
