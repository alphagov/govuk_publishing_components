/* eslint-env jasmine */

describe('Google Analytics form tracking', function () {
  var GOVUK = window.GOVUK
  var schema = new GOVUK.analyticsGa4.Schemas()
  var element
  var expected

  var attributes = {
    event_name: 'form_response',
    type: 'smart answer',
    section: 'What is the title of this question?',
    action: 'Continue',
    tool_name: 'What is the title of this smart answer?'
  }

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  function denyCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
  }

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
  })

  beforeEach(function () {
    window.dataLayer = []
    element = document.createElement('form')
    document.body.appendChild(element)
    agreeToCookies()
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
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
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      spyOn(tracker, 'trackFormSubmit')
      tracker.init()

      window.GOVUK.triggerEvent(element, 'submit')
      expect(tracker.trackFormSubmit).toHaveBeenCalled()
    })

    it('starts the module on the same page as cookie consent is given', function () {
      denyCookies()
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      spyOn(tracker, 'trackFormSubmit')
      tracker.init()

      window.GOVUK.triggerEvent(element, 'submit')
      expect(tracker.trackFormSubmit).not.toHaveBeenCalled()

      // page has not been reloaded, user consents to cookies
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      window.GOVUK.triggerEvent(element, 'submit')
      expect(tracker.trackFormSubmit).toHaveBeenCalled()

      // consent listener should be removed after triggering
      tracker.trackFormSubmit.calls.reset()
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      window.GOVUK.triggerEvent(element, 'submit')
      expect(tracker.trackFormSubmit.calls.count()).toBe(1)
    })

    it('does not do anything if consent is not given', function () {
      denyCookies()
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      spyOn(tracker, 'trackFormSubmit')
      tracker.init()

      window.GOVUK.triggerEvent(element, 'submit')
      expect(tracker.trackFormSubmit).not.toHaveBeenCalled()
    })
  })

  describe('when tracking a form', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      expected = schema.mergeProperties(attributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('collects basic data', function () {
      window.GOVUK.triggerEvent(element, 'submit')
      expected.event_data.text = 'No answer given'
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('allows the text value to be overridden', function () {
      var overriddenText = JSON.parse(JSON.stringify(attributes))
      overriddenText.text = 'Hello World'
      element.setAttribute('data-ga4-form', JSON.stringify(overriddenText))
      window.GOVUK.triggerEvent(element, 'submit')
      expected.event_data.text = 'Hello World'
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('redacts data from text inputs', function () {
      element.innerHTML =
        '<label for="textid">Label</label>' +
        '<input type="text" id="textid" name="test-text" value="test-text-value"/>'
      expected.event_data.text = '[REDACTED]'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('does not redact data from text inputs that have data-ga4-form-include-input on them', function () {
      element.innerHTML =
        '<label for="textid">Label</label>' +
        '<input type="text" id="textid" name="test-text" value="i should not be redacted but PII still runs email@example.com" data-ga4-form-include-input />' +
        '<label for="textid2">Label</label>' +
        '<input type="text" id="textid2" name="test-text-2" value="i should be redacted" />'
      expected.event_data.text = 'i should not be redacted but PII still runs [email],[REDACTED]'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('redacts data from multiple text inputs', function () {
      element.innerHTML =
        '<label for="textid1">Label</label>' +
        '<input type="text" id="textid1" name="test-text1" value="text 1"/>' +
        '<label for="textid2">Label</label>' +
        '<input type="search" id="textid2" name="test-text2"/>' +
        '<label for="textid3">Label</label>' +
        '<input type="email" id="textid3" name="test-text3" value="text 3"/>'
      expected.event_data.text = '[REDACTED]'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from checked conditional fields', function () {
      element.innerHTML =
        '<div id="conditional-field" class="govuk-checkboxes__conditional">' +
          '<label for="c1">checkbox1</label>' +
          '<input type="checkbox" aria-controls="conditional-field" id="c1" name="checkbox[]" value="checkbox1"/>' +
          '<label for="c3">checkbox3</label>' +
          '<input type="checkbox" id="c3" name="checkbox[]" value="checkbox3"/>' +
        '</div>'

      document.getElementById('c1').checked = true
      document.getElementById('c3').checked = true

      expected.event_data.text = 'checkbox3'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('does not collect data from unchecked conditional fields', function () {
      element.innerHTML =
        '<div id="conditional-field" class="govuk-checkboxes__conditional">' +
          '<label for="c1">checkbox1</label>' +
          '<input type="checkbox" aria-controls="conditional-field" id="c1" name="checkbox[]" value="checkbox1"/>' +
          '<label for="text">Label</label>' +
          '<input type="text" id="text" name="test-text" value="Some text"/>' +
        '</div>'

      expected.event_data.text = 'No answer given'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from checkboxes', function () {
      element.innerHTML =
        '<label><input type="checkbox" id="c1" name="checkbox[]" value="checkbox1"/>checkbox1</label>' +
        '<label><input type="checkbox" id="c2" name="checkbox[]" value="checkbox2"/>checkbox2</label>' +
        '<label><input type="checkbox" id="c3" name="checkbox[]" value="checkbox3"/>checkbox3</label>'
      document.getElementById('c1').checked = true
      document.getElementById('c3').checked = true
      expected.event_data.text = 'checkbox1,checkbox3'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from radio buttons', function () {
      element.innerHTML =
        '<label><input type="radio" id="r1" name="radio[]" value="radio1"/>radio1</label>' +
        '<label><input type="radio" id="r2" name="radio[]" value="radio2"/>radio2</label>' +
        '<label><input type="radio" id="r3" name="radio[]" value="radio3"/>radio3</label>'
      document.getElementById('r1').checked = true
      document.getElementById('r2').checked = true
      expected.event_data.text = 'radio2'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from select elements', function () {
      element.innerHTML =
        '<label for="s1">Label</label>' +
        '<select name="select" id="s1">' +
          '<option value="option1">Option 1</option>' +
          '<option value="option2">Option 2</option>' +
          '<option value="option3">Option 3</option>' +
        '</select>'
      var select = document.getElementById('s1')
      select.selectedIndex = 2
      window.GOVUK.triggerEvent(select, 'change')
      expected.event_data.text = 'Option 3'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from a select and a text input', function () {
      element.innerHTML =
        '<label for="s1">Label</label>' +
        '<select name="select" id="s1">' +
          '<option value="option1">Option 1</option>' +
          '<option value="option2">Option 2</option>' +
          '<option value="option3">Option 3</option>' +
        '</select>' +
        '<label for="text">Label</label>' +
        '<input type="text" id="text" name="test-text" value="Some text"/>'
      var select = document.getElementById('s1')
      select.selectedIndex = 2
      window.GOVUK.triggerEvent(select, 'change')
      expected.event_data.text = 'Option 3,[REDACTED]'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('copes when the form is not well formed', function () {
      element.innerHTML =
        '<input type="text" id="textid" name="test-text" value="test-text-value"/>' +
        '<select name="select" id="s1">' +
          '<option value="option1">Option 1</option>' +
          '<option value="option2">Option 2</option>' +
          '<option value="option3">Option 3</option>' +
        '</select>' +
        '<input type="radio" id="r1" name="radio[]" value="radio1"/>radio1' +
        '<input type="radio" id="r2" name="radio[]" value="radio2"/>radio2' +
        '<input type="checkbox" id="c1" name="checkbox[]" value="checkbox1"/>checkbox1' +
        '<input type="checkbox" id="c2" name="checkbox[]" value="checkbox2"/>checkbox2'

      var select = document.getElementById('s1')
      select.selectedIndex = 2
      window.GOVUK.triggerEvent(select, 'change')
      window.GOVUK.triggerEvent(element, 'submit')
      expected.event_data.text = 'No answer given'

      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when tracking a form with JSON recording', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'form_response',
        type: 'smart answer',
        section: 'What is the title of this question?',
        action: 'Continue',
        tool_name: 'What is the title of this smart answer?'
      }
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      element.setAttribute('data-ga4-form-record-json', '')
      expected = schema.mergeProperties(attributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('collects data from checked conditional checkboxes', function () {
      element.innerHTML =
        '<div id="conditional-field" class="govuk-checkboxes__conditional">' +
          '<fieldset>' +
          '<legend>Checkbox legend</legend>' +
          '<label for="c3">checkbox3</label>' +
          '<input type="checkbox" id="c3" name="checkbox[]" value="checkbox3"/>' +
          '</fieldset>' +
          '<input type="checkbox" aria-controls="conditional-field" id="c1" name="checkbox[]" value="checkbox1"/>' +
          '<label for="c1">checkbox1</label>' +
        '</div>'

      document.getElementById('c1').checked = true
      document.getElementById('c3').checked = true

      expected.event_data.text = JSON.stringify({ checkbox1: { 'Checkbox legend': 'checkbox3' } })

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from checked conditional input', function () {
      element.innerHTML =
        '<div id="conditional-field" class="govuk-checkboxes__conditional">' +
          '<label for="c1">checkbox1</label>' +
          '<input type="checkbox" aria-controls="conditional-field" id="c1" name="checkbox[]" value="checkbox1"/>' +
          '<label for="text">Text label</label>' +
          '<input type="text" id="text" name="test-text" value="Some text"/>' +
        '</div>'

      document.getElementById('c1').checked = true

      expected.event_data.text = JSON.stringify({ checkbox1: { 'Text label': '[REDACTED]' } })

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from a checkbox with a legend', function () {
      element.innerHTML =
        '<fieldset>' +
        '<legend>Checkbox legend</legend>' +
        '<label><input type="checkbox" id="c1" name="checkbox[]" value="checkbox1"/>checkbox1</label>' +
        '</fieldset>'

      document.getElementById('c1').checked = true

      expected.event_data.text = JSON.stringify({ 'Checkbox legend': 'checkbox1' })

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from a radio with a legend', function () {
      element.innerHTML =
        '<fieldset>' +
        '<legend>Checkbox legend</legend>' +
        '<label><input type="radio" id="r1" name="checkbox[]" value="radio1"/>radio1</label>' +
        '</fieldset>'

      document.getElementById('r1').checked = true

      expected.event_data.text = JSON.stringify({ 'Checkbox legend': 'radio1' })

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('collects data from a select and a text input', function () {
      element.innerHTML =
        '<label for="s1">Select label</label>' +
        '<select name="select" id="s1">' +
          '<option value="option1">Option 1</option>' +
          '<option value="option2">Option 2</option>' +
          '<option value="option3">Option 3</option>' +
        '</select>' +
        '<label for="text">Text label</label>' +
        '<input type="text" id="text" name="test-text" value="Some text"/>'
      var select = document.getElementById('s1')
      select.selectedIndex = 2
      window.GOVUK.triggerEvent(select, 'change')
      expected.event_data.text = JSON.stringify({ 'Select label': 'Option 3', 'Text label': '[REDACTED]' })

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when tracking a form with character count enabled', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'form_response',
        type: 'smart answer',
        section: 'What is the title of this question?',
        action: 'Continue',
        tool_name: 'What is the title of this smart answer?'
      }
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      element.setAttribute('data-ga4-form-include-text', '')
      element.setAttribute('data-ga4-form-use-text-count', '')
      expected = schema.mergeProperties(attributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('collects character count from a text input', function () {
      element.innerHTML =
        '<label for="text">Text label</label>' +
        '<input type="text" id="text" name="test-text" value="Some text"/>'

      expected.event_data.text = '9'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when tracking a form with undefined instead of no answer given', function () {
    beforeEach(function () {
      var attributes = {
        event_name: 'form_response',
        type: 'smart answer',
        section: 'What is the title of this question?',
        action: 'Continue',
        tool_name: 'What is the title of this smart answer?'
      }
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      element.setAttribute('data-ga4-form-no-answer-undefined', '')
      expected = schema.mergeProperties(attributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('allows the fallback value when the text is empty to be undefined', function () {
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      window.GOVUK.triggerEvent(element, 'submit')
      expected.event_data.text = undefined
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when tracking a form with text redaction disabled', function () {
    beforeEach(function () {
      element.setAttribute('data-ga4-form', JSON.stringify(attributes))
      element.setAttribute('data-ga4-form-include-text', '')
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected = schema.mergeProperties(attributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('does not redact all data from text inputs', function () {
      element.innerHTML =
        '<label for="textid">Label for text</label>' +
        '<input type="text" id="textid" name="test-text" value="test-text-value"/>' +
        '<label for="searchid">Label for search</label>' +
        '<input type="search" id="searchid" name="test-search" value="test-search-value"/>'
      expected.event_data.text = 'test-text-value,test-search-value'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('strips PII from text inputs', function () {
      element.innerHTML =
        '<label for="textid">Label for text</label>' +
        '<input type="text" id="textid" name="test-text" value="email@example.com"/>' +
        '<label for="searchid">Label for search</label>' +
        '<input type="search" id="searchid" name="test-search" value="another email@example.com"/>'
      expected.event_data.text = '[email],another [email]'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('does not redact data from multiple text inputs of different types', function () {
      element.innerHTML =
        '<label for="textid1">Label</label>' +
        '<input type="text" id="textid1" name="test-text1" value="text 1"/>' +
        '<label for="textid2">Label</label>' +
        '<input type="search" id="textid2" name="test-text2" value="text 2"/>' +
        '<label for="textid3">Label</label>' +
        '<input type="email" id="textid3" name="test-text3" value="text 3"/>' +
        '<label for="textid4">Label</label>' +
        '<input type="number" id="textid4" name="test-text4" value="4"/>'
      element.setAttribute('data-ga4-form-include-text', true)
      expected.event_data.text = 'text 1,text 2,text 3,4'

      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when tracking search forms', function () {
    beforeEach(function () {
      var searchAttributes = {
        event_name: 'form_response',
        type: 'header menu bar',
        section: 'Search',
        action: 'search'
      }
      element.setAttribute('data-ga4-form', JSON.stringify(searchAttributes))
      element.setAttribute('data-ga4-form-include-text', '')
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected = schema.mergeProperties(searchAttributes, 'event_data')
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      var tracker = new GOVUK.Modules.Ga4FormTracker(element)
      tracker.init()
    })

    it('converts search terms to lowercase', function () {
      element.innerHTML =
        '<label for="text">Search</label>' +
        '<input type="text" id="text" name="text" value="I SHOULD BE LOWERCASE"/>'

      expected.event_data.text = 'i should be lowercase'
      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('converts plusses to spaces, and then removes extra lines and spaces', function () {
      element.innerHTML =
        '<label for="text">Search</label>' +
        '<input type="text" id="text" name="text" value="  there+%2B++  \n \r should     be    no  extra  spaces     "/>'

      expected.event_data.text = 'there should be no extra spaces'
      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('redacts PII', function () {
      element.innerHTML =
        '<label for="text">Search</label>' +
        '<input type="text" id="text" name="text" value="email@example.com SW1A 2AA Jan 1st 1990"/>'

      expected.event_data.text = '[email] [postcode] [date]'
      window.GOVUK.triggerEvent(element, 'submit')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })
})
