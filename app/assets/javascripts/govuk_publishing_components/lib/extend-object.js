(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.extendObject = function (obj) {
    obj = obj || {}

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue
      }

      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key]
        }
      }
    }

    return obj
  }
}(window))
