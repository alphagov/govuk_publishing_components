window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};
(function (Modules) {
  'use strict'
  // Tracks interactions with search forms, including on the all content finder ("site search"),
  // homepage, and the layout super navigation header search.
  class Ga4SearchTracker {
    constructor ($module) {
      this.$module = $module
      this.$searchInput = this.$module.querySelector('input[type="search"]')

      this.type = this.$module.dataset.ga4SearchType
      this.url = this.$module.dataset.ga4SearchUrl
      this.section = this.$module.dataset.ga4SearchSection
      this.indexSection = this.$module.dataset.ga4SearchIndexSection
      this.indexSectionCount = this.$module.dataset.ga4SearchIndexSectionCount
    }

    init () {
      if (!this.$searchInput) {
        console.warn('Ga4SearchTracker: Module added to element without child search input')
        return
      }

      this.initialKeywords = this.$searchInput.value

      if (window.GOVUK.getConsentCookie() && window.GOVUK.getConsentCookie().usage) {
        this.startModule()
      } else {
        window.addEventListener('cookie-consent', () => this.startModule())
      }
    }

    startModule () {
      this.$module.addEventListener('submit', event => this.trackSearch(event))
    }

    trackSearch () {
      // The original search input may have been removed from the DOM by the autocomplete component
      // if it is used, so make sure we are tracking the correct input
      this.$searchInput = this.$module.querySelector('input[type="search"]')

      if (this.skipTracking()) return

      const data = {
        event_name: 'search',
        action: 'search',

        type: this.type,
        section: this.section,
        url: this.url,
        index_section: this.indexSection,
        index_section_count: this.indexSectionCount,
        text: this.standardiseInput(this.$searchInput.value)
      }

      if (this.$searchInput.dataset.autocompleteTriggerInput) {
        // Only set the tool_name if the autocomplete was accepted, but the other autocomplete
        // attributes should be included regardless (that way we can differentiate between users
        // having seen the autocomplete and not used it, and not having seen it at all)
        if (this.$searchInput.dataset.autocompleteAccepted === 'true') {
          data.tool_name = 'autocomplete'

          // Keep track of the fact that the autocomplete was accepted, so that we can use this as
          // part of the `page_view` event on the subsequent page load
          window.sessionStorage &&
            window.sessionStorage.setItem('searchAutocompleteAccepted', 'true')
        } else {
          // Explicitly set `tool_name` to `null` if the user has not accepted a suggestion, as
          // `undefined` will not overwrite the current value in the analytics state (meaning a
          // previously set value would be used if there was one)
          data.tool_name = null
        }

        data.length = Number(this.$searchInput.dataset.autocompleteSuggestionsCount)
        data.autocomplete_input = this.standardiseInput(
          this.$searchInput.dataset.autocompleteTriggerInput
        )
        data.autocomplete_suggestions = this.$searchInput.dataset.autocompleteSuggestions
      }

      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    }

    skipTracking () {
      // Skip tracking for those events that we do not want to track: where the search term is
      // present, but has not changed from its initial value
      return this.$searchInput.value !== '' && this.$searchInput.value === this.initialKeywords
    }

    standardiseInput (value) {
      const { standardiseSearchTerm } = window.GOVUK.analyticsGa4.core.trackFunctions

      // `standardiseSearchTerm` returns undefined for empty strings, whereas we actively want an
      // empty string as part of search events (undefined would not overwrite the current value in
      // the analytics state)
      return standardiseSearchTerm(value) || ''
    }
  }

  Modules.Ga4SearchTracker = Ga4SearchTracker
})(window.GOVUK.Modules)
