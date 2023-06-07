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
        index: {
          index_link: this.undefined,
          index_section: this.undefined,
          index_section_count: this.undefined
        },
        index_total: this.undefined,
        section: this.undefined,
        action: this.undefined,
        external: this.undefined,
        method: this.undefined,
        link_domain: this.undefined,
        link_path_parts: this.undefined,
        tool_name: this.undefined,
        percent_scrolled: this.undefined
      }
    }
  }

  Schemas.prototype.ecommerceSchema = function () {
    return {
      event: this.undefined,
      search_results: {
        event_name: this.undefined,
        term: this.undefined,
        sort: this.undefined,
        results: this.undefined,
        ecommerce: {
          items: []
        }
      },
      event_data: this.undefined
    }
  }

  // merge data attributes data into the event schema
  // only allow it if it already exists in the schema
  Schemas.prototype.mergeProperties = function (data, eventAttribute) {
    var schema = this.eventSchema()
    schema.event = eventAttribute

    for (var property in data) {
      // we check for one level of nesting in the data attributes data
      // this check can be remove once nesting is removed from all data attributes
      if (this.isAnObject(data[property])) {
        for (var subproperty in data[property]) {
          schema.event_data = this.addToObject(schema.event_data, subproperty, data[property][subproperty])
        }
      } else {
        schema.event_data = this.addToObject(schema.event_data, property, data[property])
      }
    }
    return schema
  }

  // might be easier to check if it's not a string or a number?
  Schemas.prototype.isAnObject = function (item) {
    if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
      return true
    }
  }

  // given an object and a key, insert a value into that object for that key
  // we check for one level of nesting in the object
  Schemas.prototype.addToObject = function (obj, key, value) {
    if (key in obj) {
      obj[key] = value
      return obj
    } else {
      for (var property in obj) {
        if (this.isAnObject(obj[property])) {
          if (key in obj[property]) {
            obj[property][key] = value
            return obj
          }
        }
      }
    }
    return obj
  }

  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}
  GOVUK.analyticsGa4.Schemas = Schemas

  global.GOVUK = GOVUK
})(window)
