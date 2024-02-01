window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieSettings ($module) {
    this.$module = $module
  }

  CookieSettings.prototype.init = function () {
    console.log('CookieSettings.prototype.init')
    this.$module.submitSettingsForm = this.submitSettingsForm.bind(this)
    document.querySelector('form[data-module=cookie-settings]').addEventListener('submit', this.$module.submitSettingsForm)
    window.GOVUK.singleConsent.init(this.setInitialFormValues)
  }

  CookieSettings.prototype.setInitialFormValues = function (consents, consentsPreferencesSet, error) {
    console.log('setInitialFormValues')
    if (error) {
      console.error('Single consent error: ' + error, window.location)
    }

    var currentConsentCookie = window.GOVUK.cookie('cookies_policy')
    if (currentConsentCookie) {
      console.log('currentConsentCookie is', currentConsentCookie)
      var currentConsentCookieJSON = JSON.parse(currentConsentCookie)

      // We don't need the essential value as this cannot be changed by the user
      delete currentConsentCookieJSON.essential

      for (var cookieType in currentConsentCookieJSON) {
        var radioButton

        if (currentConsentCookieJSON[cookieType]) {
          radioButton = document.querySelector('input[name=cookies-' + cookieType + '][value=on]')
        } else {
          radioButton = document.querySelector('input[name=cookies-' + cookieType + '][value=off]')
        }

        if (radioButton) {
          radioButton.checked = true
        }
      }
    } else {
      console.log('wat')
      // window.GOVUK.setCookie('cookies_preferences_set', true, { days: 365 })
      // window.GOVUK.setDefaultConsentCookie()
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
        var value = input.value === 'on'

        options[name] = value
      }
    }

    // window.GOVUK.setConsentCookie(options)
    // window.GOVUK.setCookie('cookies_preferences_set', true, { days: 365 })
    window.GOVUK.singleConsent.setPreferences(false, options)
    this.fireAnalyticsEvent(options)

    this.showConfirmationMessage()

    return false
  }

  CookieSettings.prototype.fireAnalyticsEvent = function (consent) {
    var eventLabel = ''

    for (var option in consent) {
      var optionValue = consent[option] ? 'yes' : 'no'
      eventLabel += option + '-' + optionValue + ' '
    }

    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent('cookieSettings', 'Save changes', { label: eventLabel })
    }
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
    return document.referrer ? new URL(document.referrer).pathname : false
  }

  Modules.CookieSettings = CookieSettings
})(window.GOVUK.Modules)
