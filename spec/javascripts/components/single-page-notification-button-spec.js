/* eslint-env jasmine */
/* global GOVUK */

describe('Single page notification component', function () {
  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = `
      <div data-button-text-subscribe="Get emails about this page" data-button-text-unsubscribe="Stop getting emails about this page" class="gem-c-single-page-notification-button govuk-!-display-none-print govuk-!-margin-bottom-3" data-module="single-page-notification-button">
        <form action="/email/subscriptions/single-page/new" method="POST">
          <input type="hidden" name="base_path" value="/current-page-path">
          <button class="govuk-body-s gem-c-single-page-notification-button__submit" type="submit">
            <span class="gem-c-single-page-notication-button__text">Get emails about this page</span>
        </button>
        </form>
      </div>
    `
    document.body.appendChild(container)
    jasmine.Ajax.install()
  })

  afterEach(function () {
    document.body.removeChild(container)
    jasmine.Ajax.uninstall()
  })

  it('calls the personalisation API on load', function () {
    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path')
    expect(request.method).toBe('GET')
  })

  it('includes button_location in the call to the personalisation API when button_location is specified', function () {
    document.body.removeChild(container)
    container.innerHTML = `
      <form class="gem-c-single-page-notification-button js-personalisation-enhancement" action="/email/subscriptions/single-page/new" method="POST" data-module="single-page-notification-button" data-button-location="top">
        <input type="hidden" name="base_path" value="/current-page-path">
        <button class="gem-c-single-page-notification-button__submit" type="submit">Get emails about this page</button>
      </form>
    `
    document.body.appendChild(container)

    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path&button_location=top')
    expect(request.method).toBe('GET')
  })

  it('renders the button visible when API response is received', function () {
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
    document.body.removeChild(container)
    container.innerHTML = `
      <form class="gem-c-single-page-notification-button js-personalisation-enhancement" action="/email/subscriptions/  single-page/new" method="POST" data-module="single-page-notification-button" data-button-text-subscribe="Start getting emails about this stuff" data-button-text-unsubscribe="Stop getting emails about this stuff">
        <input type="hidden" name="base_path" value="/current-page-path">
        <button class="gem-c-single-page-notification-button__submit" type="submit"><span class="gem-c-single-page-notication-button__text">Get emails about this page</span></button>
      </form>
    `
    document.body.appendChild(container)

    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": false\n }'
    })

    var button = document.querySelector('form.gem-c-single-page-notification-button')
    expect(button.textContent).toContain('Start getting emails about this stuff')
  })

  it('renders custom unsubscribe button text when API response is received if "data-button-text-subscribe" and "data-button-text-unsubscribe" are set', function () {
    document.body.removeChild(container)
    container.innerHTML = `
      <form class="gem-c-single-page-notification-button js-personalisation-enhancement" action="/email/subscriptions/  single-page/new" method="POST" data-module="single-page-notification-button" data-button-text-subscribe="Start getting emails about this stuff" data-button-text-unsubscribe="Stop getting emails about this stuff">
        <input type="hidden" name="base_path" value="/current-page-path">
        <button class="gem-c-single-page-notification-button__submit" type="submit"><span class="gem-c-single-page-notication-button__text">Get emails about this page</span></button>
      </form>
    `
    document.body.appendChild(container)

    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": true\n }'
    })

    var button = document.querySelector('form.gem-c-single-page-notification-button')
    expect(button.textContent).toContain('Stop getting emails about this stuff')
  })

  it('should remain unchanged if the response is not JSON', function () {
    var responseText = 'I am not JSON, actually'
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: responseText
    })

    var button = document.querySelector('.gem-c-single-page-notification-button.gem-c-single-page-notification-button--visible .gem-c-single-page-notification-button__submit')
    expect(button.textContent).toContain('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if response text is empty', function () {
    var responseText = ''
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: responseText
    })

    var button = document.querySelector('.gem-c-single-page-notification-button.gem-c-single-page-notification-button--visible .gem-c-single-page-notification-button__submit')
    expect(button.textContent).toContain('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if the endpoint fails', function () {
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'text/plain',
      responseText: ''
    })

    var button = document.querySelector('.gem-c-single-page-notification-button.gem-c-single-page-notification-button--visible .gem-c-single-page-notification-button__submit')
    expect(button.textContent).toContain('Get emails about this page')
  })

  it('should remain unchanged if xhr times out', function () {
    jasmine.clock().install()
    initButton()
    jasmine.Ajax.requests.mostRecent().responseTimeout()

    var button = document.querySelector('.gem-c-single-page-notification-button.gem-c-single-page-notification-button--visible .gem-c-single-page-notification-button__submit')
    expect(button.textContent).toContain('Get emails about this page')
    jasmine.clock().uninstall()
  })

  function initButton () {
    var element = document.querySelector('[data-module=single-page-notification-button]')
    new GOVUK.Modules.SinglePageNotificationButton(element).init()
  }
})
