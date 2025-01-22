window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};
(function (Modules) {
  'use strict'
  // Tracks interactions with search forms, including on the all content finder ("site search"),
  // homepage, and the layout super navigation header search.
  class Ga4SearchTracker {
    constructor ($module) {
      this.$module = $module

      const searchInput = $module.querySelector('input[type="search"]')
      this.$searchInput = searchInput

      this.type = this.$module.dataset.ga4SearchType
      this.url = this.$module.dataset.ga4SearchUrl
      this.section = this.$module.dataset.ga4SearchSection
      this.indexSection = this.$module.dataset.ga4SearchIndexSection
      this.indexSectionCount = this.$module.dataset.ga4SearchIndexSectionCount

      this.triggerSearchAction = false
      this.triggerFilterAction = false
    }

    init () {
      if (!this.$searchInput) {
        console.warn('Ga4SearchTracker: Module added to element without child search input')
        return
      }

      // We only want to trigger search events if the user has interacted with the form in some way.
      // The only exception to this is if the search term was empty to begin with, in which case we
      // want to track the event regardless.
      this.triggerSearchAction = this.$searchInput.value.trim().length > 0
      this.$module.addEventListener('change', event => this.handleChange(event))
      this.$module.addEventListener('input', event => this.handleChange(event))

      if (window.GOVUK.getConsentCookie() && window.GOVUK.getConsentCookie().usage) {
        this.startModule()
      } else {
        window.addEventListener('cookie-consent', () => this.startModule())
      }
    }

    startModule () {
      this.$module.addEventListener('submit', event => this.trackSearch(event))
    }

    handleChange(event) {
      if (event.target.type === 'search') {
        this.triggerSearchAction = true
      } else {
        this.triggerFilterAction = true
      }
    }

    trackSearch () {
      if (!this.triggerSearchAction && !this.triggerFilterAction) {
        // Do not track an event if no changes have been made and the user is just re-submitting the
        // same search
        return
      }

      // The original search input may have been removed from the DOM by the autocomplete component
      // if it is used, so make sure we are tracking the correct input
      this.$searchInput = this.$module.querySelector('input[type="search"]')

      const data = {
        event_name: 'search',
        action: this.triggerSearchAction ? 'search' : 'filter',

        type: this.type,
        section: this.section,
        url: this.url,
        index_section: this.indexSection,
        index_section_count: this.indexSectionCount,
        text: this.searchTerm()
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
        data.autocomplete_input = this.$searchInput.dataset.autocompleteTriggerInput
        data.autocomplete_suggestions = this.$searchInput.dataset.autocompleteSuggestions
      }

      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    }

    searchTerm () {
      const { standardiseSearchTerm } = window.GOVUK.analyticsGa4.core.trackFunctions

      // `standardiseSearchTerm` returns undefined for empty strings, whereas we actively want an
      // empty string as part of search events (undefined would not overwrite the current value in
      // the analytics state)
      return standardiseSearchTerm(this.$searchInput.value) || ''
    }
  }

  Modules.Ga4SearchTracker = Ga4SearchTracker
})(window.GOVUK.Modules)
