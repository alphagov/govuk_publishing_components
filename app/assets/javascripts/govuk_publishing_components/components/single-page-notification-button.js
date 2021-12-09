/* global XMLHttpRequest */
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

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

  SinglePageNotificationButton.prototype.init = function () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', this.personalisationEndpoint, true)
    // if XHR to the personalisation endpoint is taking an incredibly long time to complete, we are better off leaving the button in its default unpersonalised state. Content changing before the user's eyes while they are browsing can be jarring and should be avoided.
    xhr.timeout = 10000

    xhr.ontimeout = function () {
      this.makeVisible(this.$module)
    }.bind(this)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var responseText = xhr.responseText
          // if response text exists and is JSON parse-able, parse the response and get the button html
          if (responseText && this.responseIsJSON(responseText)) {
            var newButton = JSON.parse(responseText).button_html
            var html = document.createElement('div')
            html.innerHTML = newButton
            // test that the html returned contains the button component; if yes, swap the button for the updated version
            var responseButtonContainer = html.querySelector('form.gem-c-single-page-notification-button')
            if (responseButtonContainer) {
              this.$module.parentNode.replaceChild(responseButtonContainer, this.$module)
            }
          }
        }
        this.makeVisible(this.$module)
      }
    }.bind(this)
    xhr.send()
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
