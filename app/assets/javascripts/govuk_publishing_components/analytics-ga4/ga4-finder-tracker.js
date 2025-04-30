;(function (global) {
  'use strict'

  const GOVUK = global.GOVUK || {}
  GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}

  GOVUK.analyticsGa4.Ga4FinderTracker = {
    // Called when the search results updates. Takes the event target, and a string containing the type of change and element type. Creates the GTM schema and pushes it.
    // changeEventMetadata is a string referring to the type of form change and the element type that triggered it. For example 'update-filter checkbox'.
    trackChangeEvent: function (event) {
      const eventTarget = event.target
      let changeEventMetadata = eventTarget.closest('[data-ga4-change-category]')

      if (!changeEventMetadata) {
        return
      }

      changeEventMetadata = changeEventMetadata.dataset.ga4ChangeCategory
      changeEventMetadata = changeEventMetadata.split(' ')

      const filterParent = eventTarget.closest('[data-ga4-filter-parent]')
      const section = eventTarget.closest('[data-ga4-section]')
      const changeType = changeEventMetadata[0]
      const elementType = changeEventMetadata[1]

      if ((!changeType || !elementType) && changeType !== 'clear-all-filters') {
        console.warn('GA4 Finder tracker incorrectly configured for element: ' + eventTarget)
        return
      }

      let data = {}
      data.type = 'finder'
      data.event_name = 'select_content'

      const elementInfo = this.getElementInfo(event, elementType)
      if (!elementInfo) {
        return
      }
      const elementValue = elementInfo.elementValue
      data.text = elementValue
      const wasFilterRemoved = elementInfo.wasFilterRemoved
      data = this.setSchemaBasedOnChangeType(data, elementValue, elementType, wasFilterRemoved, changeType, section, filterParent)

      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    },

    // Grabs the value from the eventTarget. Checks if the filter was removed if the eventTarget is unchecked, set back to default, or has its user input removed. Returns the results as an object.
    getElementInfo: function (event, elementType) {
      const supportedElements = Object.assign(Object.assign({}, this.defaultSupportedElements), this.extraSupportedElements || {})

      return supportedElements[elementType] ? supportedElements[elementType](event.target, event) : { elementValue: '', wasFilterRemoved: false }
    },

    // Takes the GTM schema, the event target value, the event target HTML type, whether the filter was removed, the type of filter change it was, and the parent section heading. Populates the GTM object based on these values.
    setSchemaBasedOnChangeType: function (schema, elementValue, elementType, wasFilterRemoved, changeType, section, filterParent) {
      switch (changeType) {
        case 'update-filter': {
          if (section) {
            schema.section = section.getAttribute('data-ga4-section')
          }

          const index = this.getSectionIndex(filterParent)
          if (wasFilterRemoved) {
            schema.action = 'remove'
            schema.text = elementType === 'text' ? undefined : elementValue
          } else {
            schema.action = elementType === 'text' ? 'search' : 'select'
          }
          schema.index_link = index.index_link || undefined
          schema.index_section = index.index_section || undefined
          schema.index_section_count = index.index_section_count || undefined
          break
        }
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
        let index = sectionElement.getAttribute('data-ga4-index')
        index = JSON.parse(index)
        return index
      } catch (e) {
        console.error('GA4 configuration error: ' + e.message, window.location)
      }
    },

    defaultSupportedElements: {
      checkbox: (eventTarget) => {
        const checkboxId = eventTarget.id

        return {
          elementValue: document.querySelector("label[for='" + checkboxId + "']").textContent,
          wasFilterRemoved: !eventTarget.checked
        }
      },
      radio: (eventTarget) => {
        const radioId = eventTarget.id

        // The "value" we need for a radio is the label text that the user sees beside the checkbox.
        const elementValue = document.querySelector("label[for='" + radioId + "']").textContent
        const defaultValue = eventTarget.closest('[data-ga4-section]').querySelector('input[type=radio]:first-of-type')

        return {
          elementValue: elementValue,
          wasFilterRemoved: eventTarget.id === defaultValue.id
        }
      },
      select: (eventTarget) => {
        // The value of a <select> is the value attribute of the selected <option>, which is a hyphenated key. We need to grab the human readable label instead for tracking.
        const elementValue = eventTarget.querySelector("option[value='" + eventTarget.value + "']").textContent
        const defaultValue = eventTarget.querySelector('option:first-of-type').textContent

        return {
          elementValue: elementValue,
          wasFilterRemoved: elementValue === defaultValue
        }
      },
      text: (eventTarget) => ({
        elementValue: eventTarget.value,
        wasFilterRemoved: eventTarget.value === ''
      }),
      date: (eventTarget) => {
        // The GOV.UK Design System date input consists of three grouped but separate fields (day,
        // month, year). We want to fire a single event when all three fields are filled in to
        // avoid firing excessive events.
        const inputs = [...eventTarget.closest('.govuk-date-input').querySelectorAll('input')]
        const allInputsSet = inputs.every(input => input.value)
        const noInputsSet = inputs.every(input => !input.value)

        if (!allInputsSet && !noInputsSet) return

        return {
          elementValue: allInputsSet ? inputs.map(input => input.value).join('/') : '',
          wasFilterRemoved: noInputsSet
        }
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
