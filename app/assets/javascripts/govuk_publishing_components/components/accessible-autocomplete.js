/* eslint-env jquery */
/* global accessibleAutocomplete */
// = require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AccessibleAutocomplete ($module) {
    this.$module = $module
    this.selectElement = this.$module.querySelector('select')
  }

  AccessibleAutocomplete.prototype.init = function () {
    var configOptions = {
      selectElement: this.selectElement,
      autoselect: true,
      confirmOnBlur: true,
      preserveNullOptions: true, // https://github.com/alphagov/accessible-autocomplete#null-options
      defaultValue: '',
      govukModule: this // attach this instance of the module so we can access it in onConfirm
    }

    configOptions.onConfirm = this.onConfirm
    new accessibleAutocomplete.enhanceSelectElement(configOptions) // eslint-disable-line no-new, new-cap
    this.autoCompleteInput = this.$module.querySelector('.autocomplete__input')
    if (this.autoCompleteInput) {
      this.autoCompleteInput.addEventListener('keyup', this.handleKeyup.bind(this))
    }
  }

  // custom onConfirm function because will likely need future expansion e.g. tracking
  AccessibleAutocomplete.prototype.onConfirm = function (value) {
    // onConfirm fires on selecting an option
    // also fires when blurring the input, which then provides `value` as undefined
    // so we only update the hidden select if there's a value, and handle clearing it separately
    if (typeof value !== 'undefined') {
      // the accessible-autocomplete doesn't update the hidden select if an onConfirm function is supplied
      // https://github.com/alphagov/accessible-autocomplete/issues/322
      var options = this.selectElement.querySelectorAll('option')
      for (var i = 0; i < options.length; i++) {
        var text = options[i].textContent
        if (text === value) {
          this.govukModule.setSelectOption(options[i])
          break
        }
      }
    }
  }

  // seems to be a bug in the accessible autocomplete where clearing the input
  // doesn't update the select, so we have to do this
  AccessibleAutocomplete.prototype.handleKeyup = function (e) {
    var value = this.autoCompleteInput.value

    if (value.length === 0) {
      this.clearSelect()
    }
  }

  AccessibleAutocomplete.prototype.setSelectOption = function (option) {
    var value = option.value
    this.selectElement.value = value
    window.GOVUK.triggerEvent(this.selectElement, 'change')
  }

  AccessibleAutocomplete.prototype.clearSelect = function () {
    this.selectElement.value = ''
    window.GOVUK.triggerEvent(this.selectElement, 'change')
  }

  Modules.AccessibleAutocomplete = AccessibleAutocomplete
})(window.GOVUK.Modules)
