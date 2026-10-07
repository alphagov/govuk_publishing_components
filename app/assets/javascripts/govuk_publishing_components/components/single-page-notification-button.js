(function (Modules) {
  function SinglePageNotificationButton ($module) {
    this.$module = $module
    this.basePath = this.$module.querySelector('input[name="base_path"]').value
    this.buttonLocation = this.$module.getAttribute('data-button-location')
    this.buttonVisibleClass = 'gem-c-single-page-notification-button--visible'

    this.personalisationEndpoint = '/api/personalisation/check-email-subscription?base_path=' + this.basePath
    // This attribute is passed through to the personalisation API to ensure the updated button has the same button_location for analytics
    if (this.buttonLocation) this.personalisationEndpoint += '&button_location=' + this.buttonLocation
  }

  SinglePageNotificationButton.prototype.init = async function () {
    try {
      const response = await fetch(this.personalisationEndpoint, { headers: { Accept: 'application/json' }})
      // if (!response.ok) {
      //   throw new Error(`Response status: ${response.status}`)
      // }

      const result = await response.json()

      var customSubscribeText = this.$module.getAttribute('data-button-text-subscribe')
      var customUnsubscribeText = this.$module.getAttribute('data-button-text-unsubscribe')
      // Only set custom button text if both text items are provided
      var customText = customSubscribeText && customUnsubscribeText

      // If response returns active, user has subscribed to notifications
      if (result.active === true) {
        if (customText) {
          this.$module.querySelector('.gem-c-button__outline--notification').textContent = customUnsubscribeText
        }
      } else {
        if (customText) {
          this.$module.querySelector('.gem-c-button__outline--notification').textContent = customSubscribeText
        }
      }

      this.makeVisible(this.$module)
    } catch (error) {
      console.error(error.message)
    }
  }

  SinglePageNotificationButton.prototype.responseIsJSON = function (string) {
    try {
      JSON.parse(string)
    } catch (e) {
      return false
    }
    return true
  }

  SinglePageNotificationButton.prototype.makeVisible = function (target) {
    target.classList.add(this.buttonVisibleClass)
  }
  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
