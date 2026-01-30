window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4LinkTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-link' // elements with this attribute get tracked
    this.trackLinksOnly = this.module.hasAttribute('data-ga4-track-links-only')
    this.limitToElementClass = this.module.getAttribute('data-ga4-limit-to-element-class')
    this.PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
  }

  Ga4LinkTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie?.usage === true || consentCookie?.aggregate === true) {
      this.startModule()
    }
  }

  Ga4LinkTracker.prototype.startModule = function () {
    if (window.dataLayer) {
      this.handleClick = this.handleClick.bind(this)
      this.handleMousedown = this.handleMousedown.bind(this)

      this.module.addEventListener('click', this.handleClick)
      this.module.addEventListener('contextmenu', this.handleClick)
      this.module.addEventListener('mousedown', this.handleMousedown)

      if (this.module.hasAttribute('data-ga4-set-indexes')) {
        window.GOVUK.analyticsGa4.core.trackFunctions.setIndexes(this.module)
      }
    }
  }

  Ga4LinkTracker.prototype.handleClick = function (event) {
    var target = event.target
    if (!this.trackLinksOnly) {
      this.trackClick(event)
    } else if (this.trackLinksOnly && target.closest('a')) {
      if (!this.limitToElementClass) {
        this.trackClick(event)
      } else {
        var classes = this.limitToElementClass.split(',')

        for (var i = 0; i < classes.length; i++) {
          if (target.closest('.' + classes[i].trim())) {
            // Stops the link tracker firing twice if the link itself has data-ga4-link, and the parent element does as well.
            if (target.closest('[data-ga4-link]') !== target.closest('[data-ga4-limit-to-element-class]')) {
              return
            }
            this.trackClick(event)
          }
        }
      }
    }
  }

  Ga4LinkTracker.prototype.handleMousedown = function (event) {
    // 1 = middle mouse button
    if (event.button === 1) {
      this.handleClick(event)
    }
  }

  Ga4LinkTracker.prototype.trackClick = function (event) {
    var element = event.target
    var trackFunctions = window.GOVUK.analyticsGa4.core.trackFunctions
    // don't track this link if it's already being tracked by the ecommerce tracker
    if (element.closest('[data-ga4-ecommerce-path]')) {
      return
    }

    var target = trackFunctions.findTrackingAttributes(event.target, this.trackingTrigger)
    if (target) {
      try {
        var data = target.getAttribute(this.trackingTrigger)
        data = JSON.parse(data)
      } catch (e) {
        // if there's a problem with the config, don't start the tracker
        console.error('GA4 configuration error: ' + e.message, window.location)
        return
      }

      var text = data.text || event.target.textContent
      data.text = trackFunctions.removeLinesAndExtraSpaces(text)
      data.text = trackFunctions.applyRedactionIfRequired(this.PIIRemover, element, data.text)
      if (!data.text && (element.querySelector('img') || element.querySelector('svg') || element.tagName === 'IMG' || element.closest('svg'))) {
        data.text = 'image'
      }
      try {
        var url = data.url || this.findLink(event.target).getAttribute('href')
      } catch (e) {
        // no href found, so abort
        return
      }

      data.url = trackFunctions.removeCrossDomainParams(url)
      data.url = trackFunctions.applyRedactionIfRequired(this.PIIRemover, element, data.url)
      data.url = trackFunctions.appendPathToAnchorLinks(data.url)
      data.link_domain = trackFunctions.populateLinkDomain(data.url)
      data.method = trackFunctions.getClickType(event)
      data.external = trackFunctions.isExternalLink(data.url) ? 'true' : 'false'
      data.index = this.setIndex(data.index, event.target)

      // flatten the attributes in index into the main data
      if (data.index) {
        for (var prop in data.index) {
          data[prop] = data.index[prop]
        }
        delete data.index
      }

      if (data.type === 'smart answer' && data.action === 'change response') {
        data.section = this.PIIRemover.stripPIIWithOverride(data.section, true, true)
      }
      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    }
  }

  Ga4LinkTracker.prototype.findLink = function (target) {
    if (target.tagName === 'A') {
      return target
    } else {
      return target.closest('a')
    }
  }

  Ga4LinkTracker.prototype.setIndex = function (index, target) {
    if (target.getAttribute('data-ga4-index')) {
      try {
        var indexLink = JSON.parse(target.getAttribute('data-ga4-index'))
        // Check whether the index object already exists on a parent element, as is the case with tracking accordion links.
        // If true, combine data-ga4-index with the index object. Otherwise, just return indexLink
        index = index ? window.GOVUK.extendObject(index, indexLink) : indexLink
      } catch (e) {
        console.error('Unable to parse index as JSON: ' + e.message, window.location)
        return
      }
    }
    return index
  }

  Modules.Ga4LinkTracker = Ga4LinkTracker
})(window.GOVUK.Modules)
