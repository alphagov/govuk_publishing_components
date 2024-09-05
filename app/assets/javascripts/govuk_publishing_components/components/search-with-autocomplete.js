window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class SearchWithAutocomplete {
    constructor ($module) {
      console.log('SearchWithAutocomplete:constructor')
    }

    init () {
      console.log('SearchWithAutocomplete:init')
    }
  }

  Modules.SearchWithAutocomplete = SearchWithAutocomplete
})(window.GOVUK.Modules)
