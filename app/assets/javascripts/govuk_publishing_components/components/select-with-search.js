//= require choices.js/public/assets/scripts/choices.min.js
'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
;(function (Modules) {
  function SelectWithSearch (module) {
    this.module = module
  }

  SelectWithSearch.prototype.init = function () {
    if (!this.module.matches('select')) {
      console.error('Module is not a select element')
      return
    }

    const ariaDescribedBy = this.module.getAttribute('aria-describedby') || ''
    const includeBlank = this.module.getAttribute('data-select-with-search-include-blank')

    const labelId = this.module.id + '-label ' + ariaDescribedBy

    this.choices = new window.Choices(this.module, {
      allowHTML: true,
      searchPlaceholderValue: 'Search in list',
      shouldSort: false, // show options and groups in the order they were given
      itemSelectText: '',
      searchResultLimit: 100,
      removeItemButton: this.module.multiple,
      labelId: labelId,
      callbackOnInit: function () {
        // For the multiple select, move the input field to
        // the top of the feedback area, so that the selected
        // 'lozenges' appear afterwards in a more natural flow
        if (this.dropdown.type === 'select-multiple') {
          const inner = this.containerInner.element
          const input = this.input.element
          inner.prepend(input)
        }
        // Add aria-labelledby to the listbox as well as the combobox
        const listbox = this.itemList.element
        listbox.setAttribute('aria-labelledby', labelId)
      },
      // https://fusejs.io/api/options.html
      fuseOptions: {
        ignoreLocation: true, // matches any part of the string
        threshold: 0 // only matches when characters are sequential
      },
      ...(includeBlank
        ? {
            placeholderValue: this.module.multiple ? 'Select all that apply' : 'Select one'
          }
        : {})
    })

    this.module.choices = this.choices
  }

  Modules.SelectWithSearch = SelectWithSearch
})(window.GOVUK.Modules)
