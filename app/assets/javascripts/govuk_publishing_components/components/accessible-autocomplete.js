/* eslint-env jquery */
/* global accessibleAutocomplete */
// = require accessible-autocomplete/dist/accessible-autocomplete.min.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AccessibleAutocomplete ($module) {
    this.$module = $module
    this.selectElem = this.$module.querySelector('select')
  }

  AccessibleAutocomplete.prototype.init = function () {
    var configOptions = {
      selectElement: document.getElementById(this.selectElem.getAttribute('id')),
      autoselect: true,
      confirmOnBlur: true,
      preserveNullOptions: true, // https://github.com/alphagov/accessible-autocomplete#null-options
      defaultValue: '',
      govukModule: this // attach this instance of the module so we can access it in onConfirm
    }

    configOptions.onConfirm = this.onConfirm
    new accessibleAutocomplete.enhanceSelectElement(configOptions) // eslint-disable-line no-new, new-cap
  }

  // custom onConfirm function because will likely need future expansion e.g. tracking
  // the accessible-autocomplete doesn't update the hidden select if an onConfirm function is supplied
  // https://github.com/alphagov/accessible-autocomplete/issues/322
  // also it doesn't update either way if the user chooses something then deletes it
  AccessibleAutocomplete.prototype.onConfirm = function () {
    if (!this.govukModule.autoCompleteInput) {
      this.govukModule.autoCompleteInput = this.govukModule.$module.querySelector('.autocomplete__input')
    }
    var label = this.govukModule.autoCompleteInput.value

    if (typeof label !== 'undefined') {
      var options = this.selectElement.querySelectorAll('option')

      for (var i = 0; i < options.length; i++) {
        var text = options[i].textContent
        if (text === label) {
          this.govukModule.setSelectOption(options[i])
          break
        }
      }
    } else {
      this.govukModule.clearSelect()
    }
  }

  AccessibleAutocomplete.prototype.setSelectOption = function (option) {
    var value = option.value
    this.selectElem.value = value
  }

  AccessibleAutocomplete.prototype.clearSelect = function () {
    var empty = this.selectElem.querySelector('option[value=""]')
    if (empty) {
      empty.setAttribute('selected', true)
    }
  }

  Modules.AccessibleAutocomplete = AccessibleAutocomplete
})(window.GOVUK.Modules)
