/* eslint-env jasmine, jquery */
/* global GOVUK */
describe('Global banner module', function () {
  'use strict'

  var globalBanner
  var element

  beforeEach(function () {
    window.GOVUK.setConsentCookie({ settings: true })
    document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  })

  afterEach(function () {
    window.GOVUK.setConsentCookie({ settings: null })
    $('#global-banner').remove()
  })

  describe('global banner default', function () {
    beforeEach(function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-banner-version="5">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )

      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('sets basic global_banner_seen cookie if not already set', function () {
      expect(GOVUK.getCookie('global_banner_seen')).toBeNull()

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    })

    it('sets basic global_banner_seen cookie if existing one is malformed', function () {
      GOVUK.setCookie('global_banner_seen', 1)

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
    })
  })

  describe('global banner interactions', function () {
    beforeEach(function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-banner-version="6">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )

      $(document.body).append(element)
      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('increments view count', function () {
      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 6 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(2)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(6)
    })
  })

  describe('always on', function () {
    beforeEach(function () {
      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('does not increment view count when on', function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-banner-version="11" data-global-banner-permanent="true">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )
      $(document.body).append(element)

      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 2, version: 11 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(2)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(11)
    })

    it('continues to increment view count when off', function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-banner-version="11" data-global-banner-permanent="false">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )
      $(document.body).append(element)

      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 2, version: 11 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(3)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(11)
    })
  })

  describe('on initialise for cookies', function () {
    function expectGlobalBannerToShow () {
      expect($('html').hasClass('show-global-banner')).toBe(true)
    }

    function expectGa4AttributeToExist () {
      expect($('#global-banner').attr('data-ga4-global-banner')).toBe('')
    }

    function deleteAllCookies () {
      var cookies = document.cookie.split(';')

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i]
        var eqPos = cookie.indexOf('=')
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }

    beforeEach(function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-banner-version="5">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )
      $('html').append(element)
      $('html').removeClass('show-global-banner')
      deleteAllCookies()
      window.GOVUK.setConsentCookie({ settings: true })
    })

    it('sets global_banner_seen cookie', function () {
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
      expectGlobalBannerToShow()
      expectGa4AttributeToExist()
    })

    it('sets cookie to default value if current cookie is old (prior to versioning mechanism)', function () {
      GOVUK.setCookie('global_banner_seen', 1)
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)

      expectGlobalBannerToShow()
      expectGa4AttributeToExist()
    })

    it('resets cookie if version number is out of date, if count below 3', function () {
      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 1 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
      expectGlobalBannerToShow()
      expectGa4AttributeToExist()
    })

    it('resets cookie if version number is out of date, if count above 3', function () {
      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 10, version: 1 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(5)
      expectGlobalBannerToShow()
      expectGa4AttributeToExist()
    })

    it('makes banner visible if view count is less than 3', function () {
      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 5 }))
      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expectGlobalBannerToShow()
      expectGa4AttributeToExist()
    })
  })
})
