/* global defra */
describe('Map component', function () {
  'use strict'

  let el, module

  function setupMap (config, url, enableGa4) {
    el = document.createElement('div')
    el.setAttribute('id', 'map-1234')
    if (config) { el.setAttribute('data-config', JSON.stringify(config)) }
    if (url) { el.setAttribute('data-geojson', url) }
    if (enableGa4) { el.setAttribute('data-tracking-enabled', true) }
    el.innerHTML = '<div class="app-c-map"></div>'
    document.body.appendChild(el)
    module = new GOVUK.Modules.Map(el)
  }

  beforeEach(function () {
    spyOn(defra, 'InteractiveMap').and.callFake(function () {
      return {
        on: function () {}
      }
    })
    spyOn(defra, 'interactPlugin').and.callFake(function () {
      return {
        enable: function () {}
      }
    })
  })

  afterEach(function () {
    document.body.removeChild(el)
  })

  // map is prevented from loading if config not passed by the template
  // but this assumes we've passed that point
  describe('initialising the map correctly', function () {
    beforeEach(function () {
      setupMap()
      module.init()
    })

    it('has default config', function () {
      expect(module.config).toEqual(jasmine.objectContaining({
        minZoom: 4,
        maxZoom: 16,
        center: [-0.09, 51.505],
        containerHeight: '500px'
      }))
    })

    it('configures the map element', function () {
      expect(el.getAttribute('id')).toEqual('')
      expect(el.querySelector('.app-c-map').getAttribute('id')).toEqual('map-1234')
      expect(el.querySelector('.app-c-map')).toHaveClass('app-c-map--enabled')
    })
  })

  describe('with passed options', function () {
    const config = {
      centre_lat: 1,
      centre_lng: 2,
      zoom: 9,
      maxBounds: [-1, 3, 3, 5]
    }

    beforeEach(function () {
      setupMap(config)
      module.init()
    })

    it('accepts basic config', function () {
      expect(module.config.centre_lat).toEqual(1)
      expect(module.config.centre_lng).toEqual(2)
      expect(module.config.zoom).toEqual(9)
      expect(module.config.maxBounds).toEqual([-1, 3, 3, 5])
    })
  })

  describe('when given a geojson file', function () {
    it('accepts a relative URL', function () {
      setupMap(false, '/fake/test.geojson')
      expect(module.geoJson).toEqual('/fake/test.geojson')
    })

    it('rejects a non-relative URL', function () {
      setupMap(false, 'fake/test.geojson')
      expect(module.geoJson).toEqual(false)
    })

    it('rejects any other URL', function () {
      setupMap(false, 'https://example.com/test.geojson')
      expect(module.geoJson).toEqual(false)
    })

    it('accepts base64 encoded geoJSON', function () {
      const geoJSON = 'data:application/geo+json;base64,ewogICJ0eXBlIjogI'
      setupMap(false, geoJSON)
      expect(module.geoJson).toEqual(geoJSON)
    })
  })

  const feature1 = {
    properties: {
      name: 'Name'
    }
  }

  const feature2 = {
    properties: {
      name: 'Name',
      description: 'Description',
      address: 'Address',
      battlecry: 'spoon'
    }
  }

  const feature3 = {
    properties: {
      name: 'Name',
      url: 'https://www.gov.uk',
      email: 'test@test.com'
    }
  }

  describe('the createPopupContent function', function () {
    beforeEach(function () {
      el = document.createElement('div')
      document.body.appendChild(el)
      module = new GOVUK.Modules.Map(el)
    })

    it('creates content when there is only a name', function () {
      const result = module.createPopupContent(feature1)
      expect(result).toEqual('<h2 class="govuk-heading-s govuk-!-margin-bottom-2">Name</h2>')
    })

    it('creates content when there is a name and other fields', function () {
      const result = module.createPopupContent(feature2)
      expect(result).toEqual('<h2 class="govuk-heading-s govuk-!-margin-bottom-2">Name</h2> <p class="govuk-body govuk-!-margin-bottom-2">Description</p> <p class="govuk-body govuk-!-margin-bottom-2">Address</p> <p class="govuk-body govuk-!-margin-bottom-2">spoon</p>')
    })

    it('sets heading levels based on the passed value', function () {
      module.headingLevel = 3
      const result = module.createPopupContent(feature1)
      expect(result).toEqual('<h3 class="govuk-heading-s govuk-!-margin-bottom-2">Name</h3>')
    })

    it('transforms the url and email fields appropriately', function () {
      const result = module.createPopupContent(feature3)
      expect(result).toEqual('<h2 class="govuk-heading-s govuk-!-margin-bottom-2">Name</h2> <p class="govuk-body govuk-!-margin-bottom-2"><a href="https://www.gov.uk" class="app-c-map__link">https://www.gov.uk</a></p> <p class="govuk-body govuk-!-margin-bottom-2"><a href="mailto:test@test.com" class="app-c-map__link">test@test.com</a></p>')
    })
  })

  describe('with analytics enabled', function () {
    beforeEach(function () {
      window.dataLayer = []
      setupMap({}, false, true)
      module.init()
    })

    afterEach(function () {
      delete window.dataLayer
    })

    it('detects that tracking should occur', function () {
      expect(module.trackingEnabled).toEqual(true)
    })
  })
})
