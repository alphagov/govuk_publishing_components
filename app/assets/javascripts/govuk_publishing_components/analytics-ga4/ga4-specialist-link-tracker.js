window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4SpecialistLinkTracker = {
    init: function (config) {
      if (window.dataLayer) {
        config = config || {}
        this.internalDownloadPaths = config.internalDownloadPaths || ['/government/uploads/', '/media/', '/csv-preview/']
        this.dedicatedDownloadDomains = config.dedicatedDownloadDomains || ['assets.publishing.service.gov.uk']
        window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(this.dedicatedDownloadDomains)
        this.handleClick = this.handleClick.bind(this)
        this.handleMousedown = this.handleMousedown.bind(this)
        this.PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()

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

      // Don't track this link if it's already being tracked by the ecommerce tracker
      if (element.closest('[data-ga4-ecommerce-path]')) {
        return
      }

      // Code below ensures the tracker plays nicely with the other link tracker
      var otherLinkTracker = element.closest('[data-ga4-link]')
      if (otherLinkTracker) {
        var limitToElementClass = otherLinkTracker.getAttribute('data-ga4-limit-to-element-class')

        if (!limitToElementClass) {
          // If this link is inside the other link tracker, and the other link tracker IS NOT limiting itself to specific classes,
          // then stop this tracker from firing, as the other tracker is responsible for this link.
          return
        } else {
          // If this link is inside the other link tracker, but the other link tracker IS limiting itself to specific classes,
          // then track the link here only if it is not within the specified classes that the other tracker is looking for.
          var classes = limitToElementClass.split(',')

          for (var i = 0; i < classes.length; i++) {
            if (element.closest('.' + classes[i].trim())) {
              return
            }
          }
        }
      }

      var href = element.getAttribute('href')

      if (!href) {
        return
      }

      var data = {}
      var extraAttributes = element.getAttribute('data-ga4-attributes')
      if (extraAttributes) {
        try {
          extraAttributes = JSON.parse(extraAttributes)
          // make sure the data object remains an object - JSON.parse can return a string
          for (var attrname in extraAttributes) {
            data[attrname] = extraAttributes[attrname]
          }
        } catch (e) {
          // fall back to the empty data object if something goes wrong
          console.error('GA4 configuration error: ' + e.message, window.location)
        }
      }

      var mailToLink = false
      if (window.GOVUK.analyticsGa4.core.trackFunctions.isMailToLink(href)) {
        data.event_name = 'navigation'
        data.type = 'email'
        data.external = 'true'
        mailToLink = true
      } else if (this.isDownloadLink(href)) {
        data.event_name = 'file_download'
        data.type = this.isPreviewLink(href) ? 'preview' : 'generic download'
        data.external = window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href) ? 'true' : 'false'
      } else if (window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(href)) {
        data.event_name = 'navigation'
        data.type = data.type || 'generic link'
        data.external = 'true'
      }

      if (Object.keys(data).length > 0) {
        data.url = mailToLink ? href : this.PIIRemover.stripPIIWithOverride(href, true, true)
        if (data.url) {
          data.url = window.GOVUK.analyticsGa4.core.trackFunctions.removeCrossDomainParams(data.url)
          data.link_domain = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(data.url)
        }

        data.text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(element.textContent)
        data.text = mailToLink ? data.text : this.PIIRemover.stripPIIWithOverride(data.text, true, true)
        if (!data.text && (element.querySelector('img') || element.querySelector('svg'))) {
          data.text = 'image'
        }
        data.method = window.GOVUK.analyticsGa4.core.trackFunctions.getClickType(event)
        window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
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
      var previewRegex = /\.\w+\/preview|(\/csv-preview\/)/i
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
