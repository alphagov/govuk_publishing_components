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

        if (!config.disableListeners) {
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

      var href = element.getAttribute('href')

      if (!href) {
        return
      }
      var clickData = {}
      var linkAttributes = element.getAttribute('data-ga4-link')
      if (linkAttributes) {
        clickData = JSON.parse(linkAttributes)

        /* Since external links can't be determined in the template, we use populated-via-js as a signal
        for our JavaScript to determine this value. */
        if (clickData.external === 'populated-via-js' && clickData.url) {
          clickData.external = this.isExternalLink(clickData.url) ? 'true' : 'false'
        }

        if (clickData.method === 'populated-via-js') {
          clickData.method = this.getClickType(event)
        }

        if (clickData.index) {
          clickData.index = parseInt(clickData.index)
        }

        if (clickData.index_total) {
          clickData.index_total = parseInt(clickData.index_total)
        }
      } else if (this.isMailToLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'email'
        clickData.external = 'true'
        clickData.url = href
        clickData.text = this.removeLinesAndExtraSpaces(element.textContent)
        clickData.method = this.getClickType(event)
      } else if (this.isDownloadLink(href)) {
        clickData.event_name = 'file_download'
        clickData.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        clickData.external = this.isExternalLink(href) ? 'true' : 'false'
        clickData.url = href
        clickData.text = this.removeLinesAndExtraSpaces(element.textContent)
        clickData.method = this.getClickType(event)
      } else if (this.isExternalLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'generic link'
        clickData.external = 'true'
        clickData.url = href
        clickData.text = this.removeLinesAndExtraSpaces(element.textContent)
        clickData.method = this.getClickType(event)
      }

      if (Object.keys(clickData).length > 0) {
        if (clickData.url) {
          clickData.url = this.removeCrossDomainParams(clickData.url)
          clickData.link_domain = this.populateLinkDomain(clickData.url)
          clickData.link_path_parts = this.populateLinkPathParts(clickData.url)
        }

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

    populateLinkPathParts: function (href) {
      var path = ''
      if (this.hrefIsRelative(href) || this.isMailToLink(href)) {
        path = href
      } else {
        // This regex matches a protocol and domain name at the start of a string such as https://www.gov.uk, http://gov.uk, //gov.uk
        path = href.replace(/^(http:||https:)?(\/\/)([^\/]*)/, '') // eslint-disable-line no-useless-escape
      }

      if (path === '/' || path.length === 0) {
        return
      }

      /*
      This will create an object with 5 keys that are indexes ("1", "2", etc.)
      The values will be each part of the link path split every 100 characters, or undefined.
      For example: {"1": "/hello/world/etc...", "2": "/more/path/text...", "3": undefined, "4": undefined, "5": undefined}
      Undefined values are needed to override the persistent object in GTM so that any values from old pushes are overwritten.
      */
      var parts = path.match(/.{1,100}/g)
      var obj = {}
      for (var i = 0; i < 5; i++) {
        obj[(i + 1).toString()] = parts[i]
      }
      return obj
    },

    populateLinkDomain: function (href) {
      // We always want mailto links to have an undefined link_domain
      if (this.isMailToLink(href)) {
        return undefined
      }

      if (this.hrefIsRelative(href)) {
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

    removeLinesAndExtraSpaces: function (text) {
      text = text.trim()
      text = text.replace(/(\r\n|\n|\r)/gm, ' ') // Replace line breaks with 1 space
      text = text.replace(/\s+/g, ' ') // Replace instances of 2+ spaces with 1 space
      return text
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

    stringEndsWith: function (string, stringToFind) {
      return string.substring(string.length - stringToFind.length, string.length) === stringToFind
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
    },

    getProtocol: function () {
      return window.location.protocol
    },

    removeCrossDomainParams: function (href) {
      if (href.indexOf('_ga') !== -1 || href.indexOf('_gl') !== -1) {
        // _ga & _gl are values needed for cross domain tracking, but we don't want them included in our click tracking.
        href = href.replaceAll(/_g[al]=([^&]*)/g, '')

        // The following code cleans up inconsistencies such as gov.uk/&&, gov.uk/?&hello=world, gov.uk/?, and gov.uk/&.
        href = href.replaceAll(/(&&)+/g, '&')
        href = href.replace('?&', '?')
        if (this.stringEndsWith(href, '?') || this.stringEndsWith(href, '&')) {
          href = href.substring(0, href.length - 1)
        }
      }
      return href
    }
  }

  analyticsModules.Ga4SpecialistLinkTracker = Ga4SpecialistLinkTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
