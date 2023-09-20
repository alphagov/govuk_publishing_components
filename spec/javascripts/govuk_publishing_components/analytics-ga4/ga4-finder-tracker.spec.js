/* eslint-env jasmine */

describe('GA4 finder change tracker', function () {
  var GOVUK = window.GOVUK
  var form
  var inputParent
  var input
  var label
  var label2
  var option1
  var option2
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
    expected.event_data.text = 'hello world my postcode is [postcode]. my birthday is [date]. my email is [email]'
    expected.event_data.section = 'Search'
    expected.event_data.action = 'search'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('trims extra spaces and converts downcases characters on a search box keyword update', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-keyword text')

    input = document.createElement('input')
    input.setAttribute('type', 'search')
    input.value = ' I    have a lot of   SPACES   in a lot of PLACES         \n \r'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'search'
    expected.event_data.url = window.location.pathname
    expected.event_data.text = 'i have a lot of spaces in a lot of places'
    expected.event_data.section = 'Search'
    expected.event_data.action = 'search'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('replaces + characters with spaces on a search box keyword update', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-keyword text')

    input = document.createElement('input')
    input.setAttribute('type', 'search')
    input.value = 'i+have%2Bspaces+in+places'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'search'
    expected.event_data.url = window.location.pathname
    expected.event_data.text = 'i have spaces in places'
    expected.event_data.section = 'Search'
    expected.event_data.action = 'search'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('creates the correct GA4 object for adding/removing a checkbox filter', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-filter checkbox')
    inputParent.setAttribute('data-ga4-filter-parent', '')
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
    expected.event_data.index = { index_section: 1, index_section_count: 1, index_link: undefined }

    expect(window.dataLayer[0]).toEqual(expected)

    input.checked = false
    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.action = 'remove'
    expected.event_data.index = { index_section: undefined, index_section_count: undefined, index_link: undefined }

    expect(window.dataLayer[1]).toEqual(expected)
  })

  it('creates the correct GA4 object for adding/removing a radio filter', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-filter radio')
    inputParent.setAttribute('data-ga4-filter-parent', '')
    inputParent.setAttribute('data-ga4-section', 'Your favourite chocolate')
    var index = { index_section: 1, index_section_count: 1 }
    inputParent.setAttribute('data-ga4-index', JSON.stringify(index))

    option1 = document.createElement('input')
    option1.setAttribute('type', 'radio')
    option1.id = 'radio1'
    option1.setAttribute('name', 'chocolates')
    label = document.createElement('label')
    label.setAttribute('for', 'radio1')
    label.innerText = 'All types of chocolate (default)'

    option2 = document.createElement('input')
    option2.setAttribute('type', 'radio')
    option2.setAttribute('name', 'chocolates')
    option2.id = 'radio2'
    label2 = document.createElement('label')
    label2.setAttribute('for', 'radio2')
    label2.innerText = 'Belgian chocolate'

    inputParent.appendChild(option1)
    inputParent.appendChild(label)
    inputParent.appendChild(option2)
    inputParent.appendChild(label2)
    form.appendChild(inputParent)

    option1.checked = false
    option2.checked = true

    window.GOVUK.triggerEvent(option2, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Your favourite chocolate'
    expected.event_data.text = 'Belgian chocolate'
    expected.event_data.action = 'select'
    expected.event_data.index = { index_section: 1, index_section_count: 1, index_link: undefined }

    expect(window.dataLayer[0]).toEqual(expected)

    option1.checked = true
    option2.checked = false
    window.GOVUK.triggerEvent(option1, 'change')

    expected.event_data.action = 'remove'
    expected.event_data.index = { index_section: undefined, index_section_count: undefined, index_link: undefined }
    expected.event_data.text = 'All types of chocolate (default)'

    expect(window.dataLayer[1]).toEqual(expected)
  })

  it('creates the correct GA4 object for adding/removing a <select> filter', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-filter select')
    inputParent.setAttribute('data-ga4-filter-parent', '')
    inputParent.setAttribute('data-ga4-section', 'Your favourite chocolate')
    var index = { index_section: 5, index_section_count: 15 }
    inputParent.setAttribute('data-ga4-index', JSON.stringify(index))

    input = document.createElement('select')
    input.setAttribute('name', 'chocolates')
    input.id = 'chocolates'

    // This is the first/default option, so "adding a filter" means selecting any <option> other than this one.
    option1 = document.createElement('option')
    option1.value = 'all-types'
    option1.innerText = 'All types of chocolate (default)'
    input.appendChild(option1)

    option2 = document.createElement('option')
    option2.setAttribute('value', 'belgian-chocolate')
    option2.innerText = 'Belgian chocolate'
    input.appendChild(option2)

    input.value = 'belgian-chocolate'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Your favourite chocolate'
    expected.event_data.text = 'Belgian chocolate'
    expected.event_data.action = 'select'
    expected.event_data.index = { index_section: 5, index_section_count: 15, index_link: undefined }

    expect(window.dataLayer[0]).toEqual(expected)

    input.value = 'all-types'
    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.action = 'remove'
    expected.event_data.index = { index_link: undefined, index_section: undefined, index_section_count: undefined }
    expected.event_data.text = 'All types of chocolate (default)'

    expect(window.dataLayer[1]).toEqual(expected)
  })

  it('creates the correct GA4 object for adding/removing a text filter', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-filter text')
    inputParent.setAttribute('data-ga4-filter-parent', '')
    inputParent.setAttribute('data-ga4-section', 'Your favourite chocolate')
    var index = { index_section: 2, index_section_count: 2 }
    inputParent.setAttribute('data-ga4-index', JSON.stringify(index))

    input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.value = 'Here is an email that should not get redacted email@example.com'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Your favourite chocolate'
    expected.event_data.text = 'Here is an email that should not get redacted email@example.com'
    expected.event_data.action = 'search'
    expected.event_data.index = { index_section: 2, index_section_count: 2, index_link: undefined }

    expect(window.dataLayer[0]).toEqual(expected)

    input.value = ''
    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.action = 'remove'
    expected.event_data.index = { index_section: undefined, index_section_count: undefined, index_link: undefined }
    expected.event_data.text = undefined

    expect(window.dataLayer[1]).toEqual(expected)

    // Ensure the section changes when data-ga4-section is set on individual inputs within the same data-ga4-filter-parent
    var input2 = document.createElement('select')
    input2.setAttribute('name', 'chocolates')
    input2.setAttribute('data-ga4-section', 'Your second favourite chocolate')
    input2.id = 'chocolates2'
    input2.appendChild(option1)
    input2.appendChild(option2)
    inputParent.appendChild(input2)
    window.GOVUK.triggerEvent(input2, 'change')
    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Your second favourite chocolate'
    expected.event_data.text = 'Belgian chocolate'
    expected.event_data.action = 'select'
    expected.event_data.index = { index_section: 5, index_section_count: 15, index_link: undefined }
  })

  it('creates the correct GA4 object for clearing all filters', function () {
    form.setAttribute('data-ga4-change-category', 'clear-all-filters')

    window.GOVUK.triggerEvent(form, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.action = 'remove'
    expected.event_data.text = 'Clear all filters'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('creates the correct GA4 object for changing the sort selection', function () {
    inputParent = document.createElement('div')
    inputParent.setAttribute('data-ga4-change-category', 'update-sort select')
    var index = { index_section: 1, index_section_count: 1, index_link: undefined }
    inputParent.setAttribute('data-ga4-index', JSON.stringify(index))

    input = document.createElement('select')
    input.setAttribute('name', 'sort')
    input.id = 'sort'

    option1 = document.createElement('option')
    option1.value = 'most-viewed'
    option1.innerText = 'Most viewed'
    input.appendChild(option1)

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')

    expected.event_data.event_name = 'select_content'
    expected.event_data.section = 'Sort by'
    expected.event_data.text = 'Most viewed'
    expected.event_data.action = 'sort'

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('does nothing if the elementType or changeType does not exist', function () {
    inputParent = document.createElement('div')
    input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.id = 'textInput'

    inputParent.appendChild(input)
    form.appendChild(inputParent)

    window.GOVUK.triggerEvent(input, 'change')
    expect(window.dataLayer.length).toEqual(0)
  })
})
