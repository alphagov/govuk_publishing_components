/* eslint-env jasmine */

describe('Google Analytics search tracking', () => {
  'use strict'

  let fixture, form, input, sendSpy, ga4SearchTracker
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
      <button type="submit">Search</button>
    </form>
  `

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
    input = form.querySelector('input')

    sendSpy = spyOn(GOVUK.analyticsGa4.core, 'applySchemaAndSendData')

    ga4SearchTracker = new GOVUK.Modules.Ga4SearchTracker(form)
  })

  afterEach(() => {
    fixture.remove()
  })

  describe('if the search field is missing', () => {
    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: true })

      form.removeChild(input)
      ga4SearchTracker = new GOVUK.Modules.Ga4SearchTracker(form)
      ga4SearchTracker.init()
    })

    it('does not track search events', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).not.toHaveBeenCalled()
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

    it('tracks search events when the input changes', () => {
      input.value = 'new value'
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'search',
          type: 'site search',
          section: 'section',
          url: '/search',
          index_section: '19',
          index_section_count: '89',
          text: 'new value'
        },
        'event_data'
      )
    })

    it('does not track search events when the input does not change', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).not.toHaveBeenCalled()
    })
  })

  describe('when the input is originally empty', () => {
    beforeEach(() => {
      GOVUK.setConsentCookie({ usage: true })
      input.value = ''
      ga4SearchTracker.init()
    })

    it('tracks search events even if the (empty) input is unchanged', () => {
      GOVUK.triggerEvent(form, 'submit')

      expect(sendSpy).toHaveBeenCalledWith(
        {
          event_name: 'search',
          action: 'search',
          type: 'site search',
          section: 'section',
          url: '/search',
          index_section: '19',
          index_section_count: '89',
          text: ''
        },
        'event_data'
      )
    })
  })
})
