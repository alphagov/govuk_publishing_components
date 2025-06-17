/* eslint-env jasmine */

describe('GA4 focus loss tracker', function () {
  var GOVUK = window.GOVUK
  var element
  var expected

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('div')
    document.body.appendChild(element)
    this.agreeToCookies()
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
  })

  afterEach(function () {
    document.body.removeChild(element)
  })

  afterAll(function () {
    GOVUK.setCookie('cookies_policy', null)
    window.dataLayer = []
  })

  describe('when the user has a cookie consent choice', function () {
    it('starts the module if consent has already been given', function () {
      this.agreeToCookies()
      var tracker = new GOVUK.Modules.Ga4FocusLossTracker(element)
      spyOn(tracker, 'startModule').and.callThrough()
      tracker.init()

      expect(tracker.startModule).toHaveBeenCalled()
    })

    it('starts the module on the same page as cookie consent is given', function () {
      this.denyCookies()
      var tracker = new GOVUK.Modules.Ga4FocusLossTracker(element)
      spyOn(tracker, 'startModule').and.callThrough()
      tracker.init()
      expect(tracker.startModule).not.toHaveBeenCalled()

      // page has not been reloaded, user consents to cookies
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(tracker.startModule).toHaveBeenCalled()

      // consent listener should be removed after triggering
      tracker.startModule.calls.reset()
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(tracker.startModule).not.toHaveBeenCalled()
    })

    it('does not do anything if consent is not given', function () {
      this.denyCookies()
      var tracker = new GOVUK.Modules.Ga4FocusLossTracker(element)
      spyOn(tracker, 'startModule')
      tracker.init()

      expect(tracker.startModule).not.toHaveBeenCalled()
    })
  })

  describe('configuring tracking without any data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-focus-loss', '')
      new GOVUK.Modules.Ga4FocusLossTracker(element).init()
    })

    it('does not cause an error or fire an event', function () {
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('configuring tracking with incorrect data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-focus-loss', 'invalid json')
      new GOVUK.Modules.Ga4FocusLossTracker(element).init()
    })

    it('does not cause an error', function () {
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('tracking on focus loss', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'filter'
      expected.event_data.type = 'filter'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      var attributes = {
        event_name: 'filter',
        type: 'filter',
        not_a_schema_attribute: 'something'
      }
      element.setAttribute('data-ga4-focus-loss', JSON.stringify(attributes))
      new GOVUK.Modules.Ga4FocusLossTracker(element).init()
    })

    it('pushes ga4 attributes to the dataLayer when the element is focussed on, and then focus changes', function () {
      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
      expect(window.dataLayer[0].not_a_schema_attribute).toEqual(undefined)
    })

    it('doesnt do anything when focus is moved around within the element', function () {
      var child1 = document.createElement('a')
      var child2 = document.createElement('a')
      element.appendChild(child1)
      element.appendChild(child2)

      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(child1, 'focus')
      window.GOVUK.triggerEvent(child1, 'blur')
      window.GOVUK.triggerEvent(child2, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('automatically grabs text or search input type values', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'filter'
      expected.event_data.type = 'filter'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      var attributes = {
        event_name: 'filter',
        type: 'filter',
        not_a_schema_attribute: 'something'
      }
      document.body.removeChild(element)
      element = document.createElement('input')
      element.setAttribute('data-ga4-focus-loss', JSON.stringify(attributes))
      document.body.appendChild(element)

      new GOVUK.Modules.Ga4FocusLossTracker(element).init()
    })

    it('pushes the current text input to the dataLayer', function () {
      element.setAttribute('type', 'text')
      element.value = 'green tea'
      expected.event_data.text = 'green tea'

      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('pushes the current search input to the dataLayer', function () {
      element.setAttribute('type', 'search')
      element.value = 'black tea'
      expected.event_data.text = 'black tea'

      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('should remove extra spaces from the input', function () {
      element.setAttribute('type', 'search')
      element.value = '        black       tea              '
      expected.event_data.text = 'black tea'

      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('should set the input text to lowercase', function () {
      element.setAttribute('type', 'search')
      element.value = 'BLACK TEA'
      expected.event_data.text = 'black tea'

      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('PII removal', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'filter'
      expected.event_data.type = 'filter'
      expected.event_data.text = '/[date]/[postcode]/[email]'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      var attributes = {
        event_name: 'filter',
        type: 'filter',
        text: '/2022-02-02/SW10AA/email@example.com'
      }
      element.setAttribute('data-ga4-focus-loss', JSON.stringify(attributes))
      new GOVUK.Modules.Ga4FocusLossTracker(element).init()
    })

    it('redacts dates, postcodes and emails from text', function () {
      window.GOVUK.triggerEvent(element, 'focus')
      expect(window.dataLayer[0]).toEqual(undefined)
      window.GOVUK.triggerEvent(element, 'blur')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })
})
