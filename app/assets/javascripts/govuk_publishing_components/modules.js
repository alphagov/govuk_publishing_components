;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.modules = {
    find: function (container) {
      container = $(container || document)

      var modules
      var moduleSelector = '[data-module]'

      modules = container.find(moduleSelector)

      // Container could be a module too
      if (container.is(moduleSelector)) {
        modules = modules.add(container)
      }

      return modules
    },

    start: function (container) {
      var modules = this.find(container)

      for (var i = 0, l = modules.length; i < l; i++) {
        var element = $(modules[i])
        var moduleNames = element.data('module').split(' ')

        for (var j = 0, k = moduleNames.length; j < k; j++) {
          var moduleName = camelCaseAndCapitalise(moduleNames[j])
          var started = element.data(moduleNames[j] + '-module-started')

          if (typeof GOVUK.Modules[moduleName] === 'function' && !started) {
            // GOV.UK Legacy Modules using jQuery
            if (!GOVUK.Modules[moduleName].prototype.init) {
              new GOVUK.Modules[moduleName]().start(element)
              element.data(moduleNames[j] + '-module-started', true)
            }

            // Vanilla JavaScript GOV.UK Modules and GOV.UK Frontend Modules
            if (GOVUK.Modules[moduleName].prototype.init) {
              new GOVUK.Modules[moduleName](element[0]).init()
              element.data(moduleNames[j] + '-module-started', true)
            }
          }
        }
      }

      // eg selectable-table to SelectableTable
      function camelCaseAndCapitalise (string) {
        return capitaliseFirstLetter(camelCase(string))
      }

      // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
      function camelCase (string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g.charAt(1).toUpperCase()
        })
      }

      // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
      function capitaliseFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
