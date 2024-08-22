//= require ../vendor/polyfills/closest.js
/* global fetch */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAutocomplete = window.GOVUKFrontend.Autocomplete;

(function (Modules) {
  'use strict'

  function GemAutocomplete ($module) {
    this.$module = $module

    this.numberSuggestions = $module.getAttribute('data-display-number-suggestions')
    this.suggestionIcon = $module.getAttribute('data-suggestion-icon')
    this.throttleDelayTime = $module.getAttribute('data-throttle-delay-time')
    this.submitOnSelect = $module.getAttribute('data-submit-on-select')
    this.staticOptions = $module.getAttribute('data-source')
  }

  GemAutocomplete.prototype.init = function () {
    this.source = this.staticOptions

    var suggestionIcon = this.suggestionIcon

    var searchIcon = '<span class="gem-c-autocomplete__result--search-icon"><svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" /><line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" /></svg></span>'

    var renderResultHtml = function (result, props, inputVal) {
      var index = result.toLowerCase().indexOf(inputVal.toLowerCase())
      return `<li ${props.toString()}>${suggestionIcon ? searchIcon : ''}<span class='govuk-!-font-weight-bold'>${result.substring(0, index)}</span>${result.substring(index, index + inputVal.length)}<span class='govuk-!-font-weight-bold'>${result.substring(index + inputVal.length, result.length)}<span><div class='gem-c-autocomplete__result--border'></div></li>`
    }

    return new Autocomplete(this.$module, // eslint-disable-line no-new
      this.source,
      renderResultHtml,
      this.throttleDelayTime,
      this.numberSuggestions,
      this.submitOnSelect
    )
  }

  var util = {
    getAriaLabel: function (labelStr) {
      if (labelStr?.length) {
        var isLabelId = labelStr.startsWith('#')

        return {
          attribute: isLabelId ? 'aria-labelledby' : 'aria-label',
          content: isLabelId ? labelStr.substring(1) : labelStr
        }
      }
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
    },
    props: function (index, selectedIndex, baseClass) {
      var attributes = {}
      attributes.id = `${baseClass}-result-${index}`
      attributes.class = `${baseClass}__result`
      attributes['data-result-index'] = index
      attributes.role = 'option'
      if (index === selectedIndex) {
        attributes['aria-selected'] = 'true'
      }

      return Object.keys(attributes).reduce(
        function (str, key) {
          return `${str} ${key}='${attributes[key]}'`
        },
        ''
      )
    }
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
    submitOnSelect,
    throttleDelayTime
  ) {
    this.value = ''
    this.searchCounter = 0
    this.results = []
    this.selectedIndex = -1
    this.selectedResult = null
    this.throttleDelayTime = throttleDelayTime
    this.throttled = false
    this.autoSelect = autoSelect || false
    this.setValue = setValue || function () { }
    this.setAttribute = setAttribute || function () { }
    this.onUpdate = onUpdate || function () { }
    this.onSubmit = onSubmit || function () { }
    this.onShow = onShow || function () { }
    this.onHide = onHide || function () { }
    this.onLoading = onLoading || function () { }
    this.onLoaded = onLoaded || function () { }
    this.submitOnSelect = submitOnSelect || false

    if (util.isArray(search.split(','))) {
      this.search = () => {
        return Promise.resolve(JSON.parse(search))
      }
    } else {
      this.search = async (value) => {
        var url = new URL(search)
        url.searchParams.append('q', value)
        var response = await fetch(url)
        var results = await response.json()
        return results
      }
    }
  }

  AutocompleteCore.prototype.handleInput = function (event) {
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
    var resultsCount = this.results.length
    this.selectedIndex =
      ((selectedIndex % resultsCount) + resultsCount) % resultsCount

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

  function Autocomplete (
    root,
    search,
    renderResult,
    throttleDelayTime = 0,
    numberSuggestions,
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
    this.root = typeof root === 'string' ? document.querySelector(root) : root
    this.root.insertAdjacentHTML('beforeend', '<ul class="gem-c-autocomplete__result-list govuk-body" role="listbox"></ul><div aria-atomic="true" aria-live="polite" role="status" class="govuk-visually-hidden">No results.</div>')
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
      this.submitOnSelect,
      throttleDelayTime
    )

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

  Autocomplete.prototype.setAttribute = function (attribute, value) {
    this.input.setAttribute(attribute, value)
  }

  Autocomplete.prototype.setValue = function (result) {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  Autocomplete.prototype.renderResult = function (result, props) {
    return `<li ${props.toString()}>${this.getResultValue(result)}</li>`
  }

  Autocomplete.prototype.handleUpdate = function (results, selectedIndex) {
    if (results.length > this.numberSuggestions) {
      results = results.slice(0, this.numberSuggestions)
    }

    this.resultList.innerHTML = ''
    results.forEach((result, index) => {
      const props = util.props(index, selectedIndex, this.baseClass)
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

    this.resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
    this.resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'
  }

  Modules.GemAutocomplete = GemAutocomplete
})(window.GOVUK.Modules)
