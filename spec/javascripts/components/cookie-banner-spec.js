/* eslint-env jasmine, jquery */
/* global GOVUK */

var container

var GOVUK = window.GOVUK || {};

GOVUK.analytics = {
  trackEvent: function () {}
};

describe('Cookie banner is shown', function () {
  'use strict'

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent');
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
    GOVUK.analytics.trackEvent.calls.reset();
    document.body.removeChild(container)
  })

  it('should show the cookie banner', function () {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    expect(banner).toBeVisible()
  })

  it('should not fire a Google Analytics event when the cookie banner is shown', function() {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    expect(banner).toBeVisible()

    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled();
  })

  it('should hide when pressing the "hide" link', function () {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    var link = document.querySelector('a[data-hide-cookie-banner="true"]')
    link.dispatchEvent(new window.Event('click'))

    expect(banner).toBeHidden()
    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeTruthy()
  })
})

describe('Cookie banner is hidden', function() {
  'use strict'

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent');

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
    window.GOVUK.setCookie('seen_cookie_message', true)
    new GOVUK.Modules.CookieBanner().start($(element))
  })

  afterEach(function () {
    GOVUK.analytics.trackEvent.calls.reset();
    document.body.removeChild(container)
  })

  it('should fire a Google Analytics event when the cookie banner is hidden', function() {
    var banner = document.querySelector('[data-module="cookie-banner"]')
    window.GOVUK.setCookie('seen_cookie_message', true)

    expect(window.GOVUK.getCookie('seen_cookie_message')).toBeTruthy()
    expect(banner).toBeHidden()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cookieBanner', 'Cookie banner not shown', { nonInteraction: true });
  })
})
