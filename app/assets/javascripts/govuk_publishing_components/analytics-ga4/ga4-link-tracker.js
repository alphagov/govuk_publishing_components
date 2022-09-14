// = require govuk/vendor/polyfills/Element/prototype/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGA4 = window.GOVUK.analyticsGA4 || {}
window.GOVUK.analyticsGA4.analyticsModules = window.GOVUK.analyticsGA4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4LinkTracker = {
    init: function () {
      if (window.dataLayer) {
        this.internalLinksDomain = 'www.gov.uk/'
        this.internalLinksDomainWithoutWww = 'gov.uk/'
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

      if (this.isMailToLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'email'
        clickData.external = 'true'
      } else if (this.isDownloadLink(href)) {
        clickData.event_name = 'file_download'
        clickData.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        clickData.external = 'true'
      } else if (this.isExternalLink(href)) {
        clickData.event_name = 'navigation'
        clickData.type = 'generic link'
        clickData.external = 'true'
      }

      if (Object.keys(clickData).length > 0) {
        clickData.text = element.textContent.trim()
        clickData.url = href
        clickData.link_method = this.getClickType(event)

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

    getClickType: function (event) {
      switch (event.type) {
        case 'click':
          if (event.ctrlKey) {
            return 'ctrl click'
          } else if (event.metaKey) {
            return 'command/win click'
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
      var assetsDomain = 'assets.publishing.service.gov.uk/'
      var uploadsPath = '/government/uploads/'

      if (this.hrefPointsToDomain(href, assetsDomain)) {
        return true
      }

      var isInternalLink = this.hrefPointsToDomain(href, this.internalLinksDomain) || this.hrefPointsToDomain(href, this.internalLinksDomainWithoutWww)
      if (isInternalLink && href.indexOf(uploadsPath) !== -1) {
        return true
      }

      // Checks relative links to the uploadsPath
      if (this.stringStartsWith(href, uploadsPath)) {
        return true
      }
    },

    isExternalLink: function (href) {
      var isInternalLink = this.hrefPointsToDomain(href, this.internalLinksDomain) || this.hrefPointsToDomain(href, this.internalLinksDomainWithoutWww)
      if (!isInternalLink && !this.hrefIsRelative(href) && !this.hrefIsAnchor(href)) {
        return true
      }
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
      var httpDomain = 'http://' + domain
      var httpsDomain = 'https://' + domain
      var schemaRelativeDomain = '//' + domain
      return this.stringStartsWith(href, domain) ||
      this.stringStartsWith(href, httpDomain) ||
      this.stringStartsWith(href, httpsDomain) ||
      this.stringStartsWith(href, schemaRelativeDomain)
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
    }
  }

  analyticsModules.Ga4LinkTracker = Ga4LinkTracker
})(window.GOVUK.analyticsGA4.analyticsModules)
