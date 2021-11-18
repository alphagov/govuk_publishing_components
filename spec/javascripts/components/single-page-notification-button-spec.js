/* eslint-env jasmine */
/* global GOVUK */

describe('Single page notification component', function () {
  var FIXTURE

  beforeEach(function () {
    FIXTURE =
      '<form class="gem-c-single-page-notification-button old-button-for-test" action="/email/subscriptions/single-page/new" method="POST" data-module="single-page-notification-button">' +
        '<input type="hidden" name="base_path" value="/current-page-path">' +
        '<button class="gem-c-single-page-notification-button__submit" type="submit">Get emails about this page</button>' +
    '</form>'
    window.setFixtures(FIXTURE)
    jasmine.Ajax.install()
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
  })

  it('calls the personalisation API on load', function () {
    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path')
    expect(request.method).toBe('GET')
  })

  it('includes button_location in the call to the personalisation API when button_location is specified', function () {
    FIXTURE =
      '<form class="gem-c-single-page-notification-button old-button-for-test" action="/email/subscriptions/single-page/new" method="POST" data-module="single-page-notification-button" data-button-location="top">' +
        '<input type="hidden" name="base_path" value="/current-page-path">' +
        '<button class="gem-c-single-page-notification-button__submit" type="submit">Get emails about this page</button>' +
      '</form>'
    window.setFixtures(FIXTURE)

    initButton()
    var request = jasmine.Ajax.requests.mostRecent()
    expect(request.url).toBe('/api/personalisation/check-email-subscription?base_path=/current-page-path&button_location=top')
    expect(request.method).toBe('GET')
  })

  it('replaces the button when the API returns button html', function () {
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: '{\n    "base_path": "/current-page-path",\n    "active": true,\n    "button_html": "<form class=\\"gem-c-single-page-notification-button new-button-for-test\\" action=\\"/email/subscriptions/single-page/new\\" method=\\"POST\\">\\n  <input type=\\"hidden\\" name=\\"base_path\\" value=\\"/current-page-path\\">\\n  <button class=\\"gem-c-single-page-notification-button__submit\\" type=\\"submit\\">Stop getting emails about this page\\n</button>\\n</form>"\n}'
    })

    var button = document.querySelector('form.gem-c-single-page-notification-button.new-button-for-test button')
    expect(button).toHaveText('Stop getting emails about this page')
  })

  it('should remain unchanged if the response is not JSON', function () {
    var responseText = 'I am not JSON, actually'
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: responseText
    })

    var button = document.querySelector('form.gem-c-single-page-notification-button.old-button-for-test button')
    expect(button).toHaveText('Get emails about this page')
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

    var button = document.querySelector('form.gem-c-single-page-notification-button.old-button-for-test button')
    expect(button).toHaveText('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if the endpoint fails', function () {
    initButton()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'text/plain',
      responseText: ''
    })

    var button = document.querySelector('form.gem-c-single-page-notification-button.old-button-for-test button')
    expect(button).toHaveText('Get emails about this page')
  })

  function initButton () {
    var element = document.querySelector('[data-module=single-page-notification-button]')
    new GOVUK.Modules.SinglePageNotificationButton(element).init()
  }
})
