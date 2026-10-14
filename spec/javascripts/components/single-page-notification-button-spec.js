/* eslint-env jasmine */
/* global GOVUK */

describe('Single page notification component', function () {
  var container

  function createFixture (dataAttributes = '') {
    container = document.createElement('div')
    container.innerHTML = `
      <div class="gem-c-single-page-notification-button js-personalisation-enhancement" data-module="single-page-notification-button" ${dataAttributes}>
        <form action="/email/subscriptions/single-page/new" method="POST">
          <input type="hidden" name="base_path" value="/current-page-path">
          <button class="gem-c-button__outline gem-c-button__outline--notification" type="submit">Get emails about this page</button>
        </form>
      </div>
    `
    document.body.appendChild(container)
    jasmine.Ajax.install()
  }

  afterEach(function () {
    document.body.removeChild(container)
    jasmine.Ajax.uninstall()
  })

  it('calls the personalisation API on load', function () {
    createFixture()
    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path')
    expect(request.method).toBe('GET')
  })

  it('includes button_location in the call to the personalisation API when button_location is specified', function () {
    createFixture('data-button-location="top"')

    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path&button_location=top')
    expect(request.method).toBe('GET')
  })

  it('renders the button visible when API response is received', function () {
    createFixture()
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": false\n }'
    })

    var button = document.querySelector('.gem-c-single-page-notification-button')
    expect(button).toHaveClass('gem-c-single-page-notification-button--visible')
  })

  it('renders custom subscribe button text when API response is received if "data-button-text-subscribe" and "data-button-text-unsubscribe" are set', function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)

    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": false\n }'
    })

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Start getting emails about this stuff')
  })

  it('renders custom unsubscribe button text when API response is received if "data-button-text-subscribe" and "data-button-text-unsubscribe" are set', function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": true\n }'
    })

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Stop getting emails about this stuff')
  })

  it('should remain unchanged if the response is not JSON', function () {
    var responseText = 'I am not JSON, actually'
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: responseText
    })

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if response text is empty', function () {
    var responseText = ''
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: responseText
    })

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if the endpoint fails', function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'text/plain',
      responseText: ''
    })

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Get emails about this page')
  })

  it('should remain unchanged if xhr times out', function () {
    jasmine.clock().install()
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    initButton()
    jasmine.Ajax.requests.mostRecent().responseTimeout()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Get emails about this page')
    jasmine.clock().uninstall()
  })

  function initButton () {
    var element = document.querySelector('[data-module=single-page-notification-button]')
    new GOVUK.Modules.SinglePageNotificationButton(element).init()
  }
})
