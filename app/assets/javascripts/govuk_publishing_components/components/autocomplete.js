//= require ../vendor/polyfills/closest.js
/* global fetch */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  var util = {
    getRelativePosition: function (element1, element2) {
      var position1 = element1.getBoundingClientRect()
      var position2 = element2.getBoundingClientRect()

      var positionAbove =
        /* 1 */ position1.bottom + position2.height > window.innerHeight &&
        /* 2 */ window.innerHeight - position1.bottom < position1.top &&
        /* 3 */ window.pageYOffset + position1.top - position2.height > 0

      return positionAbove ? 'above' : 'below'
    },
    debounce: function (func, wait, immediate) {
      let timeout

      return function executedFunction () {
        var context = this
        var args = arguments

        var later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }

        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)

        if (callNow) func.apply(context, args)
      }
    },
    getAriaLabel: function (labelStr) {
      if (labelStr?.length) {
        var isLabelId = labelStr.startsWith('#')

        return {
          attribute: isLabelId ? 'aria-labelledby' : 'aria-label',
          content: isLabelId ? labelStr.substring(1) : labelStr
        }
      }
    },
    isPromise: function (value) {
      return Boolean(value && typeof value.then === 'function')
    },
    isFunction: function (value) {
      return Boolean(typeof value === 'function')
    },
    isArray: function (string) {
      try {
        return Array.isArray(JSON.parse(string))
      } catch (e) {
        return false
      }
    }
  }

  // Creates a props object with overridden toString function. toString returns an attributes
  // string in the format: `key1='value1' key2='value2'` for easy use in an HTML string.
  function Props (index, selectedIndex, baseClass) {
    this.id = `${baseClass}-result-${index}`
    this.class = `${baseClass}-result`
    this['data-result-index'] = index
    this.role = 'option'
    if (index === selectedIndex) {
      this['aria-selected'] = 'true'
    }
  }

  Props.prototype.toString = function () {
    return Object.keys(this).reduce(
      (str, key) => `${str} ${key}='${this[key]}'`,
      ''
    )
  }

  function AutocompleteCore (
    search,
    autoSelect,
    setValue,
    setAttribute,
    onUpdate,
    onSubmit,
    onShow,
    onHide,
    onLoading,
    onLoaded,
    submitOnSelect
  ) {
    this.value = ''
    this.searchCounter = 0
    this.results = []
    this.selectedIndex = -1
    this.selectedResult = null

    switch (true) {
      case util.isFunction(search):
        this.search = (value) => Promise.resolve(search(value))
        break
      case util.isArray(search):
        this.search = () => Promise.resolve(JSON.parse(search))
        break
      default:
        this.search = async (value) => {
          var url = new URL(search)
          url.searchParams.append('q', value)

          var response = await fetch(url)
          var completes = await response.json()
          return completes
        }
        break
    }

    this.autoSelect = autoSelect || false
    this.setValue = setValue || function () { }
    this.setAttribute = setAttribute || function () { }
    this.onUpdate = onUpdate || function () { }
    this.onSubmit = onSubmit || function () { }
    this.onShow = onShow
    this.onHide = onHide || function () { }
    this.onLoading = onLoading || function () { }
    this.onLoaded = onLoaded || function () { }
    this.submitOnSelect = submitOnSelect || false
  }

  AutocompleteCore.prototype.destroy = function () {
    this.search = null
    this.setValue = null
    this.setAttribute = null
    this.onUpdate = null
    this.onSubmit = null
    this.onShow = null
    this.onHide = null
    this.onLoading = null
    this.onLoaded = null
  }

  AutocompleteCore.prototype.handleInput = function (event) {
    var value = event.target.value
    this.updateResults(value)
    this.value = value
  }

  AutocompleteCore.prototype.handleKeyUp = function (event) {
    var activeEl = event.target.getAttribute('aria-activedescendant')
    if (activeEl) {
      event.target.value = document.getElementById(activeEl).innerText
    }
  }

  AutocompleteCore.prototype.handleKeyDown = function (event) {
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

  AutocompleteCore.prototype.handleFocus = function (event) {
    var value = event.target.value
    this.updateResults(value)
    this.value = value
  }

  AutocompleteCore.prototype.handleBlur = function () {
    this.hideResults()
  }

  AutocompleteCore.prototype.handleResultMouseDown = function (event) {
    event.preventDefault()
  }

  AutocompleteCore.prototype.handleResultClick = function (event) {
    var target = event.target
    var result = target.closest('[data-result-index]')
    if (result) {
      this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
      var selectedResult = this.results[this.selectedIndex]
      this.selectResult()
      this.onSubmit(selectedResult)
    }

    if (this.submitOnSelect && event.target.closest('form')) {
      event.target.closest('form').submit()
    }
  }

  AutocompleteCore.prototype.handleArrows = function (selectedIndex) {
    // Loop selectedIndex back to first or last result if out of bounds
    var resultsCount = this.results.length
    this.selectedIndex =
      ((selectedIndex % resultsCount) + resultsCount) % resultsCount

    // Update results and aria attributes
    this.onUpdate(this.results, this.selectedIndex)
  }

  AutocompleteCore.prototype.selectResult = function () {
    var selectedResult = this.results[this.selectedIndex]
    if (selectedResult) {
      this.setValue(selectedResult)
    }
    this.hideResults()
  }

  AutocompleteCore.prototype.updateResults = function (value) {
    if (value && value.length) {
      var currentSearch = ++this.searchCounter
      this.onLoading()
      this.search(value).then((results) => {
        if (currentSearch !== this.searchCounter) {
          return
        }
        this.results = results
        this.onLoaded()

        if (typeof this.results === 'undefined' || this.results.length === 0) {
          this.hideResults()
          return
        }

        this.selectedIndex = this.autoSelect ? 0 : -1
        this.onUpdate(this.results, this.selectedIndex)
        this.showResults()
      })
    }
  }

  AutocompleteCore.prototype.showResults = function () {
    this.setAttribute('aria-expanded', true)
    this.onShow()
  }

  AutocompleteCore.prototype.hideResults = function () {
    this.selectedIndex = -1
    this.results = []
    this.setAttribute('aria-expanded', false)
    this.setAttribute('aria-activedescendant', '')
    this.onUpdate(this.results, this.selectedIndex)
    this.onHide()
  }

  AutocompleteCore.prototype.checkSelectedResultVisible = function (resultsElement) {
    var selectedResultElement = resultsElement.querySelector(
      `[data-result-index='${this.selectedIndex}']`
    )
    if (!selectedResultElement) {
      return
    }

    var resultsPosition = resultsElement.getBoundingClientRect()
    var selectedPosition = selectedResultElement.getBoundingClientRect()

    if (selectedPosition.top < resultsPosition.top) {
      // Element is above viewable area
      resultsElement.scrollTop -= resultsPosition.top - selectedPosition.top
    } else if (selectedPosition.bottom > resultsPosition.bottom) {
      // Element is below viewable area
      resultsElement.scrollTop +=
        selectedPosition.bottom - resultsPosition.bottom
    }
  }

  function Autocomplete (
    root,
    search,
    renderResult,
    debounceTime = 0,
    numberSuggestions,
    positionResults,
    submitOnSelect = false,
    onUpdate = () => { },
    onSubmit = () => { },
    baseClass = 'gem-c-autocomplete',
    autoSelect = false,
    getResultValue = function (result) { return result },
    resultListLabel
  ) {
    this.numberSuggestions = numberSuggestions
    this.expanded = false
    this.loading = false
    this.position = {}
    this.resetPosition = true
    this.positionResults = positionResults
    this.root = typeof root === 'string' ? document.querySelector(root) : root
    this.root.insertAdjacentHTML('beforeend', '<ul class="gem-c-autocomplete-result-list govuk-body" role="listbox"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>')
    this.input = this.root.querySelector('input')
    this.assistiveHint = this.root.querySelector('.assistive-hint')
    this.resultList = this.root.querySelector('ul')
    this.liveRegion = this.root.querySelector('[role="status"]')
    this.baseClass = baseClass
    this.getResultValue = getResultValue
    this.onUpdate = onUpdate
    if (typeof renderResult === 'function') {
      this.renderResult = renderResult
    }

    this.resultListLabel = resultListLabel
    this.submitOnSelect = submitOnSelect

    const core = new AutocompleteCore(search,
      autoSelect,
      this.setValue.bind(this),
      this.setAttribute.bind(this),
      this.handleUpdate.bind(this),
      onSubmit,
      this.handleShow.bind(this),
      this.handleHide.bind(this),
      this.handleLoading.bind(this),
      this.handleLoaded.bind(this),
      this.submitOnSelect
    )

    if (debounceTime > 0) {
      core.handleInput = util.debounce(core.handleInput, debounceTime)
    }
    this.core = core

    this.initialize()

    return this
  }

  Autocomplete.prototype.initialize = function () {
    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('autocapitalize', 'off')
    this.input.setAttribute('spellcheck', 'false')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-haspopup', 'listbox')
    this.input.setAttribute('aria-expanded', 'false')

    this.resultList.setAttribute('role', 'listbox')

    var resultListAriaLabel = util.getAriaLabel(this.resultListLabel)
    resultListAriaLabel &&
      this.resultList.setAttribute(
        resultListAriaLabel.attribute,
        resultListAriaLabel.content
      )

    if (this.positionResults === 'absolute') {
      this.resultList.style.position = 'absolute'
    }
    this.resultList.style.zIndex = '1'
    this.resultList.style.width = '100%'
    this.resultList.style.boxSizing = 'border-box'

    this.resultList.id = `${this.baseClass}-result-list-${this.root.getAttribute('data-id-postfix')}`

    this.input.setAttribute('aria-owns', this.resultList.id)

    this.addAssistiveHint()

    document.body.addEventListener('click', this.handleDocumentClick.bind(this))
    this.input.addEventListener('input', this.core.handleInput.bind(this.core))
    this.input.addEventListener('keydown', this.core.handleKeyDown.bind(this.core))
    this.input.addEventListener('keyup', this.core.handleKeyUp.bind(this.core))
    this.input.addEventListener('focus', this.core.handleFocus.bind(this.core))
    this.input.addEventListener('blur', this.core.handleBlur.bind(this.core))
    this.resultList.addEventListener(
      'mousedown',
      this.core.handleResultMouseDown
    )
    this.resultList.addEventListener('click', this.core.handleResultClick.bind(this.core))
    this.updateStyle()
  }

  Autocomplete.prototype.addAssistiveHint = function () {
    var hintId = `${this.baseClass}-assistive-hint-${this.root.getAttribute('data-id-postfix')}`
    this.root.insertAdjacentHTML('beforeend', `<span id="${hintId}" class="govuk-visually-hidden">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</span>`)
    this.input.setAttribute('aria-describedby', `${hintId}`)
  }

  Autocomplete.prototype.destroy = function () {
    document.body.removeEventListener('click', this.handleDocumentClick)
    this.input.removeEventListener('input', this.core.handleInput.bind(this.core))
    this.input.removeEventListener('keydown', this.core.handleKeyDown.bind(this.core))
    this.input.removeEventListener('keyup', this.core.handleKeyUp.bind(this.core))
    this.input.removeEventListener('focus', this.core.handleFocus.bind(this.core))
    this.input.removeEventListener('blur', this.core.handleBlur.bind(this.core))
    this.resultList.removeEventListener(
      'mousedown',
      this.core.handleResultMouseDown
    )
    this.resultList.removeEventListener('click', this.core.handleResultClick.bind(this.core))

    this.root = null
    this.input = null
    this.resultList = null
    this.getResultValue = null
    this.onUpdate = null
    this.renderResult = null
    this.core.destroy()
    this.core = null
  }

  Autocomplete.prototype.setAttribute = function (attribute, value) {
    this.input.setAttribute(attribute, value)
  }

  Autocomplete.prototype.setValue = function (result) {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  Autocomplete.prototype.renderResult = function (result, props) {
    return `<li ${props}>${this.getResultValue(result)}</li>`
  }

  Autocomplete.prototype.handleUpdate = function (results, selectedIndex) {
    if (results.length > this.numberSuggestions) {
      results = results.slice(0, this.numberSuggestions)
    }

    this.resultList.innerHTML = ''
    results.forEach((result, index) => {
      const props = new Props(index, selectedIndex, this.baseClass)
      const resultHTML = this.renderResult(result, props, this.input.value)
      if (typeof resultHTML === 'string') {
        this.resultList.insertAdjacentHTML('beforeend', resultHTML)
      } else {
        this.resultList.insertAdjacentElement('beforeend', resultHTML)
      }
    })

    this.input.setAttribute(
      'aria-activedescendant',
      selectedIndex > -1 ? `${this.baseClass}-result-${selectedIndex}` : ''
    )

    if (this.resetPosition) {
      this.resetPosition = false
      this.position = util.getRelativePosition(this.input, this.resultList)
      this.updateStyle()
    }
    this.core.checkSelectedResultVisible(this.resultList)
    this.onUpdate(results, selectedIndex)
    this.updateStatus(results.length)
  }

  Autocomplete.prototype.updateStatus = function (resultCount) {
    this.liveRegion.innerHTML = resultCount === 0 ? 'No results.' : `${resultCount} results available.`
  }

  Autocomplete.prototype.handleShow = function () {
    this.expanded = true
    this.updateStyle()
  }

  Autocomplete.prototype.handleHide = function () {
    this.expanded = false
    this.resetPosition = true
    this.updateStyle()
  }

  Autocomplete.prototype.handleLoading = function () {
    this.loading = true
    this.updateStyle()
  }

  Autocomplete.prototype.handleLoaded = function () {
    this.loading = false
    this.updateStyle()
  }

  Autocomplete.prototype.handleDocumentClick = function (event) {
    if (this.root.contains(event.target)) {
      return
    }
    this.core.hideResults()
  }

  Autocomplete.prototype.updateStyle = function () {
    this.root.dataset.expanded = this.expanded
    this.root.dataset.loading = this.loading
    this.root.dataset.position = this.position

    this.resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
    this.resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'

    this.resultList.style.bottom = null
    this.resultList.style.top = '100%'
  }

  function GemAutocomplete ($module) {
    this.$module = $module

    this.numberSuggestions = $module.getAttribute('data-display-number-suggestions')
    this.suggestionIcon = $module.getAttribute('data-suggestion-icon')
    this.debounceTime = $module.getAttribute('data-request-debounce-time')
    this.positionResults = $module.getAttribute('data-position-results')
    this.submitOnSelect = $module.getAttribute('data-submit-on-select')
    this.staticOptions = $module.getAttribute('data-source')
  }

  GemAutocomplete.prototype.init = function (source) {
    this.source = source || this.staticOptions
    var numberSuggestions = this.numberSuggestions
    var suggestionIcon = this.suggestionIcon
    var debounceTime = this.debounceTime
    var positionResults = this.positionResults
    var submitOnSelect = this.submitOnSelect

    var searchIcon = '<span class="search-icon"><svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" /><line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" /></svg></span>'

    var renderResultHtml = function (result, props, inputVal) {
      var index = result.toLowerCase().indexOf(inputVal.toLowerCase())
      return `<li ${props}>${suggestionIcon ? searchIcon : ''}<span class='govuk-!-font-weight-bold'>${result.substring(0, index)}</span>${result.substring(index, index + inputVal.length)}<span class='govuk-!-font-weight-bold'>${result.substring(index + inputVal.length, result.length)}<span><div class='border'></div></li>`
    }

    new Autocomplete(this.$module, // eslint-disable-line no-new
      this.source,
      renderResultHtml,
      debounceTime,
      numberSuggestions,
      positionResults,
      submitOnSelect
    )
  }

  Modules.GemAutocomplete = GemAutocomplete
})(window.GOVUK.Modules)
