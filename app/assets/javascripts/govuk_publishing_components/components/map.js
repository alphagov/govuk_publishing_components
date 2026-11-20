/* global defra */
/* istanbul ignore next */
window.GOVUK = window.GOVUK || {}
/* istanbul ignore next */
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class Map {
    constructor ($module) {
      this.$module = $module
      this.map_element = this.$module.querySelector('.gem-c-map')
      this.map_id = this.$module.getAttribute('id')
      this.trackingEnabled = this.$module.getAttribute('data-tracking-enabled') === 'true'
      this.headingLevel = parseInt(this.$module.getAttribute('data-heading-level')) || 2
      const cspWorker = this.$module.getAttribute('data-csp-worker')
      this.geoJson = this.$module.getAttribute('data-geojson')
      this.trackingActive = false
      this.panelId = 'the-panel'

      if (this.geoJson) {
        if (!this.geoJson.startsWith('/') && !this.geoJson.startsWith('data:')) {
          console.error('Error: passed geoJSON must be valid and not be an external URL')
          this.geoJson = false
        }
      }

      let datasetsPlugin = false
      if (this.geoJson) {
        datasetsPlugin = defra.datasetsPlugin({
          datasets: [{
            id: 'features',
            geojson: this.geoJson,
            generateIds: true,
            showInMenu: false,
            minZoom: 1,
            maxZoom: 24, // these must exceed the values used by the map config
            style: {
              symbol: 'pin',
              symbolBackgroundColor: '#ca3535',
              symbolForegroundColor: '#ca3535'
            }
          }]
        })
      }

      this.interactPlugin = defra.interactPlugin({
        deselectOnClickOutside: true,
        interactionModes: ['selectFeature'],
        layers: [
          { layerId: 'features', labelProperty: 'name' }
        ]
      })

      // add the site font into the map styles
      window.GOVUK.mapComponentStyles = window.GOVUK.mapComponentStyles || {}
      window.GOVUK.mapComponentStyles['font-faces'] = {
        'GDS Transport': [
          {
            url: this.$module.getAttribute('data-font-light')
          }
        ],
        'GDS Transport Bold': [
          {
            url: this.$module.getAttribute('data-font-bold')
          }
        ]
      }

      const config = {
        mapProvider: defra.maplibreProvider({ workerUrl: cspWorker }),
        behaviour: 'inline',
        mapStyle: {
          url: window.GOVUK.mapComponentStyles,
          selectedColor: '#000000',
          haloColor: '#FFFFFF',
          attribution: ''
        },
        plugins: [this.interactPlugin, datasetsPlugin],
        urlPosition: 'none',
        minZoom: 4,
        maxZoom: 16,
        center: [-0.09, 51.505],
        containerHeight: '500px'
      }
      const passedConfig = JSON.parse(this.$module.getAttribute('data-config')) || {}
      this.config = Object.assign(config, passedConfig)
    }

    init () {
      const id = this.$module.getAttribute('id')
      this.$module.setAttribute('id', '')
      this.map_element.setAttribute('id', id)
      this.map_element.classList.add('gem-c-map--enabled')
      this.map = new defra.InteractiveMap(this.map_id, this.config)

      /* istanbul ignore next */
      this.map.on('map:ready', () => {
        this.interactPlugin.enable()
        this.map.addPanel(this.panelId, {
          focus: false,
          label: false,
          showLabel: false,
          html: '<div class="map-panel-content"></div>',
          mobile: { slot: 'drawer', dismissible: true },
          tablet: { slot: 'left-top', dismissible: true, width: '280px' },
          desktop: { slot: 'left-top', dismissible: true, width: '280px' }
        })
        this.map.hidePanel(this.panelId)
        if (this.trackingEnabled) {
          this.trackingActive = true
        }
      })

      /* istanbul ignore next */
      this.map.on('app:panelopened', ({ panelId }) => {
        if (panelId !== 'keyboardHelp') {
          this.panelOpen = true
          this.sendAnalytics({
            event_name: 'select_content',
            type: 'map',
            action: 'opened',
            text: this.currentMarkerName
          })
        }
      })

      /* istanbul ignore next */
      this.map.on('app:panelclosed', ({ panelId }) => {
        if (panelId !== 'keyboardHelp') {
          if (this.panelOpen) {
            this.sendAnalytics({
              event_name: 'select_content',
              type: 'map',
              action: 'closed',
              text: this.currentMarkerName
            })
            this.panelOpen = false
          }
        }
      })

      /* istanbul ignore next */
      this.map.on('interact:selectionchange', (e) => {
        if (!this.panelContent) {
          this.panelContent = this.$module.querySelector('.map-panel-content')
        }

        if (e.selectedFeatures.length > 0) {
          const currentMarker = e.selectedFeatures[0]
          this.currentMarkerName = currentMarker.properties.name
          this.panelContent.innerHTML = this.createPopupContent(currentMarker)
          this.map.showPanel(this.panelId)
          this.sendAnalytics({
            event_name: 'select_content',
            type: 'map',
            action: 'marker click',
            text: this.currentMarkerName
          })
        } else {
          this.map.hidePanel(this.panelId)
        }
      })

      /* istanbul ignore next */
      this.map.on('app:panelclosed', (e) => {
        this.interactPlugin.clear()
      })
    }

    createPopupContent (feat) {
      const heading = `h${this.headingLevel}`
      let markup = `<${heading} class="govuk-heading-s govuk-!-margin-bottom-2">${feat.properties.name}</${heading}>`
      const para = function (item) {
        return `<p class="govuk-body govuk-!-margin-bottom-2">${item}</p>`
      }

      const keys = Object.keys(feat.properties)
      keys.forEach((key) => {
        if (key === 'url') {
          markup = `${markup} ${para(`<a href="${feat.properties[key]}" class="gem-c-map__link">${feat.properties[key]}</a>`)}`
        } else if (key === 'email') {
          markup = `${markup} ${para(`<a href="mailto:${feat.properties[key]}" class="gem-c-map__link">${feat.properties[key]}</a>`)}`
        } else if (key !== 'name') {
          markup = `${markup} ${para(feat.properties[key])}`
        }
      })
      markup = this.removeScript(markup)
      return markup
    }

    removeScript (input) {
      do {
        input = input.replace(/<[\s]*script/g, '')
      } while (input.includes('<script'))
      return input
    }

    /* istanbul ignore next */
    sendAnalytics (data) {
      if (window.dataLayer && this.trackingActive) {
        window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
      }
    }
  }
  Modules.Map = Map
})(window.GOVUK.Modules)
