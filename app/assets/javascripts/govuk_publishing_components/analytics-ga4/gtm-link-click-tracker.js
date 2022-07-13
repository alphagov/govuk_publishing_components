;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkClickTracker = {

    trackLinkClicks: function () {
      this.internalLinksDomain = 'gov.uk/'
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

      var linkMethod = this.getClickType(event)

      // The link opened in a new tab if it was a middle mouse button click, a ctrl + click, or a command + click
      var DEFAULT_ATTRIBUTES = {
        event: 'analytics',
        event_name: 'navigation',
        nav: {
          type: '',
          text: element.textContent.trim(),
          index: 'n/a',
          'index-total': 'n/a',
          section: 'n/a',
          url: element.getAttribute('href'),
          external: '',
          link_method: linkMethod
        }
      }
      var attributes
      var href = element.getAttribute('href')

      if (this.isMailToLink(href)) {
        attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
        attributes.nav.type = 'email'
        attributes.nav.external = 'true'
      } else if (this.isDownloadLink(href)) {
        attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
        attributes.nav.type = 'download'
        attributes.nav.external = 'false'
      } else if (this.isExternalLink(href)) {
        attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
        attributes.nav.type = 'generic link'
        attributes.nav.external = 'true'
      }
      if (attributes) {
        this.trackClickEvent(attributes)
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

    trackClickEvent: function (attributes) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(attributes)
    },

    hrefPointsToDomain: function (href, domain) {
      // If href contains www. remove it so we can compare the href's root domain against the parameter domain, which is a root domain
      if (href.indexOf('www.' + domain) !== -1) {
        href = href.replace('www.' + domain, domain)
      }

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
