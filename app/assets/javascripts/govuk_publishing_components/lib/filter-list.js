(function (Modules) {
  'use strict'

  function FilterList (module) {
    this.module = module
    this.items = this.module.querySelectorAll('[data-filter-item]')
    this.labelText = this.module.getAttribute('data-filter-label') || 'Filter list'
    this.resultsFound = this.items.length
    this.resultsId = 'filter-results-count'
  }

  FilterList.prototype.init = function () {
    if (this.resultsFound) {
      this.appendFilterInput()
      this.resultsElement = document.getElementById(this.resultsId)
      this.updateResultsCount()
    }
  }

  FilterList.prototype.appendFilterInput = function () {
    const form = document.createElement('div')
    form.classList.add('govuk-form-group')

    const formLabel = document.createElement('label')
    formLabel.htmlFor = 'filterInput'
    formLabel.classList.add('gem-c-label', 'govuk-label')
    formLabel.textContent = this.labelText

    const formInput = document.createElement('input')
    formInput.classList.add('gem-c-input', 'govuk-input', 'govuk-!-margin-bottom-1')
    formInput.id = 'filterInput'
    formInput.name = 'name'
    formInput.spellcheck = false
    formInput.type = 'text'
    formInput.setAttribute('aria-describedby', this.resultsId)

    const results = document.createElement('div')
    results.classList.add('govuk-hint')
    results.id = this.resultsId
    results.setAttribute('aria-live', 'polite')

    form.append(formLabel, formInput, results)

    this.module.prepend(form)
    const input = form.querySelector('.govuk-input')
    input.addEventListener('submit', function (e) { e.preventDefault() })
    input.addEventListener('input', this.filterList.bind(this))
  }

  FilterList.prototype.filterList = function (e) {
    const searchTerm = e.srcElement.value

    for (var i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const text = item.innerText.toLowerCase()

      if (text.includes(searchTerm.toLowerCase())) {
        item.classList.remove('govuk-!-display-none')
      } else {
        item.classList.add('govuk-!-display-none')
      }
    }
    this.updateResultsCount()
  }

  FilterList.prototype.updateResultsCount = function () {
    const count = Array.from(this.items).filter((item) => !item.classList.contains('govuk-!-display-none')).length
    const text = count === 1 ? `${count} result found` : `${count === 0 ? 'No' : count} results found`

    this.resultsElement.innerHTML = count !== this.resultsFound ? text : ''
  }

  Modules.FilterList = FilterList
})(window.GOVUK.Modules)
