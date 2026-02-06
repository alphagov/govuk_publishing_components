/* eslint-env jasmine */
/* global GOVUK */

describe('Intervention banner component', function () {
  'use strict'

  var container

  var initWithCookie = function (setCookie) {
    if (setCookie) {
      GOVUK.setCookie('intervention_campaign', 'existing-value', { days: 1 })
    }

    container = document.createElement('div')
    container.innerHTML =
      '<section class="gem-c-intervention" data-module="intervention" data-intervention-name="test-intervention-name"><a class="govuk-link js-dismiss-link">Dismiss</a></section>'

    document.body.appendChild(container)
    var element = document.querySelector('[data-module="intervention"]')
    new GOVUK.Modules.Intervention(element).init()

    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  afterEach(function () {
    GOVUK.deleteCookie('intervention_campaign')
    document.body.removeChild(container)
  })

  describe('close banner', function () {
    beforeEach(function () {
      initWithCookie(false)
    })

    it('should hide intervention banner', function () {
      var banner = document.querySelector('.gem-c-intervention')
      var close = document.querySelector('.js-dismiss-link')
      expect(banner.checkVisibility()).toBe(true)

      close.click()

      expect(banner.checkVisibility()).toBe(false)
    })

    it('sets a cookie value', function () {
      spyOn(GOVUK, 'cookie').and.callThrough()
      var close = document.querySelector('.js-dismiss-link')
      close.click()

      expect(GOVUK.cookie).toHaveBeenCalled()
      var bannerCookie = GOVUK.cookie('intervention_campaign')
      expect(bannerCookie).toEqual('test-intervention-name')
    })
  })

  describe('when cookies are already set', function () {
    beforeEach(function () {
      initWithCookie(false)
    })

    it('does not display the banner', function () {
      GOVUK.setCookie('intervention_campaign', 'test-intervention-name', { days: 1 })
      var element = document.querySelector('[data-module="intervention"]')
      new GOVUK.Modules.Intervention(element).init()

      var banner = document.querySelector('.gem-c-intervention')

      expect(banner.checkVisibility()).toBe(false)
    })
  })

  describe('there is another concurrent campaign banner', function () {
    beforeEach(function () {
      initWithCookie(true)
    })

    it('appends campaign value to the cookie', function () {
      var close = document.querySelector('.js-dismiss-link')
      close.click()

      var updatedCookie = GOVUK.cookie('intervention_campaign')
      expect(updatedCookie).toEqual('existing-value,test-intervention-name')
    })
  })
})
