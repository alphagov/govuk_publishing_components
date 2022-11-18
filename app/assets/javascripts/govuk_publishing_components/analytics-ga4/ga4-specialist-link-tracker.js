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
        this.internalDomains = config.internalDomains || []
        this.internalDomains.push(this.getHostname())
        this.appendDomainsWithoutWWW(this.internalDomains)
        this.internalDownloadPaths = config.internalDownloadPaths || ['/government/uploads/']
        this.dedicatedDownloadDomains = config.dedicatedDownloadDomains || ['assets.publishing.service.gov.uk']
        this.appendDomainsWithoutWWW(this.dedicatedDownloadDomains)
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
        clickData.url = href
      } else if (this.isDownloadLink(href)) {
        clickData.event_name = 'file_download'
        clickData.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        clickData.external = window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href, this.internalDomains) ? 'true' : 'false'
        clickData.url = href
      } else if (window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href, this.internalDomains)) {
        clickData.event_name = 'navigation'
        clickData.type = 'generic link'
        clickData.external = 'true'
        clickData.url = href
      }

      if (Object.keys(clickData).length > 0) {
        clickData.url = href
        if (clickData.url) {
          clickData.url = window.GOVUK.analyticsGa4.core.trackFunctions.removeCrossDomainParams(clickData.url)
          clickData.link_domain = this.populateLinkDomain(clickData.url)
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

    populateLinkDomain: function (href) {
      // We always want mailto links to have an undefined link_domain
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)) {
        return undefined
      }

      if (window.GOVUK.analyticsGa4.core.trackFunctions.hrefIsRelative(href)) {
        return this.getProtocol() + '//' + this.getHostname()
      } else {
        // This regex matches a protocol and domain name at the start of a string such as https://www.gov.uk, http://gov.uk, //gov.uk
        var domainRegex = /^(http:||https:)?(\/\/)([^\/]*)/ // eslint-disable-line no-useless-escape
        var domain = domainRegex.exec(href)[0]
        return domain
      }
    },

    appendDomainsWithoutWWW: function (domainsArrays) {
      // Add domains with www. removed, in case site hrefs are marked up without www. included.
      for (var i = 0; i < domainsArrays.length; i++) {
        var domain = domainsArrays[i]
        if (this.stringStartsWith(domain, 'www.')) {
          var domainWithoutWww = domain.replace('www.', '')
          domainsArrays.push(domainWithoutWww)
        }
      }
    },

    handleMousedown: function (event) {
      // 1 = middle mouse button
      if (event.button === 1) {
        this.handleClick(event)
      }
    },

    isDownloadLink: function (href) {
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isInternalLink(href, this.internalDomains) && this.hrefPointsToDownloadPath(href)) {
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
    },

    stringStartsWith: function (string, stringToFind) {
      return string.substring(0, stringToFind.length) === stringToFind
    },

    getHostname: function () {
      return window.location.hostname
    },

    getProtocol: function () {
      return window.location.protocol
    }
  }

  analyticsModules.Ga4SpecialistLinkTracker = Ga4SpecialistLinkTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
