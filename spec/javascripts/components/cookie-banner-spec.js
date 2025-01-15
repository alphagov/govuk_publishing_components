/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Cookie banner', function () {
  'use strict'

  var container
  var DEFAULT_COOKIE_CONSENT
  var ALL_COOKIE_CONSENT

  beforeEach(function () {
    container = document.createElement('div')

    container.innerHTML =
      '<div id="global-cookie-message" class="gem-c-cookie-banner govuk-clearfix govuk-cookie-banner js-banner-wrapper" data-module="cookie-banner" data-nosnippet="" role="region" aria-label="Cookies on GOV.UK" hidden>' +
          '<div class="govuk-cookie-banner__message govuk-width-container">' +
              '<div class="govuk-grid-row">' +
                  '<div class="govuk-grid-column-two-thirds">' +
                      '<h2 class="govuk-cookie-banner__heading govuk-heading-m">Cookies on GOV.UK</h2>' +
                      '<div tabindex="-1" class="govuk-cookie-banner__content gem-c-cookie-banner__confirmation">' +
                          '<span class="gem-c-cookie-banner__content">' +
                              '<p class="govuk-body">We use some essential cookies to make this website work.</p>' +
                              '<p class="govuk-body">We’d like to set additional cookies to understand how you use GOV.UK, remember your settings and improve government services.</p>' +
                              '<p class="govuk-body">We also use cookies set by other sites to help us deliver content from their services.</p>' +
                          '</span>' +
                          '<p class="gem-c-cookie-banner__confirmation-message--accepted govuk-body" hidden="">You have accepted additional cookies. <span class="gem-c-cookie-banner__confirmation-message">You can <a class="govuk-link" href="/help/cookies">change your cookie settings</a> at any time.</span></p>' +
                          '<p class="gem-c-cookie-banner__confirmation-message--rejected govuk-body" hidden="">You have rejected additional cookies. <span class="gem-c-cookie-banner__confirmation-message">You can <a class="govuk-link" href="/help/cookies">change your cookie settings</a> at any time.</span></p>' +
                      '</div>' +
                  '</div>' +
              '</div>' +
              '<div class="js-confirmation-buttons govuk-button-group">' +
                  '<button class="gem-c-button govuk-button" type="submit" data-accept-cookies="true" data-cookie-types="all" style="display: block;">Accept additional cookies</button>' +
                  '<button class="gem-c-button govuk-button" type="submit" data-reject-cookies="true" style="display: block;">Reject additional cookies</button>' +
                  '<a class="govuk-link" href="/help/cookies">View cookies</a>' +
              '</div>' +
              '<div hidden="" class="js-hide-button govuk-button-group">' +
                  '<button class="gem-c-cookie-banner__hide-button govuk-button" data-hide-cookie-banner="true" >Hide this message</button>' +
              '</div>' +
          '</div>' +
      '</div>'
    document.body.appendChild(container)
  })

  afterEach(function () {
    delete window.GOVUK.useSingleConsentApi
    document.body.removeChild(container)
  })

  describe('when the single consent api is not enabled', function () {
    beforeEach(function () {
      // set and store consent for all as a basis of comparison
      window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      ALL_COOKIE_CONSENT = GOVUK.getCookie('cookies_policy')

      // set and store default cookie consent to use as basis of comparison
      window.GOVUK.setDefaultConsentCookie()
      DEFAULT_COOKIE_CONSENT = GOVUK.getCookie('cookies_policy')
    })

    it('should show the cookie banner', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var cookieBannerMain = document.querySelector('.js-banner-wrapper')
      var cookieBannerConfirmationAccept = document.querySelector('.gem-c-cookie-banner__confirmation-message--accepted')
      var cookieBannerConfirmationReject = document.querySelector('.gem-c-cookie-banner__confirmation-message--rejected')

      expect(element).toBeVisible()
      expect(cookieBannerMain).toBeVisible()
      expect(cookieBannerConfirmationAccept).toBeHidden()
      expect(cookieBannerConfirmationReject).toBeHidden()
    })

    it('should show the cookie banner when preferences have not been actively set', function () {
      GOVUK.setDefaultConsentCookie() // Set default cookies, which are set whether there is any interaction or not.

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var cookieBannerMain = document.querySelector('.js-banner-wrapper')
      var cookieBannerConfirmationAccept = document.querySelector('.gem-c-cookie-banner__confirmation-message--accepted')
      var cookieBannerConfirmationReject = document.querySelector('.gem-c-cookie-banner__confirmation-message--rejected')

      expect(element).toBeVisible()
      expect(cookieBannerMain).toBeVisible()
      expect(cookieBannerConfirmationAccept).toBeHidden()
      expect(cookieBannerConfirmationReject).toBeHidden()
    })

    it('should hide the cookie banner when preferences have been actively set', function () {
      GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      expect(element).toBeHidden()
    })

    it('should have the hidden attribute by default, and remove it once the JS loads when cookies are not set', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      expect(element.hasAttribute('hidden')).toEqual(true)
      expect(element.offsetParent).toEqual(null)
      new GOVUK.Modules.CookieBanner(element).init()
      expect(element.hasAttribute('hidden')).toEqual(false)
      expect(!!element.offsetParent).toEqual(true)
    })

    it('should have the hidden attribute by default, and leave it when cookies are set', function () {
      GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
      var element = document.querySelector('[data-module="cookie-banner"]')
      expect(element.offsetParent).toEqual(null)
      expect(element.hasAttribute('hidden')).toEqual(true)
      new GOVUK.Modules.CookieBanner(element).init()
      expect(element.offsetParent).toEqual(null)
      expect(element.hasAttribute('hidden')).toEqual(true)
    })

    it('sets a default consent cookie', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      expect(GOVUK.getCookie('cookies_preferences_set')).toEqual(null)
      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
    })

    it('deletes unconsented cookies if cookie preferences not explicitly set', function () {
      window.GOVUK.setCookie('_ga', 'this is not allowed!')
      spyOn(GOVUK, 'deleteUnconsentedCookies').and.callThrough()

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
      expect(GOVUK.deleteUnconsentedCookies).toHaveBeenCalled()
      expect(GOVUK.getCookie('_ga', null))
    })

    it('sets consent cookie when accepting cookies', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      // Manually reset the consent cookie so we can check the accept button works as intended
      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
      GOVUK.cookie('cookies_policy', null)

      var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
      acceptCookiesButton.click()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', 'true', { days: 365 })
      expect(GOVUK.getCookie('cookies_preferences_set')).toEqual('true')
      expect(GOVUK.getCookie('cookies_policy')).toEqual(ALL_COOKIE_CONSENT)
    })

    it('sets global_banner_seen cookie when accepting cookies', function () {
      if (typeof GOVUK.globalBannerInit === 'undefined') {
        GOVUK.globalBannerInit = {
          init: function () {}
        }
      }
      spyOn(GOVUK.globalBannerInit, 'init')
      spyOn(GOVUK, 'setCookie').and.callThrough()

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      // Manually reset the consent cookie so we can check the accept button works as intended
      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
      GOVUK.cookie('cookies_policy', null)

      var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
      acceptCookiesButton.click()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', 'true', { days: 365 })
      expect(GOVUK.getCookie('cookies_preferences_set')).toEqual('true')
      expect(GOVUK.getCookie('cookies_policy')).toEqual(ALL_COOKIE_CONSENT)
      expect(GOVUK.globalBannerInit.init).toHaveBeenCalled()
    })

    it('shows a confirmation message when cookies have been accepted', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
      var confirmationMessageAccepted = document.querySelector('.gem-c-cookie-banner__confirmation-message--accepted')

      expect(confirmationMessageAccepted).toBeHidden()

      acceptCookiesButton.click()

      expect(confirmationMessageAccepted).toBeVisible()
      expect(confirmationMessageAccepted.innerText).toContain('You have accepted additional cookies. You can change your cookie settings at any time.')
    })

    it('shows a confirmation message when cookies have been rejected', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var rejectCookiesButton = document.querySelector('[data-reject-cookies]')
      var confirmationMessageRejected = document.querySelector('.gem-c-cookie-banner__confirmation-message--rejected')

      expect(confirmationMessageRejected).toBeHidden()

      rejectCookiesButton.click()

      expect(confirmationMessageRejected).toBeVisible()
      expect(confirmationMessageRejected.innerText).toContain('You have rejected additional cookies. You can change your cookie settings at any time.')
    })

    it('set focus to the confirmation message after clicking button', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var rejectCookiesButton = document.querySelector('[data-reject-cookies]')
      var confirmationMessage = document.querySelector('.gem-c-cookie-banner__confirmation')

      rejectCookiesButton.click()

      var focusedElement = document.activeElement

      expect(focusedElement.className).toBe(confirmationMessage.className)
    })

    it('set cookies_preferences_set cookie, and re-set cookies_policy expiration date when rejecting cookies', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var rejectCookiesButton = document.querySelector('[data-reject-cookies]')

      rejectCookiesButton.click()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', DEFAULT_COOKIE_CONSENT, { days: 365 })
      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', 'true', { days: 365 })
    })

    it('should hide when pressing the "hide" link', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()

      var link = document.querySelector('button[data-hide-cookie-banner="true"]')
      link.dispatchEvent(new window.Event('click'))

      expect(element).toBeHidden()
      expect(GOVUK.getCookie('cookies_preferences_set')).toBeTruthy()
    })

    describe('when rendered inside an iframe', function () {
      var windowParent = window.parent
      var mockWindowParent = {} // window.parent would be different than window when used inside an iframe

      beforeEach(function () {
        window.parent = mockWindowParent
      })

      afterEach(function () {
        window.parent = windowParent
      })

      it('should hide the cookie banner', function () {
        var element = document.querySelector('[data-module="cookie-banner"]')
        new GOVUK.Modules.CookieBanner(element).init()
        expect(element).toBeHidden()
      })
    })
  })

  xdescribe('when the single consent api is enabled', function () {
    var acceptAll = {
      essential: true,
      usage: true,
      campaigns: true,
      settings: true
    }
    var rejectAll = {
      essential: true,
      usage: false,
      campaigns: false,
      settings: false
    }
    var mix = {
      essential: true,
      usage: false,
      campaigns: true,
      settings: true
    }

    beforeEach(function () {
      window.GOVUK.useSingleConsentApi = true
      // delete consent cookies
      window.GOVUK.cookie('cookies_policy')
      window.GOVUK.cookie('cookies_preferences_set')
      spyOn(window.GOVUK, 'setCookie')
      spyOn(window.GOVUK.singleConsent, 'init').and.callThrough()
      spyOn(window.GOVUK.singleConsent, 'apiCallback').and.callThrough()
    })

    afterEach(function () {
      // delete consent cookies
      window.GOVUK.cookie('cookies_policy')
      window.GOVUK.cookie('cookies_preferences_set')
    })

    it('initialises the single consent api on init', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()
      expect(window.GOVUK.singleConsent.init).toHaveBeenCalled()
      expect(window.GOVUK.singleConsent.apiCallback).toHaveBeenCalled()
      expect(window.GOVUK.setCookie).not.toHaveBeenCalled()
    })

    it('should show the cookie banner', function () {
      var element = document.querySelector('[data-module="cookie-banner"]')
      new GOVUK.Modules.CookieBanner(element).init()
      expect(element).toBeVisible()
    })

    describe('when a consent api UUID is passed in the URL', function () {
      var existingUrl

      beforeEach(function () {
        jasmine.Ajax.install()
        existingUrl = window.location.pathname + window.location.search
        window.history.replaceState(null, null, '?gov_singleconsent_uid=1234')
      })

      afterEach(function () {
        jasmine.Ajax.uninstall()
        window.history.replaceState(null, null, existingUrl)
      })

      it('should hide the cookie banner and set cookies for consent', function () {
        var element = document.querySelector('[data-module="cookie-banner"]')
        new GOVUK.Modules.CookieBanner(element).init()
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(acceptAll) + '}'
        })
        expect(element).not.toBeVisible()
        expect(window.GOVUK.cookie('cookies_preferences_set')).toEqual('true')
        expect(window.GOVUK.cookie('cookies_policy')).toEqual(JSON.stringify(acceptAll))
        expect(window.GOVUK.setCookie).not.toHaveBeenCalled()
      })

      it('should hide the cookie banner and set cookies for reject', function () {
        var element = document.querySelector('[data-module="cookie-banner"]')
        new GOVUK.Modules.CookieBanner(element).init()
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(rejectAll) + '}'
        })
        expect(element).not.toBeVisible()
        expect(window.GOVUK.cookie('cookies_preferences_set')).toEqual('true')
        expect(window.GOVUK.cookie('cookies_policy')).toEqual(JSON.stringify(rejectAll))
        expect(window.GOVUK.setCookie).not.toHaveBeenCalled()
      })

      it('should hide the cookie banner and set cookies for a varied cookie consent', function () {
        var element = document.querySelector('[data-module="cookie-banner"]')
        new GOVUK.Modules.CookieBanner(element).init()
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(mix) + '}'
        })
        expect(element).not.toBeVisible()
        expect(window.GOVUK.cookie('cookies_preferences_set')).toEqual('true')
        expect(window.GOVUK.cookie('cookies_policy')).toEqual(JSON.stringify(mix))
        expect(window.GOVUK.setCookie).not.toHaveBeenCalled()
      })
    })
  })
})
