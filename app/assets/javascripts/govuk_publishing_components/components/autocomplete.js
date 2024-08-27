//= require ../vendor/polyfills/closest.js
/* global fetch */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  class GemAutocomplete {
    constructor ($module) {
      this.$module = $module

      this.numberSuggestions = $module.getAttribute('data-display-number-suggestions') || 5
      this.throttleDelayTime = $module.getAttribute('data-throttle-delay-time') || 0
      this.submitOnSelect = $module.getAttribute('data-submit-on-select') || false
      this.baseClass = $module.getAttribute('data-base-class') || 'gem-c-autocomplete'
      this.source = $module.getAttribute('data-source')
    }

    init () {
      this.onUpdate = this.handleUpdate
      this.onSubmit = () => { }

      this.expanded = false
      this.loading = false

      this.$module.insertAdjacentHTML('beforeend', '<ul class="gem-c-autocomplete__result-list govuk-body" role="listbox"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>')
  
      this.$resultList = this.$module.querySelector('ul')
      this.$resultList.setAttribute('role', 'listbox')
      this.$resultList.id = `${this.baseClass}-result-list-${this.$module.getAttribute('data-id-postfix')}`

      this.$resultList.addEventListener('mousedown', this.handleResultMouseDown)
      this.$resultList.addEventListener('click', this.handleResultClick.bind(this))

      this.$input = this.$module.querySelector('input')
      this.$input.setAttribute('role', 'combobox')
      this.$input.setAttribute('autocomplete', 'off')
      this.$input.setAttribute('aria-haspopup', 'listbox')
      this.$input.setAttribute('aria-expanded', 'false')
      this.$input.setAttribute('aria-owns', this.$resultList.id)

      // are these needed, check finder-frontend
      // this.$input.setAttribute('autocapitalize', 'off')
      // this.$input.setAttribute('spellcheck', 'false')
      // this.$input.setAttribute('aria-autocomplete', 'list')

      this.$input.addEventListener('input', this.handleInput.bind(this))
      this.$input.addEventListener('keydown', this.handleKeyDown.bind(this))
      this.$input.addEventListener('keyup', this.handleKeyUp.bind(this))
      this.$input.addEventListener('focus', this.handleFocus.bind(this))
      this.$input.addEventListener('blur', this.handleBlur.bind(this))

      document.body.addEventListener('click', this.handleDocumentClick.bind(this))

      this.addAssistiveHint()

      this.$liveRegion = this.$module.querySelector('[role="status"]')

      this.value = ''
      this.searchCounter = 0
      this.results = []
      this.selectedIndex = -1
      this.selectedResult = null
      this.throttled = false

      if (Array.isArray(this.source.split(',').map(item => item.trim()))) {
        this.search = () => {
          return Promise.resolve(JSON.parse(this.source))
        }
      } else {
        this.search = async (value) => {
          const url = new URL(this.source)
          url.searchParams.append('q', value)
          const response = await fetch(url)
          const results = await response.json()
          return results
        }
      }
    }

    handleDocumentClick (event) {
      if (this.$module.contains(event.target)) {
        return
      }
      this.hideResults()
    }

    handleBlur () {
      this.hideResults()
    }

    handleResultMouseDown (event) {
      event.preventDefault()
    }

    handleInput (event) {
      if (this.throttled) {
        return
      }

      const value = event.target.value
      this.updateResults(value)
      this.value = value

      if (this.throttleDelayTime) {
        this.throttled = true
        this.keypressTimeout = setTimeout(() => {
          this.throttled = false
        }, parseInt(this.throttleDelayTime))
      }
    }

    handleKeyDown (event) {
      const keyCodes = {
        9: 'tab',
        13: 'enter',
        27: 'escape',
        32: 'space',
        38: 'up',
        40: 'down'
      }

      switch (keyCodes[event.keyCode]) {
        case 'up':
        case 'down': {
          const selectedIndex =
            event.keyCode === 38 ? this.selectedIndex - 1 : this.selectedIndex + 1
          event.preventDefault()
          this.handleArrows(selectedIndex)
          break
        }
        case 'tab': {
          this.selectResult()
          break
        }
        case 'enter':
        case 'space': {
          if (event.keyCode === 32) {
            event.preventDefault()
          }
          this.selectedResult =
            this.results[this.selectedIndex] || this.selectedResult
          this.selectResult()

          if (this.submitOnSelect && event.target.closest('form')) {
            event.target.closest('form').submit()
          }
          break
        }
        case 'escape': {
          this.hideResults()
          this.setValue()
          break
        }
      }
    }

    handleKeyUp (event) {
      const activeEl = event.target.getAttribute('aria-activedescendant')
      if (activeEl) {
        event.target.value = document.getElementById(activeEl).innerText
      }
    }

    handleResultClick (event) {
      const target = event.target
      const result = target.closest('[data-result-index]')
      if (result) {
        this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
        const selectedResult = this.results[this.selectedIndex]
        this.selectResult()
        this.onSubmit(selectedResult)
      }

      if (this.submitOnSelect && event.target.closest('form')) {
        event.target.closest('form').submit()
      }
    }

    handleFocus (event) {
      const value = event.target.value
      this.updateResults(value)
      this.value = value
    }

    handleArrows (selectedIndex) {
      const resultsCount = this.results.length
      this.selectedIndex =
        ((selectedIndex % resultsCount) + resultsCount) % resultsCount

      this.handleUpdate(this.results, this.selectedIndex)
    }

    selectResult () {
      const selectedResult = this.results[this.selectedIndex]
      if (selectedResult) {
        this.setValue(selectedResult)
      }
      this.hideResults()
    }

    updateResults (value) {
      if (value && value.length) {
        const currentSearch = ++this.searchCounter
        this.search(value).then((results) => {
          if (currentSearch !== this.searchCounter) {
            return
          }
          this.results = results

          if (typeof this.results === 'undefined' || this.results.length === 0) {
            this.hideResults()
            return
          }

          this.selectedIndex = this.autoSelect ? 0 : -1
          this.handleUpdate(this.results, this.selectedIndex)
          this.showResults()
        })
      }
    }

    showResults () {
      this.setAttribute('aria-expanded', true)
      this.handleShow()
    }

    hideResults () {
      this.selectedIndex = -1
      this.results = []
      this.setAttribute('aria-expanded', false)
      this.setAttribute('aria-activedescendant', '')
      this.handleUpdate(this.results, this.selectedIndex)
      this.handleHide()
    }

    updateStyle () {
      this.$module.dataset.expanded = this.expanded
      this.$module.dataset.loading = this.loading

      this.$resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
      this.$resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'
    }

    addAssistiveHint () {
      const hintId = `${this.baseClass}-assistive-hint-${this.$module.getAttribute('data-id-postfix')}`
      this.$module.insertAdjacentHTML('beforeend', `<span id="${hintId}" class="govuk-visually-hidden">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</span>`)
      this.$input.setAttribute('aria-describedby', `${hintId}`)
    }

    setAttribute (attribute, value) {
      this.$input.setAttribute(attribute, value)
    }

    setValue (result) {
      this.$input.value = result
    }

    createResultElement (index, selectedIndex) {
      const element = document.createElement('li')
      element.id = `${this.baseClass}-result-${index}`
      element.classList.add(`${this.baseClass}__result`)
      element.setAttribute('data-result-index', index)
      element.setAttribute('role', 'option')
      if (index === selectedIndex) {
        element.setAttribute('aria-selected', 'true')
      }

      return element
    }

    createResultContent (result, inputVal) {
      const searchIcon = '<span class="gem-c-autocomplete__result--search-icon"><svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" /><line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" /></svg></span>'
      const index = result.toLowerCase().indexOf(inputVal.toLowerCase())
      return `${searchIcon}<span class='govuk-!-font-weight-bold'>${result.substring(0, index)}</span>${result.substring(index, index + inputVal.length)}<span class='govuk-!-font-weight-bold'>${result.substring(index + inputVal.length, result.length)}<span><div class='gem-c-autocomplete__result--border'></div>`
    }

    handleUpdate (results, selectedIndex) {
      if (results.length > this.numberSuggestions) {
        results = results.slice(0, this.numberSuggestions)
      }

      this.$resultList.innerHTML = ''
      results.forEach((result, index) => {
        const resultLi = this.createResultElement(index, selectedIndex)
        resultLi.insertAdjacentHTML('beforeend', this.createResultContent(result, this.$input.value))
        this.$resultList.insertAdjacentElement('beforeend', resultLi)
      })

      this.$input.setAttribute(
        'aria-activedescendant',
        selectedIndex > -1 ? `${this.baseClass}-result-${selectedIndex}` : ''
      )

      this.updateStatus(results.length)
    }

    updateStatus (resultCount) {
      this.$liveRegion.innerHTML = resultCount === 0 ? 'No results.' : `${resultCount} results available.`
    }

    handleShow () {
      this.expanded = true
      this.updateStyle()
    }

    handleHide () {
      this.expanded = false
      this.updateStyle()
    }
  }

  Modules.GemAutocomplete = GemAutocomplete
})(window.GOVUK.Modules)
