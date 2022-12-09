/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Cookie banner', function () {
  'use strict'

  var container
  var DEFAULT_COOKIE_CONSENT
  var ALL_COOKIE_CONSENT
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
  window.GOVUK.analyticsVars.gaProperty = 'UA-123456-7'

  beforeEach(function () {
    container = document.createElement('div')

    container.innerHTML =
    '<div id="global-cookie-message" class="gem-c-cookie-banner govuk-clearfix" data-module="cookie-banner" role="region" aria-label="cookie banner" data-nosnippet="" style="display: block;">' +
      '<div class="govuk-cookie-banner js-banner-wrapper" role="region" aria-label="Cookies on GOV.UK">' +
        '<div class="gem-c-cookie-banner__message govuk-cookie-banner__message govuk-width-container govuk-body">' +
          '<div class="govuk-grid-row">' +
            '<div class="govuk-grid-column-two-thirds">' +
              '<h2 class="govuk-cookie-banner__heading govuk-heading-m">Cookies on GOV.UK</h2>' +
              '<div class="govuk-cookie-banner__content">' +
                '<p class="govuk-body">We use some essential cookies to make this website work</p>' +
                '<p class="govuk-body">We\'d like to set additional cookies to understand how you use GOV.UK, remember your settings and improve government services.</p>' +
                '<p class="govuk-body">We also use cookies set by other sites to help us deliver content from their services.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="govuk-button-group">' +
            '<button class="gem-c-button govuk-button" type="submit" data-module="gem-track-click" data-accept-cookies="true" data-track-category="cookieBanner" data-track-action="Cookie banner accepted" data-cookie-types="all" style="display: block;">Accept additional cookies</button>' +
            '<button class="gem-c-button govuk-button" type="submit" data-module="gem-track-click" data-reject-cookies="true" data-track-category="cookieBanner" data-track-action="Cookie banner rejected" style="display: block;">Reject additional cookies</button>' +
            '<a class="govuk-link" href="/help/cookies">View cookies</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="gem-c-cookie-banner__confirmation govuk-width-container" tabindex="-1" hidden="">' +
        '<p class="gem-c-cookie-banner__confirmation-message" role="alert">You can <a class="govuk-link" href="/help/cookies" data-module="gem-track-click" data-track-category="cookieBanner" data-track-action="Cookie banner settings clicked from confirmation">change your cookie settings</a> at any time.</p>' +
        '<div class="govuk-button-group">' +
          '<button class="gem-c-cookie-banner__hide-button govuk-button" data-hide-cookie-banner="true" data-module="gem-track-click" data-track-category="cookieBanner" data-track-action="Hide cookie banner">Hide this message</button>' +
        '</div>' +
      '</div>' +
    '</div>'

    document.body.appendChild(container)
    // set and store consent for all as a basis of comparison
    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    ALL_COOKIE_CONSENT = GOVUK.getCookie('cookies_policy')

    // set and store default cookie consent to use as basis of comparison
    window.GOVUK.setDefaultConsentCookie()
    DEFAULT_COOKIE_CONSENT = GOVUK.getCookie('cookies_policy')
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('should show the cookie banner', function () {
    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner(element).init()

    var cookieBannerMain = document.querySelector('.js-banner-wrapper')
    var cookieBannerConfirmation = document.querySelector('.gem-c-cookie-banner__confirmation')

    expect(window.specHelpers.isElementVisible(element)).toBeTruthy()
    expect(window.specHelpers.isElementVisible(cookieBannerMain)).toBeTruthy()
    expect(window.specHelpers.isElementHidden(cookieBannerConfirmation)).toEqual(true)
  })

  it('should show the cookie banner when preferences have not been actively set', function () {
    GOVUK.setDefaultConsentCookie() // Set default cookies, which are set whether there is any interaction or not.

    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner(element).init()

    var cookieBannerMain = document.querySelector('.js-banner-wrapper')
    var cookieBannerConfirmation = document.querySelector('.gem-c-cookie-banner__confirmation')

    expect(window.specHelpers.isElementVisible(element)).toBeTruthy()
    expect(window.specHelpers.isElementVisible(cookieBannerMain)).toBeTruthy()
    expect(window.specHelpers.isElementHidden(cookieBannerConfirmation)).toEqual(true)
  })

  it('should hide the cookie banner when preferences have been actively set', function () {
    GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })

    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner(element).init()

    expect(window.specHelpers.isElementHidden(element)).toEqual(true)
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
    spyOn(GOVUK, 'analyticsInit')
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
    expect(GOVUK.analyticsInit).toHaveBeenCalled()
  })

  it('sets global_bar_seen cookie when accepting cookies', function () {
    if (typeof GOVUK.globalBarInit === 'undefined') {
      GOVUK.globalBarInit = {
        init: function () {}
      }
    }
    spyOn(GOVUK.globalBarInit, 'init')
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
    expect(GOVUK.globalBarInit.init).toHaveBeenCalled()
  })

  it('shows a confirmation message when cookies have been accepted', function () {
    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner(element).init()

    var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
    var mainCookieBanner = document.querySelector('.gem-c-cookie-banner__message')
    var confirmationMessage = document.querySelector('.gem-c-cookie-banner__confirmation')

    expect(window.specHelpers.isElementVisible(mainCookieBanner)).toBeTruthy()
    expect(window.specHelpers.isElementHidden(confirmationMessage)).toEqual(true)

    acceptCookiesButton.click()

    expect(window.specHelpers.isElementHidden(mainCookieBanner)).toEqual(true)
    expect(window.specHelpers.isElementVisible(confirmationMessage)).toBeTruthy()
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

    expect(window.specHelpers.isElementHidden(element)).toEqual(true)
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
      expect(window.specHelpers.isElementHidden(element)).toEqual(true)
    })
  })
})
