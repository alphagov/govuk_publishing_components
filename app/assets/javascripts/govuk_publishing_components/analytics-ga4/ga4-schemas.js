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
        tool_name: this.undefined,
        percent_scrolled: this.undefined,
        video_current_time: this.undefined,
        length: this.undefined,
        video_percent: this.undefined
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

  // merge allowed data attributes into the event schema
  Schemas.prototype.mergeProperties = function (data, eventAttribute) {
    var schema = this.eventSchema()
    schema.event = eventAttribute

    for (var property in data) {
      // some passed data might be undefined, don't want it to overwrite e.g. the index sub parameters
      if (data[property] !== undefined) {
        schema.event_data = this.addToObject(schema.event_data, property, data[property])
      }
    }
    return schema
  }

  Schemas.prototype.isAnObject = function (item) {
    if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
      return true
    }
  }

  // given an object and a key, insert a value into object[key] if it exists
  Schemas.prototype.addToObject = function (obj, key, value) {
    if (key in obj) {
      obj[key] = value + '' // ensure is a string
      return obj
    } else {
      // check for one level of nesting in the object
      for (var property in obj) {
        if (this.isAnObject(obj[property])) {
          if (key in obj[property]) {
            obj[property][key] = value + '' // ensure is a string
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
