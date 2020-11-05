/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Ecommerce reporter for results pages', function () {
  'use strict'

  var ecommerce,
    element

  // dimension11 records the device pixel ratio
  // this used to be hardcoded to '1' which would pass the test on the command line
  // but fail if run in the browser, depending on the screen's actual device pixel ratio
  // this fixes that, but dimension11 is no longer needed as GA records this automatically
  var dimension11 = 1
  if (window.devicePixelRatio) {
    dimension11 = window.devicePixelRatio
  }

  beforeEach(function () {
    window.GOVUK.setConsentCookie({
      essential: true,
      settings: false,
      usage: true,
      campaigns: false
    })

    delete window.GOVUK.analytics
    window.GOVUK.analyticsInit()
    ecommerce = new GOVUK.Ecommerce()
    GOVUK.analytics.gaClientId = '12345.67890'
    spyOn(window, 'ga')
  })

  afterEach(function () {
    if (window.ga.calls) {
      window.ga.calls.reset()
    }
  })

  it('requires content id or path', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<div data-ecommerce-row></div>' +
      '</div>'
    )

    ecommerce.init(element)
    expect(window.ga).not.toHaveBeenCalled()
  })

  it('tracks ecommerce rows', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    })
  })

  it('uses data-ecommerce-index to override the implicit index', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-index="42" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 42,
      list: 'Site search results',
      dimension71: 'search query'
    })
  })

  it('tracks impressions with product variants', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query" data-ecommerce-variant="variant-x">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query',
      variant: 'variant-x'
    })
  })

  it('tracks ecommerce subheading', function () {
    element = $(
      '<div data-analytics-ecommerce data-search-query data-list-title="ecommerce-list" data-ecommerce-start-index="1">' +
        '<div data-ecommerce-row=1 data-ecommerce-path="/path/to/page" data-ecommerce-subheading="Human Readable Subheading"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      name: '/path/to/page',
      position: 1,
      list: 'ecommerce-list',
      dimension71: '',
      dimension94: 'Human Readable Subheading'
    })
  })

  it('tracks multiple lists individually', function () {
    element = $(
      '<div> ' +
        '<div data-analytics-ecommerce data-list-title="First list" data-ecommerce-start-index="1" data-search-query="search query">' +
          '<div data-ecommerce-row=1 data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
        '</div>' +
        '<div data-analytics-ecommerce data-list-title="Second list" data-ecommerce-start-index="1" data-search-query="blah">' +
          '<div data-ecommerce-row=1 data-ecommerce-path="/path/to/blah" data-ecommerce-content-id="AAAA-2222"></div>' +
        '</div>' +
      '</div>'
    )

    GOVUK.Ecommerce.start(element.find('[data-analytics-ecommerce]'))

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'First list',
      dimension71: 'search query'
    })
    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-2222',
      name: '/path/to/blah',
      position: 1,
      list: 'Second list',
      dimension71: 'blah'
    })
  })

  it('does not send id if content id is not present', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    })
  })

  it('will use the pagination offset start value', function () {
    element = $(
      '<div data-ecommerce-start-index="21" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 21,
      list: 'Site search results',
      dimension71: 'search query'
    })
  })

  it('will use the non-default list title if set', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-list-title="Non-default title" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)
    element.find('[data-ecommerce-row]').click()

    expect(window.ga).toHaveBeenCalledWith('ec:setAction', 'click', { list: 'Non-default title' })
    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Non-default title',
      dimension71: 'search query'
    })
  })

  it('will send data for multiple rows', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
        '<div data-ecommerce-row data-ecommerce-path="/a/different/page" data-ecommerce-content-id="BBBB-2222"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    })
    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'BBBB-2222',
      name: '/a/different/page',
      position: 2,
      list: 'Site search results',
      dimension71: 'search query'
    })
  })

  it('removes emails from the search query', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query with an email@address.example.com in it">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with an [email] in it'
    })
  })

  it('removes postcodes from the search query if configured to do so', function () {
    GOVUK.analytics.analytics.pii.stripPostcodePII = true

    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query with a SW1A 1AA in it">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with a [postcode] in it'
    })

    GOVUK.analytics.analytics.pii.stripPostcodePII = false
  })

  it('leaves postcodes in the search query if not configured to remove them', function () {
    GOVUK.analytics.analytics.pii.stripPostcodePII = false

    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query with a SW1A 1AA in it">' +
        '<div data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></div>' +
      '</div>'
    )

    ecommerce.init(element)

    expect(window.ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with a sw1a 1aa in it'
    })
  })

  // this test passes when run individually but fails with the other tests
  // not needed but will require fixing when analytics are fully migrated from static
  xit('tracks clicks on search results', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query">' +
        '<a data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></a>' +
      '</div>'
    )

    ecommerce.init(element)
    element.find('[data-ecommerce-row]').click()

    expect(window.ga).toHaveBeenCalledWith('ec:addProduct', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      list: 'Site search results',
      position: 1,
      dimension71: 'search query'
    })
    expect(window.ga).toHaveBeenCalledWith('ec:setAction', 'click', { list: 'Site search results' })
    expect(window.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'UX',
      eventAction: 'click',
      eventLabel: 'Results',
      dimension15: '200',
      dimension16: 'unknown',
      dimension11: dimension11.toString(),
      dimension3: 'other',
      dimension4: '00000000-0000-0000-0000-000000000000',
      dimension12: 'not withdrawn',
      dimension23: 'unknown',
      dimension26: '0',
      dimension27: '0',
      dimension32: 'none',
      dimension38: 'false',
      dimension39: 'false',
      dimension56: 'other',
      dimension57: 'other',
      dimension58: 'other',
      dimension59: 'other',
      dimension30: 'none',
      dimension95: '12345.67890'
    })
  })

  // this test passes when run individually but fails with the other tests
  // not needed but will require fixing when analytics are fully migrated from static
  xit('tracks clicks with product variants', function () {
    element = $(
      '<div data-ecommerce-start-index="1" data-search-query="search query" data-ecommerce-variant="variant-x">' +
        '<a data-ecommerce-row data-ecommerce-path="/path/to/page" data-ecommerce-content-id="AAAA-1111"></a>' +
      '</div>'
    )

    ecommerce.init(element)
    element.find('[data-ecommerce-row]').click()

    expect(window.ga).toHaveBeenCalledWith('ec:addProduct', {
      id: 'AAAA-1111',
      name: '/path/to/page',
      list: 'Site search results',
      position: 1,
      dimension71: 'search query',
      variant: 'variant-x'
    })
    expect(window.ga).toHaveBeenCalledWith('ec:setAction', 'click', { list: 'Site search results' })
    expect(window.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'UX',
      eventAction: 'click',
      eventLabel: 'Results',
      dimension15: '200',
      dimension16: 'unknown',
      dimension11: dimension11.toString(),
      dimension3: 'other',
      dimension4: '00000000-0000-0000-0000-000000000000',
      dimension12: 'not withdrawn',
      dimension23: 'unknown',
      dimension26: '0',
      dimension27: '0',
      dimension32: 'none',
      dimension38: 'false',
      dimension39: 'false',
      dimension56: 'other',
      dimension57: 'other',
      dimension58: 'other',
      dimension59: 'other',
      dimension30: 'none',
      dimension95: '12345.67890'
    })
  })

  // this test passes when run individually but fails with the other tests
  // not needed but will require fixing when analytics are fully migrated from static
  xit('tracks clicks with different event labels', function () {
    element = $(
      '<div> ' +
        '<div data-analytics-ecommerce data-list-title="First list" data-ecommerce-start-index="1" data-search-query="search query">' +
          '<div ' +
            'data-ecommerce-row=1' +
            'data-ecommerce-path="/path/to/page"' +
            'data-ecommerce-content-id="AAAA-1111">' +
          '</div>' +
        '</div>' +
        '<div data-analytics-ecommerce data-list-title="Second list" data-track-click-label="Custom click label" data-ecommerce-start-index="1" data-search-query="blah">' +
          '<div ' +
            'data-ecommerce-row=1' +
            'data-ecommerce-path="/path/to/blah"' +
            'data-ecommerce-content-id="AAAA-2222">' +
          '</div>' +
        '</div>' +
      '</div>'
    )

    GOVUK.Ecommerce.start(element.find('[data-analytics-ecommerce]'))
    element.find('[data-ecommerce-row]').click()

    expect(window.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'UX',
      eventAction: 'click',
      eventLabel: 'Results',
      dimension15: '200',
      dimension16: 'unknown',
      dimension11: dimension11.toString(),
      dimension3: 'other',
      dimension4: '00000000-0000-0000-0000-000000000000',
      dimension12: 'not withdrawn',
      dimension23: 'unknown',
      dimension26: '0',
      dimension27: '0',
      dimension32: 'none',
      dimension38: 'false',
      dimension39: 'false',
      dimension56: 'other',
      dimension57: 'other',
      dimension58: 'other',
      dimension59: 'other',
      dimension30: 'none',
      dimension95: '12345.67890'
    })
    expect(window.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'UX',
      eventAction: 'click',
      eventLabel: 'Custom click label',
      dimension15: '200',
      dimension16: 'unknown',
      dimension11: dimension11.toString(),
      dimension3: 'other',
      dimension4: '00000000-0000-0000-0000-000000000000',
      dimension12: 'not withdrawn',
      dimension23: 'unknown',
      dimension26: '0',
      dimension27: '0',
      dimension32: 'none',
      dimension38: 'false',
      dimension39: 'false',
      dimension56: 'other',
      dimension57: 'other',
      dimension58: 'other',
      dimension59: 'other',
      dimension30: 'none',
      dimension95: '12345.67890'
    })
  })

  it('will only require the ec library once', function () {
    GOVUK.Ecommerce.ecLoaded = false
    GOVUK.Ecommerce.start($('<div data-search-query="search query"></div>'))
    GOVUK.Ecommerce.start($('<div data-search-query="search query"></div>'))

    expect(window.ga).toHaveBeenCalledWith('require', 'ec')
    expect(window.ga.calls.count()).toEqual(1)
  })
})
