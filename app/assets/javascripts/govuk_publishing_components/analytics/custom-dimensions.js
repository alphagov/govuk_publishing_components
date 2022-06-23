/* global GOVUK */

(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var CustomDimensions = function () { }

  CustomDimensions.getAndExtendDefaultTrackingOptions = function (extraOptions) {
    var trackingOptions = this.customDimensions()
    return GOVUK.extendObject(trackingOptions, extraOptions)
  }

  CustomDimensions.customDimensions = function () {
    var dimensions = GOVUK.extendObject(
      {},
      customDimensionsFromBrowser(),
      customDimensionsFromMetaTags(),
      customDimensionsFromDom(),
      abTestCustomDimensions()
    )

    for (var key in dimensions) {
      dimensions[key] = new GOVUK.Analytics.PIISafe(String(dimensions[key]))
    }
    return dimensions
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
      'navigation-list-type': { dimension: 31, defaultValue: 'none' },
      'navigation-page-type': { dimension: 32, defaultValue: 'none' },
      'taxon-slug': { dimension: 56, defaultValue: 'other' },
      'taxon-id': { dimension: 57, defaultValue: 'other' },
      'taxon-slugs': { dimension: 58, defaultValue: 'other' },
      'taxon-ids': { dimension: 59, defaultValue: 'other' },
      'content-has-history': { dimension: 39, defaultValue: 'false' },
      'publishing-app': { dimension: 89 },
      'brexit-audience': { dimension: 112 },
      'brexit-superbreadcrumb': { dimension: 111 },
      stepnavs: { dimension: 96 },
      'relevant-result-shown': { dimension: 83 },
      'spelling-suggestion': { dimension: 81 }
    }

    var metas = document.querySelectorAll("meta[name^='govuk']")
    var customDimensions = {}
    var tags = {}

    for (var i = 0; i < metas.length; i++) {
      var meta = metas[i]
      var metaKey = meta.getAttribute('name').split('govuk:')[1]
      var dimension = dimensionMappings[metaKey]
      if (dimension) {
        tags[metaKey] = meta.getAttribute('content')
      }
    }

    for (var key in dimensionMappings) {
      var value = tags[key] || dimensionMappings[key].defaultValue
      if (typeof value !== 'undefined') {
        customDimensions['dimension' + dimensionMappings[key].dimension] = value
      }
    }

    return customDimensions
  }

  function customDimensionsFromDom () {
    var mainLang = document.getElementById('content')
    if (mainLang) {
      mainLang = mainLang.getAttribute('lang')
    }
    var globalBar = document.querySelector('[data-module="global-bar"]') || false
    if (globalBar) {
      globalBar = globalBar.style.display !== 'none'
    }
    return {
      dimension26: GOVUK.PageContent.getNumberOfSections(),
      dimension27: GOVUK.PageContent.getNumberOfLinks(),
      dimension23: mainLang || 'unknown',
      dimension38: globalBar && 'Global Banner viewed'
    }
  }

  function abTestCustomDimensions () {
    var abMetas = document.querySelectorAll("meta[name^='govuk:ab-test']")
    var customDimensions = {}

    for (var i = 0; i < abMetas.length; i++) {
      var meta = abMetas[i]
      var dimension = parseInt(meta.getAttribute('data-analytics-dimension'))
      var testNameAndBucket = meta.getAttribute('content')

      if (dimension) {
        customDimensions['dimension' + dimension] = testNameAndBucket
      }
    }

    return customDimensions
  }

  GOVUK.CustomDimensions = CustomDimensions
})()
