// = require govuk/vendor/polyfills/Element/prototype/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function GtmClickTracking (module) {
    this.module = module
    this.trackingTrigger = 'data-gtm-event-name' // elements with this attribute get tracked
  }

  GtmClickTracking.prototype.init = function () {
    this.module.addEventListener('click', this.trackClick.bind(this), true) // useCapture must be true
  }

  GtmClickTracking.prototype.trackClick = function (event) {
    if (window.dataLayer) {
      var target = this.findTrackingAttributes(event.target)
      if (target) {
        var data = {
          event: 'analytics',
          event_name: target.getAttribute('data-gtm-event-name'),
          // get entire URL apart from domain
          link_url: window.location.href.substring(window.location.origin.length),
          ui: JSON.parse(target.getAttribute('data-gtm-attributes')) || {}
        }
        var ariaExpanded = this.checkExpandedState(target)
        if (ariaExpanded) {
          data.ui.state = ariaExpanded === 'false' ? 'opened' : 'closed'
          data.ui.text = data.ui.text || target.innerText
        }
        window.dataLayer.push(data)
      }
    }
  }

  GtmClickTracking.prototype.findTrackingAttributes = function (clicked) {
    if (clicked.hasAttribute('[' + this.trackingTrigger + ']')) {
      return clicked
    } else {
      return clicked.closest('[' + this.trackingTrigger + ']')
    }
  }

  // check either element is expandable or contains expandable element
  GtmClickTracking.prototype.checkExpandedState = function (clicked) {
    var isExpandable = clicked.getAttribute('aria-expanded')
    var containsExpandable = clicked.querySelector('[aria-expanded]')

    if (isExpandable) {
      return isExpandable
    } else if (containsExpandable) {
      return containsExpandable.getAttribute('aria-expanded')
    }
  }

  Modules.GtmClickTracking = GtmClickTracking
})(window.GOVUK.Modules)
