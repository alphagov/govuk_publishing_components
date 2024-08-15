;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4FinderTracker = {
    // Called when the search results updates. Takes the event target, and a string containing the type of change and element type. Creates the GTM schema and pushes it.
    // changeEventMetadata is a string referring to the type of form change and the element type that triggered it. For example 'update-filter checkbox'.
    trackChangeEvent: function (eventTarget, changeEventMetadata) {
      changeEventMetadata = changeEventMetadata.split(' ')
      var filterParent = eventTarget.closest('[data-ga4-filter-parent]')
      var section = eventTarget.closest('[data-ga4-section]')
      var changeType = changeEventMetadata[0]
      var elementType = changeEventMetadata[1]

      if ((!changeType || !elementType) && changeType !== 'clear-all-filters') {
        console.warn('GA4 Finder tracker incorrectly configured for element: ' + eventTarget)
        return
      }

      var data = {}
      data.type = 'finder'
      data.event_name = 'select_content'

      var elementInfo = this.getElementInfo(eventTarget, elementType, section)
      var elementValue = elementInfo.elementValue
      data.text = elementValue
      var wasFilterRemoved = elementInfo.wasFilterRemoved
      data = this.setSchemaBasedOnChangeType(data, elementValue, elementType, wasFilterRemoved, changeType, section, filterParent)

      var schemas = new window.GOVUK.analyticsGa4.Schemas()
      var schema = schemas.mergeProperties(data, 'event_data')

      window.GOVUK.analyticsGa4.core.sendData(schema)
    },

    // Grabs the value from the eventTarget. Checks if the filter was removed if the eventTarget is unchecked, set back to default, or has its user input removed. Returns the results as an object.
    getElementInfo: function (eventTarget, elementType, section) {
      var elementValue = ''
      var defaultValue
      var wasFilterRemoved = false

      switch (elementType) {
        case 'checkbox':
          var checkboxId = eventTarget.id

          // The "value" we need for a checkbox is the label text that the user sees beside the checkbox.
          elementValue = document.querySelector("label[for='" + checkboxId + "']").textContent

          // If the checkbox is unchecked, the filter was removed.
          wasFilterRemoved = !eventTarget.checked
          break

        case 'radio':
          var radioId = eventTarget.id

          // The "value" we need for a radio is the label text that the user sees beside the checkbox.
          elementValue = document.querySelector("label[for='" + radioId + "']").textContent
          defaultValue = section.querySelector('input[type=radio]:first-of-type')

          if (eventTarget.id === defaultValue.id) {
            // Radio elements being reverted to their first option (i.e. their default value) count as a "removed filter".
            wasFilterRemoved = true
          }
          break

        case 'select':
          // The value of a <select> is the value attribute of the selected <option>, which is a hyphenated key. We need to grab the human readable label instead for tracking.
          elementValue = eventTarget.querySelector("option[value='" + eventTarget.value + "']").textContent
          defaultValue = eventTarget.querySelector('option:first-of-type').textContent

          if (elementValue === defaultValue) {
            // <select> elements being reverted to their first option (i.e. their default value) count as a "removed filter". (This will be used on the filter <select>s but not the sort by <select>, as you can't "remove" the sort by filter.)
            wasFilterRemoved = true
          }
          break

        case 'text':
          elementValue = eventTarget.value
          if (elementValue === '') {
            // If our custom date filters are reset, they become an empty text box, so we count this as a "removed filter". This boolean won't be used for the keyword search box, as deleting the keyword isn't considered removing a filter.
            wasFilterRemoved = true
          }
          break
      }

      return { elementValue: elementValue, wasFilterRemoved: wasFilterRemoved }
    },

    // Takes the GTM schema, the event target value, the event target HTML type, whether the filter was removed, the type of filter change it was, and the parent section heading. Populates the GTM object based on these values.
    setSchemaBasedOnChangeType: function (schema, elementValue, elementType, wasFilterRemoved, changeType, section, filterParent) {
      switch (changeType) {
        case 'update-filter':
          if (section) {
            schema.section = section.getAttribute('data-ga4-section')
          }

          if (wasFilterRemoved) {
            schema.action = 'remove'
            schema.text = elementType === 'text' ? undefined : elementValue
          } else {
            schema.action = elementType === 'text' ? 'search' : 'select'
            var index = this.getSectionIndex(filterParent)
            schema.index_link = index.index_link || undefined
            schema.index_section = index.index_section || undefined
            schema.index_section_count = index.index_section_count || undefined
          }
          break

        case 'update-keyword':
          schema.event_name = 'search'
          schema.url = window.location.pathname
          schema.section = 'Search'
          schema.action = 'search'
          schema.text = GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(schema.text)
          break

        case 'clear-all-filters':
          schema.action = 'remove'
          schema.text = 'Clear all filters'
          break

        case 'update-sort':
          schema.action = 'sort'
          schema.section = 'Sort by'
          break
      }
      return schema
    },

    // Takes a filter section's div, and grabs the index value from it.
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
