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

      this.searchInputName = this.$module.dataset.ga4SearchInputName
      this.type = this.$module.dataset.ga4SearchType
      this.url = this.$module.dataset.ga4SearchUrl
      this.section = this.$module.dataset.ga4SearchSection
      this.indexSection = this.$module.dataset.ga4SearchIndexSection
      this.indexSectionCount = this.$module.dataset.ga4SearchIndexSectionCount

      // At the beginning, the user has not yet interacted with any form fields
      this.triggeredAction = 'unchanged'
    }

    init () {
      if (!this.$searchInput) {
        console.warn('Ga4SearchTracker: Module added to element without child search input')
        return
      }

      // These event handlers do not send any tracking data, they only set internal state. They are
      // added here so if the user hasn't given consent yet but does so later, we do not end up with
      // inconsistent module state.
      this.$module.addEventListener('change', event => this.setTriggeredAction(event))
      this.$module.addEventListener('input', event => this.setTriggeredAction(event))

      var consentCookie = window.GOVUK.getConsentCookie()

      if (consentCookie?.usage === true || consentCookie?.usage === 'aggregate') {
        this.startModule()
      }
    }

    startModule () {
      this.$module.addEventListener('submit', event => this.trackSearch(event))
    }

    setTriggeredAction (event) {
      if (event.target.type === 'search') {
        // if `searchInputName` set then only set `triggeredAction` to `search`
        // if changed `input[type=search]` matches `input[name=searchInputName]`
        if (this.searchInputName && event.target.name !== this.searchInputName) return
        this.triggeredAction = 'search'
      } else if (this.triggeredAction !== 'search') {
        // The 'search' action always takes precedence over the 'filter' action, so only set the
        // action to 'filter' if it is not already 'search'.
        this.triggeredAction = 'filter'
      }
    }

    trackSearch () {
      // The original search input may have been removed from the DOM by the autocomplete component
      // if it is used, so make sure we are tracking the correct input
      this.$searchInput = this.$module.querySelector('input[type="search"]')

      const data = {
        event_name: 'search',
        action: this.triggeredAction,

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
