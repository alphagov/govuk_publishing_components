window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {};

(function (analytics) {
  'use strict'

  var core = {
    load: function () {
      var firstScript = document.getElementsByTagName('script')[0]
      var newScript = document.createElement('script')
      newScript.async = true

      if (window.GOVUK.analyticsGa4.vars.gtag_id) {
        // initialise gtag
        window.dataLayer = window.dataLayer || []
        var gtag = function () { window.dataLayer.push(arguments) }
        gtag('js', new Date())
        gtag('config', window.GOVUK.analyticsGa4.vars.gtag_id)

        newScript.src = '//www.googletagmanager.com/gtag/js?id=' + window.GOVUK.analyticsGa4.vars.gtag_id
        firstScript.parentNode.insertBefore(newScript, firstScript)
      } else {
        // initialise GTM
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

        var auth = window.GOVUK.analyticsGa4.vars.auth || ''
        var preview = window.GOVUK.analyticsGa4.vars.preview || ''
        if (auth) {
          auth = '&gtm_auth=' + auth
        }
        if (preview) {
          preview = '&gtm_preview=' + preview + '&gtm_cookies_win=x'
        }

        this.googleSrc = 'https://www.googletagmanager.com/gtm.js?id=' + window.GOVUK.analyticsGa4.vars.id + auth + preview
        newScript.src = this.googleSrc
        firstScript.parentNode.insertBefore(newScript, firstScript)
        window.dataLayer.push({ 'gtm.blocklist': ['customPixels', 'customScripts', 'html', 'nonGoogleScripts'] })
      }
    },

    sendData: function (data) {
      data.govuk_gem_version = this.getGemVersion()
      window.dataLayer.push(data)
    },

    getGemVersion: function () {
      return window.GOVUK.analyticsGa4.vars.gem_version || 'not found'
    }
  }

  analytics.core = core
})(window.GOVUK.analyticsGa4)
