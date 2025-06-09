/* eslint-env jasmine */

describe('Google Analytics auto tracker', function () {
  var GOVUK = window.GOVUK
  var element
  var expected

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
  })

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('form')
    document.body.appendChild(element)
    this.agreeToCookies()
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
  })

  afterEach(function () {
    document.body.removeChild(element)
  })

  afterAll(function () {
    window.dataLayer = []
  })

  describe('when the user has a cookie consent choice', function () {
    it('starts the module if consent has already been given', function () {
      this.agreeToCookies()
      var tracker = new GOVUK.Modules.Ga4AutoTracker(element)
      spyOn(tracker, 'startModule').and.callThrough()
      tracker.init()

      expect(tracker.startModule).toHaveBeenCalled()
    })

    it('starts the module on the same page as cookie consent is given', function () {
      this.denyCookies()
      var tracker = new GOVUK.Modules.Ga4AutoTracker(element)
      spyOn(tracker, 'sendEvent').and.callThrough()
      tracker.init()
      expect(tracker.sendEvent).not.toHaveBeenCalled()

      // page has not been reloaded, user consents to cookies
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(tracker.sendEvent).toHaveBeenCalled()

      // consent listener should be removed after triggering
      tracker.sendEvent.calls.reset()
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(tracker.sendEvent).not.toHaveBeenCalled()
    })

    it('does not do anything if consent is not given', function () {
      this.denyCookies()
      var tracker = new GOVUK.Modules.Ga4AutoTracker(element)
      spyOn(tracker, 'sendEvent')
      tracker.init()

      expect(tracker.sendEvent).not.toHaveBeenCalled()
    })
  })

  describe('configuring tracking without any data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-auto', '')
      new GOVUK.Modules.Ga4AutoTracker(element).init()
    })

    it('does not cause an error or fire an event', function () {
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('configuring tracking with incorrect data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-auto', 'invalid json')
      new GOVUK.Modules.Ga4AutoTracker(element).init()
    })

    it('does not cause an error', function () {
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('tracking on page load', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'select_content'
      expected.event_data.type = 'tabs'
      expected.event_data.index = {
        index_section: '7',
        index_link: undefined,
        index_section_count: undefined
      }
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      var attributes = {
        event_name: 'select_content',
        type: 'tabs',
        not_a_schema_attribute: 'something',
        index_section: 7,
        index_link: undefined,
        index_section_count: undefined
      }
      element.setAttribute('data-ga4-auto', JSON.stringify(attributes))
      new GOVUK.Modules.Ga4AutoTracker(element).init()
    })

    it('pushes ga4 attributes to the dataLayer', function () {
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('does not include non-schema data attributes', function () {
      expect(window.dataLayer[0].not_a_schema_attribute).toEqual(undefined)
    })
  })

  describe('PII removal', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'select_content'
      expected.event_data.type = 'tabs'
      expected.event_data.text = '/[date]/[postcode]/[email]'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      var attributes = {
        event_name: 'select_content',
        type: 'tabs',
        text: '/2022-02-02/SW10AA/email@example.com'
      }
      element.setAttribute('data-ga4-auto', JSON.stringify(attributes))
      new GOVUK.Modules.Ga4AutoTracker(element).init()
    })

    it('redacts dates, postcodes and emails from text', function () {
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })
})
