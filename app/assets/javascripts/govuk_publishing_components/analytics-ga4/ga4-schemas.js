;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  var Schemas = function () {
    this.undefined = undefined
  }

  Schemas.prototype.eventSchema = function () {
    return {
      event: this.undefined,

      event_data: {
        event_name: this.undefined,
        type: this.undefined,
        url: this.undefined,
        text: this.undefined,
        index: this.undefined,
        index_total: this.undefined,
        section: this.undefined,
        action: this.undefined,
        external: this.undefined,
        method: this.undefined,
        link_domain: this.undefined,
        link_path_parts: this.undefined
      }
    }
  }

  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}
  GOVUK.analyticsGa4.Schemas = Schemas

  global.GOVUK = GOVUK
})(window)
