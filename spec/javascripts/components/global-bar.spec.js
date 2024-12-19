/* global parseCookie, expectAdditionalSectionToBeHidden */
describe('Global bar module', function () {
  'use strict'

  var globalBar
  var element

  beforeEach(function () {
    window.GOVUK.setConsentCookie({ settings: true })
    document.cookie = 'global_bar_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  })

  afterEach(function () {
    window.GOVUK.setConsentCookie({ settings: null })
    $('#global-bar').remove()
  })

  describe('global banner default', function () {
    beforeEach(function () {
      element = $(
        '<div id="global-bar" data-module="global-bar">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
          '<a href="#hide-message" class="govuk-link dismiss" role="button" aria-controls="global-bar">Hide message</a>' +
          '<div class="global-bar-additional">This is some additional content</div>' +
        '</div>'
      )

      document.cookie = 'global_bar_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('sets basic global_bar_seen cookie if not already set', function () {
      expect(GOVUK.getCookie('global_bar_seen')).toBeNull()

      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)
    })

    it('sets basic global_bar_seen cookie if existing one is malformed', function () {
      GOVUK.setCookie('global_bar_seen', 1)

      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)
    })
  })

  describe('global banner interactions', function () {
    beforeEach(function () {
      element = $(
        '<div id="global-bar" data-module="global-bar">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
          '<a href="#hide-message" class="govuk-link dismiss" role="button" aria-controls="global-bar">Hide message</a>' +
        '</div>'
      )

      $(document.body).append(element)

      document.cookie = 'global_bar_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('increments view count', function () {
      GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 1, version: 0 }))

      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(2)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)
    })

    it('hides additional information section when dismiss link is clicked', function () {
      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      $(element).find('.dismiss')[0].click()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(999)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)

      expectAdditionalSectionToBeHidden()
    })

    it('hides dismiss link once dismiss link is clicked', function () {
      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      $(element).find('.dismiss')[0].click()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(999)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)

      expect($('.global-bar-dismiss').hasClass('global-bar-dismiss--show')).toBe(false)
    })
  })

  describe('always on', function () {
    beforeEach(function () {
      document.cookie = 'global_bar_seen=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })

    it('does not increment view count when on', function () {
      element = $(
        '<div id="global-bar" data-module="global-bar" data-global-bar-permanent="true">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
          '<a href="#hide-message" class="govuk-link dismiss" role="button" aria-controls="global-bar">Hide message</a>' +
        '</div>'
      )

      $(document.body).append(element)

      GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 2, version: 0 }))

      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(2)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)
    })

    it('continues to increment view count when off', function () {
      element = $(
        '<div id="global-bar" data-module="global-bar" data-global-bar-permanent="false">' +
          '<a href="/register-to-vote" class="govuk-link js-call-to-action">Register to Vote</a>' +
          '<a href="#hide-message" class="govuk-link dismiss" role="button" aria-controls="global-bar">Hide message</a>' +
        '</div>'
      )

      $(document.body).append(element)

      GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 2, version: 0 }))

      globalBar = new GOVUK.Modules.GlobalBar(element[0])
      globalBar.init()

      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(3)
      expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(0)
    })
  })
})
