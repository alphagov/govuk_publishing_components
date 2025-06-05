;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  var EMAIL_PATTERN = /[^\s=/?&#+]+(?:@|%40)[^\s=/?&+]+/g
  var POSTCODE_PATTERN = /\b[A-PR-UWYZ][A-HJ-Z]?[0-9][0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*[0-9](?!refund)[ABD-HJLNPQ-Z]{2,3}\b/gi

  // e.g. 01/01/1990 or 01-01-1990 or 1-1-1990 or 1/1/1990 or 01\01\1990 or 1\1\1990
  var DATE_PATTERN_NUMERIC_1 = /\d{1,2}([-\/\\])\d{1,2}([-\/\\])\d{4}/g // eslint-disable-line no-useless-escape

  // e.g. 1990/01/01 or 1990-01-01 or 1990-1-1 or 1990/1/1 or 1990\1\1 or 1990\01\01
  var DATE_PATTERN_NUMERIC_2 = /\d{4}([-\/\\])\d{1,2}([-\/\\])\d{1,2}/g // eslint-disable-line no-useless-escape

  // e.g. 12345678 (This originated from the UA PII Remover)
  var DATE_PATTERN_NUMERIC_3 = /[0-9]{8}/g

  // e.g. 1(st) (of) Jan(uary) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
  var DATE_PATTERN_STRING_1 = /\d{1,2}(?:st|nd|rd|th)?\s(?:of\s)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s(?:')?(\d{4}|\d{2})/gi

  // e.g. Jan(uary) 1(st) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
  var DATE_PATTERN_STRING_2 = /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s\d{1,2}?(?:st|nd|rd|th)?\s(?:')?(\d{4}|\d{2})/gi

  var ESCAPE_REGEX_PATTERN = /[|\\{}()[\]^$+*?.]/g

  // specific URL parameters to be redacted from accounts URLs
  var RESET_PASSWORD_TOKEN_PATTERN = /reset_password_token=[a-zA-Z0-9-]+/g
  var UNLOCK_TOKEN_PATTERN = /unlock_token=[a-zA-Z0-9-]+/g
  var STATE_PATTERN = /state=.[^&]+/g

  // some users mistakenly use GOV.UK to search for the status of their applications.
  // e.g. GWF123456789 and GB123456789000
  var VISA_PATTERN_GWF = /GWF\d{9}/g
  var VISA_PATTERN_GB = /GB\d{12}/g

  // 2 valid letters - optional +/space - 6 digits with optional +/spaces every 2 digits (to account for '12 34 56') - optional +/space - 1 valid letter. Case insensitive.
  // e.g. 'AB123456A', 'AB 12 34 56 A', 'ab 123456 a', 'ab 12 34 56 a', 'AB+12+34+56+A'
  var NATIONAL_INSURANCE_NUMBER = /[A-CEGHJ-OPR-TW-Z]{2}(\s+|\++)?(\d{2}(\s+|\++)?){3}[A-D]/gi

  var UK_MOBILE_NUMBER = /07\d{9}/g
  var UK_MOBILE_NUMBER_INTERNATIONAL = /\+447\d{9}/g
  var UK_LANDLINE_NUMBER = /0[1246]\d{8,9}/g
  var UK_LANDLINE_NUMBER_INTERNATIONAL = /\+44[1246]\d{8,9}/g

  function shouldStripDates () {
    var metas = document.querySelectorAll('meta[name="govuk:ga4-strip-dates"]')
    return metas.length > 0
  }

  function shouldStripPostcodes () {
    var metas = document.querySelectorAll('meta[name="govuk:ga4-strip-postcodes"]')
    return metas.length > 0
  }

  function queryStringParametersToStrip () {
    var meta = document.querySelector('meta[name="govuk:ga4-strip-query-string-parameters"]')
    var value = false
    if (meta) {
      value = meta.getAttribute('content')
    }
    var parameters = []

    if (value) {
      var split = value.split(',')
      for (var i = 0; i < split.length; i++) {
        parameters.push(split[i].trim())
      }
    }

    return parameters
  }

  var PIIRemover = function () {
    this.stripDatePII = shouldStripDates()
    this.stripPostcodePII = shouldStripPostcodes()
    this.queryStringParametersToStrip = queryStringParametersToStrip()
  }

  PIIRemover.prototype.PIISafe = function (value) {
    this.value = value
  }

  PIIRemover.prototype.stripPII = function (value) {
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

  PIIRemover.prototype.stripPIIWithOverride = function (value, enableDateStripping, enablePostcodeStripping) {
    var oldStripDatePII = this.stripDatePII
    var oldPostcodePII = this.stripPostcodePII

    this.stripDatePII = enableDateStripping
    this.stripPostcodePII = enablePostcodeStripping

    var strippedValue = this.stripPII(value)

    this.stripDatePII = oldStripDatePII
    this.stripPostcodePII = oldPostcodePII

    return strippedValue
  }

  PIIRemover.prototype.stripPIIFromString = function (string) {
    var stripped = string.replace(EMAIL_PATTERN, '[email]')
    stripped = stripped.replace(RESET_PASSWORD_TOKEN_PATTERN, 'reset_password_token=[reset_password_token]')
    stripped = stripped.replace(UNLOCK_TOKEN_PATTERN, 'unlock_token=[unlock_token]')
    stripped = stripped.replace(STATE_PATTERN, 'state=[state]')
    stripped = stripped.replace(VISA_PATTERN_GWF, '[gwf number]')
    stripped = stripped.replace(VISA_PATTERN_GB, '[gb eori number]')
    stripped = stripped.replace(NATIONAL_INSURANCE_NUMBER, '[ni number]')
    stripped = stripped.replace(UK_LANDLINE_NUMBER, '[phone number]')
    stripped = stripped.replace(UK_LANDLINE_NUMBER_INTERNATIONAL, '[phone number]')
    stripped = stripped.replace(UK_MOBILE_NUMBER, '[phone number]')
    stripped = stripped.replace(UK_MOBILE_NUMBER_INTERNATIONAL, '[phone number]')

    stripped = this.stripQueryStringParameters(stripped)

    if (this.stripDatePII === true) {
      var DATE_REDACTION_STRING = '[date]'
      stripped = stripped.replace(DATE_PATTERN_NUMERIC_1, DATE_REDACTION_STRING)
      stripped = stripped.replace(DATE_PATTERN_NUMERIC_2, DATE_REDACTION_STRING)
      stripped = stripped.replace(DATE_PATTERN_NUMERIC_3, DATE_REDACTION_STRING)
      stripped = stripped.replace(DATE_PATTERN_STRING_1, DATE_REDACTION_STRING)
      stripped = stripped.replace(DATE_PATTERN_STRING_2, DATE_REDACTION_STRING)
    }
    if (this.stripPostcodePII === true) {
      stripped = stripped.replace(POSTCODE_PATTERN, '[postcode]')
    }
    return stripped
  }

  PIIRemover.prototype.stripPIIFromObject = function (object) {
    if (object) {
      if (object instanceof this.PIISafe) {
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

  PIIRemover.prototype.stripPIIFromArray = function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      var elem = array[i]

      array[i] = this.stripPII(elem)
    }
    return array
  }

  PIIRemover.prototype.stripQueryStringParameters = function (string) {
    for (var i = 0; i < this.queryStringParametersToStrip.length; i++) {
      var parameter = this.queryStringParametersToStrip[i]
      var escaped = parameter.replace(ESCAPE_REGEX_PATTERN, '\\$&')
      var regexp = new RegExp('((?:\\?|&)' + escaped + '=)(?:[^&#\\s]*)', 'g')
      string = string.replace(regexp, '$1[' + parameter + ']')
    }

    return string
  }

  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}
  GOVUK.analyticsGa4.PIIRemover = PIIRemover

  global.GOVUK = GOVUK
})(window)
