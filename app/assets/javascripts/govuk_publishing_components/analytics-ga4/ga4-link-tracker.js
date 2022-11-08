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
      this.module.addEventListener('click', function (event) {
        var target = event.target
        if (!this.trackLinksOnly) {
          this.trackClick(event)
        } else if (this.trackLinksOnly && target.closest('a')) {
          if (!this.limitToElementClass) {
            this.trackClick(event)
          } else if (this.limitToElementClass && target.closest('.' + this.limitToElementClass)) {
            this.trackClick(event)
          }
        }
      }.bind(this), true) // useCapture must be true
    }
  }

  Ga4LinkTracker.prototype.trackClick = function (event) {
    var target = window.GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(event.target, this.trackingTrigger)
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

  Modules.Ga4LinkTracker = Ga4LinkTracker
})(window.GOVUK.Modules)
