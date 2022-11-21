/* eslint-env jasmine */

describe('GA4 core', function () {
  var GOVUK = window.GOVUK

  beforeEach(function () {
    window.dataLayer = []
    window.GOVUK.analyticsGa4.vars = {}
  })

  afterEach(function () {
    window.dataLayer = []
    window.GOVUK.analyticsGa4.vars.id = 'test-id'
    window.GOVUK.analyticsGa4.vars.auth = 'test-auth'
    window.GOVUK.analyticsGa4.vars.preview = 'test-preview'
    window.GOVUK.analyticsGa4.vars.gem_version = 'gem-version'
    window.GOVUK.analyticsGa4.vars.gtag_id = null
  })

  it('loads the GTM snippet', function () {
    GOVUK.analyticsGa4.core.load()

    expect(window.dataLayer.length).toEqual(2)
    expect(Object.keys(window.dataLayer[0])).toContain('gtm.blocklist')
    expect(Object.keys(window.dataLayer[1])).toContain('gtm.start')
    expect(Object.keys(window.dataLayer[1])).toContain('event')
    expect(window.dataLayer[0]['gtm.blocklist']).toEqual(['customPixels', 'customScripts', 'html', 'nonGoogleScripts'])
  })

  describe('calls the right URL from Google', function () {
    it('if all three env vars are present', function () {
      window.GOVUK.analyticsGa4.vars.id = 'test-id'
      window.GOVUK.analyticsGa4.vars.auth = 'test-auth'
      window.GOVUK.analyticsGa4.vars.preview = 'test-preview'
      GOVUK.analyticsGa4.core.load()

      expect(GOVUK.analyticsGa4.core.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=test-id&gtm_auth=test-auth&gtm_preview=test-preview&gtm_cookies_win=x')
    })

    it('if only id is present', function () {
      window.GOVUK.analyticsGa4.vars.id = 'test-id'
      GOVUK.analyticsGa4.core.load()

      expect(GOVUK.analyticsGa4.core.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=test-id')
    })
  })

  it('loads the GTAG snippet', function () {
    window.GOVUK.analyticsGa4.vars.gtag_id = 'fake'
    GOVUK.analyticsGa4.core.load()

    expect(window.dataLayer.length).toEqual(2)
    expect(window.dataLayer[0]).toContain('js')
    expect(window.dataLayer[1]).toContain('config')
  })

  it('pushes data to the dataLayer', function () {
    var data = {
      hello: 'I must be going'
    }
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
    GOVUK.analyticsGa4.core.sendData(data)
    expect(window.dataLayer[0]).toEqual({
      hello: 'I must be going',
      govuk_gem_version: 'aVersion'
    })
  })

  describe('link tracking functions', function () {
    describe('find tracking attributes on elements', function () {
      var element
      var trigger = 'ga4-trigger'

      beforeEach(function () {
        element = document.createElement('div')
        element.setAttribute(trigger, 'something')
      })

      it('when the element has the attribute', function () {
        var result = GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(element, trigger)
        expect(result).toEqual(element)
      })

      it('when a parent element has the attribute', function () {
        element.innerHTML = '<div class="clickme">Link</a>'
        var child = element.querySelector('.clickme')
        var result = GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(child, trigger)
        expect(result).toEqual(element)
      })
    })

    describe('dealing with long URLs', function () {
      var path = '/thisstringispreciselyfiftycharactersintotallength'
      var domains = [
        'https://www.gov.uk',
        'http://www.gov.uk',
        '//www.gov.uk',
        'https://gov.uk',
        'http://gov.uk',
        '//gov.uk'
      ]

      it('preserves the path as an object for a relative URL', function () {
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(path)).toEqual({
          1: path,
          2: undefined,
          3: undefined,
          4: undefined,
          5: undefined
        })
      })

      it('preserves a really long path correctly', function () {
        var href = path + path + path + path + path + path
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(href)).toEqual({
          1: path + path,
          2: path + path,
          3: path + path,
          4: undefined,
          5: undefined
        })
      })

      it('obeys the limit of 500 characters for really long paths', function () {
        var href = path + path + path + path + path + path + path + path + path + path + path + path + 'hello!'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(href)).toEqual({
          1: path + path,
          2: path + path,
          3: path + path,
          4: path + path,
          5: path + path
        })
      })

      it('preserves only the path as an object when a domain is present for all variants of GOV.UK', function () {
        var href
        for (var i = 0; i < domains.length; i++) {
          href = domains[i] + path
          expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(href)).toEqual({
            1: path,
            2: undefined,
            3: undefined,
            4: undefined,
            5: undefined
          })
        }
      })
    })

    it('correctly identifies a relative URL', function () {
      var href = '/relativeURL'
      expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative(href)).toEqual(true)
    })

    it('correctly identifies a non-relative URL', function () {
      var href = '//notarelativeURL'
      expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative(href)).toEqual(false)
    })

    it('correctly identifies an anchor link', function () {
      var href = '#link'
      expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsAnchor(href)).toEqual(true)
    })

    it('correctly identifies a non anchor link', function () {
      var href = '/link'
      expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsAnchor(href)).toEqual(false)
    })

    it('correctly identifies a mailto link', function () {
      var href = 'mailto:meunlessitsspam'
      expect(GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)).toEqual(true)
    })

    it('correctly identifies a non mailto link', function () {
      var href = '/link'
      expect(GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)).toEqual(false)
    })

    describe('when identifying internal links', function () {
      it('correctly identifies relative and anchor links as internal', function () {
        var href = '/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href)).toEqual(true)

        href = '#something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href)).toEqual(true)
      })

      it('correctly identifies an absolute link as internal when on the same domain', function () {
        var href = 'https://notasite.com/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href, ['notasite.com'])).toEqual(true)
      })
    })

    describe('when testing if a link points to a domain', function () {
      it('can tell if a link points to a domain', function () {
        var domain = 'www.gov.uk'
        var href = 'https://www.gov.uk/notarealpage'
        expect(GOVUK.analyticsGa4.core.trackFunctions.hrefPointsToDomain(href, domain)).toEqual(true)
      })

      it('can tell if a link doesn\'t point to a domain', function () {
        var domain = 'www.gov.uk'
        var href = 'https://www.somethingelse.uk/notarealpage'
        expect(GOVUK.analyticsGa4.core.trackFunctions.hrefPointsToDomain(href, domain)).toEqual(false)
      })
    })

    describe('when populating the link domain', function () {
      beforeEach(function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getHostname').and.returnValue('www.gov.uk')
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getProtocol').and.returnValue('https:')
      })

      it('ignores mailto links', function () {
        var href = 'mailto:meunlessitsspam'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual(undefined)
      })

      it('handles relative links and anchor links correctly', function () {
        var href = '/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual('https://www.gov.uk')

        href = '#something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual('https://www.gov.uk')
      })

      it('handles absolute links correctly', function () {
        var href = 'https://www.something.com/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual('https://www.something.com')

        href = 'http://www.something.com/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual('http://www.something.com')

        href = '//www.something.com/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(href)).toEqual('//www.something.com')
      })
    })
  })
})
