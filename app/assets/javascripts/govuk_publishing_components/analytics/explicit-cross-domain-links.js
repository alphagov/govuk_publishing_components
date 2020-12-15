;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.ExplicitCrossDomainLinks = function () {
    this.start = function ($module) {
      var element = $module[0]

      if (!global.ga) { return }

      global.ga(function () {
        var trackers = global.ga.getAll()

        if (!trackers.length) { return }

        var linker = new global.gaplugins.Linker(trackers[0])

        var attrAction = element.getAttribute('action')
        if (attrAction) {
          element.setAttribute('action', linker.decorate(attrAction))
        }

        var attrHref = element.getAttribute('href')
        if (attrHref) {
          element.href = linker.decorate(attrHref)
        }
      })
    }
  }

  global.GOVUK = GOVUK
})(window)
