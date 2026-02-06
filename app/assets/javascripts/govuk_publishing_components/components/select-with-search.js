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

    const blankOptionText = "Select none"
    const placeholderOption = this.module.querySelector(
      'option[value=""]:first-child'
    )

    if (placeholderOption && placeholderOption.textContent === '') {
      placeholderOption.textContent = this.module.multiple
        ? 'Select all that apply'
        : 'Select one'
    }

    const ariaDescribedBy = this.module.getAttribute('aria-describedby') || ''
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
        } else {
          /*** Update text for blank option in the hidden select ***/
          const selectElement = this.passedElement.element
          if (selectElement.id.search('blank') > 0) {
              selectElement.firstChild.innerText = blankOptionText
          }
          /*** Update text for blank option in the choices dropdown ***/
          // choices.js 'lastChild' in this context is the listbox of choices:
          const listbox = this.dropdown.element.lastChild
          // choices.js 'firstChild' in this context is the first option.
          // This always displays "Select One" for selects with a blank option:
          var blankOption = listbox.firstChild
          if (blankOption && blankOption.id.search('blank') > 0) {
            blankOption.innerText = blankOptionText
          }
        }
        // Add aria-labelledby to the listbox as well as the combobox
        const listbox = this.itemList.element
        listbox.setAttribute('aria-labelledby', labelId)
      },
      // https://fusejs.io/api/options.html
      fuseOptions: {
        ignoreLocation: true, // matches any part of the string
        threshold: 0 // only matches when characters are sequential
      }
    })

    // Reset blank 'Select One' to 'Select None' on each change
    // Not an ideal solution, but does work. Should revisit this
    // to find a more robust, less 'hacky' solution.
    const selectElement = this.choices.passedElement.element
    const listbox = this.choices.dropdown.element.lastChild
    selectElement.addEventListener(
      'change',
      function(event) {
        var blankOption = listbox.firstChild
        if (blankOption && blankOption.id.search('blank') > 0) {
          blankOption.innerText = blankOptionText
        }
      },
      false,
    );

    this.module.choices = this.choices
  }

  Modules.SelectWithSearch = SelectWithSearch
})(window.GOVUK.Modules)
