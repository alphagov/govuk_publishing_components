/* global accessibleAutocomplete, fetch */
//= require accessible-autocomplete/dist/accessible-autocomplete.min.js
window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class SearchWithAutocomplete {
    constructor ($module) {
      this.$module = $module
      this.$input = this.$module.querySelector('input')
      this.$source = this.$module.getAttribute('data-source')
      this.$sourceKey = this.$module.getAttribute('data-source-key')
    }

    init () {
      if (!this.$source || !this.$sourceKey) {
        console.warn('search-with-autocomplete: No source or source-key provided; skipping init')
        return
      }

      const configOptions = {
        element: this.$module,
        id: this.$input.id,
        defaultValue: this.$input.value,
        source: ['one', 'two', 'three'],
      }

      accessibleAutocomplete(configOptions)
    }
  }

  Modules.SearchWithAutocomplete = SearchWithAutocomplete
})(window.GOVUK.Modules)
