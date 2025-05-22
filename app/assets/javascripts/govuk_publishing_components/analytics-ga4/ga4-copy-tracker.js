window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var Ga4CopyTracker = {
    init: function () {
      window.addEventListener('copy', this.trackCopy.bind(this))
    },

    trackCopy: function (event) {
      try {
        var text = this.getSelectedText()
        if (!text) {
          return // do nothing if no text has been selected
        }

        var target = event.target

        if (target.closest && target.closest('[data-ga4-no-copy]')) {
          return // do nothing if data-ga4-no-copy present
        }

        var tagName = target.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return // do nothing if text is being copied from an input
        }

        var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
        text = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(text)
        text = PIIRemover.stripPIIWithOverride(text, true, true)
        var length = text.length
        text = text.substring(0, 30)

        var data = {
          event_name: 'copy',
          type: 'copy',
          action: 'copy',
          method: 'browser copy',
          text: text,
          length: length
        }
        window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
      } catch (e) {
        console.warn('GA4 copy tracker error: ' + e.message, window.location)
      }
    },

    getSelectedText: function () {
      if (window.getSelection) {
        return window.getSelection().toString()
      } else if (document.selection) {
        return document.selection.createRange().text
      }
      return false
    }
  }

  analyticsModules.Ga4CopyTracker = Ga4CopyTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
