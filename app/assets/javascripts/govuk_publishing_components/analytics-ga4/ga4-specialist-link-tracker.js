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

      // don't track this link if it's already being tracked by the other link tracker
      if (element.closest('[data-ga4-link]')) {
        return
      }

      var href = element.getAttribute('href')

      if (!href) {
        return
      }
      var clickData = {}
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'email'
        clickData.external = 'true'
      } else if (this.isDownloadLink(href)) {
        clickData.event_name = 'file_download'
        clickData.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        clickData.external = window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href) ? 'true' : 'false'
      } else if (window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'generic link'
        clickData.external = 'true'
      }

      if (Object.keys(clickData).length > 0) {
        clickData.url = href
        if (clickData.url) {
          clickData.url = window.GOVUK.analyticsGa4.core.trackFunctions.removeCrossDomainParams(clickData.url)
          clickData.link_domain = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(clickData.url)
          clickData.link_path_parts = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(clickData.url)
        }

        clickData.text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(element.textContent)
        clickData.method = window.GOVUK.analyticsGa4.core.trackFunctions.getClickType(event)

        var schema = new window.GOVUK.analyticsGa4.Schemas().eventSchema()
        schema.event = 'event_data'

        // get attributes from the clickData object to send to GA
        // only allow it if it already exists in the schema
        for (var property in clickData) {
          if (property in schema.event_data) {
            schema.event_data[property] = clickData[property]
          }
        }

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
