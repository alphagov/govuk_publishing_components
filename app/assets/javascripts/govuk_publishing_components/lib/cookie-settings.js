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
      var inputValue = this.getCookiePolicyValue(currentConsentCookieJSON, cookieType)

      // Find the element and set checked to true
      var radioButton = document.querySelector(`input[name=cookies-${cookieType}][value=${inputValue}]`)

      if (radioButton) {
        radioButton.checked = true
      }
    }
  }

  CookieSettings.prototype.submitSettingsForm = function (event) {
    event.preventDefault()

    var formInputs = Array.from(event.target.getElementsByTagName('input'))
    var newCookiePolicy = {}

    var checkedFormInputs = formInputs.filter((input) => {
      return input.checked
    })

    console.log(checkedFormInputs);

    for (var formInput of checkedFormInputs) {

        var cookieCategory = formInput.name.replace('cookies-', '')

        // Revisit
        if (cookieCategory === 'usage') {
          if (formInput.value === 'aggregate') {
            newCookiePolicy.aggregate = true
            newCookiePolicy.usage = false
          } else if (formInput.value === 'on') {
            newCookiePolicy.aggregate = false
            newCookiePolicy.usage = true
          } else {
            newCookiePolicy.aggregate = false
            newCookiePolicy.usage = false
          }
        } else {
          if (formInput.value === 'on') {
            newCookiePolicy[cookieCategory] = true
          } else {
            newCookiePolicy[cookieCategory] = false
          }
        }

        // TODO: Test this on the settings page
        if ((formInput.name === 'usage' && newCookiePolicy[formInput.name] === false) ||
            (formInput.name === 'aggregate' && newCookiePolicy[formInput.name] === false)) {
          window.GOVUK.stopSendingAnalytics = true
          // TODO: confirm where this is used
          window.GOVUK.LUX = {}
        }
    }

    window.GOVUK.setConsentCookie(newCookiePolicy)
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

  CookieSettings.prototype.getCookiePolicyValue = function (currentConsentCookieJSON, cookieTypeValue) {
    if (currentConsentCookieJSON.aggregate === true) {
      return 'aggregate'
    }

    if (currentConsentCookieJSON[cookieTypeValue] === true) {
      return 'on'
    }

    return 'off'
  }

  CookieSettings.prototype.setCookiePolicyValue = function (cookieInputValue) {
    if (cookieInputValue === 'aggregate') {
      return true
    }

    if (cookieInputValue === 'on') {
      return true
    }

    return false
  }

  Modules.CookieSettings = CookieSettings
})(window.GOVUK.Modules)
