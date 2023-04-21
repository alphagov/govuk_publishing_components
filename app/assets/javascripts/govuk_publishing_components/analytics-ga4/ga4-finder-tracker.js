//= require govuk/vendor/polyfills/Element/prototype/closest.js
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4FinderTracker = {
    trackChangeEvent: function (eventTarget, changeEventMetadata) {
      changeEventMetadata = changeEventMetadata.split(' ')
      var changeType = changeEventMetadata[0]

      var elementType = changeEventMetadata[1]
      var elementValue = ''

      var wasFilterRemoved = false

      var schema = new window.GOVUK.analyticsGa4.Schemas()
      schema.event = 'event_data'
      schema.event_data.type = 'finder'

      if (elementType === 'checkbox') {
        var checkboxId = eventTarget.id

        // The "value" for a checkbox is the label text that the user sees beside the checkbox.
        elementValue = document.querySelector("label[for='" + checkboxId + "']").textContent

        if (eventTarget.checked === false) {
          // Checkbox unchecked = filter was removed
          console.log('Filter was removed because it was unchecked')
          wasFilterRemoved = true
        }
      } else if (elementType === 'select') {
        // The value of a <select> is the ID of the <option>, so we need to grab the human friendly label.
        elementValue = eventTarget.querySelector("option[value='" + eventTarget.value + "']").textContent
        var defaultValue = eventTarget.querySelector('option:first-of-type').textContent
        console.log('Default value:', defaultValue)

        if (elementValue === defaultValue) {
          // <select> elements being reverted to their first option (i.e. their default value) counts as a "removed filter".
          console.log('Filter was removed because it matches a select default value')
          wasFilterRemoved = true
        }
      } else if (elementType === 'text') {
        elementValue = eventTarget.value
        if (elementValue === '') {
          console.log('Filter was removed because the value is an empty string')
          // Custom date filters being reset to an empty text box counts as a "removed filter".
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
          break

        case 'clear-all-filters':
          console.log('TODO: Add GA4 schema for "clear all filters" event with value "Clear all filters"')
          break

        case 'update-sort':
          console.log('TODO: Add GA4 schema for "sort by updated" event with value "Clear all filters"')
          break

        default:
          break
      }

      window.GOVUK.analyticsGa4.core.sendData(schema)
    }
  }

  global.GOVUK = GOVUK
})(window)
