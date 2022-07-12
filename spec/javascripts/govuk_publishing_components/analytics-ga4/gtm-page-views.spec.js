/* eslint-env jasmine */

describe('Google Tag Manager page view tracking', function () {
  var GOVUK = window.GOVUK
  var saved = {}
  var expected

  beforeEach(function () {
    saved.title = document.title
    document.title = 'This here page'
    expected = {
      event: 'config_ready',
      page: {
        location: document.location.href,
        referrer: document.referrer,
        title: 'This here page',
        status_code: 200
      },
      publishing: {
        document_type: 'n/a',
        publishing_app: 'n/a',
        rendering_application: 'n/a',
        schema_name: 'n/a',
        content_id: 'n/a'
      },
      taxonomy: {
        section: 'n/a',
        taxon_slug: 'n/a',
        taxon_id: 'n/a',
        themes: 'n/a',
        taxon_slugs: 'n/a',
        taxon_ids: 'n/a'
      },
      content: {
        language: 'n/a',
        history: 'false',
        withdrawn: 'false',
        first_published_at: 'n/a',
        updated_at: 'n/a',
        public_updated_at: 'n/a',
        publishing_government: 'n/a',
        political_status: 'n/a',
        primary_publishing_organisation: 'n/a',
        organisations: 'n/a',
        world_locations: 'n/a'
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

  function createMetaTags (key, value) {
    var metatag = document.createElement('meta')
    metatag.setAttribute('name', 'govuk:' + key)
    metatag.setAttribute('content', value)
    document.getElementsByTagName('head')[0].appendChild(metatag)
  }

  it('returns a standard page view', function () {
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with a specific status code', function () {
    window.httpStatusCode = 404
    expected.page.status_code = 404
    GOVUK.Gtm.sendPageView()
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
        gtmName: 'rendering_application',
        tagName: 'rendering-application',
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
      expected.publishing[tag.gtmName] = tag.value
    }

    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with specific taxonomy information', function () {
    var tags = [
      {
        gtmName: 'section',
        tagName: 'section',
        value: 'this section'
      },
      {
        gtmName: 'taxon_slug',
        tagName: 'taxon-slug',
        value: 'this taxon slug'
      },
      {
        gtmName: 'taxon_id',
        tagName: 'taxon-id',
        value: 'this taxon id'
      },
      {
        gtmName: 'themes',
        tagName: 'themes',
        value: 'this theme'
      },
      {
        gtmName: 'taxon_slugs',
        tagName: 'taxon-slugs',
        value: 'this taxon slugs'
      },
      {
        gtmName: 'taxon_ids',
        tagName: 'taxon-ids',
        value: 'this taxon ids'
      }
    ]

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      createMetaTags(tag.tagName, tag.value)
      expected.taxonomy[tag.gtmName] = tag.value
    }

    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview with a language', function () {
    var html = document.querySelector('html')
    html.setAttribute('lang', 'wakandan')
    expected.content.language = 'wakandan'

    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview with history', function () {
    createMetaTags('content-has-history', 'true')
    expected.content.history = 'true'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview without history', function () {
    createMetaTags('content-has-history', 'banana')
    expected.content.history = 'false'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a withdrawn page', function () {
    createMetaTags('withdrawn', 'withdrawn')
    expected.content.withdrawn = 'true'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a first published date', function () {
    createMetaTags('first-published-at', '2022-03-28T19:11:00.000+00:00')
    expected.content.first_published_at = '2022-03-28T19:11:00.000+00:00'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a last updated date', function () {
    createMetaTags('updated-at', '2021-03-28T19:11:00.000+00:00')
    expected.content.updated_at = '2021-03-28T19:11:00.000+00:00'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page with a last public updated date', function () {
    createMetaTags('public-updated-at', '2020-03-28T19:11:00.000+00:00')
    expected.content.public_updated_at = '2020-03-28T19:11:00.000+00:00'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a publishing government', function () {
    createMetaTags('publishing-government', 'labour')
    expected.content.publishing_government = 'labour'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a political status', function () {
    createMetaTags('political-status', 'ongoing')
    expected.content.political_status = 'ongoing'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with a primary publishing organisation', function () {
    createMetaTags('primary-publishing-organisation', 'Home Office')
    expected.content.primary_publishing_organisation = 'Home Office'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with ids for contributing organisations', function () {
    createMetaTags('analytics:organisations', 'some organisations')
    expected.content.organisations = 'some organisations'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a pageview on a page marked with world locations', function () {
    createMetaTags('analytics:world-locations', 'some world locations')
    expected.content.world_locations = 'some world locations'
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })
})
