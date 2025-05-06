/* eslint-env jasmine */

describe('Google Analytics 4 ecommerce tracking', function () {
  var GOVUK = window.GOVUK
  var searchResultsParentEl
  var searchResults
  var searchResultsHeading
  var resultToBeClicked
  var onPageLoadExpected
  var onSearchResultClickExpected
  var pageViewExpected

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  beforeEach(function () {
    searchResultsHeading = document.createElement('h2')
    searchResultsHeading.id = 'js-result-count'
    searchResultsHeading.innerHTML = '12,345 results'

    searchResultsParentEl = document.createElement('div')
    searchResultsParentEl.setAttribute('data-ga4-ecommerce', '')
    searchResultsParentEl.setAttribute('data-ga4-search-query', 'test-search-query')
    searchResultsParentEl.setAttribute('data-ga4-ecommerce-variant', 'test-ecommerce-variant')
    searchResultsParentEl.setAttribute('data-ga4-list-title', 'test-list-title')
    searchResultsParentEl.setAttribute('data-ga4-ecommerce-start-index', '1')

    searchResults = document.createElement('div')
    searchResults.innerHTML =
      '<a data-ga4-ecommerce-path="/coronavirus" data-ga4-ecommerce-row="1" data-ga4-ecommerce-index="1" data-ga4-ecommerce-content-id="test0" href="/coronavirus">Coronavirus (COVID-19): guidance and support</a>' +

      '<a data-ga4-ecommerce-path="/guidance/travel-abroad-from-england-during-coronavirus-covid-19" data-ga4-ecommerce-content-id="test1" data-ga4-ecommerce-row="1" data-ga4-ecommerce-index="2" href="/guidance/travel-abroad">Travel abroad</a>' +

      '<a data-ga4-ecommerce-path="/guidance/people-with-symptoms-of-a-respiratory-infection-including-covid-19" data-ga4-ecommerce-content-id="test2" data-ga4-ecommerce-row="1" data-ga4-ecommerce-index="3" href="/guidance/people">People</a>' +

      '<a data-ga4-ecommerce-path="/foreign-travel-advice" onclick="event.preventDefault()" data-ga4-ecommerce-row="1" data-ga4-ecommerce-content-id="test3" data-ga4-ecommerce-index="4" href="/foreign-travel-advice">Foreign travel advice</a>' +

      '<a data-ga4-ecommerce-path="/guidance/living-safely-with-respiratory-infections-including-covid-19" data-ga4-ecommerce-content-id="test4" data-ga4-ecommerce-row="1" data-ga4-ecommerce-index="5" href="/guidance/living-safely">Living safely</a>'

    onPageLoadExpected = {
      event: 'search_results',
      event_data: undefined,
      search_results: {
        event_name: 'view_item_list',
        term: 'test-search-query',
        sort: 'test-ecommerce-variant',
        results: 12345,
        ecommerce: {
          items: [
            {
              item_id: '/coronavirus',
              item_content_id: 'test0',
              item_list_name: 'test-list-title',
              index: 1
            },
            {
              item_id: '/guidance/travel-abroad-from-england-during-coronavirus-covid-19',
              item_content_id: 'test1',
              item_list_name: 'test-list-title',
              index: 2
            },
            {
              item_id: '/guidance/people-with-symptoms-of-a-respiratory-infection-including-covid-19',
              item_content_id: 'test2',
              item_list_name: 'test-list-title',
              index: 3
            },
            {
              item_id: '/foreign-travel-advice',
              item_content_id: 'test3',
              item_list_name: 'test-list-title',
              index: 4
            },
            {
              item_id: '/guidance/living-safely-with-respiratory-infections-including-covid-19',
              item_content_id: 'test4',
              item_list_name: 'test-list-title',
              index: 5
            }
          ]
        }
      }
    }

    window.dataLayer = []
    searchResultsParentEl.appendChild(searchResults)
    searchResultsParentEl.appendChild(searchResultsHeading)
    document.body.appendChild(searchResultsParentEl)
    agreeToCookies()
  })

  afterEach(function () {
    window.dataLayer = []
    document.body.removeChild(searchResultsParentEl)
  })

  describe('on page load', function () {
    it('should push a nullified ecommerce object to the dataLayer', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[0].search_results.ecommerce).toBe(null)
    })

    it('should get the search query', function () {
      var expected = 'coronavirus'
      searchResultsParentEl.setAttribute('data-ga4-search-query', 'coronavirus')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.term).toBe(expected)
    })

    it('should remove PII from search query', function () {
      var expected = '[email]'
      searchResultsParentEl.setAttribute('data-ga4-search-query', 'email@example.com')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.term).toBe(expected)
    })

    it('should replace plusses with spaces, and remove extra lines/spaces from search query', function () {
      var expected = 'i have a lot of spaces'
      searchResultsParentEl.setAttribute('data-ga4-search-query', '%2Bi++have+\n+\r+a+lot+of+   spaces')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.term).toBe(expected)
    })

    it('should set the search query to lowercase', function () {
      var expected = 'i am lowercase'
      searchResultsParentEl.setAttribute('data-ga4-search-query', 'I AM LOWERCASE')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.term).toBe(expected)
    })

    it('should get the variant', function () {
      var expected = 'Relevance'
      searchResultsParentEl.setAttribute('data-ga4-ecommerce-variant', 'Relevance')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.sort).toBe(expected)
    })

    it('should set the variant to undefined when the data-ga4-ecommerce-variant does not exist', function () {
      searchResultsParentEl.removeAttribute('data-ga4-ecommerce-variant')
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.sort).toBe(undefined)
    })

    it('should get the number of search results i.e. 12345 search results in this test case', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[1].search_results.results).toBe(onPageLoadExpected.search_results.results)
    })

    it('should get the item id for each search result', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items
      for (var i = 0; i < searchResults.length; i++) {
        expect(searchResults[i].item_id).toBe(onPageLoadExpected.search_results.ecommerce.items[i].item_id)
      }
    })

    it('should get the item content id for each search result', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items
      for (var i = 0; i < searchResults.length; i++) {
        expect(searchResults[i].item_content_id).toBe(onPageLoadExpected.search_results.ecommerce.items[i].item_content_id)
      }
    })

    it('should get the item list name for each search result', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items
      for (var i = 0; i < searchResults.length; i++) {
        expect(searchResults[i].item_list_name).toBe(onPageLoadExpected.search_results.ecommerce.items[i].item_list_name)
      }
    })

    it('should set the item list name to \'Site search results\' when the data-ga4-list-title does not exist', function () {
      for (var i = 0; i < onPageLoadExpected.search_results.ecommerce.items.length; i++) {
        onPageLoadExpected.search_results.ecommerce.items[i].item_list_name = 'Site search results'
      }
      searchResultsParentEl.removeAttribute('data-ga4-list-title')

      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items
      for (var j = 0; j < searchResults.length; j++) {
        expect(searchResults[j].item_list_name).toBe(onPageLoadExpected.search_results.ecommerce.items[j].item_list_name)
      }
    })

    it('should get the index for each search result using the data-ga4-ecommerce-index attribute', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items

      for (var i = 0; i < searchResults.length; i++) {
        expect(searchResults[i].index).toBe(onPageLoadExpected.search_results.ecommerce.items[i].index)
      }
    })

    it('should get the index for each search result using the for loop index if the data-ga4-ecommerce-index attribute does not exist', function () {
      var ecommerceRows = document.querySelectorAll('[data-ga4-ecommerce-row]')
      for (var i = 0; i < ecommerceRows.length; i++) {
        ecommerceRows[i].removeAttribute('data-ga4-ecommerce-index')
      }

      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var searchResults = window.dataLayer[1].search_results.ecommerce.items
      for (var j = 0; j < searchResults.length; j++) {
        expect(searchResults[j].index).toBe(onPageLoadExpected.search_results.ecommerce.items[j].index)
      }
    })
  })

  describe('when a new page isn\'t loaded e.g. when the user selects a filter', function () {
    it('should push a nullified ecommerce object to the dataLayer', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init('test')

      expect(window.dataLayer[1].search_results.ecommerce).toBe(null)
    })

    it('should push a pageView object to the dataLayer', function () {
      spyOnProperty(document, 'referrer', 'get').and.returnValue('https://gov.uk/')

      // We can't spy on location, so instead we use an anchor link to change the URL
      var linkForURLMock = document.createElement('a')
      linkForURLMock.href = '#'
      linkForURLMock.click()
      var location = document.location.href

      pageViewExpected = {
        event: 'page_view',
        page_view: {
          location: location,
          referrer: 'https://gov.uk/'
        }
      }

      GOVUK.analyticsGa4.Ga4EcommerceTracker.init('https://gov.uk/')

      expect(window.dataLayer[0].event).toBe(pageViewExpected.event)
      expect(window.dataLayer[0].page_view.location).toBe(pageViewExpected.page_view.location)
      expect(window.dataLayer[0].page_view.referrer).toBe(pageViewExpected.page_view.referrer)
    })
  })

  describe('when the user clicks on a search result', function () {
    beforeEach(function () {
      onSearchResultClickExpected = {
        event: 'search_results',
        event_data: {
          external: 'false'
        },
        search_results: {
          event_name: 'select_item',
          term: 'test-search-query',
          sort: 'test-ecommerce-variant',
          results: 12345,
          ecommerce: {
            items: [
              {
                item_id: '/foreign-travel-advice',
                item_content_id: 'test3',
                item_name: 'Foreign travel advice',
                item_list_name: 'test-list-title',
                index: 4
              }
            ]
          }
        }
      }

      resultToBeClicked = document.querySelector("[data-ga4-ecommerce-path='/foreign-travel-advice']")
      resultToBeClicked.removeAttribute('data-ga4-ecommerce-item-name')
      GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.internalLinksDomain = 'www.gov.uk/'
      GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.internalLinksDomainWithoutWww = 'gov.uk/'
    })

    it('should push a nullified ecommerce object to the dataLayer', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      expect(window.dataLayer[0].search_results.ecommerce).toBe(null)
    })

    it('should call the handleClick function', function () {
      var tracker = GOVUK.analyticsGa4.Ga4EcommerceTracker

      spyOn(tracker, 'handleClick')
      tracker.init()

      resultToBeClicked.click()
      expect(tracker.handleClick).toHaveBeenCalled()
    })

    it('should push 1 search result to the dataLayer (i.e. the clicked search result)', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      resultToBeClicked.click()
      expect(window.dataLayer[3].search_results.ecommerce.items.length).toBe(1)
    })

    it('should add the event_data property to the object and set it appropriately', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      resultToBeClicked.click()
      expect(window.dataLayer[3].event_data).not.toBe(null)
      expect(window.dataLayer[3].event_data.external).toBe(onSearchResultClickExpected.event_data.external)
    })

    it('should set the remaining properties appropriately', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      resultToBeClicked.click()
      expect(window.dataLayer[3].event).toBe(onSearchResultClickExpected.event)
      expect(window.dataLayer[3].search_results).toEqual(onSearchResultClickExpected.search_results)
    })

    it('should use data-ga4-ecommerce-item-name to set item_name property if present', function () {
      GOVUK.analyticsGa4.Ga4EcommerceTracker.init()

      var differentListItemName = 'different list item name'
      onSearchResultClickExpected.search_results.ecommerce.items[0].item_name = differentListItemName
      resultToBeClicked.dataset.ga4EcommerceItemName = differentListItemName

      resultToBeClicked.click()
      expect(window.dataLayer[3].event).toBe(onSearchResultClickExpected.event)
      expect(window.dataLayer[3].search_results).toEqual(onSearchResultClickExpected.search_results)
    })
  })
})
