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
        var ariaExpanded = this.getClosestAttribute(target, 'aria-expanded')
        /*
          the details component uses an 'open' attribute instead of aria-expanded, so we need to check if we're on a details component.
          since details deletes the 'open' attribute when closed, we need this boolean, otherwise every element which
          doesn't contain an 'open' attr would be pushed to gtm as a closed element.
        */
        var detailsElement = (target.tagName.toLowerCase() === 'details') ? target : target.querySelector('details')

        if (ariaExpanded) {
          data.ui.text = data.ui.text || target.innerText
          data.ui.state = (ariaExpanded === 'false') ? 'opened' : 'closed'
        } else if (detailsElement) {
          data.ui.text = data.ui.text || detailsElement.textContent
          var openAttribute = detailsElement.getAttribute('open')
          data.ui.state = (openAttribute == null) ? 'opened' : 'closed'
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

  // check if an attribute exists or contains the attribute
  GtmClickTracking.prototype.getClosestAttribute = function (clicked, attribute) {
    var isAttributeOnElement = clicked.getAttribute(attribute)
    var containsAttribute = clicked.querySelector('[' + attribute + ']')

    if (isAttributeOnElement || isAttributeOnElement === '') { // checks for "" as some attribute names can contain no value making them falsy
      return isAttributeOnElement
    } else if (containsAttribute) {
      return containsAttribute.getAttribute(attribute)
    }
  }

  Modules.GtmClickTracking = GtmClickTracking
})(window.GOVUK.Modules)
