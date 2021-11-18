/* global XMLHttpRequest */
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SinglePageNotificationButton ($module) {
    this.$module = $module
    this.basePath = this.$module.querySelector('input[name="base_path"]').value
    this.buttonLocation = this.$module.getAttribute('data-button-location')

    this.personalisationEndpoint = '/api/personalisation/check-email-subscription?base_path=' + this.basePath
    // This attribute is passed through to the personalisation API to ensure the updated button has the same button_location for analytics
    if (this.buttonLocation) this.personalisationEndpoint += '&button_location=' + this.buttonLocation
  }

  SinglePageNotificationButton.prototype.init = function () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', this.personalisationEndpoint, true)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var responseText = xhr.responseText
        // if response text exists and is JSON parse-able, parse the response and get the button html
        if (responseText && this.responseIsJSON(responseText)) {
          var newButton = JSON.parse(responseText).button_html
          var html = document.createElement('div')
          html.innerHTML = newButton
          // test that the html returned contains the button component; if yes, swap the button for the updated version
          var responseHasButton = html.querySelector('form.gem-c-single-page-notification-button .gem-c-single-page-notification-button__submit')
          if (responseHasButton) {
            this.$module.outerHTML = newButton
          }
        }
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
  Modules.SinglePageNotificationButton = SinglePageNotificationButton
})(window.GOVUK.Modules)
