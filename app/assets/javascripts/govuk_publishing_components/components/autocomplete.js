/* global accessibleAutocomplete, fetch */
//= require accessible-autocomplete/dist/accessible-autocomplete.min.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Autocomplete ($module) {
    this.$module = $module
    this.$input = this.$module.querySelector('input')
    this.$datalist = this.$module.querySelector('datalist')
    this.$source = this.$module.getAttribute('data-source')
    this.$sourceKey = this.$module.getAttribute('data-source-key')
  }

  Autocomplete.prototype.init = function () {
    if (!this.$datalist && !this.$source) {
      return
    }

    var configOptions = {
      element: this.$module,
      id: this.$input.id,
      defaultValue: this.$input.value,
      source: this.getDataListContents()
    }

    accessibleAutocomplete(configOptions) // eslint-disable-line new-cap
    this.copyInputAttributes()
  }

  Autocomplete.prototype.getDataListContents = function () {
    if (this.$datalist.firstChild) {
      var options = this.$datalist.querySelectorAll('option')
      var sources = []
      for (var i = 0; i < options.length; i++) {
        sources.push(options[i].getAttribute('value'))
      }
      return sources
    } else {
      var source = this.$source
      var sourceKey = this.$sourceKey
      return function suggest (query, populateResults) {
        async function getData (populateResults, source, sourceKey) {
          const url = source + query
          try {
            const response = await fetch(url)
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()
            if (!Array.isArray(json[sourceKey])) {
              throw new Error(`JSON response does not contain an array at key: ${sourceKey}`)
            }
            populateResults(json[sourceKey])
          } catch (error) {
            console.error(error.message)
          }
        }
        getData(populateResults, source, sourceKey)
      }
    }
  }

  // the name attribute isn't copied by the accessible autocomplete code
  Autocomplete.prototype.copyInputAttributes = function () {
    var name = this.$input.getAttribute('name')
    var autoCompleteInput = this.$module.querySelector('.autocomplete__input')
    autoCompleteInput.setAttribute('name', name)
    this.$input.parentNode.removeChild(this.$input)
  }

  Modules.Autocomplete = Autocomplete
})(window.GOVUK.Modules)
