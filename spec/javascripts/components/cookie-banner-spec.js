/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Cookie banner component', function () {
  'use strict'

  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
    '<div id="global-cookie-message" class="gem-c-cookie-banner" data-module="cookie-banner">' +
      '<p class="gem-c-cookie-banner__message govuk-width-container">' +
        '<a class="govuk-link" href="https://www.gov.uk/help/cookies">Find out more about cookies</a> or <a class="govuk-link" href="#" data-hide-cookie-banner="true">hide this message</a>' +
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
