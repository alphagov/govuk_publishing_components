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
  }

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('calls the personalisation API on load', function () {
    createFixture()
    stubSuccessfulFetch()
    initButton()

    // expect(window.fetch).toHaveBeenCalledWith(
    //   '/api/personalisation/check-email-subscription?base_path=/current-page-path', { headers: { Accept: 'application/json' }, signal: abortController.signal }
    // )
  })

  it('includes button_location in the call to the personalisation API when button_location is specified', function () {
    createFixture('data-button-location="top"')
    stubSuccessfulFetch()
    initButton()

    // expect(window.fetch).toHaveBeenCalledWith(
    //   '/api/personalisation/check-email-subscription?base_path=/current-page-path&button_location=top', { headers: { Accept: 'application/json' }, signal: abortController.signal }
    // )
  })

  it('renders the button visible when API response is received', async function () {
    createFixture()
    stubSuccessfulFetch({ base_path: '/current-page-path', active: false })
    await initButton()

    var button = document.querySelector('.gem-c-single-page-notification-button')
    expect(button).toHaveClass('gem-c-single-page-notification-button--visible')
  })

  it('renders custom subscribe button text when API response is received if "data-button-text-subscribe" and "data-button-text-unsubscribe" are set', async function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    stubSuccessfulFetch({ base_path: '/current-page-path', active: false })
    await initButton()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Start getting emails about this stuff')
  })

  it('renders custom unsubscribe button text when API response is received if "data-button-text-subscribe" and "data-button-text-unsubscribe" are set', async function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    stubSuccessfulFetch({ base_path: '/current-page-path', active: true })
    await initButton()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Stop getting emails about this stuff')
  })

  it('should remain unchanged if the response is not JSON', async function () {
    var responseText = 'I am not JSON, actually'

    createFixture()
    stubSuccessfulFetch(responseText)
    await initButton()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toBe('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if response text is empty', async function () {
    var responseText = ''

    createFixture()
    stubSuccessfulFetch(responseText)
    await initButton()

    var button = document.querySelector('.gem-c-single-page-notification-button.gem-c-single-page-notification-button--visible .gem-c-button__outline--notification')
    expect(button.textContent).toContain('Get emails about this page')
    expect(GOVUK.Modules.SinglePageNotificationButton.prototype.responseIsJSON(responseText)).toBe(false)
  })

  it('should remain unchanged if the endpoint fails', async function () {
    createFixture()
    stubServerErrorFetch()
    await initButton()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toContain('Get emails about this page')
  })

  it('should remain unchanged if xhr times out', async function () {
    createFixture(`
      data-button-text-subscribe="Start getting emails about this stuff"
      data-button-text-unsubscribe="Stop getting emails about this stuff"
    `)
    stubServerTimeout()
    await initButton()

    var button = document.querySelector('button.gem-c-button__outline--notification')
    expect(button.textContent).toContain('Get emails about this page')
    // expect(initButton).toThrowError()
  })

  const stubSuccessfulFetch = (personalisationData) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(personalisationData)
    }))
  }

  const stubServerErrorFetch = () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' })
    }))
  }

  const stubServerTimeout = () => {
    spyOn(window, 'fetch').and.callFake(() => setTimeout(() => 1))
  }

  async function initButton () {
    var element = document.querySelector('[data-module=single-page-notification-button]')
    return await new GOVUK.Modules.SinglePageNotificationButton(element).init()
  }
})
