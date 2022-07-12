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
    window.location.hash = ''
  })

  describe('configuring tracking incompletely', function () {
    beforeEach(function () {
      element.setAttribute('data-gtm-event-name', 'event-name')
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('does not cause an error', function () {
      element.click()
      var expected = {
        event: 'analytics',
        event_name: 'event-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {}
      }
      expect(window.dataLayer[0]).toEqual(expected)
    })
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

    it('gets the full URL including a hash', function () {
      var currentUrl = window.location.href.substring(window.location.origin.length)
      // fix a bug where running the test in a browser more than once left a
      // dangling # that broke the expected URL - would be (url)##myhash
      var lastChar = currentUrl.substr(currentUrl.length - 1)
      if (lastChar === '#') {
        currentUrl = currentUrl.slice(0, -1)
      }
      window.location.hash = 'myhash'

      element.click()
      var expected = {
        event: 'analytics',
        event_name: 'event-name',
        link_url: currentUrl + '#myhash',
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
        'test-3-2': 'test 3-2 value',
        text: 'some text'
      }
      element.classList.add('gem-c-accordion')
      element.setAttribute('data-gtm-event-name', 'event3-name')
      element.setAttribute('data-gtm-attributes', JSON.stringify(attributes))
      element.setAttribute('aria-expanded', 'false')
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('includes the expanded state in the gtm attributes', function () {
      element.click()

      var expectedFirst = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'opened',
          text: 'some text'
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
          state: 'closed',
          text: 'some text'
        }
      }
      element.setAttribute('aria-expanded', 'true')
      element.click()
      expect(window.dataLayer).toEqual([expectedFirst, expectedSecond])
    })
  })

  describe('doing tracking on a details element', function () {
    beforeEach(function () {
      var attributes = {
        'test-3-1': 'test 3-1 value',
        'test-3-2': 'test 3-2 value',
        text: 'some text'
      }
      element.innerHTML =
        '<details data-gtm-event-name="event3-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('includes the open state in the gtm attributes', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()

      var expectedFirst = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'opened',
          text: 'some text'
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
          state: 'closed',
          text: 'some text'
        }
      }
      clickOn.setAttribute('open', '')
      clickOn.click()
      expect(window.dataLayer).toEqual([expectedFirst, expectedSecond])
    })
  })

  describe('doing tracking on an accordion element that contains an expandable element', function () {
    beforeEach(function () {
      var attributes = {
        'test-3-1': 'test 3-1 value',
        'test-3-2': 'test 3-2 value'
      }
      element.innerHTML =
        '<div data-gtm-event-name="event3-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes) + '\'' +
          'class="gem-c-accordion"' +
        '>' +
          '<button aria-expanded="false">Show</button>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('includes the expanded state in the gtm attributes', function () {
      var clickOn = element.querySelector('.gem-c-accordion')
      clickOn.click()

      var expectedFirst = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'opened',
          text: 'Show'
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
          state: 'closed',
          text: 'Hide'
        }
      }
      element.querySelector('[aria-expanded]').setAttribute('aria-expanded', 'true')
      element.querySelector('button').textContent = 'Hide'
      clickOn.click()
      expect(window.dataLayer).toEqual([expectedFirst, expectedSecond])
    })
  })

  describe('doing tracking on an details element summary click', function () {
    beforeEach(function () {
      var attributes = {
        'test-3-1': 'test 3-1 value',
        'test-3-2': 'test 3-2 value'
      }
      element.innerHTML =
        '<details data-gtm-event-name="event3-name"' +
          'data-gtm-attributes=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
          '<summary class="nested">Example</summary>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('includes the open state in the gtm attributes', function () {
      var clickOn = element.querySelector('.nested')
      clickOn.click()

      var expectedFirst = {
        event: 'analytics',
        event_name: 'event3-name',
        link_url: window.location.href.substring(window.location.origin.length),
        ui: {
          'test-3-1': 'test 3-1 value',
          'test-3-2': 'test 3-2 value',
          state: 'opened',
          text: 'Example'
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
          state: 'closed',
          text: 'Example'
        }
      }
      element.setAttribute('open', '')
      clickOn.click()

      expect(window.dataLayer).toEqual([expectedFirst, expectedSecond])
    })
  })

  describe('doing tracking on an clicked parent element containing a nested accordion', function () {
    beforeEach(function () {
      element.innerHTML = `
      <div data-gtm-event-name="event3-name" class="clickme">
        <div class='content'>Content</div>
        <div class='accoridon' class='gem-c-accordion'">
          <button aria-expanded="false">Show</button>
        </div>
      </div>`
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('should not track the aria-expanded state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].ui.state).toEqual(undefined)
    })
  })

  describe('doing tracking on an clicked parent element containing a details element', function () {
    beforeEach(function () {
      element.innerHTML = `
      <div data-gtm-event-name="event3-name" class="clickme">
        <div class='content'>Content</div>
        <details>
          Details element
        </details>
      </div>`
      document.body.appendChild(element)
      new GOVUK.Modules.GtmClickTracking(element).init()
    })

    it('should not track the open/closed state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].ui.state).toEqual(undefined)
    })
  })
})
