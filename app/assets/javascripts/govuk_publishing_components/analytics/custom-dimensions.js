/* global GOVUK, $ */

(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var CustomDimensions = function () { }

  CustomDimensions.getAndExtendDefaultTrackingOptions = function (extraOptions) {
    var trackingOptions = this.customDimensions()
    return $.extend(trackingOptions, extraOptions)
  }

  CustomDimensions.customDimensions = function () {
    var dimensions = $.extend(
      {},
      customDimensionsFromBrowser(),
      customDimensionsFromMetaTags(),
      customDimensionsFromDom(),
      abTestCustomDimensions()
    )

    return $.each(dimensions, function (key, value) {
      dimensions[key] = new GOVUK.Analytics.PIISafe(String(value))
    })
  }

  function customDimensionsFromBrowser () {
    var customDimensions = {
      dimension15: window.httpStatusCode || 200,
      dimension16: GOVUK.cookie('TLSversion') || 'unknown',
      dimension95: GOVUK.analytics.gaClientId
    }

    if (window.devicePixelRatio) {
      customDimensions.dimension11 = window.devicePixelRatio
    } else {
      customDimensions.dimension11 = window.screen.deviceXDPI / window.screen.logicalXDPI
    }

    return customDimensions
  }

  function customDimensionsFromMetaTags () {
    var dimensionMappings = {
      section: { dimension: 1 },
      format: { dimension: 2 },
      themes: { dimension: 3, defaultValue: 'other' },
      'content-id': { dimension: 4, defaultValue: '00000000-0000-0000-0000-000000000000' },
      'search-result-count': { dimension: 5 },
      'publishing-government': { dimension: 6 },
      'political-status': { dimension: 7 },
      'analytics:organisations': { dimension: 9 },
      'analytics:world-locations': { dimension: 10 },
      withdrawn: { dimension: 12, defaultValue: 'not withdrawn' },
      'schema-name': { dimension: 17 },
      'rendering-application': { dimension: 20 },
      'search-autocomplete-status': { dimension: 21 },
      'navigation-legacy': { dimension: 30, defaultValue: 'none' },
      'navigation-page-type': { dimension: 32, defaultValue: 'none' },
      'taxon-slug': { dimension: 56, defaultValue: 'other' },
      'taxon-id': { dimension: 57, defaultValue: 'other' },
      'taxon-slugs': { dimension: 58, defaultValue: 'other' },
      'taxon-ids': { dimension: 59, defaultValue: 'other' },
      'content-has-history': { dimension: 39, defaultValue: 'false' },
      'publishing-application': { dimension: 89 },
      'brexit-audience': { dimension: 112 },
      stepnavs: { dimension: 96 },
      'relevant-result-shown': { dimension: 83 },
      'spelling-suggestion': { dimension: 81 }
    }

    var $metas = $('meta[name^="govuk:"]')
    var customDimensions = {}
    var tags = {}

    $metas.each(function () {
      var $meta = $(this)
      var key = $meta.attr('name').split('govuk:')[1]

      var dimension = dimensionMappings[key]
      if (dimension) {
        tags[key] = $meta.attr('content')
      }
    })

    $.each(dimensionMappings, function (key, dimension) {
      var value = tags[key] || dimension.defaultValue
      if (typeof value !== 'undefined') {
        customDimensions['dimension' + dimension.dimension] = value
      }
    })

    return customDimensions
  }

  function customDimensionsFromDom () {
    return {
      dimension26: GOVUK.PageContent.getNumberOfSections(),
      dimension27: GOVUK.PageContent.getNumberOfLinks(),
      dimension23: $('main[id="content"]').attr('lang') || 'unknown',
      dimension38: $('[data-module="global-bar"]').is(':visible') && 'Global Banner viewed'
    }
  }

  function abTestCustomDimensions () {
    var $abMetas = $('meta[name^="govuk:ab-test"]')
    var customDimensions = {}

    $abMetas.each(function () {
      var $meta = $(this)
      var dimension = parseInt($meta.data('analytics-dimension'))
      var testNameAndBucket = $meta.attr('content')

      if (dimension) {
        customDimensions['dimension' + dimension] = testNameAndBucket
      }
    })

    return customDimensions
  }

  GOVUK.CustomDimensions = CustomDimensions
})()
