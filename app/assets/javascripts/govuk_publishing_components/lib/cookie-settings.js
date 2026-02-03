window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieSettings ($module) {
    this.$module = $module
  }

  CookieSettings.prototype.init = function () {
    this.$module.submitSettingsForm = this.submitSettingsForm.bind(this)

    document.querySelector('form[data-module=cookie-settings]')
      .addEventListener('submit', this.$module.submitSettingsForm)

    this.setInitialFormValues()
  }

  CookieSettings.prototype.setInitialFormValues = function () {
    if (!window.GOVUK.cookie('cookies_policy')) {
      window.GOVUK.setDefaultConsentCookie()
    }

    var currentConsentCookie = window.GOVUK.cookie('cookies_policy')
    var currentConsentCookieJSON = JSON.parse(currentConsentCookie)

    // If there is no cookie consent do not set initial form values
    if (!currentConsentCookie) return

    // If there is no cookie consent JSON do not set initial form values
    if (!currentConsentCookieJSON) return

    // We don't need the essential value as this cannot be changed by the user
    delete currentConsentCookieJSON.essential

    // Loop over the different cookie
    for (var cookieType in currentConsentCookieJSON) {
      var inputValue = this.getCookiePolicyValue(currentConsentCookieJSON[cookieType])

      // Find the element and set checked to true
      var radioButton = document.querySelector(`input[name=cookies-${cookieType}][value=${inputValue}]`)

      if (radioButton) {
        radioButton.checked = true
      }
    }
  }

  CookieSettings.prototype.submitSettingsForm = function (event) {
    event.preventDefault()

    var formInputs = event.target.getElementsByTagName('input')
    var options = {}

    for (var i = 0; i < formInputs.length; i++) {
      var input = formInputs[i]
      if (input.checked) {
        var name = input.name.replace('cookies-', '')

        // Revisit
        options[name] = this.setCookiePolicyValue(input.value)

        // TODO: Test this on the settings page
        if (name === 'usage' && options[name] === false) {
          window.GOVUK.stopSendingAnalytics = true
          // TODO: confirm where this is used
          window.GOVUK.LUX = {}
        }
      }
    }

    window.GOVUK.setConsentCookie(options)
    window.GOVUK.setCookie('cookies_preferences_set', true, { days: 365 })
    this.showConfirmationMessage()
    return false
  }

  CookieSettings.prototype.showConfirmationMessage = function () {
    var confirmationMessage = document.querySelector('div[data-cookie-confirmation]')
    // hide the message if already visible so assistive tech is triggered when it appears
    confirmationMessage.style.display = 'none'
    var previousPageLink = document.querySelector('.cookie-settings__prev-page')
    var referrer = CookieSettings.prototype.getReferrerLink()

    document.body.scrollTop = document.documentElement.scrollTop = 0

    if (previousPageLink) {
      if (referrer && referrer !== document.location.pathname) {
        previousPageLink.href = referrer
        previousPageLink.style.display = 'inline'
      } else {
        previousPageLink.style.display = 'none'
      }
    }

    confirmationMessage.style.display = 'block'
  }

  CookieSettings.prototype.getReferrerLink = function () {
    var documentReferrer = false
    try {
      documentReferrer = document.referrer || new URL(document.referrer).pathname
    } catch (e) {
      // TODO: Test
      console.warn('Error grabbing referrer for cookie settings', window.location, e)
    }
    return documentReferrer
  }

  CookieSettings.prototype.getCookiePolicyValue = function (cookieTypeValue) {
    if (cookieTypeValue === 'aggregate') {
      return 'aggregate'
    }
    if (cookieTypeValue === true) {
      return 'on'
    }

    return 'off'
  }

  CookieSettings.prototype.setCookiePolicyValue = function (cookieInputValue) {
    if (cookieInputValue === 'aggregate') {
      return 'aggregate'
    }

    if (cookieInputValue === 'on') {
      return true
    }

    return false
  }

  Modules.CookieSettings = CookieSettings
})(window.GOVUK.Modules)
