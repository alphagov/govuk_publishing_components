/* eslint-env jasmine */

describe('GA4 smart answer results tracking', function () {
  var GOVUK = window.GOVUK
  var smartAnswerResultsParentEl
  var smartAnswerResultsCount
  var smartAnswerResults
  var smartAnswerResultToBeClicked
  var onPageLoadExpected
  var onSmartAnswerResultClickExpected

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  beforeEach(function () {
    smartAnswerResultsCount = document.createElement('span')
    smartAnswerResultsCount.id = 'ga4-ecommerce-result-count'
    smartAnswerResultsCount.innerHTML = '5 results'

    smartAnswerResultsParentEl = document.createElement('div')
    smartAnswerResultsParentEl.setAttribute('data-ga4-module', 'ga4-smart-answer-results-tracker')
    smartAnswerResultsParentEl.setAttribute('data-ga4-list-title', 'Smart answer results')
    smartAnswerResultsParentEl.setAttribute('data-ga4-ecommerce-start-index', '1')

    smartAnswerResults = document.createElement('div')
    smartAnswerResults.innerHTML = '<a data-ga4-ecommerce-path="https://www.gov.uk/the-warm-home-discount-scheme" href="https://www.gov.uk/the-warm-home-discount-scheme" data-ga4-ecommerce-index="1">Check if you’re eligible for the Warm Home Discount scheme</a>' +

      '<a data-ga4-ecommerce-path="/apply-council-tax-reduction" href="/apply-council-tax-reduction" data-ga4-ecommerce-index="2">Check if you’re eligible for Council Tax Reduction</a>' +

      '<a data-ga4-ecommerce-path="/budgeting-help-benefits" href="/budgeting-help-benefits" data-ga4-ecommerce-index="3" onclick="event.preventDefault()">Check if you’re eligible for a Budgeting Loan</a>' +

      '<a data-ga4-ecommerce-path="https://www.nhs.uk/nhs-services/help-with-health-costs" href="https://www.nhs.uk/nhs-services/help-with-health-costs" data-ga4-ecommerce-index="4">Check if you’re eligible for help with health costs on the NHS website</a>' +

      '<a data-ga4-ecommerce-path="https://www.gov.uk/support-for-mortgage-interest" href="https://www.gov.uk/support-for-mortgage-interest" data-ga4-ecommerce-index="5">Check if you’re eligible for Support for Mortgage Interest</a>'

    onPageLoadExpected = {
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
    smartAnswerResultsParentEl.appendChild(smartAnswerResults)
    smartAnswerResultsParentEl.appendChild(smartAnswerResultsCount)
    document.body.appendChild(smartAnswerResultsParentEl)
    agreeToCookies()
  })

  afterEach(function () {
    window.dataLayer = []
    document.body.removeChild(smartAnswerResultsParentEl)
  })

  it('starts the module when consent is given', function () {
    window.GOVUK.deleteCookie('cookies_policy')
    var smartAnswerTracker = new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl)
    spyOn(smartAnswerTracker, 'startModule').and.callThrough()
    smartAnswerTracker.init()
    expect(smartAnswerTracker.startModule).not.toHaveBeenCalled()

    // page has not been reloaded, user consents to cookies
    window.GOVUK.triggerEvent(window, 'cookie-consent')
    expect(smartAnswerTracker.startModule).toHaveBeenCalled()

    // consent listener should be removed after triggering
    smartAnswerTracker.startModule.calls.reset()
    window.GOVUK.triggerEvent(window, 'cookie-consent')
    expect(smartAnswerTracker.startModule).not.toHaveBeenCalled()
  })

  describe('on page load', function () {
    it('should push a nullified ecommerce object to the dataLayer', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      expect(window.dataLayer[0].search_results.ecommerce).toBe(null)
    })

    it('should get the number of results i.e. 5 results in this test case', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      expect(window.dataLayer[1].search_results.results).toBe(onPageLoadExpected.search_results.results)
    })

    it('should get the item id for each result', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      var smartAnswerResultItems = window.dataLayer[1].search_results.ecommerce.items
      for (var i = 0; i < smartAnswerResultItems.length; i++) {
        expect(smartAnswerResultItems[i].item_id).toBe(onPageLoadExpected.search_results.ecommerce.items[i].item_id)
      }
    })

    it('should get the item list name for each result', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      var smartAnswerResultItems = window.dataLayer[1].search_results.ecommerce.items
      for (var i = 0; i < smartAnswerResultItems.length; i++) {
        expect(smartAnswerResultItems[i].item_list_name).toBe(onPageLoadExpected.search_results.ecommerce.items[i].item_list_name)
      }
    })

    it('should set the item list name to \'Smart answer results\' when the data-ga4-list-title does not exist', function () {
      for (var i = 0; i < onPageLoadExpected.search_results.ecommerce.items.length; i++) {
        onPageLoadExpected.search_results.ecommerce.items[i].item_list_name = 'Smart answer results'
      }
      smartAnswerResultsParentEl.removeAttribute('data-ga4-list-title')

      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      var smartAnswerResultItems = window.dataLayer[1].search_results.ecommerce.items
      for (var j = 0; j < smartAnswerResultItems.length; j++) {
        expect(smartAnswerResultItems[j].item_list_name).toBe(onPageLoadExpected.search_results.ecommerce.items[j].item_list_name)
      }
    })

    it('should get the index for each result using the data-ga4-ecommerce-index attribute', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      var smartAnswerResultItems = window.dataLayer[1].search_results.ecommerce.items

      for (var i = 0; i < smartAnswerResultItems.length; i++) {
        expect(smartAnswerResultItems[i].index).toBe(onPageLoadExpected.search_results.ecommerce.items[i].index)
      }
    })

    it('should get the index for each search result using the for loop index if the data-ga4-ecommerce-index attribute does not exist', function () {
      var smartAnswerResults = document.querySelectorAll('[data-ga4-ecommerce-path]')
      for (var i = 0; i < smartAnswerResults.length; i++) {
        smartAnswerResults[i].removeAttribute('data-ga4-ecommerce-index')
      }

      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      var smartAnswerResultItems = window.dataLayer[1].search_results.ecommerce.items
      for (var j = 0; j < smartAnswerResultItems.length; j++) {
        expect(smartAnswerResultItems[j].index).toBe(onPageLoadExpected.search_results.ecommerce.items[j].index)
      }
    })
  })

  describe('when the user clicks on a search result', function () {
    beforeEach(function () {
      onSmartAnswerResultClickExpected = {
        event: 'search_results',
        event_data: {
          external: 'false'
        },
        search_results: {
          event_name: 'select_item',
          term: undefined,
          sort: undefined,
          results: 5,
          ecommerce: {
            items: [
              {
                item_id: '/budgeting-help-benefits',
                item_content_id: undefined,
                item_name: 'Check if you’re eligible for a Budgeting Loan',
                item_list_name: 'Smart answer results',
                index: 3
              }
            ]
          }
        }
      }

      smartAnswerResultToBeClicked = document.querySelector("[data-ga4-ecommerce-path='/budgeting-help-benefits']")
      GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.internalLinksDomain = 'www.gov.uk/'
      GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.internalLinksDomainWithoutWww = 'gov.uk/'
    })

    it('should push a nullified ecommerce object to the dataLayer', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      expect(window.dataLayer[0].search_results.ecommerce).toBe(null)
    })

    it('should call the handleClick function', function () {
      var tracker = new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl)

      spyOn(tracker, 'handleClick')
      tracker.init()

      smartAnswerResultToBeClicked.click()
      expect(tracker.handleClick).toHaveBeenCalled()
    })

    it('should push 1 search result to the dataLayer (i.e. the clicked search result)', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      smartAnswerResultToBeClicked.click()
      expect(window.dataLayer[3].search_results.ecommerce.items.length).toBe(1)
    })

    it('should add the event_data property to the object and set it appropriately', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      smartAnswerResultToBeClicked.click()
      expect(window.dataLayer[3].event_data).not.toBe(null)
      expect(window.dataLayer[3].event_data.external).toBe(onSmartAnswerResultClickExpected.event_data.external)
    })

    it('should set the remaining properties appropriately', function () {
      /* eslint-disable no-new */
      new GOVUK.Modules.Ga4SmartAnswerResultsTracker(smartAnswerResultsParentEl).init()

      smartAnswerResultToBeClicked.click()
      expect(window.dataLayer[3].event).toBe(onSmartAnswerResultClickExpected.event)
      expect(window.dataLayer[3].search_results).toEqual(onSmartAnswerResultClickExpected.search_results)
    })
  })
})
