//= require ../vendor/polyfills/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4LinkTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-link' // elements with this attribute get tracked
    this.trackLinksOnly = this.module.hasAttribute('data-ga4-track-links-only')
    this.limitToElementClass = this.module.getAttribute('data-ga4-limit-to-element-class')
  }

  Ga4LinkTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.settings) {
      this.startModule()
    } else {
      this.startModule = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.startModule)
    }
  }

  // triggered by cookie-consent event, which happens when users consent to cookies
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
      } else if (target.closest('.' + this.limitToElementClass)) {
        this.trackClick(event)
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
    var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()

    // don't track this link if it's already being tracked by the ecommerce tracker
    if (element.closest('[data-ga4-ecommerce-path]')) {
      return
    }

    var target = window.GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(event.target, this.trackingTrigger)
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
      data.text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(text)
      data.text = PIIRemover.stripPIIWithOverride(data.text, true, true)
      var url = data.url || this.findLink(event.target).getAttribute('href')
      data.url = window.GOVUK.analyticsGa4.core.trackFunctions.removeCrossDomainParams(PIIRemover.stripPIIWithOverride(url, true, true))
      data.link_domain = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkDomain(data.url)
      data.link_path_parts = window.GOVUK.analyticsGa4.core.trackFunctions.populateLinkPathParts(data.url)
      data.method = window.GOVUK.analyticsGa4.core.trackFunctions.getClickType(event)
      data.external = window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(data.url) ? 'true' : 'false'
      data.index = this.setIndex(data.index, event.target)

      if (data.type === 'smart answer' && data.action === 'change response') {
        data.section = PIIRemover.stripPIIWithOverride(data.section, true, true)
      }

      var schemas = new window.GOVUK.analyticsGa4.Schemas()
      var schema = schemas.mergeProperties(data, 'event_data')
      window.GOVUK.analyticsGa4.core.sendData(schema)
    }
  }

  Ga4LinkTracker.prototype.findLink = function (target) {
    if (target.tagName === 'A') {
      return target
    } else {
      return target.closest('a')
    }
  }

  Ga4LinkTracker.prototype.setIndex = function (indexData, target) {
    var index = window.GOVUK.analyticsGa4.core.trackFunctions.createIndexObject(indexData)

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
