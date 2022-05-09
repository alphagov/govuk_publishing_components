/* eslint-env jasmine */

describe('Google Tag Manager click tracking', function () {
  var GOVUK = window.GOVUK
  var element

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('div')
  })

  afterEach(function () {
    document.body.removeChild(element)
  })

  describe('doing simple tracking on a single element', function () {
    beforeEach(function () {
      element.setAttribute('data-gtm-event-name', 'event-name')
      var attributes = {
        'test-1': 'test-1 value',
        'test-2': 'test-2 value'
      }
      element.setAttribute('data-gtm-attributes', JSON.stringify(attributes))
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('pushes gtm attributes to the dataLayer', function () {
      element.click()
      var expected = {
        event: 'analytics',
        event_name: 'event-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-1': 'test-1 value',
          'test-2': 'test-2 value'
        }
      }
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('doing simple tracking on multiple elements', function () {
    beforeEach(function () {
      var attributes1 = {
        'test-1-1': 'test 1-1 value',
        'test-1-2': 'test 1-2 value'
      }
      var attributes2 = {
        'test-2-1': 'test 2-1 value',
        'test-2-2': 'test 2-2 value'
      }
      element.innerHTML =
        '<div data-gtm-event-name="event1-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes1) + '\'' +
          'class="clickme"' +
        '></div>' +
        '<div data-gtm-event-name="event2-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes2) + '\'' +
          'class="clickme"' +
        '></div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('pushes gtm attributes to the dataLayer', function () {
      var clickOn = element.querySelectorAll('.clickme')
      for (var i = 0; i < clickOn.length; i++) {
        clickOn[i].click()
      }
      var expected = [
        {
          event: 'analytics',
          event_name: 'event1-name',
          link_url: window.location.href.substring(window.location.origin.length),
          ui: {
            'test-1-1': 'test 1-1 value',
            'test-1-2': 'test 1-2 value'
          }
        },
        {
          event: 'analytics',
          event_name: 'event2-name',
          link_url: window.location.href.substring(window.location.origin.length),
          ui: {
            'test-2-1': 'test 2-1 value',
            'test-2-2': 'test 2-2 value'
          }
        }
      ]
      expect(window.dataLayer).toEqual(expected)
    })
  })

  describe('doing tracking on an expandable element', function () {
    beforeEach(function () {
      var attributes = {
        'test-3-1': 'test 3-1 value',
        'test-3-2': 'test 3-2 value'
      }
      element.innerHTML =
        '<div data-gtm-event-name="event3-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
          '<button aria-expanded="false">Show</button>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('includes the expanded state in the gtm attributes', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()

      var expectedFirst = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'opened'
        }
      }
      expect(window.dataLayer).toEqual([expectedFirst])

      var expectedSecond = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'closed'
        }
      }
      element.querySelector('[aria-expanded]').setAttribute('aria-expanded', 'true')
      clickOn.click()
      expect(window.dataLayer).toEqual([expectedFirst, expectedSecond])
    })
  })
})
