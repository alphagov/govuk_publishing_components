;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkClickTracker = {

    trackLinkClicks: function () {
      this.internalLinksDomain = 'www.gov.uk/'
      document.querySelector('body').addEventListener('click', this.handleClick.bind(this))
      document.querySelector('body').addEventListener('contextmenu', this.handleClick.bind(this))
      document.querySelector('body').addEventListener('mousedown', this.handleMousedown.bind(this))
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

        for (var key in clickData) {
          if (schema.event_data[key]) {
            schema.event_data[key] = clickData[key]
          }
        }

        console.log(schema)
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
      if (!href) {
        return false
      }

      if (href.length < 7) {
        return false
      }
      return href.substring(0, 7) === 'mailto:'
    },

    isDownloadLink: function (href) {
      var assetsDomain = 'assets.publishing.service.gov.uk/'
      var uploadsPath = '/government/uploads/'
      if (!href) {
        return false
      }

      if (this.hrefPointsToDomain(href, assetsDomain)) {
        return true
      }

      if (this.hrefPointsToDomain(href, this.internalLinksDomain) && href.indexOf(uploadsPath) !== -1) {
        return true
      }

      // Checks relative links to the uploadsPath
      if (this.stringStartsWith(href, uploadsPath)) {
        return true
      }
    },

    isExternalLink: function (href) {
      if (!href) {
        return false
      }

      if (!this.hrefPointsToDomain(href, this.internalLinksDomain) && !this.hrefIsRelative(href)) {
        return true
      }
    },

    trackClickEvent: function (schema) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(schema)
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
      // Checks that a link is relative, but is not a schema relative url
      return this.stringStartsWith(href, '/') && !this.stringStartsWith(href, '//')
    }

  }

  global.GOVUK = GOVUK
})(window)
