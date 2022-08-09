/* eslint-env jasmine */

describe('Google Tag Manager click tracking', function () {
  var GOVUK = window.GOVUK
  var element
  var expected

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('div')
  })

  afterEach(function () {
    document.body.removeChild(element)
  })

  describe('configuring tracking without any data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4', '')
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('does not cause an error or fire an event', function () {
      element.click()
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('configuring tracking with incorrect data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4', 'invalid json')
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('does not cause an error', function () {
      element.click()
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('doing simple tracking on a single element', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'select_content'
      expected.event_data.type = 'tabs'

      var attributes = {
        event_name: 'select_content',
        type: 'tabs',
        not_a_schema_attribute: 'something'
      }
      element.setAttribute('data-ga4', JSON.stringify(attributes))
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('pushes gtm attributes to the dataLayer', function () {
      element.click()
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('does not include non-schema data attributes', function () {
      element.click()
      expect(window.dataLayer[0].not_a_schema_attribute).toEqual(undefined)
    })
  })

  describe('doing simple tracking on multiple elements', function () {
    var expected1
    var expected2

    beforeEach(function () {
      expected1 = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected1.event = 'event_data'
      expected1.event_data.event_name = 'event1-name'

      expected2 = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected2.event = 'event_data'
      expected2.event_data.event_name = 'event2-name'

      var attributes1 = {
        event_name: 'event1-name'
      }
      var attributes2 = {
        event_name: 'event2-name'
      }

      element.innerHTML =
        '<div data-gtm-event-name="event1-name"' +
          'data-ga4=\'' + JSON.stringify(attributes1) + '\'' +
          'class="clickme"' +
        '></div>' +
        '<div data-gtm-event-name="event2-name"' +
          'data-ga4=\'' + JSON.stringify(attributes2) + '\'' +
          'class="clickme"' +
        '></div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('pushes gtm attributes to the dataLayer', function () {
      var clickOn = element.querySelectorAll('.clickme')
      for (var i = 0; i < clickOn.length; i++) {
        clickOn[i].click()
      }
      expected = [expected1, expected2]
      expect(window.dataLayer).toEqual(expected)
    })
  })

  describe('doing tracking on an expandable element', function () {
    beforeEach(function () {
      var attributes = {
        text: 'some text'
      }
      element.classList.add('gem-c-accordion')
      element.setAttribute('data-ga4', JSON.stringify(attributes))
      element.setAttribute('aria-expanded', 'false')
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('includes the expanded state in the gtm attributes', function () {
      element.click()

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.text = 'some text'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.text = 'some text'

      element.setAttribute('aria-expanded', 'true')
      element.click()
      expect(window.dataLayer[1]).toEqual(expected)
    })
  })

  describe('doing tracking on a details element', function () {
    beforeEach(function () {
      var attributes = {
        text: 'some text'
      }
      element.innerHTML =
        '<details data-gtm-event-name="event3-name"' +
          'data-ga4=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('includes the open state in the gtm attributes', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.text = 'some text'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.text = 'some text'

      clickOn.setAttribute('open', '')
      clickOn.click()
      expect(window.dataLayer[1]).toEqual(expected)
    })
  })

  describe('doing tracking on an accordion element that contains an expandable element', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<div data-ga4=\'' + JSON.stringify(attributes) + '\'' +
          'class="gem-c-accordion"' +
        '>' +
          '<button aria-expanded="false">Show</button>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('includes the expanded state in the gtm attributes', function () {
      var clickOn = element.querySelector('.gem-c-accordion')
      clickOn.click()

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Show'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Hide'

      element.querySelector('[aria-expanded]').setAttribute('aria-expanded', 'true')
      element.querySelector('button').textContent = 'Hide'
      clickOn.click()

      expect(window.dataLayer[1]).toEqual(expected)
    })
  })

  describe('doing tracking on an details element summary click', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<details data-ga4=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
          '<summary class="nested">Example</summary>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('includes the open state in the gtm attributes', function () {
      var clickOn = element.querySelector('.nested')
      clickOn.click()

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Example'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Example'

      element.setAttribute('open', '')
      clickOn.click()

      expect(window.dataLayer[1]).toEqual(expected)
    })
  })

  describe('doing tracking on an clicked parent element containing a nested accordion', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<div data-ga4=\'' + JSON.stringify(attributes) + '\' class="clickme">' +
          '<div class="content">Content</div>' +
          '<div class="gem-c-accordion">' +
            '<button aria-expanded="false">Show</button>' +
          '</div>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('should not track the aria-expanded state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].event_data.action).toEqual(null)
    })
  })

  describe('doing tracking on an clicked parent element containing a details element', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<div data-ga4=\'' + JSON.stringify(attributes) + '\' class="clickme">' +
          '<div class="content">Content</div>' +
          '<details>' +
            'Details element' +
          '</details>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmEventClickTracker(element).init()
    })

    it('should not track the open/closed state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].event_data.action).toEqual(null)
    })
  })
})
