/* eslint-env jasmine */

describe('GA4 core', function () {
  var GOVUK = window.GOVUK
  var id
  var auth
  var preview

  beforeEach(function () {
    window.dataLayer = []
    id = window.GOVUK.analyticsGa4.vars.id
    auth = window.GOVUK.analyticsGa4.vars.auth
    preview = window.GOVUK.analyticsGa4.vars.preview

    window.GOVUK.analyticsGa4.vars.id = undefined
    window.GOVUK.analyticsGa4.vars.auth = undefined
    window.GOVUK.analyticsGa4.vars.preview = undefined
  })

  afterEach(function () {
    window.dataLayer = []
    window.GOVUK.analyticsGa4.vars.id = id
    window.GOVUK.analyticsGa4.vars.auth = auth
    window.GOVUK.analyticsGa4.vars.preview = preview
    window.GOVUK.analyticsGa4.vars.gtag_id = null

    window.GOVUK.analyticsGa4.vars.internalDomains = ['www.gov.uk']
    window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)
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

    it('correctly identifies relative URLs', function () {
      var relativeURLs = [
        'g',
        './g',
        'g/',
        '/g',
        '?y',
        'g?y',
        'g?y/./x',
        '#s',
        'g#s',
        'g#s/./x',
        'g?y#s',
        ';x',
        'g;x',
        'g;x?y#s',
        '.',
        './',
        '..',
        '../',
        '../g',
        '../..',
        '../../',
        '../../g',
        '']

      for (var i = 0; i < relativeURLs.length; i++) {
        var href = relativeURLs[i]
        expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative(href)).toEqual(true)
      }

      // When no href is passed
      expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative()).toEqual(true)
    })

    it('correctly identifies non-relative URLs', function () {
      var nonRelativeURLs = ['//notarelativeURL',
        'https://www.gov.uk',
        'http://gov.uk',
        'https://www.gov.uk/#anchor',
        'http://www.gov.uk/path']
      for (var i = 0; i < nonRelativeURLs.length; i++) {
        var href = nonRelativeURLs[i]
        expect(GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative(href)).toEqual(false)
      }
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
        window.GOVUK.analyticsGa4.vars.internalDomains.push('www.notasite.com')
        window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)

        var href = 'https://notasite.com/something'
        expect(GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href)).toEqual(true)
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

    it('accepts an array of domains and increases it to include variants without www at the start', function () {
      var domains = ['www.gov.uk']
      GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(domains)
      expect(domains).toContain('www.gov.uk')
      expect(domains).toContain('gov.uk')
    })

    describe('when the data-ga4-set-indexes property exists on the module', function () {
      var module

      beforeEach(function () {
        module = document.createElement('div')
        module.setAttribute('data-ga4-link', '{"someData": "blah"}')
        module.innerHTML = '<a id="example1" href="www.example1.com">Example link 1</a>' +
        '<a id="example2" href="www.example2.com">Example link 2</a>' +
        '<a id="example3" href="www.example3.com">Example link 3</a>' +
        '<a id="example4" href="www.example4.com">Example link 4</a>' +
        '<a id="example5" href="www.example5.com">Example link 5</a>'

        window.dataLayer = []
        document.body.appendChild(module)
        GOVUK.analyticsGa4.core.trackFunctions.setIndexes(module)
      })

      afterEach(function () {
        window.dataLayer = []
        document.body.removeChild(module)
      })

      it('calculates the index total', function () {
        var data = JSON.parse(module.getAttribute('data-ga4-link'))

        expect(data.index_total).toEqual(5)
      })

      it('sets the index object of each link', function () {
        var links = module.querySelectorAll('a')

        for (var i = 0; i < links.length; i++) {
          var linkIndex = links[i].getAttribute('data-ga4-index')
          expect(linkIndex).toEqual('{"index_link": ' + (i + 1) + '}')
        }
      })
    })

    describe('when handling the index parameter', function () {
      it('converts a three digit index into sub-parameters as expected', function () {
        var expected = {
          index_section: 2,
          index_link: 3
        }
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject('1.2.3')).toEqual(expected)
      })

      it('converts a two digit index into sub-parameters as expected', function () {
        var expected = {
          index_section: 1,
          index_link: 2
        }
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject('1.2')).toEqual(expected)
      })

      it('converts a one digit index into sub-parameters as expected', function () {
        var expected = {
          index_section: 1
        }
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject('1')).toEqual(expected)
      })

      it('copes when passed an actual number', function () {
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject(1)).toEqual({ index_section: 1 })
      })

      it('returns the object if an object is passed', function () {
        var expected = { index: 1 }
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject(expected)).toEqual(expected)
      })

      it('returns undefined if undefined is passed', function () {
        expect(GOVUK.analyticsGa4.core.trackFunctions.createIndexObject(undefined)).toEqual(undefined)
      })

      describe('returns undefined for unset index keys', function () {
        var ga4Data, expectedData
        beforeEach(function () {
          ga4Data = { event_data: { index: {} } }
          expectedData = { event_data: { index: { index_link: undefined, index_section: undefined, index_section_count: undefined } } }
        })

        it('returns undefined for all keys if index exists, but no child keys', function () {
          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)
          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_link if it doesnt exist', function () {
          ga4Data.event_data.index.index_section = 123
          ga4Data.event_data.index.index_section_count = 123
          expectedData.event_data.index.index_section_count = 123
          expectedData.event_data.index.index_section = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_section if it doesnt exist', function () {
          ga4Data.event_data.index.index_link = 123
          ga4Data.event_data.index.index_section_count = 123
          expectedData.event_data.index.index_link = 123
          expectedData.event_data.index.index_section_count = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_section_count if it doesnt exist', function () {
          ga4Data.event_data.index.index_link = 123
          ga4Data.event_data.index.index_section = 123
          expectedData.event_data.index.index_link = 123
          expectedData.event_data.index.index_section = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_section_count and index_section if they dont exist', function () {
          ga4Data.event_data.index.index_link = 123
          expectedData.event_data.index.index_link = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_section_count and index_link if they dont exist', function () {
          ga4Data.event_data.index.index_section = 123
          expectedData.event_data.index.index_section = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('returns undefined for index_section and index_link if they dont exist', function () {
          ga4Data.event_data.index.index_section_count = 123
          expectedData.event_data.index.index_section_count = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('does not set any indexes to undefined if they all exist', function () {
          ga4Data.event_data.index.index_link = 123
          ga4Data.event_data.index.index_section = 123
          ga4Data.event_data.index.index_section_count = 123

          expectedData.event_data.index.index_link = 123
          expectedData.event_data.index.index_section = 123
          expectedData.event_data.index.index_section_count = 123

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })

        it('ensures values set to 0 are not set to undefined (as 0 is falsy)', function () {
          ga4Data.event_data.index.index_link = 0
          ga4Data.event_data.index.index_section = 0
          ga4Data.event_data.index.index_section_count = 0

          expectedData.event_data.index.index_link = 0
          expectedData.event_data.index.index_section = 0
          expectedData.event_data.index.index_section_count = 0

          ga4Data = GOVUK.analyticsGa4.core.ensureIndexesArePopulated(ga4Data)

          expect(ga4Data).toEqual(expectedData)
        })
      })
    })
  })

  describe('ecommerce tracking helper functions', function () {
    describe('when the clearEcommerceObject function is called', function () {
      it('sends a nullified ecommerce object to the dataLayer', function () {
        GOVUK.analyticsGa4.core.ecommerceHelperFunctions.clearEcommerceObject()

        expect(window.dataLayer[0].search_results.ecommerce).toEqual(null)
      })
    })

    describe('when the number of results is present in the DOM', function () {
      var resultCountContainer

      resultCountContainer = document.createElement('span')
      resultCountContainer.innerHTML = '<span id="results-count">54321 results</span>'

      beforeEach(function () {
        document.body.appendChild(resultCountContainer)
      })

      afterEach(function () {
        document.body.removeChild(resultCountContainer)
      })

      it('retrieves them and returns a number', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual(54321)
        expect(typeof GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual('number')
      })
    })

    describe('the correct index of the result is returned', function () {
      var result1 = document.createElement('div')
      result1.setAttribute('data-ecommerce-index', '1')

      var result2 = document.createElement('div')
      result2.setAttribute('data-ecommerce-index', '5')

      var result3 = document.createElement('div')
      result3.setAttribute('data-ecommerce-index', '123')

      beforeEach(function () {
        document.body.appendChild(result1)
        document.body.appendChild(result2)
        document.body.appendChild(result3)
      })

      afterEach(function () {
        document.body.removeChild(result1)
        document.body.appendChild(result2)
        document.body.appendChild(result3)
      })

      it('when the index is 1 and the start position is 1', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result1, 1)).toEqual(1)
      })

      it('when the index is 1 and the start position is 21', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result1, 21)).toEqual(21)
      })

      it('when the index is 1 and the start position is 1935', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result1, 3975)).toEqual(3975)
      })

      it('when the index is 5 and the start position is 1', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result2, 1)).toEqual(5)
      })

      it('when the index is 5 and the start position is 21', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result2, 21)).toEqual(25)
      })

      it('when the index is 5 and the start position is 3975', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result2, 3975)).toEqual(3979)
      })

      it('when the index is 123 and the start position is 1', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result3, 1)).toEqual(123)
      })

      it('when the index is 123 and the start position is 21', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result3, 21)).toEqual(143)
      })

      it('when the index is 123 and the start position is 3975', function () {
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(result3, 3975)).toEqual(4097)
      })
    })

    describe('when the populateEcommerceSchema function is called', function () {
      var resultsParentEl
      var resultsCount
      var results
      var expectedEcommerceObject

      function agreeToCookies () {
        GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      }

      beforeEach(function () {
        resultsCount = document.createElement('span')
        resultsCount.id = 'result-count'
        resultsCount.innerHTML = '5 results'

        resultsParentEl = document.createElement('div')
        resultsParentEl.setAttribute('data-module', 'ga4-smart-answer-results-tracker')
        resultsParentEl.setAttribute('data-list-title', 'Smart answer results')
        resultsParentEl.setAttribute('data-ecommerce-start-index', '1')

        results = document.createElement('div')
        results.innerHTML = '<a data-ga4-ecommerce-path="https://www.gov.uk/the-warm-home-discount-scheme" href="https://www.gov.uk/the-warm-home-discount-scheme" data-ecommerce-index="1">Check if you’re eligible for the Warm Home Discount scheme</a>' +

        '<a data-ga4-ecommerce-path="/apply-council-tax-reduction" href="/apply-council-tax-reduction" data-ecommerce-index="2">Check if you’re eligible for Council Tax Reduction</a>' +

        '<a data-ga4-ecommerce-path="/budgeting-help-benefits" href="/budgeting-help-benefits" data-ecommerce-index="3" onclick="event.preventDefault()">Check if you’re eligible for a Budgeting Loan</a>' +

        '<a data-ga4-ecommerce-path="https://www.nhs.uk/nhs-services/help-with-health-costs" href="https://www.nhs.uk/nhs-services/help-with-health-costs" data-ecommerce-index="4">Check if you’re eligible for help with health costs on the NHS website</a>' +

        '<a data-ga4-ecommerce-path="https://www.gov.uk/support-for-mortgage-interest" href="https://www.gov.uk/support-for-mortgage-interest" data-ecommerce-index="5">Check if you’re eligible for Support for Mortgage Interest</a>'

        expectedEcommerceObject = {
          event: 'search_results',
          event_data: undefined,
          search_results: {
            event_name: 'view_item_list',
            term: undefined,
            sort: undefined,
            results: 5,
            ecommerce: {
              items: [
                {
                  item_id: 'https://www.gov.uk/the-warm-home-discount-scheme',
                  item_list_name: 'Smart answer results',
                  index: 1
                },
                {
                  item_id: '/apply-council-tax-reduction',
                  item_list_name: 'Smart answer results',
                  index: 2
                },
                {
                  item_id: '/budgeting-help-benefits',
                  item_list_name: 'Smart answer results',
                  index: 3
                },
                {
                  item_id: 'https://www.nhs.uk/nhs-services/help-with-health-costs',
                  item_list_name: 'Smart answer results',
                  index: 4
                },
                {
                  item_id: 'https://www.gov.uk/support-for-mortgage-interest',
                  item_list_name: 'Smart answer results',
                  index: 5
                }
              ]
            }
          }
        }

        window.dataLayer = []
        resultsParentEl.appendChild(results)
        resultsParentEl.appendChild(resultsCount)
        document.body.appendChild(resultsParentEl)
        agreeToCookies()
      })

      afterEach(function () {
        window.dataLayer = []
        document.body.removeChild(resultsParentEl)
      })

      it('the ecommerce object is built correctly', function () {
        var builtEcommerceObject = GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
          element: resultsParentEl,
          resultsId: 'result-count'
        })

        expect(builtEcommerceObject).toEqual(expectedEcommerceObject)
      })
    })
  })
})
