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
        '<div id="global-banner" data-module="global-banner">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
          '<div class="global-banner-additional">This is some additional content</div>' +
        '</div>'
      )

      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('sets basic global_banner_seen cookie if not already set', function () {
      expect(GOVUK.getCookie('global_banner_seen')).toBeNull()

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(0)
    })

    it('sets basic global_banner_seen cookie if existing one is malformed', function () {
      GOVUK.setCookie('global_banner_seen', 1)

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(0)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(0)
    })
  })

  describe('global banner interactions', function () {
    beforeEach(function () {
      element = $(
        '<div id="global-banner" data-module="global-banner">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )

      $(document.body).append(element)

      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('increments view count', function () {
      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 1, version: 0 }))

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(2)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(0)
    })
  })

  describe('always on', function () {
    beforeEach(function () {
      document.cookie = 'global_banner_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('does not increment view count when on', function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-global-banner-permanent="true">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )

      $(document.body).append(element)

      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 2, version: 0 }))

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(2)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(0)
    })

    it('continues to increment view count when off', function () {
      element = $(
        '<div id="global-banner" data-module="global-banner" data-global-banner-permanent="false">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
        '</div>'
      )

      $(document.body).append(element)

      GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 2, version: 0 }))

      globalBanner = new GOVUK.Modules.GlobalBanner(element[0])
      globalBanner.init()

      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).count).toBe(3)
      expect(window.GOVUK.parseCookie(GOVUK.getCookie('global_banner_seen')).version).toBe(0)
    })
  })
})
