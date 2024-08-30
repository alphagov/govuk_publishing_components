/* global fetch */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  class GemSearchAutocomplete {
    constructor ($module) {
      this.$module = $module

      this.numberSuggestions = $module.getAttribute('data-display-number-suggestions')
      this.throttleDelayTime = $module.getAttribute('data-throttle-delay-time')
      this.submitOnSelect = $module.getAttribute('data-submit-on-select')
      this.baseClass = $module.getAttribute('data-base-class')
      this.source = $module.getAttribute('data-source')
    }

    init () {
      this.expanded = false
      this.loading = false

      this.$module.insertAdjacentHTML('beforeend', `<ul class="${this.baseClass}__result-list js-result-list govuk-body"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>`)

      this.$resultList = this.$module.querySelector('.js-result-list')
      this.$resultList.setAttribute('role', 'listbox')
      this.$resultList.id = `${this.baseClass}-result-list-${this.$module.getAttribute('data-id-postfix')}`

      this.$resultList.addEventListener('mousedown', this.handleResultMouseDown)
      this.$resultList.addEventListener('click', this.handleResultClick.bind(this))

      this.$input = this.$module.querySelector('.gem-c-search__input')
      this.$input.setAttribute('role', 'combobox')
      this.$input.setAttribute('autocomplete', 'off')
      this.$input.setAttribute('aria-autocomplete', 'list')
      this.$input.setAttribute('aria-haspopup', 'listbox')
      this.$input.setAttribute('aria-expanded', 'false')
      this.$input.setAttribute('aria-owns', this.$resultList.id)
      this.$input.setAttribute('autocapitalize', 'off')
      this.$input.setAttribute('spellcheck', 'false')

      this.$input.addEventListener('input', this.handleInput.bind(this))
      this.$input.addEventListener('keydown', this.handleInputKeyDown.bind(this))
      this.$input.addEventListener('keyup', this.handleInputKeyUp.bind(this))
      this.$input.addEventListener('focus', this.handleInputFocus.bind(this))
      this.$input.addEventListener('blur', this.handleInputBlur.bind(this))

      document.body.addEventListener('click', this.handleDocumentClick.bind(this))

      this.createAssistiveHint()

      this.$liveRegion = this.$module.querySelector('.js-assistive-hint')

      this.value = ''
      this.searchCounter = 0
      this.results = []
      this.selectedIndex = -1
      this.selectedResult = null
      this.throttled = false

      this.normaliseSource()
    }

    normaliseSource () {
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

    handleInputBlur () {
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

    handleInputKeyDown (event) {
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
            keyCodes[event.keyCode] === 'up' ? this.selectedIndex - 1 : this.selectedIndex + 1
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
          if (keyCodes[event.keyCode] === 'space') {
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
          this.setInputValue('')
          break
        }
      }
    }

    handleInputKeyUp (event) {
      const activeEl = event.target.getAttribute('aria-activedescendant')
      if (activeEl) {
        this.setInputValue(this.$module.getElementById(activeEl).innerText)
      }
    }

    handleResultClick (event) {
      const target = event.target
      const result = target.closest('.js-result')
      if (result) {
        this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
        this.selectedResult = this.results[this.selectedIndex]
        this.selectResult()
      }

      if (this.submitOnSelect && event.target.closest('form')) {
        event.target.closest('form').submit()
      }
    }

    handleInputFocus (event) {
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
        this.setInputValue(selectedResult)
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

          this.handleUpdate(this.results, this.selectedIndex)
          this.showResults()
        })
      }
    }

    showResults () {
      this.$input.setAttribute('aria-expanded', true)
      this.handleShow()
    }

    hideResults () {
      this.selectedIndex = -1
      this.results = []
      this.$input.setAttribute('aria-expanded', false)
      this.$input.setAttribute('aria-activedescendant', '')
      this.handleUpdate(this.results, this.selectedIndex)
      this.handleHide()
    }

    updateStyle () {
      this.$module.dataset.expanded = this.expanded
      this.$module.dataset.loading = this.loading

      this.$resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
      this.$resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'
    }

    createAssistiveHint () {
      const hintId = `${this.baseClass}-assistive-hint-${this.$module.getAttribute('data-id-postfix')}`
      this.$module.insertAdjacentHTML('beforeend', `<span id="${hintId}" class="govuk-visually-hidden js-assistive-hint" aria-live="polite" aria-atomic="true">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</span>`)
      this.$input.setAttribute('aria-describedby', hintId)
    }

    setInputValue (result) {
      this.$input.value = result
    }

    createResultElement (index, selectedIndex) {
      const resultElement = document.createElement('li')
      resultElement.id = `${this.baseClass}-result-${index}`
      resultElement.classList.add(`${this.baseClass}__result`)
      resultElement.classList.add('js-result')
      resultElement.setAttribute('data-result-index', index)
      resultElement.setAttribute('role', 'option')
      if (index === selectedIndex) {
        resultElement.setAttribute('aria-selected', 'true')
      }

      return resultElement
    }

    createResultHtml (result, inputVal) {
      const searchIcon = `<span class="${this.baseClass}__result--search-icon"><svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" /><line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" /></svg></span>`
      const index = result.toLowerCase().indexOf(inputVal.toLowerCase())
      return `${searchIcon}<span class='govuk-!-font-weight-bold'>${result.substring(0, index)}</span>${result.substring(index, index + inputVal.length)}<span class='govuk-!-font-weight-bold'>${result.substring(index + inputVal.length, result.length)}<span><div class='gem-c-search-autocomplete__result--border'></div>`
    }

    handleShow () {
      this.expanded = true
      this.updateStyle()
    }

    handleHide () {
      this.expanded = false
      this.updateStyle()
    }

    handleUpdate (results, selectedIndex) {
      if (results.length > this.numberSuggestions) {
        results = results.slice(0, this.numberSuggestions)
      }

      this.$resultList.innerHTML = ''
      results.forEach((result, index) => {
        const resultListElement = this.createResultElement(index, selectedIndex)
        resultListElement.insertAdjacentHTML('beforeend', this.createResultHtml(result, this.$input.value))
        this.$resultList.insertAdjacentElement('beforeend', resultListElement)
      })

      this.$input.setAttribute(
        'aria-activedescendant',
        selectedIndex > -1 ? `${this.baseClass}-result-${selectedIndex}` : ''
      )

      this.updateStatus(results.length)
    }

    updateStatus (resultCount) {
      this.$liveRegion.textContent = resultCount === 0 ? 'No results.' : `${resultCount} results available.`
    }
  }

  Modules.GemSearchAutocomplete = GemSearchAutocomplete
})(window.GOVUK.Modules)
