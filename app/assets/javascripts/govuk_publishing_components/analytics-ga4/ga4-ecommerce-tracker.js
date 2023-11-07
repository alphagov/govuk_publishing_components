;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4EcommerceTracker = {
    init: function (referrer) {
      if (window.dataLayer) {
        /* The referrer parameter is only passed to the init() function as a result of an AJAX request
        (in live_search.js in the finder-frontend repository). Otherwise it will not be available and this indicates a fresh page load.
        This is needed to trigger a fresh pageViewTracker push to the dataLayer on dynamic page updates and to prevent multiple
        click listeners from being applied on this.searchResultsBlocks elements. */
        var isNewPageLoad = !referrer

        /* The data-ga4-ecommerce attribute may be present on several DOM elements e.g. search results and spelling
        suggestions, hence why document.querySelectorAll is required */
        this.searchResultsBlocks = document.querySelectorAll('[data-ga4-ecommerce]')

        if (!this.searchResultsBlocks.length === 0) {
          return
        }

        /* If the results are updated by JS, the URL of the page will change and this needs to be visible to PA's,
        hence the pageView object push to the dataLayer. We do not need to send a pageView object on page load as
        this is handled elsewhere. */
        if (referrer) {
          var pageViewTracker = window.GOVUK.analyticsGa4.analyticsModules.PageViewTracker

          if (pageViewTracker) {
            pageViewTracker.init(referrer)
          }
        }

        for (var i = 0; i < this.searchResultsBlocks.length; i++) {
          this.trackResults(this.searchResultsBlocks[i])

          if (isNewPageLoad) {
            this.searchResultsBlocks[i].addEventListener('click', this.handleClick.bind(this))
          }
        }
      }
    },

    trackResults: function (searchResultsBlock) {
      var ecommerceSchema = GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
        element: searchResultsBlock,
        resultsId: 'js-result-count'
      })

      GOVUK.analyticsGa4.core.ecommerceHelperFunctions.clearEcommerceObject()
      GOVUK.analyticsGa4.core.sendData(ecommerceSchema)
    },

    handleClick: function (event) {
      if (event.target.getAttribute('data-ga4-ecommerce-path')) {
        var searchResultsBlock = event.target.closest('[data-ga4-ecommerce]')

        var ecommerceSchema = GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
          element: searchResultsBlock,
          resultsId: 'js-result-count',
          event: event
        })

        GOVUK.analyticsGa4.core.ecommerceHelperFunctions.clearEcommerceObject()
        GOVUK.analyticsGa4.core.sendData(ecommerceSchema)
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
