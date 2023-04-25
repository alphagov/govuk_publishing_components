/* eslint-env jasmine */

describe('GA4 finder change tracker', function () {
  var GOVUK = window.GOVUK
  var form
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

    agreeToCookies()
  })

  afterEach(function () {
    document.body.removeChild(form)
  })

  afterAll(function () {
    window.dataLayer = []
  })

  it('creates the correct GA4 object for a search box keyword update', function () {
    var searchBoxParent = document.createElement('div')
    searchBoxParent.setAttribute('data-ga4-change-category', 'update-keyword text')

    var searchBox = document.createElement('input')
    searchBox.setAttribute('type', 'search')
    searchBox.value = 'Hello world my postcode is SW1A 0AA. My birthday is 1970-01-01. My email is email@example.com'

    searchBoxParent.appendChild(searchBox)
    form.appendChild(searchBoxParent)

    window.GOVUK.triggerEvent(searchBox, 'change')

    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.govuk_gem_version = 'aVersion'
    expected.event = 'event_data'
    expected.event_data.event_name = 'search'
    expected.event_data.type = 'finder'
    expected.event_data.url = window.location.pathname
    expected.event_data.text = 'Hello world my postcode is [postcode]. My birthday is [date]. My email is [email]'
    expected.event_data.section = 'Search'
    expected.event_data.action = 'search'
    console.log(window.dataLayer)
    expect(window.dataLayer[0]).toEqual(expected)
  })
})
