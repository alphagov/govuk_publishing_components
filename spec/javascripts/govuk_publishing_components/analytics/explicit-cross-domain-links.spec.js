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
    spyOn(linker, 'decorate').and.returnValue('/somewhere?_ga=abc123')
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

    it('leaves the link href if unchanged there are no trackers in ga', function () {
      trackers = []
      explicitCrossDomainLinks.start(element)
      expect(element.attr('href')).toEqual('/somewhere')
    })

    it('modifies the link href to append ids from ga to the destination url', function () {
      trackers = [{ ga_mock: 'foobar' }]
      explicitCrossDomainLinks.start(element)
      expect(element.attr('href')).toEqual('/somewhere?_ga=abc123')
    })
  })

  describe('forms', function () {
    beforeEach(function () {
      element = $('<form method="POST" action="/somewhere">' +
               '<input type="hidden" name="key" value="value" />' +
               '<button type="submit">Create a GOV.UK account</button>' +
             '</form>')
    })

    it('leaves the form action if unchanged there are no trackers in ga', function () {
      trackers = []
      explicitCrossDomainLinks.start(element)
      expect(element.attr('action')).toEqual('/somewhere')
    })

    it('modifies the form action to append ids from ga to the destination url', function () {
      trackers = [{ ga_mock: 'foobar' }]
      explicitCrossDomainLinks.start(element)
      expect(element.attr('action')).toEqual('/somewhere?_ga=abc123')
    })
  })
})
