/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Cookie banner', function () {
  'use strict'

  var container
  var DEFAULT_COOKIE_CONSENT
  var ALL_COOKIE_CONSENT

  beforeEach(function () {
    container = document.createElement('div')

    container.innerHTML = `
      <div id="global-cookie-message" data-module="cookie-banner" data-nosnippet="" aria-label="Cookies on GOV.UK"
        class="gem-c-cookie-banner govuk-clearfix govuk-cookie-banner js-banner-wrapper" role="region" hidden="hidden">
        <div class="govuk-cookie-banner__message govuk-width-container">
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
              <h2 class="govuk-cookie-banner__heading govuk-heading-m">Cookies on GOV.UK</h2>
              <div tabindex="-1" class="govuk-cookie-banner__content gem-c-cookie-banner__confirmation">
                <div class="gem-c-cookie-banner__content">
                  <p class='govuk-body'>We use some essential cookies to make this website work.</p>
                  <p class='govuk-body'>We’d like to set additional cookies to understand how you use GOV.UK, remember your
                    settings and improve government services.</p>
                  <p class='govuk-body'>We also use cookies set by other sites to help us deliver content from their services.
                  </p>
                </div>
                <p class="gem-c-cookie-banner__confirmation-message--accepted govuk-body" hidden data-ga4-cookie-banner
                  data-module="ga4-link-tracker" data-ga4-track-links-only data-ga4-set-indexes
                  data-ga4-link="{'event_name':'navigation','type':'cookie banner','section':'You have accepted additional cookies'}">
                  You have accepted additional cookies. <span class="gem-c-cookie-banner__confirmation-message">You can <a
                      class="govuk-link" href="/help/cookies">change your cookie settings</a> at any time.</span></p>
                <p class="gem-c-cookie-banner__confirmation-message--rejected govuk-body" hidden>You have rejected additional
                  cookies. <span class="gem-c-cookie-banner__confirmation-message">You can <a class="govuk-link"
                      href="/help/cookies">change your cookie settings</a> at any time.</span></p>
              </div>
            </div>
          </div>
          <div class="js-confirmation-buttons govuk-button-group">
            <button class="gem-c-button govuk-button" type="submit" data-accept-cookies="true" data-cookie-types="all">
              Accept additional cookies
            </button>
            <button class="gem-c-button govuk-button" type="submit" data-reject-cookies="true">
              Reject additional cookies
            </button>
            <a class="govuk-link" href="/help/cookies">View cookies</a>
          </div>
          <div hidden class="js-hide-button govuk-button-group">
            <button class="gem-c-cookie-banner__hide-button govuk-button" data-hide-cookie-banner="true"
              data-module="ga4-event-tracker"
              data-ga4-event="{'event_name':'select_content','type':'cookie banner','action':'closed','section':'You have accepted additional cookies'}">
              Hide cookie message
            </button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(container)
  })

  beforeEach(function () {
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
