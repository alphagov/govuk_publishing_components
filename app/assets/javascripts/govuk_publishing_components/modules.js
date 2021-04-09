;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.modules = {
    find: function (container) {
      container = container || $(document)

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
        var module
        var element = $(modules[i])
        var moduleName = camelCaseAndCapitalise(element.data('module'))
        var started = element.data('module-started')
        var frontendModuleName = moduleName.replace('Govuk', '')

        if ( // GOV.UK Publishing & Legacy Modules
          typeof GOVUK.Modules[moduleName] === 'function' &&
          !GOVUK.Modules[moduleName].prototype.init &&
          (!started || started === 'delay')
        ) {
          module = new GOVUK.Modules[moduleName]()
          module.start(element)
          if (started !== 'delay') {
            element.data('module-started', true)
          }
        }

        if ( // GOV.UK Frontend Modules
          typeof GOVUK.Modules[frontendModuleName] === 'function' &&
          GOVUK.Modules[frontendModuleName].prototype.init &&
          (!started || started === 'delay')
        ) {
          module = new GOVUK.Modules[frontendModuleName](element[0]).init()
          if (started !== 'delay') {
            element.data('module-started', true)
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
