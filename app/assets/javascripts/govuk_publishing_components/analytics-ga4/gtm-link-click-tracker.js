// = require govuk/vendor/polyfills/Element/prototype/closest.js

;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkClickTracker = {
    trackLinkClicks: function () {
      this.internalLinksDomain = 'www.gov.uk/'
      this.internalLinksDomainWithoutWww = 'gov.uk/'
      this.handleClick = this.handleClick.bind(this)
      this.handleMousedown = this.handleMousedown.bind(this)
      document.querySelector('body').addEventListener('click', this.handleClick)
      document.querySelector('body').addEventListener('contextmenu', this.handleClick)
      document.querySelector('body').addEventListener('mousedown', this.handleMousedown)
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
        return false
      }

      if (this.isMailToLink(href)) {
        clickData.type = 'email'
        clickData.external = 'true'
      } else if (this.isDownloadLink(href)) {
        clickData.type = 'download'
        clickData.external = 'false'
      } else if (this.isExternalLink(href)) {
        clickData.type = 'generic link'
        clickData.external = 'true'
      }

      if (Object.keys(clickData).length > 0) {
        clickData.event_name = 'navigation'
        clickData.text = element.textContent.trim()
        clickData.url = href
        clickData.link_method = this.getClickType(event)

        var schema = new window.GOVUK.analyticsGA4.Schemas().eventSchema()
        schema.event = 'analytics'

        // get attributes from the clickData object to send to GA
        // only allow it if it already exists in the schema
        for (var property in clickData) {
          if (property in schema.event_data) {
            schema.event_data[property] = clickData[property]
          }
        }

        this.trackClickEvent(schema)
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
      if (!isInternalLink && !this.hrefIsRelative(href)) {
        return true
      }
    },

    trackClickEvent: function (schema) {
      if (window.dataLayer) {
        window.dataLayer.push(schema)
      }
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
    }
  }

  global.GOVUK = GOVUK
})(window)
