/* eslint-env jasmine, jquery */
/* global GOVUK, globalBannerInit */

describe('Global banner initialize', function () {
  function expectGlobalBannerToShow () {
    expect($('html').hasClass('show-global-banner')).toBe(true)
  }

  function expectGa4AttributeToExist () {
    expect($('#global-banner').attr('data-ga4-global-banner')).toBe('')
  }

  beforeAll(function () {
    $('html').append('<div id="global-banner"></div>')
  })

  afterAll(function () {
    $('#global-banner').remove()
  })

  beforeEach(function () {
    deleteAllCookies()
    spyOn(globalBannerInit, 'getBannerVersion').and.returnValue(5)
    $('html').removeClass('show-global-banner')
    $('#global-banner').removeAttr('data-ga4-global-banner')

    window.GOVUK.setConsentCookie({ settings: true })
  })

  it('does not show the banner on a blocked URL', function () {
    spyOn(globalBannerInit, 'urlBlockList').and.returnValue(true)
    GOVUK.globalBannerInit.init()

    // The cookie should still be set, but the banner should not be visible
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    expectGlobalBannerToBeHidden()
    expectGa4AttributeToNotExist()
  })

  it('sets global_banner_seen cookie', function () {
    GOVUK.globalBannerInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    expectGlobalBannerToShow()
    expectGa4AttributeToExist()
  })

  it('sets cookie to default value if current cookie is old (prior to versioning mechanism)', function () {
    GOVUK.setCookie('global_banner_seen', 1)
    GOVUK.globalBannerInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)

    expectGlobalBannerToShow()
    expectGa4AttributeToExist()
  })

  it('resets cookie if version number is out of date, if count below 3', function () {
    GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 1 }))
    GOVUK.globalBannerInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    expectGlobalBannerToShow()
    expectGa4AttributeToExist()
  })

  it('resets cookie if version number is out of date, if count above 3', function () {
    GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 10, version: 1 }))
    GOVUK.globalBannerInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    expectGlobalBannerToShow()
    expectGa4AttributeToExist()
  })

  it('makes banner visible if view count is less than 3', function () {
    GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 5 }))
    GOVUK.globalBannerInit.init()

    expectGlobalBannerToShow()
    expectGa4AttributeToExist()
  })
})

function deleteAllCookies () {
  var cookies = document.cookie.split(';')

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]
    var eqPos = cookie.indexOf('=')
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
