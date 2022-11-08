/* eslint-env jasmine */

describe('Google Analytics event tracking', function () {
  var GOVUK = window.GOVUK
  var element
  var expected

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  function denyCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
  }

  beforeAll(function () {
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
  })

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('div')
    agreeToCookies()
  })

  afterEach(function () {
    document.body.removeChild(element)
  })

  afterAll(function () {
    window.dataLayer = []
  })

  describe('when the user has a cookie consent choice', function () {
    it('starts the module if consent has already been given', function () {
      agreeToCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4EventTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).toHaveBeenCalled()
    })

    it('starts the module on the same page as cookie consent is given', function () {
      denyCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4EventTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).not.toHaveBeenCalled()

      // page has not been reloaded, user consents to cookies
      window.GOVUK.triggerEvent(window, 'cookie-consent')

      element.click()
      expect(tracker.trackClick).toHaveBeenCalled()
    })

    it('does not do anything if consent is not given', function () {
      denyCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4EventTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).not.toHaveBeenCalled()
    })
  })

  describe('configuring tracking without any data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-event', '')
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('does not cause an error or fire an event', function () {
      element.click()
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('configuring tracking with incorrect data', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-event', 'invalid json')
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('does not cause an error', function () {
      element.click()
      expect(window.dataLayer[0]).toEqual(undefined)
    })
  })

  describe('doing simple tracking on a single element', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'select_content'
      expected.event_data.type = 'tabs'
      expected.govuk_gem_version = 'aVersion'

      var attributes = {
        event_name: 'select_content',
        type: 'tabs',
        not_a_schema_attribute: 'something'
      }
      element.setAttribute('data-ga4-event', JSON.stringify(attributes))
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('pushes ga4 attributes to the dataLayer', function () {
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
      expected1 = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected1.event = 'event_data'
      expected1.event_data.event_name = 'event1-name'
      expected1.govuk_gem_version = 'aVersion'

      expected2 = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected2.event = 'event_data'
      expected2.event_data.event_name = 'event2-name'
      expected2.govuk_gem_version = 'aVersion'

      var attributes1 = {
        event_name: 'event1-name'
      }
      var attributes2 = {
        event_name: 'event2-name'
      }

      element.innerHTML =
        '<div data-ga4-event=\'' + JSON.stringify(attributes1) + '\'' +
          'class="clickme"' +
        '></div>' +
        '<div data-ga4-event=\'' + JSON.stringify(attributes2) + '\'' +
          'class="clickme"' +
        '></div>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('pushes ga4 attributes to the dataLayer', function () {
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
      element.setAttribute('data-ga4-event', JSON.stringify(attributes))
      element.setAttribute('aria-expanded', 'false')
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('includes the expanded state in the ga4 attributes', function () {
      element.click()

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.text = 'some text'
      expected.govuk_gem_version = 'aVersion'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.text = 'some text'
      expected.govuk_gem_version = 'aVersion'

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
        '<details data-ga4-event=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('includes the open state in the ga4 attributes', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.text = 'some text'
      expected.govuk_gem_version = 'aVersion'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.text = 'some text'
      expected.govuk_gem_version = 'aVersion'

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
        '<div data-ga4-event=\'' + JSON.stringify(attributes) + '\'' +
          'class="gem-c-accordion"' +
        '>' +
          '<button aria-expanded="false">Show</button>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('includes the expanded state in the ga4 attributes', function () {
      var clickOn = element.querySelector('.gem-c-accordion')
      clickOn.click()

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Show'
      expected.govuk_gem_version = 'aVersion'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Hide'
      expected.govuk_gem_version = 'aVersion'

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
        '<details data-ga4-event=\'' + JSON.stringify(attributes) + '\'' +
          'class="clickme"' +
        '>' +
          '<summary class="nested">Example</summary>' +
        '</details>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('includes the open state in the ga4 attributes', function () {
      var clickOn = element.querySelector('.nested')
      clickOn.click()

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'opened'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Example'
      expected.govuk_gem_version = 'aVersion'

      expect(window.dataLayer[0]).toEqual(expected)

      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.action = 'closed'
      expected.event_data.event_name = 'event-name'
      expected.event_data.text = 'Example'
      expected.govuk_gem_version = 'aVersion'

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
        '<div data-ga4-event=\'' + JSON.stringify(attributes) + '\' class="clickme">' +
          '<div class="content">Content</div>' +
          '<div class="gem-c-accordion">' +
            '<button aria-expanded="false">Show</button>' +
          '</div>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('should not track the aria-expanded state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].event_data.action).toEqual(undefined)
    })
  })

  describe('doing tracking on an clicked parent element containing a details element', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<div data-ga4-event=\'' + JSON.stringify(attributes) + '\' class="clickme">' +
          '<div class="content">Content</div>' +
          '<details>' +
            'Details element' +
          '</details>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('should not track the open/closed state', function () {
      var clickOn = element.querySelector('.clickme')
      clickOn.click()
      expect(window.dataLayer[0].event_data.action).toEqual(undefined)
    })
  })

  describe('doing tracking on tab clicks', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'event-name'
      }
      element.innerHTML =
        '<div data-ga4-event=\'' + JSON.stringify(attributes) + '\' class="clickme">' +
          '<div class="gem-c-tabs">' +
              '<ul>' +
              '<li> <a href="#tab-location-1" class="tab-1">Tab 1</a> </li>' +
              '<li> <a href="#tab-location-2" class="tab-2">Tab 2</a> </li>' +
              '<li> <p class="random-list-item">Not a link</p> </li>' +
              '</ul>' +
          '</div>' +
        '</div>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('should track tab click url locations', function () {
      var clickOn = element.querySelector('.tab-1')
      clickOn.click()
      expect(window.dataLayer[0].event_data.url).toEqual('#tab-location-1')

      window.dataLayer = []
      clickOn = element.querySelector('.tab-2')
      clickOn.click()
      expect(window.dataLayer[0].event_data.url).toEqual('#tab-location-2')

      window.dataLayer = []
      clickOn = element.querySelector('.random-list-item')
      clickOn.click()
      expect(window.dataLayer[0].event_data.url).toEqual(undefined)
    })
  })

  describe('doing tracking on the feedback component', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'form_submit',
        type: 'feedback',
        text: 'Yes',
        section: 'Is this page useful?'
      }
      element.innerHTML =
        '<div data-module="ga4-event-tracker">' +
      '</div>'

      var yesButton = document.createElement('button')
      yesButton.setAttribute('data-ga4-event', JSON.stringify(attributes))
      yesButton.id = 'yesButton'

      attributes.text = 'No'
      var noButton = document.createElement('button')
      noButton.setAttribute('data-ga4-event', JSON.stringify(attributes))
      noButton.id = 'noButton'

      element.appendChild(yesButton)
      element.appendChild(noButton)

      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()

      window.dataLayer = []
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'form_submit'
      expected.event_data.type = 'feedback'
      expected.event_data.section = 'Is this page useful?'
      expected.govuk_gem_version = 'aVersion'
    })

    it('should track "Yes" button clicks', function () {
      expected.event_data.text = 'Yes'

      var yesButton = document.querySelector('#yesButton')
      yesButton.click()
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('should track "No" button clicks', function () {
      expected.event_data.text = 'No'

      var noButton = document.querySelector('#noButton')
      noButton.click()
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('doing tracking on an data-ga4-expandable element', function () {
    beforeEach(function () {
      element.innerHTML = '<header data-module="ga4-event-tracker" data-ga4-expandable><nav>' +
      '<button aria-expanded="false">Menu</button>' +
      '<ul><li><button aria-expanded="false"">Topics</button></li>' +
      '<li><button aria-expanded="false">Government activity</button></li></ul>' +
      '<button aria-expanded="false">Search</button>' +
      '</nav></header>'
      document.body.appendChild(element)
      new GOVUK.Modules.Ga4EventTracker(element).init()
    })

    it('tracks expanding/collapsing sections under the data-ga4-expandable attribute', function () {
      var expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'select_content'
      expected.event_data.type = 'header menu bar'
      expected.govuk_gem_version = 'aVersion'
      var buttons = document.querySelectorAll('button')
      expected.event_data.index_total = buttons.length

      for (var i = 0; i < buttons.length; i++) {
        window.dataLayer = []
        var button = buttons[i]
        button.setAttribute('data-ga4-event', JSON.stringify({
          event_name: 'select_content',
          type: 'header menu bar',
          text: button.textContent,
          section: button.textContent,
          index: i + 1,
          index_total: buttons.length
        }))

        button.click()
        expected.event_data.action = 'opened'
        expected.event_data.text = button.textContent
        expected.event_data.section = button.textContent
        expected.event_data.index = i + 1
        expect(window.dataLayer[0]).toEqual(expected)
        button.setAttribute('aria-expanded', 'true')
        expected.event_data.action = 'closed'
        button.click()
        expect(window.dataLayer[1]).toEqual(expected)
      }
    })
  })
})
