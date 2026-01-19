/* eslint-env jasmine */

describe('Google Tag Manager page view tracking', function () {
  var GOVUK = window.GOVUK
  var saved = {}
  var expected

  beforeAll(function () {
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
  })

  beforeEach(function () {
    saved.title = document.title
    document.title = 'This here page'
    expected = {
      event: 'page_view',
      govuk_gem_version: 'aVersion',
      timestamp: '123456',
      page_view: {
        location: document.location.href,
        referrer: document.referrer,
        title: 'This here page',
        status_code: '200',
        viewport_size: GOVUK.analyticsGa4.analyticsModules.PageViewTracker.getViewPort(),

        ab_test: undefined,
        document_type: undefined,
        publishing_app: undefined,
        rendering_app: undefined,
        schema_name: undefined,
        content_id: undefined,

        browse_topic: undefined,
        navigation_page_type: undefined,
        navigation_list_type: undefined,
        step_navs: undefined,
        taxonomy_main: undefined,
        taxonomy_main_id: undefined,
        taxonomy_level1: undefined,
        taxonomy_all: undefined,
        taxonomy_all_ids: undefined,

        language: undefined,
        history: 'false',
        withdrawn: 'false',
        first_published_at: undefined,
        updated_at: undefined,
        public_updated_at: undefined,
        publishing_government: undefined,
        political_status: undefined,
        primary_publishing_organisation: undefined,
        organisations: undefined,
        world_locations: undefined,

        dynamic: 'false',
        app_promo_banner: undefined,
        emergency_banner: undefined,
        phase_banner: undefined,
        devolved_nations_banner: undefined,
        cookie_banner: undefined,
        intervention: undefined,
        global_bar: undefined,
        query_string: undefined,
        search_term: undefined,
        tool_name: undefined,
        spelling_suggestion: undefined,
        discovery_engine_attribution_token: undefined,
        canonical_url: undefined,

        user_created_at: undefined,
        user_organisation_name: undefined,
        user_role: undefined,
        user_id: undefined
      }
    }
    if (window.location.search) {
      expected.page_view.query_string = window.location.search.substring(1) // get the '?something' bit of the URL and remove the '?'
    }
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
    window.dataLayer = []
  })

  afterEach(function () {
    document.title = saved.title
    window.httpStatusCode = false
    var head = document.getElementsByTagName('head')[0]
    var metas = document.querySelectorAll("[name^='govuk']")
    for (var i = 0; i < metas.length; i++) {
      head.removeChild(metas[i])
    }
    var html = document.querySelector('html')
    html.removeAttribute('lang')
  })

  afterAll(function () {
    window.dataLayer = []
  })

  function createMetaTags (key, value) {
    var metatag = document.createElement('meta')
    metatag.setAttribute('name', 'govuk:' + key)
    metatag.setAttribute('content', value)
    document.getElementsByTagName('head')[0].appendChild(metatag)
  }

  it('returns a standard page view', function () {
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with a specific status code', function () {
    window.httpStatusCode = 404
    expected.page_view.status_code = '404'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with specific publishing information', function () {
    var tags = [
      {
        gtmName: 'document_type',
        tagName: 'format',
        value: 'detailed_guide'
      },
      {
        gtmName: 'publishing_app',
        tagName: 'publishing-app',
        value: 'whitehall'
      },
      {
        gtmName: 'rendering_app',
        tagName: 'rendering-app',
        value: 'government-frontend'
      },
      {
        gtmName: 'schema_name',
        tagName: 'schema-name',
        value: 'html_publication'
      },
      {
        gtmName: 'content_id',
        tagName: 'content-id',
        value: '123456'
      }
    ]

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      createMetaTags(tag.tagName, tag.value)
      expected.page_view[tag.gtmName] = tag.value
    }

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with specific taxonomy information', function () {
    var tags = [
      {
        gtmName: 'browse_topic',
        tagName: 'ga4-browse-topic',
        value: 'this section'
      },
      {
        gtmName: 'taxonomy_main',
        tagName: 'taxon-slug',
        value: 'this taxon slug'
      },
      {
        gtmName: 'taxonomy_main_id',
        tagName: 'taxon-id',
        value: 'this taxon id'
      },
      {
        gtmName: 'taxonomy_level1',
        tagName: 'taxonomy_level1',
        value: 'this theme'
      },
      {
        gtmName: 'taxonomy_all',
        tagName: 'taxon-slugs',
        value: 'this taxon slugs'
      },
      {
        gtmName: 'taxonomy_all_ids',
        tagName: 'taxon-ids',
        value: 'this taxon ids'
      }
    ]

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      createMetaTags(tag.tagName, tag.value)
      expected.page_view[tag.gtmName] = tag.value
    }

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  describe('returns a pageview with a language', function () {
    var content

    beforeEach(function () {
      content = document.createElement('div')
      content.setAttribute('id', 'content')
      document.body.appendChild(content)
    })

    afterEach(function () {
      document.body.removeChild(content)
    })

    it('set correctly', function () {
      content.setAttribute('lang', 'wakandan')
      expected.page_view.language = 'wakandan'

      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('set incorrectly', function () {
      expected.page_view.language = undefined

      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  it('returns a pageview without a language', function () {
    expected.page_view.language = undefined

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview with history', function () {
    createMetaTags('content-has-history', 'true')
    expected.page_view.history = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview without history', function () {
    createMetaTags('content-has-history', 'banana')
    expected.page_view.history = 'false'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a withdrawn page', function () {
    createMetaTags('withdrawn', 'withdrawn')
    expected.page_view.withdrawn = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a first published date', function () {
    createMetaTags('first-published-at', '2022-03-28T19:11:00.000+00:00')
    expected.page_view.first_published_at = '2022-03-28'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a last updated date', function () {
    createMetaTags('updated-at', '2021-03-28T19:11:00.000+00:00')
    expected.page_view.updated_at = '2021-03-28'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a last public updated date', function () {
    createMetaTags('public-updated-at', '2020-03-28T19:11:00.000+00:00')
    expected.page_view.public_updated_at = '2020-03-28'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a publishing government', function () {
    createMetaTags('publishing-government', 'labour')
    expected.page_view.publishing_government = 'labour'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a publishing government (GA4 alternative meta tag)', function () {
    createMetaTags('ga4-publishing-government', 'labour')
    expected.page_view.publishing_government = 'labour'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('handles removing hyphens and downcases from the publishing government meta tag', function () {
    createMetaTags('ga4-publishing-government', '2005-To-2010-Labour-GOVERNMENT')
    expected.page_view.publishing_government = '2005 to 2010 labour government'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)

    createMetaTags('publishing-government', '2005-To-2010-Labour-GOVERNMENT-2')
    expected.page_view.publishing_government = '2005 to 2010 labour government 2'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[1]).toEqual(expected)
  })

  it('handles removing hyphens and downcases when the publishing government meta tags are falsy', function () {
    createMetaTags('ga4-publishing-government', '')
    expected.page_view.publishing_government = undefined
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)

    createMetaTags('publishing-government', '')
    expected.page_view.publishing_government = undefined
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[1]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a political status', function () {
    createMetaTags('political-status', 'ongoing')
    expected.page_view.political_status = 'ongoing'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a political status (GA4 alternative meta tag)', function () {
    createMetaTags('ga4-political-status', 'historic')
    expected.page_view.political_status = 'historic'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a primary publishing organisation', function () {
    createMetaTags('primary-publishing-organisation', 'Home Office')
    expected.page_view.primary_publishing_organisation = 'Home Office'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with ids for contributing organisations', function () {
    createMetaTags('organisations', 'some organisations')
    expected.page_view.organisations = 'some organisations'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with world locations', function () {
    createMetaTags('world-locations', 'some world locations')
    expected.page_view.world_locations = 'some world locations'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns undefined if the content attribute is an empty string', function () {
    createMetaTags('spelling-suggestion', '')
    expected.page_view.spelling_suggestion = undefined
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('removes email and postcode pii from the page title', function () {
    document.title = 'example@gov.uk - SW12AA - 0123456789'
    expected.page_view.title = '[email] - [postcode] - 0123456789'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('doesn\'t remove dates from the page title', function () {
    document.title = '01-01-2026'
    expected.page_view.title = '01-01-2026'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('removes email, postcode, and date pii from the page location and referrer', function () {
    spyOnProperty(document, 'referrer', 'get').and.returnValue('https://gov.uk/example@gov.uk/SW12AA/2020-01-01')
    expected.page_view.referrer = 'https://gov.uk/[email]/[postcode]/[date]'

    // We can't spy on location, so instead we use an anchor link to change the URL temporarily

    // Reset the URL so we can build the expected link string
    var linkForURLMock = document.createElement('a')
    linkForURLMock.href = '#'
    linkForURLMock.click()
    var location = document.location.href

    expected.page_view.location = location + '[email]/[postcode]/[date]'

    // Add personally identifiable information to the current page location
    linkForURLMock.href = '#example@gov.uk/SW12AA/2020-01-01'
    linkForURLMock.click()

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

    // Reset the page location for other tests
    linkForURLMock.href = '#'
    linkForURLMock.click()

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('doesn\'t remove date pii from the location when on a search page', function () {
    spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?keywords=2020-01-01')

    // We can't spy on location, so instead we use an anchor link to change the URL temporarily.
    // Reset the URL so we can build the expected link string.
    var linkForURLMock = document.createElement('a')
    linkForURLMock.href = '#'
    linkForURLMock.click()
    var location = document.location.href

    expected.page_view.location = location + '[email]/[postcode]?keywords=2020-01-01'
    expected.page_view.search_term = '2020-01-01'
    expected.page_view.query_string = 'keywords=2020-01-01'

    // Add personally identifiable information to the current page location
    linkForURLMock.href = '#example@gov.uk/SW12AA?keywords=2020-01-01'
    linkForURLMock.click()

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

    // Reset the page location for other tests
    linkForURLMock.href = '#'
    linkForURLMock.click()

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('can redact ga parameters as expected', function () {
    var url = 'https://www.gov.uk/welfare?'
    var param1 = '_ga=2.237932419.220854294.1692605006-1618308030.1687790776'
    var param2 = '_gl=32.23434234.243-32434220-230442300234.234324.42304-09320'
    var param3 = '_gl=1*18346yi*_ga*OTkxOTU4OTU5LjE2OTQ0MzQyNTg.*_ga_HYBY4V8XVT*MTY5NDQzNDI1OC4xLjAuMTY5NDQzNDI1OC4wLjAuMA..'

    expect(GOVUK.analyticsGa4.analyticsModules.PageViewTracker.stripGaParam(url + param1)).toEqual(url + '_ga=[id]')
    expect(GOVUK.analyticsGa4.analyticsModules.PageViewTracker.stripGaParam(url + param2)).toEqual(url + '_gl=[id]')
    expect(GOVUK.analyticsGa4.analyticsModules.PageViewTracker.stripGaParam(url + param1 + '&' + param2)).toEqual(url + '_ga=[id]&_gl=[id]')
    expect(GOVUK.analyticsGa4.analyticsModules.PageViewTracker.stripGaParam(url + param3)).toEqual(url + '_gl=[id]')
  })

  it('redacts ga parameters from the location and referrer before they are mistaken for PII', function () {
    // We can't spy on location, so instead we use an anchor link to change the URL temporarily

    // Reset the URL so we can build the expected link string
    var linkForURLMock = document.createElement('a')
    linkForURLMock.href = '#'
    linkForURLMock.click()
    var location = document.location.href

    expected.page_view.location = location + '[email]'

    // Add email address to the current page location
    linkForURLMock.href = '#example@gov.uk?_gl=2012-01-05.2022-01-23'
    linkForURLMock.click()
    expected.page_view.location = document.location.href.replace('#example@gov.uk?_gl=2012-01-05.2022-01-23', '#[email]?_gl=[id]')

    spyOnProperty(document, 'referrer', 'get').and.returnValue('https://gov.uk/?_ga=2012-01-05.2022-01-23&date=2021-01-02')
    expected.page_view.referrer = 'https://gov.uk/?_ga=[id]&date=[date]'

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    // Reset the page location for other tests
    linkForURLMock.href = '#'
    linkForURLMock.click()
  })

  describe('correctly sets the referrer and dynamic properties', function () {
    it('when not passed a parameter', function () {
      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('when passed a parameter for the referrer', function () {
      expected.page_view.referrer = 'https://gov.uk/referrer'
      expected.page_view.dynamic = 'true'

      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init('https://gov.uk/referrer')

      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  it('correctly sets the ab-test parameter', function () {
    createMetaTags('ab-test', 'BankHolidaysTest:A')
    expected.page_view.ab_test = 'BankHolidaysTest:A'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the navigation-page-type parameter', function () {
    createMetaTags('navigation-page-type', 'Browse level 2')
    expected.page_view.navigation_page_type = 'Browse level 2'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the navigation-list-type parameter', function () {
    createMetaTags('navigation-list-type', 'curated')
    expected.page_view.navigation_list_type = 'curated'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the step-navs parameter', function () {
    createMetaTags('stepnavs', 'e01e924b-9c7c-4c71-8241-66a575c2f61f')
    expected.page_view.step_navs = 'e01e924b-9c7c-4c71-8241-66a575c2f61f'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the app_promo_banner parameter', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-app-promo-banner', '')
    document.body.appendChild(div)
    expected.page_view.app_promo_banner = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('correctly sets the emergency_banner parameter', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-emergency-banner', '')
    document.body.appendChild(div)
    expected.page_view.emergency_banner = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('correctly sets the phase_banner parameter', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-phase-banner', 'beta')
    document.body.appendChild(div)
    expected.page_view.phase_banner = 'beta'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('correctly sets the devolved_nations_banner parameter', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-devolved-nations-banner', 'England, Scotland, Wales')
    document.body.appendChild(div)
    expected.page_view.devolved_nations_banner = 'England, Scotland, Wales'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('correctly sets the cookie_banner parameter when the banner exists and no cookie exists', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-cookie-banner', '')
    document.body.appendChild(div)
    expected.page_view.cookie_banner = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('doesn\'t set the cookie parameter when the banner is hidden via the cookie', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-cookie-banner', '')
    div.setAttribute('data-module', 'cookie-banner')
    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":false,"usage":false,"campaigns":false}')
    expected.page_view.cookie_banner = undefined
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    window.GOVUK.setCookie('cookie_policy', '')
  })

  describe('intervention banner', function () {
    var div
    beforeEach(function () {
      div = document.createElement('div')
      div.setAttribute('data-ga4-intervention-banner', '')
      document.body.appendChild(div)
    })

    afterEach(function () {
      document.body.removeChild(div)
    })

    it('correctly sets the parameter when the banner exists and no cookie exists', function () {
      div.setAttribute('data-intervention-name', 'hello-world')
      div.setAttribute('data-module', 'intervention')
      expected.page_view.intervention = 'true'
      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('doesn\'t set the intervention parameter when the banner is hidden via the cookie', function () {
      div.setAttribute('data-ga4-intervention-banner', '')
      div.setAttribute('data-module', 'intervention')
      div.setAttribute('data-intervention-name', 'hello-world')
      window.GOVUK.setCookie('intervention_campaign', 'hello-world')
      expected.page_view.intervention = undefined
      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
      expect(window.dataLayer[0]).toEqual(expected)
      window.GOVUK.setCookie('intervention_campaign', '')
    })
  })

  it('correctly sets the global_banner parameter', function () {
    var div = document.createElement('div')
    div.setAttribute('data-ga4-global-banner', '')
    document.body.appendChild(div)
    expected.page_view.global_bar = 'true'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
    document.body.removeChild(div)
  })

  it('correctly sets the query_string parameter with PII and _ga/_gl values redacted', function () {
    spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?query1=hello&query2=world&email=email@example.com&postcode=SW12AA&birthday=1990-01-01&_ga=19900101.567&_gl=19900101.567&ni_number=AA+123456+A')
    expected.page_view.query_string = 'query1=hello&query2=world&email=[email]&postcode=[postcode]&birthday=[date]&_ga=[id]&_gl=[id]&ni_number=[ni number]'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the query_string parameter without PII date redaction when a search term exists', function () {
    spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?keywords=hello&query2=world&email=email@example.com&postcode=SW12AA&birthday=1990-01-01&_ga=19900101.567&_gl=19900101.567')
    expected.page_view.search_term = 'hello'
    expected.page_view.query_string = 'keywords=hello&query2=world&email=[email]&postcode=[postcode]&birthday=1990-01-01&_ga=[id]&_gl=[id]'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  describe('search_term parameter', function () {
    describe('using the query parameter "keywords"', function () {
      it('correctly sets the parameter using ?keywords= with PII values redacted', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?keywords=hello+world+email@example.com+SW12AA+1990-01-01&another=one')
        expected.page_view.query_string = 'keywords=hello+world+[email]+[postcode]+1990-01-01&another=one'
        expected.page_view.search_term = 'hello world [email] [postcode] 1990-01-01'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('correctly sets the parameter using &keywords= with PII values redacted (except for dates)', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?test=true&keywords=hello+world+email@example.com+SW12AA+1990-01-01&another=one')
        expected.page_view.query_string = 'test=true&keywords=hello+world+[email]+[postcode]+1990-01-01&another=one'
        expected.page_view.search_term = 'hello world [email] [postcode] 1990-01-01'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('replaces plusses with spaces, and removes extra lines and spaces', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?test=true&keywords=hello++%2B+world+there+are+spaces++in+++a+lot++++of++\n++places')
        expected.page_view.query_string = 'test=true&keywords=hello++%2B+world+there+are+spaces++in+++a+lot++++of++\n++places'
        expected.page_view.search_term = 'hello world there are spaces in a lot of places'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('sets the search term to lowercase', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?test=true&keywords=I+AM+LOWERCASE')
        expected.page_view.query_string = 'test=true&keywords=I+AM+LOWERCASE'
        expected.page_view.search_term = 'i am lowercase'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('correctly ignores other query string values', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?keywordss=not+search&keyywords=not+search+either&hello=world')
        expected.page_view.query_string = 'keywordss=not+search&keyywords=not+search+either&hello=world'
        expected.page_view.search_term = undefined
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('decodes URL encoded characters in the search term', function () {
        spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('?keywords=%5Btesting%5Dtesting!+"123"')
        expected.page_view.query_string = 'keywords=%5Btesting%5Dtesting!+"123"'
        expected.page_view.search_term = '[testing]testing! "123"'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })
    })

    describe('using the data-ga4-search-query attribute', function () {
      var div
      beforeEach(function () {
        div = document.createElement('div')
        document.body.appendChild(div)
      })

      afterEach(function () {
        document.body.removeChild(div)
      })

      it('correctly sets the parameter with PII values redacted (except for dates)', function () {
        div.setAttribute('data-ga4-search-query', 'hello world email@example.com SW12AA 1990-01-01')
        expected.page_view.search_term = 'hello world [email] [postcode] 1990-01-01'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('replaces plusses with spaces, and removes extra lines and spaces', function () {
        div.setAttribute('data-ga4-search-query', 'hello++%2B+world+there+are+spaces++in+++a+lot++++of++\n++places')
        expected.page_view.search_term = 'hello world there are spaces in a lot of places'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      it('sets the search term to lowercase', function () {
        div.setAttribute('data-ga4-search-query', 'I AM LOWERCASE')
        expected.page_view.search_term = 'i am lowercase'
        GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
        expect(window.dataLayer[0]).toEqual(expected)
      })
    })

    it('functions correctly when there is no query string or data-ga4-search-query attribute', function () {
      spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getSearch').and.returnValue('')
      expected.page_view.search_term = undefined
      expected.page_view.query_string = undefined
      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  it('correctly sets the spelling_suggestion parameter', function () {
    createMetaTags('spelling-suggestion', 'tax')
    expected.page_view.spelling_suggestion = 'tax'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('correctly sets the discovery_engine_attribution_token parameter', function () {
    createMetaTags('discovery-engine-attribution-token', 'searchyMcSearch')
    expected.page_view.discovery_engine_attribution_token = 'searchyMcSearch'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  describe('tool_name parameter', function () {
    it('is unset by default', function () {
      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

      expect(window.dataLayer[0].page_view.tool_name).toBeUndefined()
    })

    it('is set to "autocomplete" if the user used search autocomplete on the previous page', function () {
      spyOn(window.sessionStorage, 'getItem').and.callFake(function (key) {
        return key === 'searchAutocompleteAccepted' ? 'true' : undefined
      })

      GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

      expect(window.dataLayer[0].page_view.tool_name).toEqual('autocomplete')
    })
  })

  it('returns a canonical_url if the link element exists', function () {
    var link = document.createElement('link')
    var head = document.getElementsByTagName('head')[0]

    link.setAttribute('rel', 'canonical')
    link.setAttribute('href', 'https://www.gov.uk/benefits-calculators/')

    head.appendChild(link)

    expected.page_view.canonical_url = 'https://www.gov.uk/benefits-calculators/'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)

    head.removeChild(link)
  })

  it('falls back to constructing a canonical_url if the link element doesn\'t exist', function () {
    var meta = document.createElement('meta')
    meta.setAttribute('name', 'govuk:ga4-base-path')
    meta.setAttribute('content', '/browse/example')
    var head = document.getElementsByTagName('head')[0]

    head.appendChild(meta)

    expected.page_view.canonical_url = window.location.origin + '/browse/example'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)

    head.removeChild(meta)
  })
})
