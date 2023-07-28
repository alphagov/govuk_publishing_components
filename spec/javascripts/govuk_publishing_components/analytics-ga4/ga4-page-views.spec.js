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
      page_view: {
        location: document.location.href,
        referrer: document.referrer,
        title: 'This here page',
        status_code: '200',

        ab_test: undefined,
        document_type: undefined,
        publishing_app: undefined,
        rendering_app: undefined,
        schema_name: undefined,
        content_id: undefined,

        browse_topic: undefined,
        navigation_page_type: undefined,
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

        dynamic: 'false'
      }
    }
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
        tagName: 'section',
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
        tagName: 'themes',
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
      if (tag.gtmName === 'taxonomy_all_ids' || tag.gtmName === 'taxonomy_all') {
        expected.page_view[tag.gtmName] = {
          1: tag.value,
          2: undefined,
          3: undefined,
          4: undefined,
          5: undefined
        }
      } else {
        expected.page_view[tag.gtmName] = tag.value
      }
    }

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('splits taxonomy_all and taxonomy_all_ids into five parts', function () {
    var tags = [
      {
        gtmName: 'taxonomy_all',
        tagName: 'taxon-slugs',
        value: 'finance-support,premises-rates,company-closure-administration-liquidation-and-insolvency,contract-working-hours,dismissals-redundancies,food-and-farming-industry,producing-distributing-food-food-labelling,recruiting-hiring,recruiting-hiring,redundancies-dismissals,sale-goods-services-data,scientific-research-and-development,self-employed'
      },
      {
        gtmName: 'taxonomy_all_ids',
        tagName: 'taxon-ids',
        value: 'ccfc50f5-e193-4dac-9d78-50b3a8bb24c5,68cc0b3c-7f80-4869-9dc7-b2ceef5f4f08,864fe969-7d5a-4251-b8b5-a50d57be943f,23a712ff-23b3-4f5a-83f1-44ac679fe615,a1c6c263-e4ef-4b96-b82f-e070ff157367,e2559668-cf36-47fc-8a77-2e760e12a812,f1126ffb-e352-4129-bb33-8e4dfdbee9ac,c195d3e6-5924-4def-b1c2-24a685a0b210,55e8ea89-9ba8-4439-a703-7d26723a4ec0,a4d954b4-3a64-488c-a0fc-fa91ecb8cf2b,c39ac533-be2c-4460-93ba-e656793568ef,429bf677-b514-4c10-8a89-c0eee4acc7ec,24e91c04-21cb-479a-8f23-df0eaab31788thistextisincluded!!ButThisSentenceIsNotAsItIsOver500Characters.'
      }
    ]

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      createMetaTags(tag.tagName, tag.value)
    }

    // taxonomy_all
    expected.page_view[tags[0].gtmName] = {
      1: 'finance-support,premises-rates,company-closure-administration-liquidation-and-insolvency,contract-wo',
      2: 'rking-hours,dismissals-redundancies,food-and-farming-industry,producing-distributing-food-food-label',
      3: 'ling,recruiting-hiring,recruiting-hiring,redundancies-dismissals,sale-goods-services-data,scientific',
      4: '-research-and-development,self-employed',
      5: undefined
    }

    // taxonomy_all_ids
    expected.page_view[tags[1].gtmName] = {
      1: 'ccfc50f5-e193-4dac-9d78-50b3a8bb24c5,68cc0b3c-7f80-4869-9dc7-b2ceef5f4f08,864fe969-7d5a-4251-b8b5-a5',
      2: '0d57be943f,23a712ff-23b3-4f5a-83f1-44ac679fe615,a1c6c263-e4ef-4b96-b82f-e070ff157367,e2559668-cf36-4',
      3: '7fc-8a77-2e760e12a812,f1126ffb-e352-4129-bb33-8e4dfdbee9ac,c195d3e6-5924-4def-b1c2-24a685a0b210,55e8',
      4: 'ea89-9ba8-4439-a703-7d26723a4ec0,a4d954b4-3a64-488c-a0fc-fa91ecb8cf2b,c39ac533-be2c-4460-93ba-e65679',
      5: '3568ef,429bf677-b514-4c10-8a89-c0eee4acc7ec,24e91c04-21cb-479a-8f23-df0eaab31788thistextisincluded!!'
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

  it('returns a pageview on a page marked with a political status', function () {
    createMetaTags('political-status', 'ongoing')
    expected.page_view.political_status = 'ongoing'
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
    createMetaTags('analytics:organisations', 'some organisations')
    expected.page_view.organisations = 'some organisations'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with world locations', function () {
    createMetaTags('analytics:world-locations', 'some world locations')
    expected.page_view.world_locations = 'some world locations'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('removes email pii from the title, location and referrer', function () {
    document.title = 'example@gov.uk'
    expected.page_view.title = '[email]'

    spyOnProperty(document, 'referrer', 'get').and.returnValue('https://gov.uk/example@gov.uk')
    expected.page_view.referrer = 'https://gov.uk/[email]'

    // We can't spy on location, so instead we use an anchor link to change the URL temporarily

    // Reset the URL so we can build the expected link string
    var linkForURLMock = document.createElement('a')
    linkForURLMock.href = '#'
    linkForURLMock.click()
    var location = document.location.href

    expected.page_view.location = location + '[email]'

    // Add email address to the current page location
    linkForURLMock.href = '#example@gov.uk'
    linkForURLMock.click()

    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()

    // Reset the page location for other tests
    linkForURLMock.href = '#'
    linkForURLMock.click()

    expect(window.dataLayer[0]).toEqual(expected)
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

  it('correctly sets the navigation-type parameter', function () {
    createMetaTags('navigation-page-type', 'Browse level 2')
    expected.page_view.navigation_page_type = 'Browse level 2'
    GOVUK.analyticsGa4.analyticsModules.PageViewTracker.init()
    expect(window.dataLayer[0]).toEqual(expected)
  })
})
