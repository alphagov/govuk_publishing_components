window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function FilterList (module) {
    this.module = module
    this.items = this.module.querySelectorAll('[data-filter-item]')
    this.labelText = this.module.getAttribute('data-filter-label') || 'Filter list'
  }

  FilterList.prototype.init = function () {
    if (this.items.length) {
      this.appendFilterInput()
    }
  }

  FilterList.prototype.appendFilterInput = function () {
    const form = document.createElement('div')
    form.classList.add('govuk-form-group')
    form.innerHTML = `
      <label for="filterInput" class="gem-c-label govuk-label">${this.labelText}</label>
      <input class="gem-c-input govuk-input" id="filterInput" name="name" spellcheck="false" type="text">
    `
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
  }

  Modules.FilterList = FilterList
})(window.GOVUK.Modules)
