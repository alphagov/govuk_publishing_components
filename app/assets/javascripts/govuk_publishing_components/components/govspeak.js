window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.Govspeak = function () {
    this.start = function ($element) {
      if (!$element.hasClass('disable-youtube')) {
        this.embedYoutube($element)
      }

      this.createBarcharts($element)
    }

    this.embedYoutube = function ($jqElement) {
      var enhancement = new window.GOVUK.GovspeakYoutubeLinkEnhancement($jqElement[0])
      enhancement.init()
    }

    this.createBarcharts = function ($element) {
      var enhancement = new window.GOVUK.GovspeakBarchartEnhancement($element)
      enhancement.init()
    }
  }
})(window.GOVUK.Modules)
