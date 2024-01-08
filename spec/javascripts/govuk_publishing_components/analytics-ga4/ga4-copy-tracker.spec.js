/* eslint-env jasmine */

describe('Google Analytics 4 copy tracker', function () {
  var GOVUK = window.GOVUK
  var expected

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
    GOVUK.analyticsGa4.analyticsModules.Ga4CopyTracker.init()
  })

  beforeEach(function () {
    window.dataLayer = []
    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.event = 'event_data'
    expected.event_data.event_name = 'copy'
    expected.event_data.type = 'copy'
    expected.event_data.action = 'copy'
    expected.event_data.method = 'browser copy'
    expected.govuk_gem_version = 'aVersion'
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
    expected.timestamp = '123456'
  })

  it('triggers a GA4 event when the copy event is fired', function () {
    var text = 'This is some text'
    expected.event_data.text = text
    expected.event_data.length = '17'
    spyOn(window, 'getSelection').and.returnValue(text)

    window.GOVUK.triggerEvent(window, 'copy')
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('does not send data unless text has been selected', function () {
    spyOn(window, 'getSelection').and.returnValue('')

    window.GOVUK.triggerEvent(window, 'copy')
    expect(window.dataLayer.length).toEqual(0)
  })

  it('does not send data if copying from an input element', function () {
    var html = '<p id="p_tag">hello</p>' +
      '<input type="text" id="input_tag"/>' +
      '<textarea id="textarea_tag"></textarea>'
    var element = document.createElement('div')
    element.innerHTML = html
    document.body.appendChild(element)
    spyOn(window, 'getSelection').and.returnValue('no thankyou')

    window.GOVUK.triggerEvent(document.getElementById('input_tag'), 'copy')
    expect(window.dataLayer.length).toEqual(0)

    window.GOVUK.triggerEvent(document.getElementById('textarea_tag'), 'copy')
    expect(window.dataLayer.length).toEqual(0)

    window.GOVUK.triggerEvent(document.getElementById('p_tag'), 'copy')
    // in testing the copy listener is created multiple times, can't be precise here
    // so we test that at least one copy event has occurred
    expect(window.dataLayer.length).toBeGreaterThan(0)

    document.body.removeChild(element)
  })

  it('cleans line breaks and other characters from copied text', function () {
    var text = 'This is some text\n\nThis is some more\tAnd some more\n     and     some spaces    \n'
    expected.event_data.text = 'This is some text This is some'
    expected.event_data.length = '65'
    spyOn(window, 'getSelection').and.returnValue(text)

    window.GOVUK.triggerEvent(window, 'copy')
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('only records a maximum of 30 characters', function () {
    var text = "The first problem is where to get a lot of text. That's actually not so hard if you think about it - all you have to do is write some words down, any words that come to mind."
    expected.event_data.text = 'The first problem is where to '
    expected.event_data.length = '174'
    spyOn(window, 'getSelection').and.returnValue(text)

    window.GOVUK.triggerEvent(window, 'copy')
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('redacts PII from the text it collects', function () {
    var text = 'some email@example.com SW1A 2AA Jan 1st 1990'
    expected.event_data.text = 'some [email] [postcode] [date]'
    expected.event_data.length = '30'
    spyOn(window, 'getSelection').and.returnValue(text)

    window.GOVUK.triggerEvent(window, 'copy')
    expect(window.dataLayer[0]).toEqual(expected)
  })
})
