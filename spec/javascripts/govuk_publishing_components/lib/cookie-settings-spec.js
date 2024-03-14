/* eslint-env jasmine */
var GOVUK = window.GOVUK || {}

describe('cookieSettings', function () {
  var container,
    element,
    confirmationContainer,
    fakePreviousURL

  beforeEach(function () {
    delete window.GOVUK.useSingleConsentApi
    GOVUK.Modules.CookieSettings.prototype.getReferrerLink = function () {
      return fakePreviousURL
    }

    container = document.createElement('div')
    container.innerHTML =
      '<form data-module="cookie-settings">' +
        '<input type="radio" id="settings-on" name="cookies-settings" value="on">' +
        '<input type="radio" id="settings-off" name="cookies-settings" value="off">' +
        '<input type="radio" id="usage-on" name="cookies-usage" value="on">' +
        '<input type="radio" id="usage-off" name="cookies-usage" value="off">' +
        '<input type="radio" name="cookies-campaigns" value="on">' +
        '<input type="radio" name="cookies-campaigns" value="off">' +
        '<button id="submit-button" type="submit">Submit</button>' +
      '</form>'

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
  })

  describe('when the single consent api is not enabled', function () {
    describe('setInitialFormValues', function () {
      it('sets a consent cookie by default', function () {
        GOVUK.cookie('cookies_policy', null)
        spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

        new GOVUK.Modules.CookieSettings(element).init()

        expect(window.GOVUK.setDefaultConsentCookie).toHaveBeenCalled()
      })

      it('sets all radio buttons to the default values', function () {
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

      it('does not error if not all options are present', function () {
        element.innerHTML =
        '<form data-module="cookie-settings">' +
          '<input type="radio" id="settings-on" name="cookies-settings" value="on">' +
          '<input type="radio" id="settings-off" name="cookies-settings" value="off">' +
          '<button id="submit-button" type="submit">Submit</button>' +
        '</form>'

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

        expect(window.GOVUK.setConsentCookie).toHaveBeenCalledWith({ settings: false, usage: false, campaigns: false })
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

      it('fires a Google Analytics event', function () {
        spyOn(GOVUK.analytics, 'trackEvent').and.callThrough()

        new GOVUK.Modules.CookieSettings(element).init()

        element.querySelector('#settings-on').checked = false
        element.querySelector('#settings-off').checked = true

        var button = element.querySelector('#submit-button')
        button.click()

        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cookieSettings', 'Save changes', { label: 'settings-no usage-no campaigns-no ' })
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

  xdescribe('when the single consent api is enabled', function () {
    beforeEach(function () {
      window.GOVUK.useSingleConsentApi = true
    })

    afterEach(function () {
      delete window.GOVUK.useSingleConsentApi
    })

    it('setInitialFormValues does not set a consent cookie by default', function () {
      GOVUK.cookie('cookies_policy', null)
      spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

      new GOVUK.Modules.CookieSettings(element).init()

      expect(window.GOVUK.setDefaultConsentCookie).not.toHaveBeenCalled()
    })

    it('submitSettingsForm passes responsibility for handling consent to the single consent api', function () {
      spyOn(window.GOVUK, 'setConsentCookie')
      spyOn(window.GOVUK.singleConsent, 'init')

      new GOVUK.Modules.CookieSettings(element).init()

      element.querySelector('#settings-on').checked = false
      element.querySelector('#settings-off').checked = true

      var button = element.querySelector('#submit-button')
      button.click()

      expect(window.GOVUK.setConsentCookie).not.toHaveBeenCalled()
      expect(window.GOVUK.singleConsent.init).toHaveBeenCalled()
    })
  })

  describe('when setting usage cookies to false', function () {
    beforeEach(function () {
      spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
    })
    it('stops analytics tracking', function () {
      var analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100
      })
      window.dataLayer = []

      // Expect the default return value when you send an analytics event
      expect(analytics.trackEvent()).toEqual(undefined)
      expect(analytics.trackShare()).toEqual(undefined)
      expect(analytics.trackPageview()).toEqual(undefined)
      expect(GOVUK.analyticsGa4.core.sendData({})).toEqual(undefined)

      new GOVUK.Modules.CookieSettings(element).init()

      element.querySelector('#usage-on').checked = false
      element.querySelector('#usage-off').checked = true

      var button = element.querySelector('#submit-button')
      button.click()

      expect(window.GOVUK.stopSendingAnalytics).toEqual(true)

      // Expect a false return value now when you send an analytics event

      expect(analytics.trackEvent()).toEqual(false)
      expect(analytics.trackShare()).toEqual(false)
      expect(analytics.trackPageview()).toEqual(false)
      expect(window.GOVUK.analyticsGa4.core.sendData()).toEqual(false)

      expect(window.GOVUK.LUX).toEqual({})
    })
  })
})
