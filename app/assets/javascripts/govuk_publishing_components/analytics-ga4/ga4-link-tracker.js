//= require ../vendor/polyfills/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4LinkTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4' // elements with this attribute get tracked
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
    var target = this.findTrackingAttributes(event.target)
    if (target) {
      var schema = new window.GOVUK.analyticsGa4.Schemas().eventSchema()

      try {
        var data = target.getAttribute(this.trackingTrigger)
        data = JSON.parse(data)
      } catch (e) {
        // if there's a problem with the config, don't start the tracker
        console.error('GA4 configuration error: ' + e.message, window.location)
        return
      }

      schema.event = 'event_data'
      data.text = event.target.textContent
      data.url = this.findLink(event.target).getAttribute('href')
      // get attributes from the data attribute to send to GA
      // only allow it if it already exists in the schema
      for (var property in data) {
        if (property in schema.event_data) {
          schema.event_data[property] = data[property]
        }
      }

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

  // FIXME duplicated from the event tracker - move to somewhere shared
  Ga4LinkTracker.prototype.findTrackingAttributes = function (clicked) {
    if (clicked.hasAttribute('[' + this.trackingTrigger + ']')) {
      return clicked
    } else {
      return clicked.closest('[' + this.trackingTrigger + ']')
    }
  }

  Modules.Ga4LinkTracker = Ga4LinkTracker
})(window.GOVUK.Modules)
