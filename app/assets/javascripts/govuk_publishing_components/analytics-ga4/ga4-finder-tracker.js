//= require govuk/vendor/polyfills/Element/prototype/closest.js
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4FinderTracker = {
    trackChangeEvent: function (eventTarget, changeEventMetadata) {
      var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()

      changeEventMetadata = changeEventMetadata.split(' ')
      var changeType = changeEventMetadata[0]

      var elementType = changeEventMetadata[1]
      var elementValue = ''

      var wasFilterRemoved = false

      var schema = new GOVUK.analyticsGa4.Schemas().eventSchema()
      schema.event = 'event_data'
      schema.event_data.type = 'finder'

      if (elementType === 'checkbox') {
        var checkboxId = eventTarget.id

        // The "value" we need for a checkbox is the label text that the user sees beside the checkbox.
        elementValue = document.querySelector("label[for='" + checkboxId + "']").textContent

        if (eventTarget.checked === false) {
          // Checkbox unchecked = filter was removed
          console.log('Filter was removed because it was unchecked')
          wasFilterRemoved = true
        }
      } else if (elementType === 'select') {
        // The value of a <select> is the value attribute of the selected <option>, which is a hyphenated key. We need to grab the human readable label instead for tracking.
        elementValue = eventTarget.querySelector("option[value='" + eventTarget.value + "']").textContent
        var defaultValue = eventTarget.querySelector('option:first-of-type').textContent
        console.log('Default value:', defaultValue)

        if (elementValue === defaultValue) {
          // <select> elements being reverted to their first option (i.e. their default value) count as a "removed filter". (This will be used on the filter <select>s but not the sort by <select>, as you can't "remove" the sort by filter.)
          console.log('Filter was removed because it matches a select default value')
          wasFilterRemoved = true
        }
      } else if (elementType === 'text') {
        elementValue = eventTarget.value
        if (elementValue === '') {
          console.log('Filter was removed because the value is an empty string')
          // If our custom date filters are reset, they become an empty text box, so we count this as a "removed filter". This boolean won't be used for the keyword search box, as deleting the keyword isn't considered removing a filter.
          wasFilterRemoved = true
        }
      }

      console.log('Change type is', changeType)

      switch (changeType) {
        case 'update-filter':
          console.log('Was the filter removed?', wasFilterRemoved)
          if (wasFilterRemoved) {
            console.log('TODO: Add GA4 schema for "filter removed" event with value', elementValue)
          } else {
            console.log('TODO: Add GA4 schema for "filter added event" with value', elementValue)
          }
          break

        case 'update-keyword':
          schema.event_data.event_name = 'search'
          schema.event_data.url = window.location.href
          schema.event_data.text = PIIRemover.stripPIIWithOverride(elementValue, true, true)
          schema.event_data.section = 'Search'
          schema.event_data.action = 'search'
          break

        case 'clear-all-filters':
          console.log('TODO: Add GA4 schema for "clear all filters" event with value "Clear all filters"')
          break

        case 'update-sort':
          console.log('TODO: Add GA4 schema for "sort by updated" event with value', elementValue)
          break

        default:
          break
      }

      window.GOVUK.analyticsGa4.core.sendData(schema)
    }
  }

  global.GOVUK = GOVUK
})(window)
