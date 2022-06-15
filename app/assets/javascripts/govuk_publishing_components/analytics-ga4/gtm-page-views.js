;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  GOVUK.Gtm = {
    sendPageView: function () {
      if (window.dataLayer) {
        var data = {
          event: 'config_ready',
          page: {
            location: this.getLocation(),
            referrer: this.getReferrer(),
            title: this.getTitle(),
            status_code: this.getStatusCode()
          }
        }
        window.dataLayer.push(data)
      }
    },

    getLocation: function () {
      return document.location.href
    },

    getReferrer: function () {
      return document.referrer
    },

    getTitle: function () {
      return document.title
    },

    // window.httpStatusCode is set in the source of the error page in static
    // https://github.com/alphagov/static/blob/main/app/views/root/_error_page.html.erb#L32
    getStatusCode: function () {
      if (window.httpStatusCode) {
        return window.httpStatusCode
      } else {
        return 200
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
