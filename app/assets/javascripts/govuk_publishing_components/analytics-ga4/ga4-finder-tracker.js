//= require govuk/vendor/polyfills/Element/prototype/closest.js
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4FinderTracker = {

    setFilterIndexes: function () {
      var filterContainer = document.querySelector('[data-ga4-filter-container]')

      if (!filterContainer) {
        return
      }

      var filterSections = filterContainer.querySelectorAll('[data-ga4-section]')

      for (var i = 0; i < filterSections.length; i++) {
        var section = filterSections[i]
        section.setAttribute('data-ga4-index', JSON.stringify({ index_section: i + 1, index_section_count: filterSections.length }))
      }
    },

    trackChangeEvent: function (eventTarget, changeEventMetadata) {
      var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()

      changeEventMetadata = changeEventMetadata.split(' ')
      var changeType = changeEventMetadata[0]

      var elementType = changeEventMetadata[1]
      var elementValue = ''
      var defaultValue

      var wasFilterRemoved = false

      var section = eventTarget.closest('[data-ga4-section]')

      var schema = new GOVUK.analyticsGa4.Schemas().eventSchema()
      schema.event = 'event_data'
      schema.event_data.type = 'finder'

      if (elementType === 'checkbox') {
        var checkboxId = eventTarget.id

        // The "value" we need for a checkbox is the label text that the user sees beside the checkbox.
        elementValue = document.querySelector("label[for='" + checkboxId + "']").textContent

        // If the checkbox is unchecked, the filter was removed.
        wasFilterRemoved = !eventTarget.checked
      } else if (elementType === 'radio') {
        var radioId = eventTarget.id

        // The "value" we need for a radio is the label text that the user sees beside the checkbox.
        elementValue = document.querySelector("label[for='" + radioId + "']").textContent
        defaultValue = section.querySelector('input[type=radio]:first-of-type')

        if (eventTarget.id === defaultValue.id) {
          // Radio elements being reverted to their first option (i.e. their default value) count as a "removed filter".
          wasFilterRemoved = true
        }
      } else if (elementType === 'select') {
        // The value of a <select> is the value attribute of the selected <option>, which is a hyphenated key. We need to grab the human readable label instead for tracking.
        elementValue = eventTarget.querySelector("option[value='" + eventTarget.value + "']").textContent
        defaultValue = eventTarget.querySelector('option:first-of-type').textContent

        if (elementValue === defaultValue) {
          // <select> elements being reverted to their first option (i.e. their default value) count as a "removed filter". (This will be used on the filter <select>s but not the sort by <select>, as you can't "remove" the sort by filter.)
          wasFilterRemoved = true
        }
      } else if (elementType === 'text') {
        elementValue = eventTarget.value
        if (elementValue === '') {
          // If our custom date filters are reset, they become an empty text box, so we count this as a "removed filter". This boolean won't be used for the keyword search box, as deleting the keyword isn't considered removing a filter.
          wasFilterRemoved = true
        }
      }

      schema.event_data.text = elementValue

      switch (changeType) {
        case 'update-filter':
          schema.event_data.event_name = 'select_content'

          if (section) {
            schema.event_data.section = section.getAttribute('data-ga4-section')
          }

          if (wasFilterRemoved) {
            schema.event_data.action = 'remove'
            schema.event_data.text = elementType === 'text' ? undefined : elementValue
          } else {
            schema.event_data.action = elementType === 'text' ? 'search' : 'select'
            schema.event_data.index = this.getSectionIndex(section)
          }
          break

        case 'update-keyword':
          schema.event_data.event_name = 'search'
          schema.event_data.url = window.location.pathname
          schema.event_data.section = 'Search'
          schema.event_data.action = 'search'
          schema.event_data.text = PIIRemover.stripPIIWithOverride(schema.event_data.text, true, true)
          break

        case 'clear-all-filters':
          schema.event_data.event_name = 'select_content'
          schema.event_data.action = 'remove'
          schema.event_data.text = 'Clear all filters'
          break

        case 'update-sort':
          schema.event_data.event_name = 'select_content'
          schema.event_data.action = 'sort'
          schema.event_data.section = 'Sort by'
          break

        default:
          break
      }

      window.GOVUK.analyticsGa4.core.sendData(schema)
    },

    getSectionIndex: function (sectionElement) {
      try {
        var index = sectionElement.getAttribute('data-ga4-index')
        index = JSON.parse(index)
        return index
      } catch (e) {
        console.error('GA4 configuration error: ' + e.message, window.location)
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
