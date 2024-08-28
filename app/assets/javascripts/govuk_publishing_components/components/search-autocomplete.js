window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  class GemSearchAutocomplete {
    constructor ($module) {
      this.$module = $module

      this.numberSuggestions = $module.getAttribute('data-display-number-suggestions') || 5
      this.throttleDelayTime = $module.getAttribute('data-throttle-delay-time') || 0
      this.submitOnSelect = $module.getAttribute('data-submit-on-select') || false
      this.baseClass = $module.getAttribute('data-base-class') || 'gem-c-search-autocomplete'
      this.source = $module.getAttribute('data-source')
    }

    init () {
      this.onUpdate = this.handleUpdate
      this.onSubmit = () => { }

      this.expanded = false
      this.loading = false

      this.$module.insertAdjacentHTML('beforeend', '<ul class="gem-c-search-autocomplete__result-list govuk-body" role="listbox"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>')

      this.$resultList = this.$module.querySelector('ul')
      this.$resultList.setAttribute('role', 'listbox')
      this.$resultList.id = `${this.baseClass}-result-list-${this.$module.getAttribute('data-id-postfix')}`

      this.$input = this.$module.querySelector('input')
      this.$input.setAttribute('role', 'combobox')
      this.$input.setAttribute('autocomplete', 'off')
      this.$input.setAttribute('aria-autocomplete', 'list')
      this.$input.setAttribute('aria-haspopup', 'listbox')
      this.$input.setAttribute('aria-expanded', 'false')
      this.$input.setAttribute('aria-owns', this.$resultList.id)
      this.$input.setAttribute('autocapitalize', 'off')
      this.$input.setAttribute('spellcheck', 'false')

      this.createAssistiveHint()

      this.$liveRegion = this.$module.querySelector('[role="status"]')

      this.value = ''
      this.searchCounter = 0
      this.results = []
      this.selectedIndex = -1
      this.selectedResult = null
      this.throttled = false
    }

    createAssistiveHint () {
      const hintId = `${this.baseClass}-assistive-hint-${this.$module.getAttribute('data-id-postfix')}`
      this.$module.insertAdjacentHTML('beforeend', `<span id="${hintId}" class="govuk-visually-hidden">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</span>`)
      this.$input.setAttribute('aria-describedby', `${hintId}`)
    }
  }

  Modules.GemSearchAutocomplete = GemSearchAutocomplete
})(window.GOVUK.Modules)
