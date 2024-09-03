/* global XMLHttpRequest */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  class GemSearchAutocomplete {
    constructor ($module) {
      this.$module = $module

      this.numberSuggestions = $module.getAttribute('data-display-number-suggestions')
      this.submitOnSelect = $module.getAttribute('data-submit-on-select')
      this.baseClass = $module.getAttribute('data-base-class')
      this.source = $module.getAttribute('data-source')
    }

    init () {
      this.expanded = false

      this.$module.insertAdjacentHTML('beforeend', `<ul class="${this.baseClass}__result-list js-result-list govuk-body"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>`)

      this.configureResultList()
      this.configureInput(this.$resultList.id)
      this.createAssistiveHint()

      if (this.$module.querySelector('form')) {
        this.$form = this.$module.querySelector('form')
      }

      document.body.addEventListener('click', e => this.handleDocumentClick(e))

      this.$liveRegion = this.$module.querySelector('.js-assistive-hint')

      this.value = ''
      this.searchCounter = 0
      this.results = []
      this.selectedIndex = -1
      this.selectedResult = null
      this.throttled = false

      this.normaliseSource()
    }

    configureResultList () {
      this.$resultList = this.$module.querySelector('.js-result-list')
      this.$resultList.setAttribute('role', 'listbox')
      this.$resultList.id = `${this.baseClass}-result-list-${this.$module.getAttribute('data-id-postfix')}`

      this.$resultList.addEventListener('mousedown', e => this.handleResultMouseDown(e))
      this.$resultList.addEventListener('click', e => this.handleResultClick(e))
    }

    configureInput (listElementId) {
      this.$input = this.$module.querySelector('.gem-c-search__input')
      this.$input.setAttribute('role', 'combobox')
      this.$input.setAttribute('autocomplete', 'off')
      this.$input.setAttribute('aria-autocomplete', 'list')
      this.$input.setAttribute('aria-haspopup', 'listbox')
      this.$input.setAttribute('aria-expanded', 'false')
      this.$input.setAttribute('aria-owns', listElementId)
      this.$input.setAttribute('autocapitalize', 'off')
      this.$input.setAttribute('spellcheck', 'false')

      this.$input.addEventListener('input', e => this.handleInput(e))
      this.$input.addEventListener('change', e => this.handleInput(e))
      this.$input.addEventListener('keydown', e => this.handleInputKeyDown(e))
      this.$input.addEventListener('keyup', e => this.handleInputKeyUp(e))
      this.$input.addEventListener('focus', e => this.handleInputFocus(e))
      this.$input.addEventListener('blur', e => this.handleInputBlur(e))
    }

    createAssistiveHint () {
      const hintId = `${this.baseClass}-assistive-hint-${this.$module.getAttribute('data-id-postfix')}`
      this.$module.insertAdjacentHTML('beforeend', `<span id="${hintId}" class="govuk-visually-hidden js-assistive-hint" aria-live="polite" aria-atomic="true">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</span>`)
      this.$input.setAttribute('aria-describedby', hintId)
    }

    normaliseSource () {
      try {
        const url = new URL(this.source)

        this.search = (value) => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            url.searchParams.set('q', value)

            const done = function () {
              if (xhr.status === 200) {
                try {
                  const results = JSON.parse(xhr.responseText)
                  resolve(results)
                } catch (error) {
                  reject(new Error('Failed to parse JSON response x'))
                }
              } else {
                // handle error
              }
            }

            xhr.addEventListener('loadend', done)
            xhr.open('GET', url, true)
            xhr.send()
          })
        }
      } catch (e) {
        this.search = () => {
          return Promise.resolve(JSON.parse(this.source))
        }
      }
    }

    handleDocumentClick (event) {
      if (this.$module.contains(event.target)) {
        return
      }
      this.hideResults()
    }

    handleResultMouseDown (event) {
      event.preventDefault()
    }

    handleResultClick (event) {
      const target = event.target
      const result = target.closest('.js-result')
      if (result) {
        this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
        this.selectedResult = this.results[this.selectedIndex]
        this.selectResult()
      }
    }

    handleInputBlur () {
      this.hideResults()
    }

    handleInput (event) {
      this.value = event.target.value

      if (this.throttled) {
        return
      }

      this.updateResults()

      if (this.$module.getAttribute('data-throttle-delay-time')) {
        this.throttled = true
        this.keypressTimeout = setTimeout(() => {
          this.throttled = false
        }, parseInt(this.$module.getAttribute('data-throttle-delay-time')))
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
          this.selectedResult =
            this.results[this.selectedIndex] || this.selectedResult
          this.selectResult()
          break
        }
        case 'escape': {
          this.hideResults()
          this.setInputValue('')
          break
        }
      }
    }

    handleInputKeyUp () {
      const activeEl = this.$input.getAttribute('aria-activedescendant')
      if (activeEl) {
        this.setInputValue(this.$module.querySelector(`#${activeEl}`).innerText)
      }
    }

    handleInputFocus (event) {
      if (event.target.value.length) {
        this.value = event.target.value
        this.updateResults()
      }
    }

    handleArrows (selectedIndex) {
      const resultsCount = this.results.length
      this.selectedIndex = (selectedIndex + resultsCount) % resultsCount

      this.handlePositionChange()
    }

    submitForm () {
      if (this.$form) {
        this.$form.submit()
      }
    }

    selectResult () {
      const selectedResult = this.results[this.selectedIndex]
      if (selectedResult) {
        this.setInputValue(selectedResult)
      }
      this.hideResults()
      if (this.submitOnSelect) {
        this.submitForm()
      }
    }

    updateResults () {
      if (this.value && this.value.length) {
        const currentSearch = ++this.searchCounter
        this.search(this.value).then((results) => {
          if (currentSearch !== this.searchCounter) {
            return
          }
          this.results = results

          if (typeof this.results === 'undefined' || this.results.length === 0) {
            this.hideResults()
            return
          }

          this.handleResultsUpdate()
          this.showResults()
        })
      } else {
        this.hideResults()
      }
    }

    showResults () {
      this.$input.setAttribute('aria-expanded', true)
      this.expanded = true
      this.updateStyle()
    }

    hideResults () {
      this.selectedIndex = -1
      this.results = []
      this.$input.setAttribute('aria-expanded', false)
      this.$input.setAttribute('aria-activedescendant', '')
      this.handleResultsUpdate()
      this.expanded = false
      this.updateStyle()
    }

    updateStyle () {
      this.$resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
      this.$resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'
    }

    setInputValue (result) {
      this.$input.value = result
    }

    createResultElement (index) {
      const resultElement = document.createElement('li')
      resultElement.id = `${this.baseClass}-result-${index}`
      resultElement.classList.add(`${this.baseClass}__result`)
      resultElement.classList.add('js-result')
      resultElement.setAttribute('data-result-index', index)
      resultElement.setAttribute('role', 'option')
      if (index === this.selectedIndex) {
        resultElement.setAttribute('aria-selected', 'true')
      }

      return resultElement
    }

    createResultElementContent (resultListElement, result, inputVal) {
      const searchIcon = `<span class="${this.baseClass}__result--search-icon"><svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" /><line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" /></svg></span>`
      resultListElement.insertAdjacentHTML('afterbegin', searchIcon)

      const regex = new RegExp(`(${inputVal})`, 'gi')
      const matchHTML = result.replace(regex, '<span class="govuk-!-font-weight-regular js-result-match">$1</span>')

      const section = document.createElement('span')
      section.classList.add('govuk-!-font-weight-bold')
      section.innerHTML = matchHTML

      resultListElement.insertAdjacentElement('beforeend', section)
      resultListElement.insertAdjacentHTML('beforeend', '<div class="gem-c-search-autocomplete__result--border"></div>')

      return resultListElement
    }

    handlePositionChange () {
      this.$input.setAttribute(
        'aria-activedescendant',
        this.selectedIndex > -1 ? `${this.baseClass}-result-${this.selectedIndex}` : ''
      )

      Array.from(this.$module.querySelectorAll(`.${this.baseClass}__result`)).forEach(r => r.setAttribute('aria-selected', 'false'))

      this.$module.querySelector(`#${this.baseClass}-result-${this.selectedIndex}`).setAttribute('aria-selected', 'true')
    }

    handleResultsUpdate () {
      if (this.results.length > this.numberSuggestions) {
        this.results = this.results.slice(0, this.numberSuggestions)
      }

      this.$resultList.innerHTML = ''
      this.results.forEach((result, index) => {
        const resultListElement = this.createResultElement(index)

        this.$resultList.insertAdjacentElement('beforeend', this.createResultElementContent(resultListElement, result, this.$input.value))
      })

      this.updateStatus(this.results.length)
    }

    updateStatus (resultCount) {
      this.$liveRegion.textContent = resultCount === 0 ? 'No results.' : `${resultCount} results available.`
    }
  }

  Modules.GemSearchAutocomplete = GemSearchAutocomplete
})(window.GOVUK.Modules)
