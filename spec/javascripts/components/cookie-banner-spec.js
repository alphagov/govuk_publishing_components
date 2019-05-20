/* eslint-env jasmine, jquery */
/* global GOVUK */

var container

var GOVUK = window.GOVUK || {};

describe('Cookie banner is shown', function () {
  'use strict'

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
    '<div id="global-cookie-message" class="gem-c-cookie-banner" data-module="cookie-banner">' +
      '<p class="gem-c-cookie-banner__message govuk-width-container">' +
        '<a class="govuk-link" href="/help/cookies">Find out more about cookies</a> or <a class="govuk-link" href="#" data-hide-cookie-banner="true">hide this message</a>' +
      '</p>' +
    '</div>'

    document.body.appendChild(container)
    var element = document.querySelector('[data-module="cookie-banner"]')
    window.GOVUK.cookie('seen_cookie_message', null)
    new GOVUK.Modules.CookieBanner().start($(element))
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('should show the cookie banner', function () {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    expect(window.GOVUK.getCookie('cookie_policy')).toBeFalsy()
    expect(banner).toBeVisible()
  })

  it('should hide when pressing the "hide" link', function () {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    var link = document.querySelector('a[data-hide-cookie-banner="true"]')
    link.dispatchEvent(new window.Event('click'))

    expect(banner).toBeHidden()
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeTruthy()
  })
})

describe('New cookie banner', function () {
  'use strict'

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
    '<div id="global-cookie-message" class="gem-c-cookie-banner--new" data-module="cookie-banner">' +
      '<div class="gem-c-cookie-banner__wrapper govuk-width-container" data-cookie-banner-main="true">' +
        '<p class="gem-c-cookie-banner__message">GOV.UK uses cookies to make the site simpler.</p>' +
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
    var element = document.querySelector('.gem-c-cookie-banner--new[data-module="cookie-banner"]')
    window.GOVUK.cookie('seen_cookie_message', null)
    window.GOVUK.cookie('cookie_policy', null)
    new GOVUK.Modules.CookieBanner().start($(element))
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('sets a default consent cookie', function () {
    var banner = document.querySelector('.gem-c-cookie-banner--new[data-module="cookie-banner"]')
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    expect(window.GOVUK.getCookie('cookie_policy')).toEqual('"{\\"essential\\":true,\\"settings\\":true,\\"usage\\":true,\\"campaigns\\":true}"')
    expect(banner).toBeVisible()
  })

  it('sets consent cookie when accepting cookies', function() {
    var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
    acceptCookiesButton.click()
    expect(window.GOVUK.getCookie('cookie_policy')).toEqual('"{\\"essential\\":true,\\"settings\\":true,\\"usage\\":true,\\"campaigns\\":true}"')
  })

  it('shows a confirmation message when accepting cookies', function() {
    var acceptCookiesButton = document.querySelector('[data-accept-cookies]')
    var mainCookieBanner = document.querySelector('div[data-cookie-banner-main]')
    var confirmationMessage = document.querySelector('div[data-cookie-banner-confirmation]')

    expect(mainCookieBanner).toBeVisible()
    expect(confirmationMessage).not.toBeVisible()

    acceptCookiesButton.click()

    expect(mainCookieBanner).not.toBeVisible()
    expect(confirmationMessage).toBeVisible()
  })
})
