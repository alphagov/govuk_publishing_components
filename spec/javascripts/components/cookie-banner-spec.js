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
      '<div id="global-cookie-message" class="gem-c-cookie-banner" data-module="cookie-banner">' +
        '<div class="gem-c-cookie-banner__wrapper govuk-width-container" data-cookie-banner-main="true">' +
          '<p class="gem-c-cookie-banner__message">GOV.UK uses cookies which are essential for the site to work. We also use non-essential cookies to help us improve government digital services. Any data collected is anonymised.</p>' +
          '<div class="gem-c-cookie-banner__buttons">' +
            '<button class="gem-c-button govuk-button gem-c-button--secondary-quiet gem-c-button--inline" type="submit" data-module="track-click" data-accept-cookies="true" data-track-category="cookieBanner" data-track-action="Cookie banner accepted">Accept cookies</button>' +
            '<a class="gem-c-button govuk-button gem-c-button--secondary-quiet gem-c-button--inline" role="button" data-module="track-click" data-track-category="cookieBanner" data-track-action="Cookie banner settings clicked" href="/help/cookies">Cookie settings</a>' +
          '</div>' +
        '</div>' +
        '<div class="gem-c-cookie-banner__confirmation govuk-width-container" data-cookie-banner-confirmation="true" style="display: none;">' +
          '<p class="gem-c-cookie-banner__confirmation-message">' +
            'You have accepted all cookies' +
          '</p>' +
          '<button class="gem-c-cookie-banner__hide-button" data-hide-cookie-banner="true">Hide</button>' +
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
    new GOVUK.Modules.CookieBanner().start($(element))

    var cookieBannerMain = document.querySelector('.gem-c-cookie-banner__wrapper')
    var cookieBannerConfirmation = document.querySelector('.gem-c-cookie-banner__confirmation')

    expect(element).toBeVisible()
    expect(cookieBannerMain).toBeVisible()
    expect(cookieBannerConfirmation).toBeHidden()
  })

  it('should show the cookie banner when preferences have not been actively set', function () {
    GOVUK.setDefaultConsentCookie() // Set default cookies, which are set whether there is any interaction or not.

    var element = document.querySelector('[data-module="cookie-banner"]')

    new GOVUK.Modules.CookieBanner().start($(element))

    var cookieBannerMain = document.querySelector('.gem-c-cookie-banner__wrapper')
    var cookieBannerConfirmation = document.querySelector('.gem-c-cookie-banner__confirmation')

    expect(element).toBeVisible()
    expect(cookieBannerMain).toBeVisible()
    expect(cookieBannerConfirmation).toBeHidden()
  })

  it('should hide the cookie banner when preferences have been actively set', function () {
    GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })

    var element = document.querySelector('[data-module="cookie-banner"]')

    new GOVUK.Modules.CookieBanner().start($(element))

    expect(element).toBeHidden()
  })

  it('sets a default consent cookie', function () {
    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner().start($(element))

    expect(GOVUK.getCookie('cookies_preferences_set')).toEqual(null)
    expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
  })

  it('deletes unconsented cookies if cookie preferences not explicitly set', function () {
    window.GOVUK.setCookie('_ga', 'this is not allowed!')
    spyOn(GOVUK, 'deleteUnconsentedCookies').and.callThrough()

    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner().start($(element))

    expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
    expect(GOVUK.deleteUnconsentedCookies).toHaveBeenCalled()
    expect(GOVUK.getCookie('_ga', null))
  })

  it('sets consent cookie when accepting cookies', function () {
    spyOn(GOVUK, 'analyticsInit')
    spyOn(GOVUK, 'setCookie').and.callThrough()

    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner().start($(element))

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
    new GOVUK.Modules.CookieBanner().start($(element))

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
    new GOVUK.Modules.CookieBanner().start($(element))

    var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
    var mainCookieBanner = document.querySelector('div[data-cookie-banner-main]')
    var confirmationMessage = document.querySelector('div[data-cookie-banner-confirmation]')

    expect(mainCookieBanner).toBeVisible()
    expect(confirmationMessage).toBeHidden()

    acceptCookiesButton.click()

    expect(mainCookieBanner).toBeHidden()
    expect(confirmationMessage).toBeVisible()
  })

  it('should hide when pressing the "hide" link', function () {
    spyOn(GOVUK, 'setCookie').and.callThrough()

    var element = document.querySelector('[data-module="cookie-banner"]')
    new GOVUK.Modules.CookieBanner().start($(element))

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
      new GOVUK.Modules.CookieBanner().start($(element))
      expect(element).toBeHidden()
    })
  })
})
