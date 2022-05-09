window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function GtmClickTracking (module) {
    this.module = module
    this.trackingTrigger = 'data-gtm-event-name' // elements with this attribute get tracked
  }

  GtmClickTracking.prototype.init = function () {
    var trackClicksOn = [this.module]
    if (!this.module.getAttribute(this.trackingTrigger)) {
      trackClicksOn = this.module.querySelectorAll('[' + this.trackingTrigger + ']')
    }

    for (var i = 0; i < trackClicksOn.length; i++) {
      trackClicksOn[i].addEventListener('click', this.trackClick.bind(this))
    }
  }

  GtmClickTracking.prototype.trackClick = function (event) {
    if (window.dataLayer) {
      var target = event.currentTarget
      var data = {
        event: 'analytics',
        event_name: target.getAttribute('data-gtm-event-name'),
        // get entire URL apart from domain
        link_url: window.location.href.substring(window.location.origin.length),
        ui: JSON.parse(target.getAttribute('data-gtm-attributes'))
      }
      var ariaExpanded = this.checkExpandedState(target)
      if (ariaExpanded) {
        data.ui.state = ariaExpanded === 'false' ? 'opened' : 'closed'
      }
      window.dataLayer.push(data)
    }
  }

  GtmClickTracking.prototype.checkExpandedState = function (clicked) {
    var expanded = clicked.querySelector('[aria-expanded]')
    if (expanded) {
      return expanded.getAttribute('aria-expanded')
    }
  }

  Modules.GtmClickTracking = GtmClickTracking
})(window.GOVUK.Modules)
