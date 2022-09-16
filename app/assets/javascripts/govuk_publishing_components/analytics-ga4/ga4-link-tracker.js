// = require govuk/vendor/polyfills/Element/prototype/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGA4 = window.GOVUK.analyticsGA4 || {}
window.GOVUK.analyticsGA4.analyticsModules = window.GOVUK.analyticsGA4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4LinkTracker = {
    init: function (config = {}) {
      if (window.dataLayer) {
        this.config = config
        this.internalDomains = this.config.internalDomains || []
        this.internalDomains.push(this.getHostname())
        this.appendDomainsWithoutWWW(this.internalDomains)
        this.internalDownloadPaths = this.config.internalDownloadPaths || ['/government/uploads/']
        this.dedicatedDownloadDomains = this.config.dedicatedDownloadDomains || ['assets.publishing.service.gov.uk']
        this.appendDomainsWithoutWWW(this.dedicatedDownloadDomains)
        this.handleClick = this.handleClick.bind(this)
        this.handleMousedown = this.handleMousedown.bind(this)

        if (!this.config.disableListeners) {
          document.querySelector('body').addEventListener('click', this.handleClick)
          document.querySelector('body').addEventListener('contextmenu', this.handleClick)
          document.querySelector('body').addEventListener('mousedown', this.handleMousedown)
        }
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

      var clickData = {}
      var href = element.getAttribute('href')

      if (!href) {
        return
      }

      var linkAttributes = element.getAttribute('data-ga4-link')
      if (linkAttributes) {
        linkAttributes = JSON.parse(linkAttributes)
        clickData = Object.assign(clickData, linkAttributes)

        /* Since external links can't be determined in the template, we use _ as a signal
        for our JavaScript to determine this value. */
        if (clickData.external === '[populated-via-js]' && clickData.url) {
          clickData.external = this.isExternalLink(clickData.url) ? 'true' : 'false'
        }

        if (clickData.link_method === '[populated-via-js]') {
          clickData.link_method = this.getClickType(event)
        }

        if (clickData.index) {
          clickData.index = parseInt(linkAttributes.index)
        }
        if (clickData.index_total) {
          clickData.index_total = parseInt(linkAttributes.index_total)
        }
      } else if (this.isMailToLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'email'
        clickData.external = 'true'
        clickData.url = href
        clickData.text = element.textContent.trim()
        clickData.link_method = this.getClickType(event)
      } else if (this.isDownloadLink(href)) {
        clickData.event_name = 'file_download'
        clickData.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        clickData.external = this.isExternalLink(href) ? 'true' : 'false'
        clickData.url = href
        clickData.text = element.textContent.trim()
        clickData.link_method = this.getClickType(event)
      } else if (this.isExternalLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'generic link'
        clickData.external = 'true'
        clickData.url = href
        clickData.text = element.textContent.trim()
        clickData.link_method = this.getClickType(event)
      }

      if (Object.keys(clickData).length > 0) {
        var schema = new window.GOVUK.analyticsGA4.Schemas().eventSchema()
        schema.event = 'event_data'

        // get attributes from the clickData object to send to GA
        // only allow it if it already exists in the schema
        for (var property in clickData) {
          if (property in schema.event_data) {
            schema.event_data[property] = clickData[property]
          }
        }

        window.GOVUK.analyticsGA4.core.sendData(schema)
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

    getClickType: function (event) {
      switch (event.type) {
        case 'click':
          if (event.ctrlKey) {
            return 'ctrl click'
          } else if (event.metaKey) {
            return 'command/win click'
          } else if (event.shiftKey) {
            return 'shift click'
          } else {
            return 'primary click'
          }
        case 'mousedown':
          return 'middle click'
        case 'contextmenu':
          return 'secondary click'
      }
    },

    handleMousedown: function (event) {
      // 1 = middle mouse button
      if (event.button === 1) {
        this.handleClick(event)
      }
    },

    isMailToLink: function (href) {
      return href.substring(0, 7) === 'mailto:'
    },

    isDownloadLink: function (href) {
      if (this.isInternalLink(href) && this.hrefPointsToDownloadPath(href)) {
        return true
      }

      var result = false
      for (var i = 0; i < this.dedicatedDownloadDomains.length; i++) {
        var downloadDomain = this.dedicatedDownloadDomains[i]
        if (this.hrefPointsToDomain(href, downloadDomain)) {
          result = true
        }
      }
      return result
    },

    isInternalLink: function (href) {
      if (this.hrefIsRelative(href) || this.hrefIsAnchor(href)) {
        return true
      }
      var result = false
      for (var i = 0; i < this.internalDomains.length; i++) {
        var internalDomain = this.internalDomains[i]
        if (this.hrefPointsToDomain(href, internalDomain)) {
          result = true
        }
      }
      return result
    },

    isExternalLink: function (href) {
      return !this.isInternalLink(href)
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

    hrefPointsToDomain: function (href, domain) {
      /* Add a trailing slash to prevent an edge case such
      as the href www.gov.uk.domain.co.uk being detected as an internal link,
      if we were checking for 'www.gov.uk' instead of 'www.gov.uk/' */
      if (domain.substring(domain.length) !== '/') {
        domain = domain + '/'
      }

      /* If the href doesn't end in a slash, we add one.
      This fixes an edge case where the <a href> is exactly `https://www.gov.uk`
      but these checks would only look for `https://www.gov.uk/` */
      if (href.substring(href.length) !== '/') {
        href = href + '/'
      }
      var httpDomain = 'http://' + domain
      var httpsDomain = 'https://' + domain
      var schemaRelativeDomain = '//' + domain
      return this.stringStartsWith(href, domain) ||
      this.stringStartsWith(href, httpDomain) ||
      this.stringStartsWith(href, httpsDomain) ||
      this.stringStartsWith(href, schemaRelativeDomain)
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

    hrefIsRelative: function (href) {
      // Checks that a link is relative, but is not a protocol relative url
      return href[0] === '/' && href[1] !== '/'
    },

    hrefIsAnchor: function (href) {
      return href[0] === '#'
    },

    getHostname: function () {
      return window.location.hostname
    }
  }

  analyticsModules.Ga4LinkTracker = Ga4LinkTracker
})(window.GOVUK.analyticsGA4.analyticsModules)
