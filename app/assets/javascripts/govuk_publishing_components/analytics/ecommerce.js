// https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
/* global GOVUK, ga */

(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var DEFAULT_LIST_TITLE = 'Site search results'
  var DEFAULT_TRACK_CLICK_LABEL = 'Results'

  var Ecommerce = function (config) {
    this.init = function (element) {
      // Limiting to 100 characters to avoid noise from extra longs search queries
      // and to stop the size of the payload going over 8k limit.
      var searchQuery = GOVUK.analytics.stripPII(element.getAttribute('data-search-query')).substring(0, 100).toLowerCase()
      var ecommerceRows = element.querySelectorAll('[data-ecommerce-row]')
      var startPosition = parseInt(element.getAttribute('data-ecommerce-start-index'), 10)
      var listTitle = element.getAttribute('data-list-title') || DEFAULT_LIST_TITLE
      var variant = element.getAttribute('data-ecommerce-variant') || undefined
      var trackClickLabel = element.getAttribute('data-track-click-label') || DEFAULT_TRACK_CLICK_LABEL

      for (var i = 0; i < ecommerceRows.length; i++) {
        var ecommerceRow = ecommerceRows[i]
        var listSubheading = ecommerceRow.getAttribute('data-ecommerce-subheading') || undefined
        var contentId = ecommerceRow.getAttribute('data-ecommerce-content-id') || undefined
        var path = ecommerceRow.getAttribute('data-ecommerce-path')

        var indexOverride = ecommerceRow.getAttribute('data-ecommerce-index')
        var index = indexOverride ? parseInt(indexOverride, 10) - 1 : i

        addImpression(contentId, path, index + startPosition, searchQuery, listTitle, listSubheading, variant)
        trackProductOnClick(ecommerceRow, contentId, path, index + startPosition, searchQuery, listTitle, listSubheading, variant, trackClickLabel)
      }
    }

    function constructData (contentId, path, position, listTitle, listSubheading, searchQuery, variant) {
      var data = {
        position: position,
        list: listTitle,
        dimension71: searchQuery
      }

      if (listSubheading !== undefined) {
        data.dimension94 = listSubheading
      }

      if (contentId !== undefined) {
        data.id = contentId
      }

      if (path !== undefined) {
        data.name = path
      }

      if (variant !== undefined) {
        data.variant = variant
      }

      return data
    }

    function addImpression (contentId, path, position, searchQuery, listTitle, listSubheading, variant) {
      if (contentId || path) {
        var impressionData = constructData(contentId, path, position, listTitle, listSubheading, searchQuery, variant)
        ga('ec:addImpression', impressionData)
      }
    }

    function trackProductOnClick (row, contentId, path, position, searchQuery, listTitle, listSubheading, variant, trackClickLabel) {
      row.addEventListener('click', function () {
        if (contentId || path) {
          var clickData = constructData(contentId, path, position, listTitle, listSubheading, searchQuery, variant)
          ga('ec:addProduct', clickData)
        }

        ga('ec:setAction', 'click', { list: listTitle })
        GOVUK.analytics.trackEvent('UX', 'click',
          GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({ label: trackClickLabel })
        )
      })
    }
  }

  Ecommerce.ecLoaded = false
  Ecommerce.start = function (elements) {
    if (!window.ga) { return }
    elements = elements || document.querySelectorAll('[data-analytics-ecommerce]')
    if (elements.length > 0) {
      if (!Ecommerce.ecLoaded) {
        ga('require', 'ec')
        Ecommerce.ecLoaded = true
      }
      for (var i = 0; i < elements.length; i++) {
        var ecommerce = new Ecommerce()
        ecommerce.init(elements[i])
      }
    }
  }

  GOVUK.Ecommerce = Ecommerce
})()
