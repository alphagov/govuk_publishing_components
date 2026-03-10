/* eslint-env jasmine */
var GOVUK = window.GOVUK || {}

describe('cookieSettings', function () {
  var container,
    element,
    confirmationContainer,
    fakePreviousURL

  // default cookie consent to use as basis of comparison
  var DEFAULT_COOKIE_CONSENT = '{"essential":true,"settings":false,"usage":false,"campaigns":false,"aggregate":true}'
  // all consent cookie to use as a basis of comparison
  var ALL_COOKIE_CONSENT = '{"essential":true,"settings":true,"usage":true,"campaigns":true,"aggregate":false}'
  // previous version of the all consent cookie to use as a basis of comparison
  var ALL_COOKIE_CONSENT_USAGE_NO_AGGREGATE = '{"essential":true,"settings":true,"usage":true,"campaigns":true}'

  beforeEach(function () {
    GOVUK.Modules.CookieSettings.prototype.getReferrerLink = function () {
      return fakePreviousURL
    }

    container = document.createElement('div')
    container.innerHTML = `
      <form data-module="cookie-settings">
        <fieldset>
          <input type="radio" id="settings-on" name="cookies-settings" value="on">
          <input type="radio" id="settings-off" name="cookies-settings" value="off" checked>
        </fieldset>
        <fieldset>
          <input type="radio" id="usage-on" name="cookies-usage" value="on">
          <input type="radio" id="usage-aggregate" name="cookies-usage" value="aggregate" checked>
          <input type="radio" id="usage-off" name="cookies-usage" value="off">
        </fieldset>
        <fieldset>
          <input type="radio" id="campaigns-on" name="cookies-campaigns" value="on">
          <input type="radio" id="campaigns-off" name="cookies-campaigns" value="off" checked>
        <fieldset>
        <button id="submit-button" type="submit">Submit</button>
      </form>
    `

    document.body.appendChild(container)

    confirmationContainer = document.createElement('div')
    confirmationContainer.style.display = 'none'
    confirmationContainer.setAttribute('data-cookie-confirmation', 'true')
    confirmationContainer.innerHTML =
      '<a class="cookie-settings__prev-page" href="#">View previous page</a>'

    document.body.appendChild(confirmationContainer)

    element = document.querySelector('[data-module=cookie-settings]')
  })

  afterEach(function () {
    document.body.removeChild(container)
    document.body.removeChild(confirmationContainer)
    window.GOVUK.deleteCookie('cookies_policy')
  })

  describe('setInitialFormValues', function () {
    it('sets a default `cookie_policy` consent cookie if not previously set', function () {
      GOVUK.cookie('cookies_policy', null)
      spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

      new GOVUK.Modules.CookieSettings(element).init()

      expect(window.GOVUK.setDefaultConsentCookie).toHaveBeenCalled()
      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
    })

    it('does not update the `cookie_policy` cookie to the default values if previously set', function () {
      GOVUK.cookie('cookies_policy', ALL_COOKIE_CONSENT)
      spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

      new GOVUK.Modules.CookieSettings(element).init()

      expect(window.GOVUK.setDefaultConsentCookie).not.toHaveBeenCalled()
      expect(GOVUK.getCookie('cookies_policy')).not.toEqual(DEFAULT_COOKIE_CONSENT)
      expect(GOVUK.getCookie('cookies_policy')).toEqual(ALL_COOKIE_CONSENT)
    })

    it('sets all radio buttons to the default values', function () {
      new GOVUK.Modules.CookieSettings(element).init()

      var checkedRadioButtons = element.querySelectorAll('input[type=radio]:checked')
      var consentCookieJSON = window.GOVUK.getConsentCookie()

      for (var radioButton of checkedRadioButtons) {
        var name = radioButton.name.replace('cookies-', '')

        if (radioButton.value === 'aggregate') {
          expect(consentCookieJSON.aggregate).toEqual(true)
          expect(consentCookieJSON.usage).toEqual(false)
        } else {
          expect(consentCookieJSON[name]).toEqual(radioButton.value === 'on')
        }
      }
    })

    it('sets all radio buttons to the all cookie consent values', function () {
      GOVUK.cookie('cookies_policy', ALL_COOKIE_CONSENT)
      new GOVUK.Modules.CookieSettings(element).init()

      var checkedRadioButtons = element.querySelectorAll('input[type=radio]:checked')
      var consentCookieJSON = window.GOVUK.getConsentCookie()

      for (var radioButton of checkedRadioButtons) {
        var name = radioButton.name.replace('cookies-', '')

        if (radioButton.value === 'aggregate') {
          expect(consentCookieJSON.aggregate).toEqual(true)
          expect(consentCookieJSON.usage).toEqual(false)
        } else {
          expect(consentCookieJSON[name]).toEqual(radioButton.value === 'on')
        }
      }
    })

    it('does not error if not all form options are present', function () {
      window.GOVUK.setDefaultConsentCookie()
      element.innerHTML = `
        <form data-module="cookie-settings">
          <input type="radio" id="settings-on" name="cookies-settings" value="on">
          <input type="radio" id="settings-off" name="cookies-settings" value="off">
          <button id="submit-button" type="submit">Submit</button>
        </form>
      `

      new GOVUK.Modules.CookieSettings(element).init()

      var radioButtons = element.querySelectorAll('input[value=on]')
      var consentCookieJSON = JSON.parse(window.GOVUK.cookie('cookies_policy'))

      for (var i = 0; i < radioButtons.length; i++) {
        var name = radioButtons[i].name.replace('cookies-', '')

        if (consentCookieJSON[name]) {
          expect(radioButtons[i].checked).toBeTruthy()
        } else {
          expect(radioButtons[i].checked).not.toBeTruthy()
        }
      }
    })

    it('does not error if aggregate is not included in the cookies_policy', function () {
      GOVUK.cookie('cookies_policy', ALL_COOKIE_CONSENT_USAGE_NO_AGGREGATE)
      new GOVUK.Modules.CookieSettings(element).init()

      var checkedRadioButtons = element.querySelectorAll('input[type=radio]:checked')
      var consentCookieJSON = window.GOVUK.getConsentCookie()

      for (var radioButton of checkedRadioButtons) {
        var name = radioButton.name.replace('cookies-', '')
        expect(consentCookieJSON[name]).toEqual(radioButton.value === 'on')
      }
    })
  })

  describe('submitSettingsForm', function () {
    it('updates consent cookie with any changes', function () {
      spyOn(window.GOVUK, 'setConsentCookie').and.callThrough()

      new GOVUK.Modules.CookieSettings(element).init()

      element.querySelector('#settings-on').checked = false
      element.querySelector('#settings-off').checked = true

      var button = element.querySelector('#submit-button')
      button.click()

      var cookie = JSON.parse(GOVUK.cookie('cookies_policy'))

      expect(window.GOVUK.setConsentCookie).toHaveBeenCalledWith({ settings: false, usage: false, campaigns: false, aggregate: true })
      expect(cookie.settings).toBeFalsy()
    })

    it('sets cookies_preferences_set cookie on form submit', function () {
      spyOn(window.GOVUK, 'setCookie').and.callThrough()

      new GOVUK.Modules.CookieSettings(element).init()

      GOVUK.cookie('cookies_preferences_set', null)

      expect(GOVUK.cookie('cookies_preferences_set')).toEqual(null)

      var button = element.querySelector('#submit-button')
      button.click()

      expect(window.GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', true, { days: 365 })
      expect(GOVUK.cookie('cookies_preferences_set')).toBeTruthy()
    })
  })

  describe('showConfirmationMessage', function () {
    it('sets the previous referrer link if one is present', function () {
      fakePreviousURL = '/student-finance'

      new GOVUK.Modules.CookieSettings(element).init()

      var button = element.querySelector('#submit-button')
      button.click()

      var previousLink = document.querySelector('.cookie-settings__prev-page')

      expect(previousLink.style.display).toEqual('inline')
      expect(previousLink.href).toContain('/student-finance')
    })

    it('does not set a referrer if one is not present', function () {
      fakePreviousURL = null

      new GOVUK.Modules.CookieSettings(element).init()

      var button = element.querySelector('#submit-button')
      button.click()

      var previousLink = document.querySelector('.cookie-settings__prev-page')

      expect(previousLink.style.display).toEqual('none')
    })

    it('does not set a referrer if URL is the same as current page (cookies page)', function () {
      fakePreviousURL = document.location.pathname

      new GOVUK.Modules.CookieSettings(element).init()

      var button = element.querySelector('#submit-button')
      button.click()

      var previousLink = document.querySelector('.cookie-settings__prev-page')

      expect(previousLink.style.display).toEqual('none')
    })

    it('shows a confirmation message', function () {
      var confirmationMessage = document.querySelector('[data-cookie-confirmation]')

      new GOVUK.Modules.CookieSettings(element).init()

      var button = element.querySelector('#submit-button')
      button.click()

      expect(confirmationMessage.style.display).toEqual('block')
    })
  })
})
