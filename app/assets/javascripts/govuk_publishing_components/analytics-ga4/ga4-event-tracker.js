window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4EventTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-event' // elements with this attribute get tracked
  }

  Ga4EventTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.usage) {
      this.startModule()
    } else {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
    }
  }

  // triggered by cookie-consent event, which happens when users consent to cookies
  Ga4EventTracker.prototype.startModule = function () {
    if (window.dataLayer) {
      window.removeEventListener('cookie-consent', this.start)
      this.module.addEventListener('click', this.trackClick.bind(this), true) // useCapture must be true
    }
  }

  Ga4EventTracker.prototype.getTargetDatasetSchema = function (element) {
    var targetDataset

    try {
      targetDataset = element.dataset
    } catch (error) {
      console.error(error)
    }

    var eventData = {}

    Object.keys(targetDataset).forEach(function (key) {
      var schemaKey = window.GOVUK.analyticsGa4.core.trackFunctions.toSnakeCase(key)

      eventData[schemaKey] = targetDataset[key]
    })

    return eventData
  }

  Ga4EventTracker.prototype.trackClick = function (event) {
    if (event.tracked) return
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

      data = Object.assign(data, this.getTargetDatasetSchema(target))

      var text = data.text || event.target.textContent
      data.text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(text)

      /* Ensure it only tracks aria-expanded in an element with data-ga4-expandable on it. */
      if (target.closest('[data-ga4-expandable]')) {
        var ariaExpanded = this.getClosestAttribute(target, 'aria-expanded')
      }

      /*
        the details component uses an 'open' attribute instead of aria-expanded, so we need to check if we're on a details component.
        since details deletes the 'open' attribute when closed, we need this boolean, otherwise every element which
        doesn't contain an 'open' attr would be pushed to gtm as a closed element.
      */
      var detailsElement = target.closest('details')

      if (ariaExpanded) {
        data.text = data.text || target.innerText
        data.action = (ariaExpanded === 'false') ? 'opened' : 'closed'
      } else if (detailsElement) {
        data.text = data.text || detailsElement.textContent
        var openAttribute = detailsElement.getAttribute('open')
        data.action = (openAttribute == null) ? 'opened' : 'closed'
      }

      /* If a tab was clicked, grab the href of the clicked tab (usually an anchor # link) */
      var tabElement = event.target.closest('.gem-c-tabs')
      if (tabElement) {
        var aTag = event.target.closest('a')
        if (aTag) {
          var href = aTag.getAttribute('href')
          if (href) {
            data.url = window.GOVUK.analyticsGa4.core.trackFunctions.appendPathToAnchorLinks(href)
          }
        }
      }
      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
      event.tracked = true
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
