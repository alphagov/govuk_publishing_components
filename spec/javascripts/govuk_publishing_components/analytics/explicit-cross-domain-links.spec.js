/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Explicit cross-domain linker', function () {
  'use strict'

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

    element = $('<a href="#">')
    /* eslint-disable no-new */
    new GOVUK.Modules.ExplicitCrossDomainLinks(element[0])

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

  describe('when a cross-domain link is clicked', function () {
    it('modifies the link href to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is "false"', function () {
      GOVUK.cookie('cookies_preferences_set', 'false')
      expect(element.attr('href')).toEqual('#')
      window.GOVUK.triggerEvent(element[0], 'click')
      expect(element.attr('href')).toEqual('#?cookie_consent=not-engaged')
      expect(window.location.href).toContain('?cookie_consent=not-engaged')
    })

    it('modifies the link href to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is not set', function () {
      GOVUK.cookie('cookies_preferences_set', null)
      expect(element.attr('href')).toEqual('#')
      window.GOVUK.triggerEvent(element[0], 'click')
      expect(element.attr('href')).toEqual('#?cookie_consent=not-engaged')
      expect(window.location.href).toContain('?cookie_consent=not-engaged')
    })

    it('modifies the link href to append cookie_consent parameter "reject" if usage cookies have been rejected', function () {
      GOVUK.cookie('cookies_preferences_set', 'true')
      GOVUK.setConsentCookie({ usage: false })
      expect(element.attr('href')).toEqual('#')
      window.GOVUK.triggerEvent(element[0], 'click')
      expect(element.attr('href')).toEqual('#?cookie_consent=reject')
      expect(window.location.href).toContain('?cookie_consent=reject')
    })

    describe('user has accepted cookies', function () {
      it('modifies the link href to append cookie_consent parameter "accept" and adds _ga if trackers are present', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = [{ ga_mock: 'foobar' }]

        expect(element.attr('href')).toEqual('#')
        window.GOVUK.triggerEvent(element[0], 'click')

        expect(element.attr('href')).toEqual('#?cookie_consent=accept&_ga=abc123')
        expect(window.location.href).toContain('?cookie_consent=accept&_ga=abc123')
      })

      it('modifies the link href to only append cookie_consent "accept" if there are no trackers', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = []

        expect(element.attr('href')).toEqual('#')
        window.GOVUK.triggerEvent(element[0], 'click')
        expect(element.attr('href')).toEqual('#?cookie_consent=accept')
        expect(window.location.href).toContain('?cookie_consent=accept')
      })

      it('modifies the link href to only append cookie_consent "accept" if ga is not initalised on window', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        expect(element.attr('href')).toEqual('#')
        window.GOVUK.triggerEvent(element[0], 'click')
        expect(element.attr('href')).toEqual('#?cookie_consent=accept')
        expect(window.location.href).toContain('?cookie_consent=accept')
      })
    })
  })

  describe('when a cross-domain form is submitted', function () {
    beforeEach(function () {
      element = $('<form method="POST" action="/somewhere">' +
               '<input type="hidden" name="key" value="value" />' +
               '<button type="submit">Create a GOV.UK account</button>' +
             '</form>')

      /* eslint-disable no-new */
      new GOVUK.Modules.ExplicitCrossDomainLinks(element[0])
    })

    it('modifies the form action to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is "false"', function () {
      GOVUK.cookie('cookies_preferences_set', 'false')
      expect(element.attr('action')).toEqual('/somewhere')
      window.GOVUK.triggerEvent(element[0], 'submit')

      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the form action to append cookie_consent parameter "not-engaged" if cookies_preferences_set cookie is not set', function () {
      GOVUK.cookie('cookies_preferences_set', null)
      expect(element.attr('action')).toEqual('/somewhere')
      window.GOVUK.triggerEvent(element[0], 'submit')
      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=not-engaged')
    })

    it('modifies the form action to append cookie_consent parameter "reject" if usage cookies have been rejected', function () {
      GOVUK.cookie('cookies_preferences_set', 'true')
      GOVUK.setConsentCookie({ usage: false })
      expect(element.attr('action')).toEqual('/somewhere')
      window.GOVUK.triggerEvent(element[0], 'submit')
      expect(element.attr('action')).toEqual('/somewhere?cookie_consent=reject')
    })

    describe('user accepts cookies', function () {
      it('modifies the form action to append cookie_consent parameter "accept" and adds _ga if trackers are present', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = [{ ga_mock: 'foobar' }]
        expect(element.attr('action')).toEqual('/somewhere')
        window.GOVUK.triggerEvent(element[0], 'submit')
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept&_ga=abc123')
      })

      it('modifies the form action to only append cookie_consent "accept" if there are no trackers', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        trackers = []
        expect(element.attr('action')).toEqual('/somewhere')
        window.GOVUK.triggerEvent(element[0], 'submit')
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept')
      })

      it('modifies the form action to only append cookie_consent "accept" if ga is not initalized on window', function () {
        GOVUK.cookie('cookies_preferences_set', 'true')
        GOVUK.setConsentCookie({ usage: true })
        window.ga = undefined
        expect(element.attr('action')).toEqual('/somewhere')
        window.GOVUK.triggerEvent(element[0], 'submit')
        expect(element.attr('action')).toEqual('/somewhere?cookie_consent=accept')
      })
    })
  })
})
