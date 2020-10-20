;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  var EMAIL_PATTERN = /[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g
  var POSTCODE_PATTERN = /[A-PR-UWYZ][A-HJ-Z]?[0-9][0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*[0-9][ABD-HJLNPQ-Z]{2}/gi
  var DATE_PATTERN = /\d{4}(-?)\d{2}(-?)\d{2}/g

  function shouldStripDates() {
    return ($('meta[name="govuk:static-analytics:strip-dates"]').length > 0)
  }

  function shouldStripPostcodes() {
    return ($('meta[name="govuk:static-analytics:strip-postcodes"]').length > 0)
  }

  var pii = function () {
    this.stripDatePII = shouldStripDates()
    this.stripPostcodePII = shouldStripPostcodes()
  }

  pii.prototype.stripPII = function (value) {
    if (typeof value === 'string') {
      return this.stripPIIFromString(value)
    } else if (Object.prototype.toString.call(value) === '[object Array]' || Object.prototype.toString.call(value) === '[object Arguments]') {
      return this.stripPIIFromArray(value)
    } else if (typeof value === 'object') {
      return this.stripPIIFromObject(value)
    } else {
      return value
    }
  }

  pii.prototype.stripPIIFromString = function (string) {
    var stripped = string.replace(EMAIL_PATTERN, '[email]')
    if (this.stripDatePII === true) {
      stripped = stripped.replace(DATE_PATTERN, '[date]')
    }
    if (this.stripPostcodePII === true) {
      stripped = stripped.replace(POSTCODE_PATTERN, '[postcode]')
    }
    return stripped
  }

  pii.prototype.stripPIIFromObject = function (object) {
    if (object) {
      if (object instanceof GOVUK.Analytics.PIISafe) {
        return object.value
      } else {
        for (var property in object) {
          var value = object[property]

          object[property] = this.stripPII(value)
        }
        return object
      }
    }
  }

  pii.prototype.stripPIIFromArray = function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      var elem = array[i]

      array[i] = this.stripPII(elem)
    }
    return array
  }

  GOVUK.pii = pii

  global.GOVUK = GOVUK
})(window)
