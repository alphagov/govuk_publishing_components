// = require govuk/vendor/polyfills/Element/prototype/closest.js

;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkTracker = {
    trackLinkClicks: function (options) {
      if (window.dataLayer) {
        this.internalDomains = options.internalDomains || []
        this.internalDomains.push(this.getHostname())

        for (var i = 0; i < this.internalDomains.length; i++) {
          // Add domains with www. removed, in case site hrefs are marked up without www. included.
          var internalDomain = this.internalDomains[i]
          var internalDomainWithoutWww = internalDomain.replace('www.', '')
          if (internalDomainWithoutWww !== internalDomain) {
            this.internalDomains.push(internalDomainWithoutWww)
          }
        }

        this.internalDownloadPaths = options.internalDownloadPaths || []
        this.dedicatedDownloadDomains = options.dedicatedDownloadDomains || []
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

      var clickData = {}
      var href = element.getAttribute('href')

      if (!href) {
        return
      }

      var linkAttributes = element.getAttribute('data-ga4-link')
      if (linkAttributes) {
        linkAttributes = JSON.parse(linkAttributes)
        clickData = Object.assign(clickData, linkAttributes)

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

        window.dataLayer.push(schema)
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
      for (var i = 0; i < this.dedicatedDownloadDomains.length; i++) {
        var downloadDomain = this.dedicatedDownloadDomains[i]
        if (this.hrefPointsToDomain(href, downloadDomain)) {
          return true
        }
      }

      if (this.isInternalLink(href) && this.hrefPointsToDownloadPath(href)) {
        return true
      }
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
      domain = domain + '/'
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

  global.GOVUK = GOVUK
})(window)
