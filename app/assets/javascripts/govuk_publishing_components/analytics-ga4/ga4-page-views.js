window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var PageViewTracker = {
    PIIRemover: new window.GOVUK.analyticsGa4.PIIRemover(), // imported in analytics-ga4.js
    nullValue: undefined,

    init: function (referrer) {
      if (window.dataLayer) {
        var data = {
          event: 'page_view',
          page_view: {
            location: this.getLocation(),
            /* If the init() function receives a referrer parameter, this indicates that it has been called as a part of an AJAX request and
            this.getReferrer() will not return the correct value. Therefore we need to rely on the referrer parameter. */
            referrer: this.getReferrer(referrer),
            title: this.getTitle(),
            status_code: this.getStatusCode(),
            viewport_size: this.getViewPort(),

            ab_test: this.getMetaContent('ab-test'),
            document_type: this.getMetaContent('format'),
            publishing_app: this.getMetaContent('publishing-app'),
            rendering_app: this.getMetaContent('rendering-app'),
            schema_name: this.getMetaContent('schema-name'),
            content_id: this.getMetaContent('content-id'),

            browse_topic: this.getMetaContent('ga4-browse-topic'),
            navigation_page_type: this.getMetaContent('navigation-page-type'),
            navigation_list_type: this.getMetaContent('navigation-list-type'),
            step_navs: this.getMetaContent('stepnavs'),
            taxonomy_level1: this.getMetaContent('themes'),
            taxonomy_main: this.getMetaContent('taxon-slug'),
            taxonomy_main_id: this.getMetaContent('taxon-id'),
            taxonomy_all: this.getMetaContent('taxon-slugs'),
            taxonomy_all_ids: this.getMetaContent('taxon-ids'),

            language: this.getLanguage(),
            history: this.getHistory(),
            withdrawn: this.getWithDrawn(),
            first_published_at: this.stripTimeFrom(this.getMetaContent('first-published-at')),
            updated_at: this.stripTimeFrom(this.getMetaContent('updated-at')),
            public_updated_at: this.stripTimeFrom(this.getMetaContent('public-updated-at')),
            publishing_government: this.removeHyphensAndDowncase(this.getMetaContent('publishing-government') || this.getMetaContent('ga4-publishing-government')),
            political_status: this.getMetaContent('political-status') || this.getMetaContent('ga4-political-status'),
            primary_publishing_organisation: this.getMetaContent('primary-publishing-organisation'),
            organisations: this.getMetaContent('analytics:organisations'),
            world_locations: this.getMetaContent('analytics:world-locations'),

            /* The existence of a referrer parameter indicates that the page has been dynamically updated via an AJAX request
            and therefore we can use it to set the dynamic property appropriately. This value is used by PA's to differentiate
            between fresh page loads and dynamic page updates. */
            dynamic: referrer ? 'true' : 'false',
            emergency_banner: document.querySelector('[data-ga4-emergency-banner]') ? 'true' : undefined,
            phase_banner: this.getElementAttribute('data-ga4-phase-banner') || undefined,
            devolved_nations_banner: this.getElementAttribute('data-ga4-devolved-nations-banner') || undefined,
            cookie_banner: this.getBannerPresence('[data-ga4-cookie-banner]'),
            intervention: this.getBannerPresence('[data-ga4-intervention-banner]'),
            query_string: this.getQueryString(),
            search_term: this.getSearchTerm(),
            spelling_suggestion: this.getMetaContent('spelling-suggestion')
          }
        }
        window.GOVUK.analyticsGa4.core.sendData(data)
      }
    },

    removeHyphensAndDowncase: function (text) {
      if (text) {
        return text.replace(/-/g, ' ').toLowerCase()
      }
    },

    getLocation: function () {
      return this.PIIRemover.stripPIIWithOverride(this.stripGaParam(document.location.href), true, true)
    },

    getSearchTerm: function () {
      var queryString = window.GOVUK.analyticsGa4.core.trackFunctions.getSearch()

      if (!queryString) {
        return undefined
      }

      var searchTerm = queryString.match(/keywords=([^&]*)/)
      if (!searchTerm) {
        return undefined
      }

      searchTerm = searchTerm[0].replace('keywords=', '')
      searchTerm = window.GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(searchTerm)

      return searchTerm
    },

    getQueryString: function () {
      var queryString = window.GOVUK.analyticsGa4.core.trackFunctions.getSearch()
      if (queryString) {
        queryString = this.stripGaParam(queryString)
        queryString = this.PIIRemover.stripPIIWithOverride(queryString, true, true)
        queryString = queryString.substring(1) // removes the '?' character from the start.
        return queryString
      }
    },

    getReferrer: function (referrer) {
      referrer = this.stripGaParam(referrer || document.referrer)
      return this.PIIRemover.stripPIIWithOverride(referrer, true, true)
    },

    // remove GA parameters of the form _ga=2320.021-012302 or _gl=02.10320.01230-123
    stripGaParam: function (str) {
      str = str.replace(/(_ga=[0-9.-]+)/g, '_ga=[id]')
      str = str.replace(/(_gl=[a-zA-Z0-9._\-*]+)/g, '_gl=[id]')
      return str
    },

    getTitle: function () {
      return this.PIIRemover.stripPIIWithOverride(document.title, true, true)
    },

    // window.httpStatusCode is set in the source of the error page in static
    // https://github.com/alphagov/static/blob/1c734451f2dd6fc0c7e80beccbdcbfa5aaffd0e4/app/views/root/_error_page.html.erb#L41-L43
    getStatusCode: function () {
      if (window.httpStatusCode) {
        return window.httpStatusCode.toString()
      } else {
        return '200'
      }
    },

    getViewPort: function () {
      var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      return vw + 'x' + vh
    },

    getMetaContent: function (name) {
      var tag = document.querySelector('meta[name="govuk:' + name + '"]')
      if (tag) {
        var contentAttribute = tag.getAttribute('content')
        if (contentAttribute === '') {
          return undefined
        }
        return contentAttribute
      } else {
        return this.nullValue
      }
    },

    getElementAttribute: function (attributeName) {
      var el = document.querySelector('[' + attributeName + ']')
      if (el) {
        return el.getAttribute(attributeName)
      }
    },

    getLanguage: function () {
      var content = document.getElementById('content')
      var html = document.querySelector('html')
      if (content) {
        var contentLanguage = content.getAttribute('lang')
        if (contentLanguage) {
          return contentLanguage
        }
      }
      // html.getAttribute('lang') is untested - Jasmine would not allow lang to be set on <html>.
      return html.getAttribute('lang') || this.nullValue
    },

    getHistory: function () {
      var history = this.getMetaContent('content-has-history')
      return (history === 'true') ? 'true' : 'false'
    },

    getWithDrawn: function () {
      var withdrawn = this.getMetaContent('withdrawn')
      return (withdrawn === 'withdrawn') ? 'true' : 'false'
    },

    getBannerPresence: function (bannerSelector) {
      /* If the user hides the banner using JS, a cookie is set to hide it on future page loads.
       * Therefore we need to start the banner module early so that it hides if this cookie exists.
       * Without this, our pageview object will track the banner as visible before it gets hidden. */

      var banner = document.querySelector(bannerSelector)

      if (banner) {
        window.GOVUK.modules.start(banner)
        var bannerHidden = banner.getAttribute('hidden') === '' || banner.getAttribute('hidden')

        if (bannerHidden) {
          return undefined
        }
        return 'true'
      }
      return undefined
    },

    // return only the date from given timestamps of the form
    // 2022-03-28T19:11:00.000+00:00
    stripTimeFrom: function (value) {
      if (value !== undefined) {
        return value.split('T')[0]
      } else {
        return this.nullValue
      }
    }
  }

  analyticsModules.PageViewTracker = PageViewTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
