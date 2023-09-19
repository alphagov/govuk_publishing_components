window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function MobileFiltersModal (module) {
    this.module = module
    this.triggerElement = document.querySelector('[data-toggle="mobile-filters-modal"][data-target="' + this.module.id + '"]')
    this.clearFiltersTrigger = this.module.querySelector('.js-clear-selected-filters')
    this.module.toggle = this.handleToggle.bind(this)
    this.module.open = this.handleOpen.bind(this)
    this.module.close = this.handleClose.bind(this)
    this.module.clearFilters = this.handleClearFilters.bind(this)
  }

  MobileFiltersModal.prototype.init = function () {
    if (this.triggerElement) {
      this.triggerElement.addEventListener('click', this.module.toggle)
      this.triggerElement.setAttribute('aria-controls', this.module.id)
      this.triggerElement.setAttribute('aria-expanded', 'false')
      // Open filter on page load if data attribute "open_on_load" is present
      if (this.triggerElement.getAttribute('data-open-on-load') === 'true') {
        this.triggerElement.click()
      }
    }

    if (this.clearFiltersTrigger) {
      this.clearFiltersTrigger.addEventListener('click', this.module.clearFilters)
    }

    this.addGa4Tracking()
  }

  MobileFiltersModal.prototype.handleToggle = function (event) {
    event.preventDefault()

    if (this.module.classList.contains('facets--visible')) {
      this.module.close()
    } else {
      this.module.open()
    }
  }

  MobileFiltersModal.prototype.handleOpen = function () {
    this.triggerElement.setAttribute('aria-expanded', 'true')
    this.module.classList.add('facets--visible')
  }

  MobileFiltersModal.prototype.handleClose = function () {
    this.triggerElement.setAttribute('aria-expanded', 'false')
    this.module.classList.remove('facets--visible')
  }

  MobileFiltersModal.prototype.handleClearFilters = function (event) {
    if (event) {
      event.preventDefault()
    }
    // reset all selects, uncheck checkboxes, clear text input values
    // and remove the selected count on each facet
    var elements = this.module.querySelectorAll('input, select, .js-selected-counter')
    var form = document.querySelector('.js-live-search-form')
    var customEvent = document.createEvent('HTMLEvents')
    customEvent.initEvent('customFormChange', true, false)
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i]
      var tagName = el.tagName
      switch (tagName) {
        case 'INPUT':
          if (el.type === 'checkbox' && el.checked === true) {
            el.checked = false
          } else if (el.type === 'text' && el.value !== '') {
            el.value = ''
          }
          break
        case 'SELECT':
          el.selectedIndex = null
          break
        case 'DIV':
          el.parentNode.removeChild(el)
          break
        case 'SPAN':
          el.parentNode.removeChild(el)
          break
        default:
          break
      }
    }
    // fire a single custom change event on the form once all filters have been cleared
    // so that we only fetch new search-api data once
    form.dispatchEvent(customEvent)
  }

  MobileFiltersModal.prototype.addGa4Tracking = function () {
    var indexSectionCount = document.querySelectorAll('[data-ga4-filter-parent]').length

    this.triggerElement.setAttribute('data-ga4-event', JSON.stringify({
      event_name: 'select_content',
      type: 'finder',
      text: 'Filter',
      section: 'Filter',
      index: {
        index_section: 0,
        index_section_count: indexSectionCount
      }
    }))
  }

  Modules.MobileFiltersModal = MobileFiltersModal
})(window.GOVUK.Modules)
