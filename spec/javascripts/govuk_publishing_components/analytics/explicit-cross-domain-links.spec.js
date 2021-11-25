/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Explicit cross-domain linker', function () {
  'use strict'

  var explicitCrossDomainLinks
  var element
  var linker
  var trackers

  beforeEach(function () {
    window.ga = function (callback) {
      window.ga = {
        getAll: function () {
          return trackers
        }
      }

      callback()
    }

    window.gaplugins = {
      Linker: function () {}
    }

    linker = {
      decorate: function () {}
    }

    explicitCrossDomainLinks = new GOVUK.Modules.ExplicitCrossDomainLinks()

    spyOn(window.gaplugins, 'Linker').and.returnValue(linker)
    spyOn(linker, 'decorate').and.callFake(function (url) {
      return url + '&_ga=abc123'
    })
  })

  afterEach(function () {
    element.remove()
    delete window.ga
    delete window.gaplugins
  })

  describe('links', function () {
    beforeEach(function () {
      element = $('<a href="/somewhere">')
    })

    it('modifies the link href to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is "false"', function () {
      GOVUK.cookie('cookies_preferences_set', 'false')
      explicitCrossDomainLinks.start(element)
      expect(element.attr('href')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the link href to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is not set', function () {
      GOVUK.cookie('cookies_preferences_set', null)
      explicitCrossDomainLinks.start(element)
      expect(element.attr('href')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the link href to append cookie_consent parameter "reject" if usage cookies have been rejected', function () {
      GOVUK.cookie('cookies_preferences_set', 'true')
      GOVUK.setConsentCookie({ usage: false })
      explicitCrossDomainLinks.start(element)
      expect(element.attr('href')).toEqual('/somewhere?cookie_consent=reject')
    })

    describe('user has accepted cookies', function () {
      it('modifies the link href to append cookie_consent parameter "accept" and adds _ga if trackers are present', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = [{ ga_mock: 'foobar' }]

        explicitCrossDomainLinks.start(element)

        expect(element.attr('href')).toEqual('/somewhere?cookie_consent=accept&_ga=abc123')
      })

      it('modifies the link href to only append cookie_consent "accept" if there are no trackers', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = []
        explicitCrossDomainLinks.start(element)
        expect(element.attr('href')).toEqual('/somewhere?cookie_consent=accept')
      })

      it('modifies the link href to only append cookie_consent "accept" if ga is not initalised on window', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        explicitCrossDomainLinks.start(element)
        expect(element.attr('href')).toEqual('/somewhere?cookie_consent=accept')
      })
    })

    describe('user has interacted with the cookie banner on the current page', function () {
      beforeEach(function () {
        GOVUK.cookie('cookies_preferences_set', null)
        explicitCrossDomainLinks.start(element)
        GOVUK.cookie('cookies_preferences_set', 'true')
      })
      it('modifies the link href to append cookie_consent parameter "accept" if the cookie-consent event was fired', function () {
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        window.GOVUK.triggerEvent(window, 'cookie-consent')

        expect(element.attr('href')).toEqual('/somewhere?cookie_consent=accept')
      })

      it('modifies the link href to append cookie_consent parameter "reject" if the cookie-reject event was fired', function () {
        GOVUK.setConsentCookie({ usage: false })
        window.GOVUK.triggerEvent(window, 'cookie-reject')

        expect(element.attr('href')).toEqual('/somewhere?cookie_consent=reject')
      })
    })
  })

  describe('forms', function () {
    beforeEach(function () {
      element = $('<form method="POST" action="/somewhere">' +
               '<input type="hidden" name="key" value="value" />' +
               '<button type="submit">Create a GOV.UK account</button>' +
             '</form>')
    })

    it('modifies the form action to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is "false"', function () {
      GOVUK.cookie('cookies_preferences_set', 'false')
      explicitCrossDomainLinks.start(element)
      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the form action to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is not set', function () {
      GOVUK.cookie('cookies_preferences_set', null)
      explicitCrossDomainLinks.start(element)
      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the form action to append cookie_consent parameter "reject" if usage cookies have been rejected', function () {
      GOVUK.cookie('cookies_preferences_set', 'true')
      GOVUK.setConsentCookie({ usage: false })
      explicitCrossDomainLinks.start(element)
      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=reject')
    })

    describe('user accepts cookies', function () {
      it('modifies the form action to append cookie_consent parameter "accept" and adds _ga if trackers are present', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = [{ ga_mock: 'foobar' }]
        explicitCrossDomainLinks.start(element)
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept&_ga=abc123')
      })

      it('modifies the form action to only append cookie_consent "accept" if there are no trackers', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = []
        explicitCrossDomainLinks.start(element)
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept')
      })

      it('modifies the form action to only append cookie_consent "accept" if ga is not initalized on window', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        explicitCrossDomainLinks.start(element)
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept')
      })
    })

    describe('user has interacted with the cookie banner on the current page', function () {
      beforeEach(function () {
        GOVUK.cookie('cookies_preferences_set', null)
        explicitCrossDomainLinks.start(element)
        GOVUK.cookie('cookies_preferences_set', 'true')
      })
      it('modifies the form action to append cookie_consent parameter "accept" if the cookie-consent event was fired', function () {
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        window.GOVUK.triggerEvent(window, 'cookie-consent')

        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept')
      })

      it('modifies the form action to append cookie_consent parameter "reject" if the cookie-reject event was fired', function () {
        GOVUK.setConsentCookie({ usage: false })
        window.GOVUK.triggerEvent(window, 'cookie-reject')

        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=reject')
      })
    })
  })
})
