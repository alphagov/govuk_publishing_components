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
        link_path_parts: this.undefined,
        tool_name: this.undefined
      }
    }
  }

  Schemas.prototype.ecommerceSchema = function (isExternalLink) {
    var ecommerceObject = {
      event: this.undefined,
      search_results: {
        event_name: this.undefined,
        term: this.undefined,
        sort: this.undefined,
        results: this.undefined,
        ecommerce: {
          items: []
        }
      }
    }

    if (isExternalLink !== undefined) {
      ecommerceObject.event_data = {}
      ecommerceObject.event_data.external = isExternalLink
    }

    return ecommerceObject
  }

  // get attributes from the data attribute to send to GA
  // only allow it if it already exists in the schema
  Schemas.prototype.mergeProperties = function (data, eventAttribute) {
    var schema = this.eventSchema()
    schema.event = eventAttribute
    for (var property in data) {
      if (property in schema.event_data) {
        schema.event_data[property] = data[property]
      }
    }
    return schema
  }

  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}
  GOVUK.analyticsGa4.Schemas = Schemas

  global.GOVUK = GOVUK
})(window)
