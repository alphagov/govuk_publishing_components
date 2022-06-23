/* global describe it expect beforeEach afterEach spyOn */
describe('custom dimensions', function () {
  'use strict'
  var GOVUK = window.GOVUK

  afterEach(function () {
    var head = document.getElementsByTagName('head')[0]
    var metas = document.querySelectorAll("[name^='govuk']")
    for (var i = 0; i < metas.length; i++) {
      head.removeChild(metas[i])
    }
  })

  it('adds a custom dimension', function () {
    var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({ label: 'testLabel' })
    expect(test.label).toEqual('testLabel')
    expect(test.dimension15.value).toEqual('200')
  })

  it('overrides an existing custom dimension', function () {
    var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({ dimension15: 'spinnaker' })
    expect(test.dimension15).toEqual('spinnaker')
  })

  describe('gets custom dimensions from meta tags', function () {
    var dimensions = {
      section: { dimension: 1, testValue: 'test-1' },
      format: { dimension: 2, testValue: 'test-2' },
      themes: { dimension: 3, defaultValue: 'other', testValue: 'test-3' },
      'content-id': { dimension: 4, defaultValue: '00000000-0000-0000-0000-000000000000', testValue: 'test-4' },
      'search-result-count': { dimension: 5, testValue: 'test-5' },
      'publishing-government': { dimension: 6, testValue: 'test-6' },
      'political-status': { dimension: 7, testValue: 'test-7' },
      'analytics:organisations': { dimension: 9, testValue: 'test-9' },
      'analytics:world-locations': { dimension: 10, testValue: 'test-10' },
      withdrawn: { dimension: 12, defaultValue: 'not withdrawn', testValue: 'test-12' },
      'schema-name': { dimension: 17, testValue: 'test-17' },
      'rendering-application': { dimension: 20, testValue: 'test-20' },
      'search-autocomplete-status': { dimension: 21, testValue: 'test-21' },
      'navigation-legacy': { dimension: 30, defaultValue: 'none', testValue: 'test-30' },
      'navigation-list-type': { dimension: 31, defaultValue: 'none', testValue: 'test-31' },
      'navigation-page-type': { dimension: 32, defaultValue: 'none', testValue: 'test-32' },
      'taxon-slug': { dimension: 56, defaultValue: 'other', testValue: 'test-56' },
      'taxon-id': { dimension: 57, defaultValue: 'other', testValue: 'test-57' },
      'taxon-slugs': { dimension: 58, defaultValue: 'other', testValue: 'test-58' },
      'taxon-ids': { dimension: 59, defaultValue: 'other', testValue: 'test-59' },
      'content-has-history': { dimension: 39, defaultValue: 'false', testValue: 'test-39' },
      'publishing-app': { dimension: 89, testValue: 'test-89' },
      'brexit-audience': { dimension: 112, testValue: 'test-112' },
      'brexit-superbreadcrumb': { dimension: 111, testValue: 'test-111' },
      stepnavs: { dimension: 96, testValue: 'test-96' },
      'relevant-result-shown': { dimension: 83, testValue: 'test-83' },
      'spelling-suggestion': { dimension: 81, testValue: 'test-81' }
    }

    function createMetaTags () {
      var metatag
      for (var key in dimensions) {
        metatag = document.createElement('meta')
        metatag.setAttribute('name', 'govuk:' + key)
        metatag.setAttribute('content', dimensions[key].testValue)
        document.getElementsByTagName('head')[0].appendChild(metatag)
      }
    }

    function testMetas (data, testDefaults) {
      for (var key in dimensions) {
        var thisDimension = dimensions[key]
        var dimension = 'dimension' + thisDimension.dimension
        var value = thisDimension.testValue

        if (!testDefaults) {
          if (data[dimension].value !== value) {
            return false
          }
        } else if (testDefaults && thisDimension.defaultValue) {
          value = thisDimension.defaultValue
          if (data[dimension].value !== value) {
            return false
          }
        }
      }
      return true
    }

    it('when no custom values are given', function () {
      var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions()
      expect(testMetas(test, true)).toBe(true)
    })

    it('when every custom value is given', function () {
      createMetaTags(true)
      var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions()
      expect(testMetas(test)).toEqual(true)
    })
  })

  describe('getting custom dimensions from the DOM', function () {
    var body
    var fakeMain
    var fakeBanner

    beforeEach(function () {
      body = document.getElementsByTagName('body')[0]
      fakeMain = document.createElement('main')
      fakeMain.setAttribute('id', 'content')
      fakeBanner = document.createElement('div')
      fakeBanner.setAttribute('data-module', 'global-bar')
      body.appendChild(fakeMain)
      body.appendChild(fakeBanner)

      spyOn(GOVUK.PageContent, 'getNumberOfSections').and.returnValue('one million')
      spyOn(GOVUK.PageContent, 'getNumberOfLinks').and.returnValue('one hundred billion dollars')
    })

    afterEach(function () {
      body.removeChild(fakeMain)
      body.removeChild(fakeBanner)
    })

    it('when the global banner is not visible and the main element has no language set', function () {
      fakeBanner.style.display = 'none'
      var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions()
      expect(test.dimension26.value).toEqual('one million')
      expect(test.dimension27.value).toEqual('one hundred billion dollars')
      expect(test.dimension23.value).toEqual('unknown')
      expect(test.dimension38.value).toEqual('false')
    })

    it('when the global banner is visible and the main element has a language set', function () {
      fakeBanner.style.display = 'block'
      fakeMain.setAttribute('lang', 'dutch')
      var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions()
      expect(test.dimension26.value).toEqual('one million')
      expect(test.dimension27.value).toEqual('one hundred billion dollars')
      expect(test.dimension23.value).toEqual('dutch')
      expect(test.dimension38.value).toEqual('Global Banner viewed')
    })
  })

  it('gets custom dimensions for ab tests', function () {
    var meta = document.createElement('meta')
    meta.setAttribute('name', 'govuk:ab-test')
    meta.setAttribute('content', 'big boy')
    meta.setAttribute('data-analytics-dimension', '2001')
    document.getElementsByTagName('head')[0].appendChild(meta)
    var test = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions()
    expect(test.dimension2001.value).toEqual('big boy')
  })
})
