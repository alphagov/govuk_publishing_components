/* eslint-env jasmine */
/* global GOVUK */

describe('App promo banner', function () {
  'use strict'

  var container

  function initialiseAppBannerComponent () {
    var appPromoBanner = document.querySelector('[data-module="app-promo-banner"]')
    new GOVUK.Modules.AppPromoBanner(appPromoBanner).init()
    return appPromoBanner
  }

  function parseCookie (cookie) {
    return JSON.parse(cookie)
  }

  beforeEach(function () {
    // Set the Cookie permissions required
    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')

    // Set the User Agent to Android
    this.propertySpy = spyOnProperty(window.navigator, 'userAgent').and.returnValue('Android')

    container = document.createElement('div')
    // Added cookie banner to ensure the code works as expected
    container.innerHTML = `
      <div id="global-cookie-message" hidden>Cookie banner content</div>
      <div data-module="app-promo-banner" data-nosnippet="" aria-label="GOV.UK app"
        class="gem-c-app-promo-banner" role="region" hidden="hidden">
        <div class="govuk-width-container">
          <div class="gem-c-app-promo-banner__container">
            <button class="gem-c-app-promo-banner__close-button js-close-app-promo-banner" data-module="ga4-event-tracker"
              data-ga4-event="{'event_name':'select_content','type':'app promo banner','action':'closed','section':'Get the GOV.UK app'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" focusable="false">
              <title>Close app download banner</title>
              <circle cx="12" cy="12" r="11.5" stroke="currentColor" />
              <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m7 7 10 10m0-10L7 17" />
              </svg>
            </button>
            <img alt="" class="gem-c-app-promo-banner__icon" width="64" height="64"
              src="/assets/govuk_publishing_components/app-promo-banner/govuk-app-icon.png" />
            <div class="gem-c-app-promo-banner__content">
              <div class="gem-c-app-promo-banner__text">
                <h2 class="govuk-heading-s govuk-!-margin-bottom-0">Get the GOV.UK app</h2>
                <p class="govuk-body-s govuk-!-margin-bottom-0">Government made easier</p>
              </div>
              <a href="https://play.google.com/store/apps/details?id=uk.gov.govuk&hl=en_GB"
                class="govuk-link govuk-body govuk-!-margin-bottom-0" data-module="ga4-link-tracker"
                data-ga4-event="{'event_name':'navigation','type':'app promo banner','index_link':1, 'index_total': 1}">
                View
                <span class="govuk-visually-hidden">on Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  afterAll(function () {
    GOVUK.setCookie('cookies_policy', null)
  })

  it('is displayed with the correct attibutes and does not set a cookie on load', function () {
    var appPromoBanner = initialiseAppBannerComponent()

    expect(appPromoBanner).toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(false)
    expect(appPromoBanner.hasAttribute('data-nosnippet')).toEqual(true)
  })

  it('is not displayed if the user agent is not Android', function () {
    this.propertySpy.and.returnValue('Unsupported User Agent')

    var appPromoBanner = initialiseAppBannerComponent()

    expect(GOVUK.getCookie('app_promo_banner')).toBeNull()
    expect(appPromoBanner).not.toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(true)
  })

  it('is not displayed if the cookie banner is visible', function () {
    var cookieBanner = document.querySelector('#global-cookie-message')
    cookieBanner.removeAttribute('hidden')

    expect(GOVUK.getCookie('app_promo_banner')).toBeNull()

    var appPromoBanner = initialiseAppBannerComponent()

    expect(appPromoBanner).not.toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(true)
  })

  it('is hidden when the "close" button is clicked and sets the app_promo_banner cookie', function () {
    expect(GOVUK.getCookie('app_promo_banner')).toBeNull()

    var appPromoBanner = initialiseAppBannerComponent()

    var closeButton = appPromoBanner.querySelector('.js-close-app-promo-banner')
    closeButton.dispatchEvent(new window.Event('click'))

    expect(appPromoBanner).not.toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(true)
    expect(parseCookie(GOVUK.getCookie('app_promo_banner')).closed).toBe(true)
  })

  it('is hidden when the "close" button is clicked, but does not set the app_promo_banner cookie if settings consent is false', function () {
    window.GOVUK.setConsentCookie({ settings: false })

    var appPromoBanner = initialiseAppBannerComponent()

    var closeButton = appPromoBanner.querySelector('.js-close-app-promo-banner')
    closeButton.dispatchEvent(new window.Event('click'))

    expect(appPromoBanner).not.toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(true)
    expect(GOVUK.getCookie('app_promo_banner')).toBeNull()
  })

  it('is not displayed if the app banner was previously closed and app_promo_banner cookie set', function () {
    window.GOVUK.setCookie('app_promo_banner', '{ "closed": true }')

    var appPromoBanner = initialiseAppBannerComponent()

    expect(appPromoBanner).not.toHaveClass('gem-c-app-promo-banner--visible')
    expect(appPromoBanner.hasAttribute('hidden')).toEqual(true)
  })
})
