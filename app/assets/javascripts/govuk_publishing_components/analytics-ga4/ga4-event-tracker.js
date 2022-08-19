// = require govuk/vendor/polyfills/Element/prototype/closest.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4EventTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4' // elements with this attribute get tracked
  }

  Ga4EventTracker.prototype.init = function () {
    this.module.addEventListener('click', this.trackClick.bind(this), true) // useCapture must be true
  }

  Ga4EventTracker.prototype.trackClick = function (event) {
    if (window.dataLayer) {
      var target = this.findTrackingAttributes(event.target)
      if (target) {
        var schema = new window.GOVUK.analyticsGA4.Schemas().eventSchema()

        try {
          var data = target.getAttribute(this.trackingTrigger)
          data = JSON.parse(data)
        } catch (e) {
          // if there's a problem with the config, don't start the tracker
          console.error('GA4 configuration error: ' + e.message, window.location)
          return
        }

        schema.event = 'event_data'
        // get attributes from the data attribute to send to GA
        // only allow it if it already exists in the schema
        for (var property in data) {
          if (property in schema.event_data) {
            schema.event_data[property] = data[property]
          }
        }

        // Ensure it only tracks aria-expanded in an accordion element, instead of in any child of the clicked element
        if (target.closest('.gem-c-accordion')) {
          var ariaExpanded = this.getClosestAttribute(target, 'aria-expanded')
        }

        /*
          the details component uses an 'open' attribute instead of aria-expanded, so we need to check if we're on a details component.
          since details deletes the 'open' attribute when closed, we need this boolean, otherwise every element which
          doesn't contain an 'open' attr would be pushed to gtm as a closed element.
        */
        var detailsElement = target.closest('details')

        if (ariaExpanded) {
          schema.event_data.text = data.text || target.innerText
          schema.event_data.action = (ariaExpanded === 'false') ? 'opened' : 'closed'
        } else if (detailsElement) {
          schema.event_data.text = data.text || detailsElement.textContent
          var openAttribute = detailsElement.getAttribute('open')
          schema.event_data.action = (openAttribute == null) ? 'opened' : 'closed'
        }

        /* If a tab was clicked, grab the href of the clicked tab (usually an anchor # link) */
        var tabElement = event.target.closest('.gem-c-tabs')
        if (tabElement) {
          var aTag = event.target.closest('a')
          if (aTag) {
            var href = aTag.getAttribute('href')
            if (href) {
              schema.event_data.url = href
            }
          }
        }

        window.dataLayer.push(schema)
      }
    }
  }

  Ga4EventTracker.prototype.findTrackingAttributes = function (clicked) {
    if (clicked.hasAttribute('[' + this.trackingTrigger + ']')) {
      return clicked
    } else {
      return clicked.closest('[' + this.trackingTrigger + ']')
    }
  }

  // check if an attribute exists or contains the attribute
  Ga4EventTracker.prototype.getClosestAttribute = function (clicked, attribute) {
    var isAttributeOnElement = clicked.getAttribute(attribute)
    var containsAttribute = clicked.querySelector('[' + attribute + ']')

    if (isAttributeOnElement || isAttributeOnElement === '') { // checks for "" as some attribute names can contain no value making them falsy
      return isAttributeOnElement
    } else if (containsAttribute) {
      return containsAttribute.getAttribute(attribute)
    }
  }

  Modules.Ga4EventTracker = Ga4EventTracker
})(window.GOVUK.Modules)
