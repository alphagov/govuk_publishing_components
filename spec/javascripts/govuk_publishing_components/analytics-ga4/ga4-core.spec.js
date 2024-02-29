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
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
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
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
    var data = {
      hello: 'I must be going'
    }
    GOVUK.analyticsGa4.core.sendData(data)
    expect(window.dataLayer[0]).toEqual({
      hello: 'I must be going',
      govuk_gem_version: 'aVersion',
      timestamp: '123456'
    })
  })

  it('does not push data to the dataLayer if window.GOVUK.stopSendingAnalytics is true', function () {
    window.GOVUK.stopSendingAnalytics = true
    GOVUK.analyticsGa4.core.sendData({})
    expect(window.dataLayer[0]).toEqual(undefined)
    expect(GOVUK.analyticsGa4.core.sendData()).toEqual(false)
  })

  describe('query strings allow pushing to a fake dataLayer', function () {
    var data

    beforeEach(function () {
      data = {
        hello: 'I must be going'
      }
      window.fakeDataLayer = []
    })

    var queryStringsToTest = ['?smokey_cachebust', '&smokey_cachebust', '?disable_ga4', '&disable_ga4']

    for (var i = 0; i < queryStringsToTest.length; i++) {
      var queryString = queryStringsToTest[i]
      it('pushes to the fakeDataLayer if the page query string contains ' + queryString, function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue(queryString + '=123456')
        GOVUK.analyticsGa4.core.sendData(data)
        expect(window.dataLayer).toEqual([])
        expect(window.fakeDataLayer[0]).toEqual(data)
      })
    }
  })

  it('sorts event data alphabetically for debug mode', function () {
    var data = {
      c: 'c_data',
      b: 'b_data',
      a: {},
      q: 'q_data'
    }
    var expected = {
      a: {},
      b: 'b_data',
      c: 'c_data',
      q: 'q_data'
    }
    expect(GOVUK.analyticsGa4.core.sortEventData(data)).toEqual(expected)
  })

  it('uses the schema to control data sent to the dataLayer', function () {
    var data = {
      index_link: 3,
      not_a_property: '1'
    }
    var schemas = new window.GOVUK.analyticsGa4.Schemas()
    var expected = schemas.mergeProperties(data, 'test')
    expected.govuk_gem_version = 'aVersion'
    expected.event_data.index.index_link = '3'
    expected.timestamp = '123456'
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
    GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'test')
    expect(window.dataLayer[0]).toEqual(expected)
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

    describe('when tracking anchor links', function () {
      beforeEach(function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getPathname').and.returnValue('/hello-world')
      })

      it('appends the page path to anchor links', function () {
        var href = '#heading1'
        expect(GOVUK.analyticsGa4.core.trackFunctions.appendPathToAnchorLinks(href)).toEqual('/hello-world#heading1')

        href = '/not-an-anchor-link'
        expect(GOVUK.analyticsGa4.core.trackFunctions.appendPathToAnchorLinks(href)).toEqual(href)
      })
    })

    it('accepts an array of domains and increases it to include variants without www at the start', function () {
      var domains = ['www.gov.uk']
      GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(domains)
      expect(domains).toContain('www.gov.uk')
      expect(domains).toContain('gov.uk')
    })

    it('standardises search terms for consistency across trackers', function () {
      var searchTerm = 'NO UPPERCASE, NO %2B plus + signs, NO PII email@example.com SW1A 2AA 1st Jan 1990 and    NO    extra    spaces \n \r      '
      var expected = 'no uppercase, no plus signs, no pii [email] [postcode] [date] and no extra spaces'

      searchTerm = GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(searchTerm)
      expect(searchTerm).toEqual(expected)
    })

    describe('when the data-ga4-set-indexes attribute exists on the module', function () {
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

      it('allows the index_total to be set manually in rare circumstances', function () {
        var data = JSON.parse(module.getAttribute('data-ga4-link'))
        expect(data.index_total).toEqual(5)

        module.setAttribute('data-ga4-link', '{"someData": "blah", "index_total": 9000}')
        GOVUK.analyticsGa4.core.trackFunctions.setIndexes(module)

        data = JSON.parse(module.getAttribute('data-ga4-link'))
        expect(data.index_total).toEqual(9000)
      })

      it('ignores links without a href', function () {
        module.setAttribute('data-ga4-link', '{"someData": "blah"}')
        module.innerHTML = '<a id="example1" href="www.example1.com">Example link 1</a>' +
        '<a id="example2" href="www.example2.com">Example link 2</a>' +
        '<a id="example3" href="">Example link 3</a>' +
        '<a id="example4" href="www.example4.com">Example link 4</a>' +
        '<a id="example5">Example link 5</a>'

        GOVUK.analyticsGa4.core.trackFunctions.setIndexes(module)
        var links = module.querySelectorAll('a')

        // Manually track the indexes as there are two links which won't have an index, so we can't use the loop's i variable to check the indexes are correct.
        var index = 0

        for (var i = 0; i < links.length; i++) {
          var linkIndexAttribute = links[i].getAttribute('data-ga4-index')

          // The links with no href should have no data-ga4-index attribute
          if (i === 2 || i === 4) {
            expect(linkIndexAttribute).toEqual(null)
          } else {
          // Increment the index as the following link should have the data-ga4-index-attribute
            index++
            expect(linkIndexAttribute).toEqual('{"index_link": ' + (index) + '}')
          }
        }
      })
    })

    describe('when the data-ga4-set-indexes attribute exists on a module that contains search results or links with a data-ga4-do-not-index attribute', function () {
      var module

      beforeEach(function () {
        module = document.createElement('div')
        module.setAttribute('data-ga4-link', '{"someData": "blah"}')
        module.innerHTML = '<a id="example1" href="www.example1.com">Example link 1</a>' +
        '<a id="example2" href="www.example2.com" data-ga4-do-not-index>Do not index link 1</a>' +
        '<a id="example3" href="www.example3.com">Example link 2</a>' +
        '<a id="example4" href="www.example4.com" data-ga4-ecommerce-path="/path">Search result 1</a>' +
        '<a id="example5" href="www.example5.com">Example link 3</a>' +
        '<a id="example6" href="www.example6.com" data-ga4-ecommerce-path="/path">Search result 2</a>' +
        '<a id="example7" href="www.example7.com">Example link 4</a>' +
        '<a id="example8" href="www.example8.com" data-ga4-do-not-index>Do not index link 2</a>' +
        '<a id="example9" href="www.example9.com">Example link 5</a>'

        window.dataLayer = []
        document.body.appendChild(module)
        GOVUK.analyticsGa4.core.trackFunctions.setIndexes(module)
      })

      afterEach(function () {
        window.dataLayer = []
        document.body.removeChild(module)
      })

      it('ignores search results and links with a data-ga4-do-not-index attribute when calculating the index total', function () {
        var data = JSON.parse(module.getAttribute('data-ga4-link'))

        expect(data.index_total).toEqual(5)
      })

      it('does not set the index object of search results', function () {
        var searchResults = module.querySelectorAll('[data-ga4-ecommerce-path]')

        for (var i = 0; i < searchResults.length; i++) {
          var searchResultsIndex = searchResults[i].getAttribute('data-ga4-index')
          expect(searchResultsIndex).toEqual(null)
        }
      })

      it('does not set the index object of links with a data-ga4-do-not-index attribute', function () {
        var ignoredLinks = module.querySelectorAll('[data-ga4-do-not-index]')

        for (var i = 0; i < ignoredLinks.length; i++) {
          var ignoredLinksIndex = ignoredLinks[i].getAttribute('data-ga4-index')
          expect(ignoredLinksIndex).toEqual(null)
        }
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
      resultCountContainer.innerHTML = '<span id="results-count">54,321 results</span>'

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

      it('handles new lines and extra spaces', function () {
        resultCountContainer.innerHTML = '<span id="results-count"> \n   54,321 results    \n</span>'
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual(54321)
        expect(typeof GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual('number')
      })

      it('handles "Results:" at the start of the string ', function () {
        resultCountContainer.innerHTML = '<span id="results-count">Results: 54,321 licences</span>'
        expect(GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual(54321)
        expect(typeof GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(resultCountContainer, 'results-count')).toEqual('number')
      })
    })

    describe('the correct index of the result is returned', function () {
      var result1 = document.createElement('div')
      result1.setAttribute('data-ga4-ecommerce-index', '1')

      var result2 = document.createElement('div')
      result2.setAttribute('data-ga4-ecommerce-index', '5')

      var result3 = document.createElement('div')
      result3.setAttribute('data-ga4-ecommerce-index', '123')

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
        resultsParentEl.setAttribute('data-ga4-module', 'ga4-smart-answer-results-tracker')
        resultsParentEl.setAttribute('data-ga4-list-title', 'Smart answer results')
        resultsParentEl.setAttribute('data-ga4-ecommerce-start-index', '1')

        results = document.createElement('div')
        results.innerHTML = '<a data-ga4-ecommerce-path="https://www.gov.uk/the-warm-home-discount-scheme" href="https://www.gov.uk/the-warm-home-discount-scheme" data-ga4-ecommerce-index="1">Check if you’re eligible for the Warm Home Discount scheme</a>' +

        '<a data-ga4-ecommerce-path="/apply-council-tax-reduction" href="/apply-council-tax-reduction" data-ga4-ecommerce-index="2">Check if you’re eligible for Council Tax Reduction</a>' +

        '<a data-ga4-ecommerce-path="/budgeting-help-benefits" href="/budgeting-help-benefits" data-ga4-ecommerce-index="3" onclick="event.preventDefault()">Check if you’re eligible for a Budgeting Loan</a>' +

        '<a data-ga4-ecommerce-path="https://www.nhs.uk/nhs-services/help-with-health-costs" href="https://www.nhs.uk/nhs-services/help-with-health-costs" data-ga4-ecommerce-index="4">Check if you’re eligible for help with health costs on the NHS website</a>' +

        '<a data-ga4-ecommerce-path="https://www.gov.uk/support-for-mortgage-interest" href="https://www.gov.uk/support-for-mortgage-interest" data-ga4-ecommerce-index="5">Check if you’re eligible for Support for Mortgage Interest</a>'

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
                  item_content_id: undefined,
                  item_list_name: 'Smart answer results',
                  index: 1
                },
                {
                  item_id: '/apply-council-tax-reduction',
                  item_content_id: undefined,
                  item_list_name: 'Smart answer results',
                  index: 2
                },
                {
                  item_id: '/budgeting-help-benefits',
                  item_content_id: undefined,
                  item_list_name: 'Smart answer results',
                  index: 3
                },
                {
                  item_id: 'https://www.nhs.uk/nhs-services/help-with-health-costs',
                  item_content_id: undefined,
                  item_list_name: 'Smart answer results',
                  index: 4
                },
                {
                  item_id: 'https://www.gov.uk/support-for-mortgage-interest',
                  item_content_id: undefined,
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

      it('the ecommerce items array is limited to 200 items', function () {
        var innerHTML = ''
        var ecommerceItems = []

        // Adds 500 search results to the DOM, but only adds 200 to our expected ecommerce object array
        for (var i = 0; i < 500; i++) {
          innerHTML = innerHTML + '<a data-ga4-ecommerce-path="https://www.gov.uk/the-warm-home-discount-scheme" href="https://www.gov.uk/the-warm-home-discount-scheme" data-ga4-ecommerce-index="' + (i + 1) + '">Check if you’re eligible for the Warm Home Discount scheme</a>'

          if (i < 200) {
            ecommerceItems.push({
              item_id: 'https://www.gov.uk/the-warm-home-discount-scheme',
              item_content_id: undefined,
              item_list_name: 'Smart answer results',
              index: i + 1
            })
          }
        }

        resultsCount.innerHTML = '500 results'
        results.innerHTML = innerHTML
        expectedEcommerceObject.search_results.results = 500
        expectedEcommerceObject.search_results.ecommerce.items = ecommerceItems

        var builtEcommerceObject = GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
          element: resultsParentEl,
          resultsId: 'result-count'
        })

        expect(builtEcommerceObject).toEqual(expectedEcommerceObject)
        expect(builtEcommerceObject.search_results.ecommerce.items.length).toEqual(200)
      })
    })
  })

  it('populates the timestamp value correctly', function () {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date(2050, 1, 1))

    GOVUK.analyticsGa4.core.sendData({})
    var timestamp = Date.now().toString()

    jasmine.clock().uninstall()

    expect(window.dataLayer[0].timestamp).toEqual(timestamp)
  })
})
