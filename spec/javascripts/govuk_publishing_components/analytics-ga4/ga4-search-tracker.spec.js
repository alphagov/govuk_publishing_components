/* eslint-env jasmine */

describe('Google Analytics search tracking', () => {
  'use strict'

  let fixture, form, searchInput, filterInput, sendSpy, setItemSpy, ga4SearchTracker
  const GOVUK = window.GOVUK

  const html = `
    <form
      data-module="ga4-search-tracker"
      data-ga4-search-type="site search"
      data-ga4-search-url="/search"
      data-ga4-search-section="section"
      data-ga4-search-index-section="19"
      data-ga4-search-index-section-count="89"
    >
      <input type="search" name="keyword" value="initial value">
      <input type="text" name="foo" value="bar">
      <button type="submit">Search</button>
    </form>
  `

  const commonEventProps = {
    type: 'site search',
    section: 'section',
    url: '/search',
    index_section: '19',
    index_section_count: '89'
  }

  beforeAll(() => {
    GOVUK.analyticsGa4 = GOVUK.analyticsGa4 || {}
    GOVUK.analyticsGa4.vars = GOVUK.analyticsGa4.vars || {}
    GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
  })

  afterAll(() => {
    window.dataLayer = []
  })

  beforeEach(() => {
    fixture = document.createElement('div')
    document.body.appendChild(fixture)
    fixture.innerHTML = html

    form = fixture.querySelector('form')
    searchInput = form.querySelector('input[name="keyword"]')
    filterInput = form.querySelector('input[name="foo"]')

    sendSpy = spyOn(GOVUK.analyticsGa4.core, 'applySchemaAndSendData')
    setItemSpy = spyOn(window.sessionStorage, 'setItem')

    ga4SearchTracker = new GOVUK.Modules.Ga4SearchTracker(form)
  })

  afterEach(() => {
    fixture.remove()
  })

  describe('if the search field is missing', () => {
    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: true })

      form.removeChild(searchInput)
      ga4SearchTracker = new GOVUK.Modules.Ga4SearchTracker(form)
      ga4SearchTracker.init()
    })

    it('does not track search events', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).not.toHaveBeenCalled()
    })
  })

  describe('if data-ga4-tracked-search is defined', () => {
    const ga4SearchInputName = 'tracked-search-name'

    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: true })

      form.dataset.ga4SearchInputName = ga4SearchInputName

      ga4SearchTracker = new GOVUK.Modules.Ga4SearchTracker(form)
      ga4SearchTracker.init()
    })

    it('tracks search events as `search` action when change occurs on tracked search', () => {
      searchInput.name = ga4SearchInputName
      searchInput.value = 'new value'
      GOVUK.triggerEvent(filterInput, 'input', { target: filterInput })
      GOVUK.triggerEvent(searchInput, 'input', { target: searchInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'search',
          text: 'new value',
          ...commonEventProps
        },
        'event_data'
      )
    })

    it('does not track search events as `search` action when change occurs on untracked search', () => {
      searchInput.value = 'new value'
      GOVUK.triggerEvent(filterInput, 'input', { target: filterInput })
      GOVUK.triggerEvent(searchInput, 'input', { target: searchInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'filter',
          text: 'new value',
          ...commonEventProps
        },
        'event_data'
      )
    })
  })

  describe('when usage tracking is declined', () => {
    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: false })
      ga4SearchTracker.init()
    })

    it('does not track search events', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).not.toHaveBeenCalled()
    })
  })

  describe('when usage tracking is accepted', () => {
    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: true })
      ga4SearchTracker.init()
    })

    it('tracks search events as `search` action when the keyword input changes', () => {
      searchInput.value = 'new value'
      GOVUK.triggerEvent(searchInput, 'input', { target: searchInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'search',
          text: 'new value',
          ...commonEventProps
        },
        'event_data'
      )
    })

    it('tracks search events as `filter` action when non-keyword input changes', () => {
      filterInput.value = 'new value'
      GOVUK.triggerEvent(filterInput, 'input', { target: filterInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'filter',
          text: 'initial value',
          ...commonEventProps
        },
        'event_data'
      )
    })

    it('tracks search events as `unchanged` action when nothing changes', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'unchanged',
          text: 'initial value',
          ...commonEventProps
        },
        'event_data'
      )
    })

    it('includes autocomplete information if present', () => {
      searchInput.dataset.autocompleteTriggerInput = 'i want to'
      searchInput.dataset.autocompleteSuggestions = 'i want to fish|i want to dance|i want to sleep'
      searchInput.dataset.autocompleteSuggestionsCount = '3'
      searchInput.dataset.autocompleteAccepted = 'true'

      searchInput.value = 'i want to fish'
      GOVUK.triggerEvent(searchInput, 'input', { target: searchInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'search',
          text: 'i want to fish',
          tool_name: 'autocomplete',
          length: 3,
          autocomplete_input: 'i want to',
          autocomplete_suggestions: 'i want to fish|i want to dance|i want to sleep',
          ...commonEventProps
        },
        'event_data'
      )
    })

    it('persists usage of autocomplete so that the next page knows it was used', () => {
      searchInput.dataset.autocompleteTriggerInput = 'i want to remember'
      searchInput.dataset.autocompleteAccepted = 'true'
      searchInput.value = 'i want to remember'

      GOVUK.triggerEvent(form, 'submit')
      expect(setItemSpy).toHaveBeenCalledWith('searchAutocompleteAccepted', 'true')
    })

    it('sets tool_name to null if the user has not accepted a suggestion', () => {
      searchInput.dataset.autocompleteTriggerInput = 'i want to'
      searchInput.dataset.autocompleteSuggestions = 'i want to fish|i want to dance|i want to sleep'
      searchInput.dataset.autocompleteSuggestionsCount = '3'

      searchInput.value = 'i want to fish'
      GOVUK.triggerEvent(searchInput, 'input', { target: searchInput })
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy.calls.mostRecent().args[0].tool_name).toBeNull()
    })
  })
})
