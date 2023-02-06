// = require govuk/vendor/polyfills/Element/prototype/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4SpecialistLinkTracker = {
    init: function (config) {
      if (window.dataLayer) {
        config = config || {}
        this.internalDownloadPaths = config.internalDownloadPaths || ['/government/uploads/']
        this.dedicatedDownloadDomains = config.dedicatedDownloadDomains || ['assets.publishing.service.gov.uk']
        window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(this.dedicatedDownloadDomains)
        this.handleClick = this.handleClick.bind(this)
        this.handleMousedown = this.handleMousedown.bind(this)

        document.querySelector('body').addEventListener('click', this.handleClick)
        document.querySelector('body').addEventListener('contextmenu', this.handleClick)
        document.querySelector('body').addEventListener('mousedown', this.handleMousedown)
      }
    },

    stopTracking: function () {
      document.querySelector('body').removeEventListener('click', this.handleClick)
      document.querySelector('body').removeEventListener('contextmenu', this.handleClick)
      document.querySelector('body').removeEventListener('mousedown', this.handleMousedown)
    },

    handleClick: function (event) {
      var element = event.target

      if (element.tagName !== 'A') {
        element = element.closest('a')
      }

      if (!element) {
        return
      }

      // don't track this link if it's already being tracked by the another tracker (e.g. the link tracker or ecommerce tracker)
      if (element.closest('[data-ga4-link]') || element.closest('[data-ga4-ecommerce-path]')) {
        return
      }

      var href = element.getAttribute('href')

      if (!href) {
        return
      }
      var data = {}
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)) {
        data.event_name = 'navigation'
        data.type = 'email'
        data.external = 'true'
      } else if (this.isDownloadLink(href)) {
        data.event_name = 'file_download'
        data.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        data.external = window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href) ? 'true' : 'false'
      } else if (window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href)) {
        data.event_name = 'navigation'
        data.type = 'generic link'
        data.external = 'true'
      }

      if (Object.keys(data).length > 0) {
        data.url = href
        if (data.url) {
          data.url = window.GOVUK.analyticsGa4.core.trackFunctions.removeCrossDomainParams(data.url)
          data.link_domain = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(data.url)
          data.link_path_parts = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(data.url)
        }

        data.text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(element.textContent)
        data.method = window.GOVUK.analyticsGa4.core.trackFunctions.getClickType(event)

        var schemas = new window.GOVUK.analyticsGa4.Schemas()
        var schema = schemas.mergeProperties(data, 'event_data')
        window.GOVUK.analyticsGa4.core.sendData(schema)
      }
    },

    handleMousedown: function (event) {
      // 1 = middle mouse button
      if (event.button === 1) {
        this.handleClick(event)
      }
    },

    isDownloadLink: function (href) {
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href) && this.hrefPointsToDownloadPath(href)) {
        return true
      }

      var result = false
      for (var i = 0; i < this.dedicatedDownloadDomains.length; i++) {
        var downloadDomain = this.dedicatedDownloadDomains[i]
        if (window.GOVUK.analyticsGa4.core.trackFunctions.hrefPointsToDomain(href, downloadDomain)) {
          result = true
        }
      }
      return result
    },

    isPreviewLink: function (href) {
      /*  Regex looks for:
      1. The file extension period (the character '.')
      2. any alphanumeric characters (so we can match any file type such as jpg, pdf, mp4.)
      3. the presence of '/preview'.
      For example, .csv/preview or .mp4/preview will be matched.
      Regex is used over JS string methods as this should work with anchor links, query string parameters and files that may have 'preview' in their name.
      */
      var previewRegex = /\.\w+\/preview/i
      return previewRegex.test(href)
    },

    hrefPointsToDownloadPath: function (href) {
      var result = false
      for (var i = 0; i < this.internalDownloadPaths.length; i++) {
        var internalDownloadPath = this.internalDownloadPaths[i]
        if (href.indexOf(internalDownloadPath) !== -1) {
          result = true
        }
      }
      return result
    }
  }

  analyticsModules.Ga4SpecialistLinkTracker = Ga4SpecialistLinkTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
