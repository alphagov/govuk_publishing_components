;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  var Schemas = function () {
    this.null = 'n/a'
  }

  Schemas.prototype.eventSchema = function () {
    return {
      event: this.null,

      event_data: {
        event_name: this.null,
        type: this.null,
        url: this.null,
        text: this.null,
        index: this.null,
        index_total: this.null,
        section: this.null,
        action: this.null,
        external: this.null
      }
    }
  }

  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}
  GOVUK.analyticsGA4.Schemas = Schemas

  global.GOVUK = GOVUK
})(window)
