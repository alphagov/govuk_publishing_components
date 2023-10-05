window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4PrintIntentTracker = {
    init: function () {
      window.addEventListener('beforeprint', function () {
        var data = {
          event_name: 'print_page',
          type: 'print page',
          method: 'browser print'
        }
        var schema = new window.GOVUK.analyticsGa4.Schemas()
        schema = schema.mergeProperties(data, 'event_data')
        window.GOVUK.analyticsGa4.core.sendData(schema)
      })
    }
  }

  analyticsModules.Ga4PrintIntentTracker = Ga4PrintIntentTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
