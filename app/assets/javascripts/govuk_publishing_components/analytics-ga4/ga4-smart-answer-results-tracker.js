window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {};

(function (Modules) {
  'use strict'

  function Ga4SmartAnswerResultsTracker (module) {
    this.module = module
  }

  Ga4SmartAnswerResultsTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie?.usage === true || consentCookie?.usage === 'aggregate') {
      this.startModule()
    }
  }

  Ga4SmartAnswerResultsTracker.prototype.startModule = function () {
    // only run this code if the dataLayer exists and an element with a data-ga4-ecommerce-path
    // attribute exists as this indicates that ecommerce tracking is required
    if (window.dataLayer && this.module.querySelector('[data-ga4-ecommerce-path]')) {
      this.trackResults()
      this.module.addEventListener('click', this.handleClick.bind(this))
    }
  }

  Ga4SmartAnswerResultsTracker.prototype.trackResults = function () {
    var ecommerceSchema = window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
      element: this.module,
      resultsId: 'ga4-ecommerce-result-count'
    })

    window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.clearEcommerceObject()
    window.GOVUK.analyticsGa4.core.sendData(ecommerceSchema)
  }

  Ga4SmartAnswerResultsTracker.prototype.handleClick = function (event) {
    if (event.target.getAttribute('data-ga4-ecommerce-path')) {
      var ecommerceSchema = window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema({
        element: this.module,
        resultsId: 'ga4-ecommerce-result-count',
        event: event
      })

      window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.clearEcommerceObject()
      window.GOVUK.analyticsGa4.core.sendData(ecommerceSchema)
    }
  }

  Modules.Ga4SmartAnswerResultsTracker = Ga4SmartAnswerResultsTracker
})(window.GOVUK.Modules)
