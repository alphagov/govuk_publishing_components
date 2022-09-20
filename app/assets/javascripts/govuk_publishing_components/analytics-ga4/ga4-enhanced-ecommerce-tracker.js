// = require govuk/vendor/polyfills/Element/prototype/closest.js
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.Ga4EnhancedEcommerceTracker = {
    PIIRemover: new GOVUK.analyticsGA4.PIIRemover(),
    DEFAULT_LIST_TITLE: 'Site search results',

    init: function (isNewPageLoad) {
      if (window.dataLayer) {
        this.searchResultsBlocks = document.querySelectorAll('[data-ga4-ecommerce]')
        this.isNewPageLoad = isNewPageLoad

        if (!this.searchResultsBlocks.length === 0) {
          return
        }

        /* If the results are updated by JS, the URL of the page will change and this needs to be visible to PA's,
        hence the pageView object push to the dataLayer. We do not need to send a pageView object on page load as
        this is handled elsewhere. */
        if (!this.isNewPageLoad) {
          var pageViewTracker = window.GOVUK.analyticsGA4.analyticsModules.PageViewTracker

          if (pageViewTracker) {
            pageViewTracker.init()
          }
        }

        for (var i = 0; i < this.searchResultsBlocks.length; i++) {
          this.trackSearchResults(this.searchResultsBlocks[i])

          if (this.isNewPageLoad) {
            this.searchResultsBlocks[i].addEventListener('click', this.handleClick.bind(this))
          }
        }
      }
    },

    trackSearchResults: function (searchResultsBlock) {
      var schema = this.populateEcommerceSchema(searchResultsBlock, false, null)

      this.clearPreviousEcommerceObject()
      window.dataLayer.push(schema)
    },

    handleClick: function (event) {
      var searchResultsBlock = event.target.closest('[data-ga4-ecommerce]')
      var isSearchResult = event.target.getAttribute('data-ecommerce-path')

      if (isSearchResult) {
        var searchResult = event.target
        var schema = this.populateEcommerceSchema(searchResultsBlock, true, searchResult)

        this.clearPreviousEcommerceObject()
        window.dataLayer.push(schema)
      }
    },

    populateEcommerceSchema: function (searchResultsBlock, searchResultClicked, searchResult) {
      // Limiting to 100 characters to avoid noise from extra long search queries and to stop the size of the payload going over 8k limit.
      var searchQuery = this.PIIRemover.stripPII(searchResultsBlock.getAttribute('data-search-query')).substring(0, 100).toLowerCase()
      var variant = searchResultsBlock.getAttribute('data-ecommerce-variant') || undefined
      var ecommerceRows = searchResultsBlock.querySelectorAll('[data-ecommerce-row]')
      var listTitle = searchResultsBlock.getAttribute('data-list-title') || this.DEFAULT_LIST_TITLE
      var startPosition = parseInt(searchResultsBlock.getAttribute('data-ecommerce-start-index'), 10)

      var ecommerceObject = {
        event: 'search_results',
        search_results: {
          event_name: searchResultClicked && searchResult ? 'select_item' : 'view_item_list',
          term: searchQuery,
          sort: variant,
          results: this.getResultsCount(searchResultsBlock),
          ecommerce: {
            items: []
          }
        }
      }

      // Populate items array
      if (searchResultClicked && searchResult) {
        ecommerceObject.search_results.ecommerce.items.push({
          item_id: searchResult.getAttribute('data-ecommerce-path'),
          item_name: searchResult.textContent,
          item_list_name: listTitle,
          index: this.getIndex(searchResult, startPosition)
        })

        ecommerceObject.event_data = {
          external: GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker.isExternalLink(searchResult.getAttribute('data-ecommerce-path')) ? 'true' : 'false'
        }
      } else {
        for (var i = 0; i < ecommerceRows.length; i++) {
          var ecommerceRow = ecommerceRows[i]
          var path = ecommerceRow.getAttribute('data-ecommerce-path')

          /* If the element does not have a data-ecommerce-index attribute, we set one so that we can use it later when setting the index property
          on the ecommerce object. This for loop will always run on page load and so data-ecommerce-index will be available when we use it in the
          initial if block above that checks if a search result has been clicked. */
          if (!ecommerceRow.getAttribute('data-ecommerce-index')) {
            ecommerceRow.setAttribute('data-ecommerce-index', i + 1)
          }

          ecommerceObject.search_results.ecommerce.items.push({
            item_id: path,
            item_list_name: listTitle,
            index: this.getIndex(ecommerceRow, startPosition)
          })
        }
      }

      return ecommerceObject
    },

    getIndex: function (element, startPosition) {
      return parseInt(element.getAttribute('data-ecommerce-index')) + startPosition - 1
    },

    clearPreviousEcommerceObject: function () {
      window.dataLayer.push({ search_results: { ecommerce: null } })
    },

    getResultsCount: function (searchResultsBlock) {
      // This returns a string e.g. '12,345 results'. Therefore to extract the number, we need to remove the comma and split the string at the space
      var resultsCount = searchResultsBlock.querySelector('#js-result-count')

      if (!resultsCount) {
        return null
      }

      resultsCount = resultsCount.textContent.replace(',', '')
      resultsCount = resultsCount.split(' ')[0]
      return parseInt(resultsCount)
    }
  }

  global.GOVUK = GOVUK
})(window)
