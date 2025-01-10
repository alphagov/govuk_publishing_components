/* eslint-env jasmine, jquery */
/* global GOVUK, globalBarInit */

describe('Global bar initialize', function () {
  function expectGlobalBarToShow () {
    expect($('html').hasClass('show-global-bar')).toBe(true)
  }

  function expectGlobalBarToBeHidden () {
    expect($('html').hasClass('show-global-bar')).toBe(false)
  }

  function expectGa4AttributeToExist () {
    expect($('#global-bar').attr('data-ga4-global-bar')).toBe('')
  }

  function expectGa4AttributeToNotExist () {
    expect($('#global-bar').attr('data-ga4-global-bar')).toBe(undefined)
  }

  // function expectAdditionalSectionToBeVisible () {
  //   expect($('.global-bar-additional').hasClass('global-bar-additional--show')).toBe(true)
  // }

  beforeAll(function () {
    $('html').append('<div id="global-bar"></div>')
  })

  afterAll(function () {
    $('#global-bar').remove()
  })

  beforeEach(function () {
    deleteAllCookies()
    spyOn(globalBarInit, 'getBannerVersion').and.returnValue(5)
    $('html').removeClass('show-global-bar')
    $('#global-bar').removeAttr('data-ga4-global-bar')

    window.GOVUK.setConsentCookie({ settings: true })
  })

  it('does not show the banner on a blocked URL', function () {
    spyOn(globalBarInit, 'urlBlockList').and.returnValue(true)
    GOVUK.globalBarInit.init()

    // The cookie should still be set, but the banner should not be visible
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToBeHidden()
    expectGa4AttributeToNotExist()
  })

  it('sets global_bar_seen cookie', function () {
    GOVUK.globalBarInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
    expectGa4AttributeToExist()
  })

  it('sets cookie to default value if current cookie is old (prior to versioning mechanism)', function () {
    GOVUK.setCookie('global_bar_seen', 1)
    GOVUK.globalBarInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)

    expectGlobalBarToShow()
    expectGa4AttributeToExist()
  })

  it('resets cookie if version number is out of date, if count below 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 1, version: 1 }))
    GOVUK.globalBarInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
    expectGa4AttributeToExist()
  })

  it('resets cookie if version number is out of date, if count above 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 10, version: 1 }))
    GOVUK.globalBarInit.init()

    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
    expectGa4AttributeToExist()
  })

  it('makes banner visible if view count is less than 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 1, version: 5 }))
    GOVUK.globalBarInit.init()

    expectGlobalBarToShow()
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
