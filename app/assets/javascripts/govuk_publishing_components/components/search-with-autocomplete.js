/* global accessibleAutocomplete, fetch */
//= require accessible-autocomplete/dist/accessible-autocomplete.min.js
window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class SearchWithAutocomplete {
    constructor ($module) {
      this.$module = $module
      this.$input = this.$module.querySelector('input')
      this.source = this.$module.getAttribute('data-source')
      this.sourceKey = this.$module.getAttribute('data-source-key')
    }

    init () {
      if (!this.source || !this.sourceKey) {
        console.warn('search-with-autocomplete: No source or source-key provided; skipping init')
        return
      }

      const configOptions = {
        element: this.$module,
        id: this.$input.id,
        name: this.$input.name,
        defaultValue: this.$input.value,
        source: this.getResults,
      }

      accessibleAutocomplete(configOptions)
    }

    getResults = (query, populateResults) => {
      fetch(`${this.source}${query}`)
        .then(response => response.json())
        .then(data => data[this.sourceKey])
        .then(results => {
          populateResults(results)
        })
    }
  }

  Modules.SearchWithAutocomplete = SearchWithAutocomplete
})(window.GOVUK.Modules)
