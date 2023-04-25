/* eslint-env jasmine */

describe('GA4 finder change tracker', function () {
  var GOVUK = window.GOVUK
  var form
  var inputParent
  var input
  var label
  var expected

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
  })

  beforeEach(function () {
    window.dataLayer = []
    form = document.createElement('form')
    document.body.appendChild(form)

    form.addEventListener('change', function (e) {
      var ga4ChangeCategory = e.target.closest('[data-ga4-change-category]')
      if (ga4ChangeCategory) {
        ga4ChangeCategory = ga4ChangeCategory.getAttribute('data-ga4-change-category')
        window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent(e.target, ga4ChangeCategory)
      }
    })

    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.govuk_gem_version = 'aVersion'
    expected.event = 'event_data'
    expected.event_data.type = 'finder'

    agreeToCookies()
  })

  afterEach(function () {
    document.body.removeChild(form)
  })

  afterAll(function () {
    window.dataLayer = []
  })

  it('creates the correct GA4 object for a search box keyword update', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-keyword text')

    input = document.createElement('input')
    input.setAttribute('type', 'search')
    input.value = 'Hello world my postcode is SW1A 0AA. My birthday is 1970-01-01. My email is email@example.com'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'search'
    expected.event_data.url = window.location.pathname
    expected.event_data.text = 'Hello world my postcode is [postcode]. My birthday is [date]. My email is [email]'
    expected.event_data.section = 'Search'
    expected.event_data.action = 'search'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('creates the correct GA4 object for adding a checkbox filter', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-filter checkbox')
    inputParent.setAttribute('data-ga4-section', 'Your favourite chocolate')
    var index = { index_section: 1, index_section_count: 1 }
    inputParent.setAttribute('data-ga4-index', JSON.stringify(index))

    input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.id = 'checkbox'
    input.checked = true
    label = document.createElement('label')
    label.setAttribute('for', 'checkbox')
    label.innerText = 'All types of chocolate'

    inputParent.appendChild(input)
    inputParent.appendChild(label)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Your favourite chocolate'
    expected.event_data.text = 'All types of chocolate'
    expected.event_data.action = 'select'
    expected.event_data.index = index

    expect(window.dataLayer[0]).toEqual(expected)
  })
})
