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
            referrer: referrer ? this.PIIRemover.stripPIIWithOverride(referrer, true, true) : this.getReferrer(),
            title: this.getTitle(),
            status_code: this.getStatusCode(),

            ab_test: this.getMetaContent('ab-test'),
            document_type: this.getMetaContent('format'),
            publishing_app: this.getMetaContent('publishing-app'),
            rendering_app: this.getMetaContent('rendering-app'),
            schema_name: this.getMetaContent('schema-name'),
            content_id: this.getMetaContent('content-id'),

            browse_topic: this.getMetaContent('section'),
            navigation_page_type: this.getMetaContent('navigation-page-type'),
            navigation_list_type: this.getMetaContent('navigation-list-type'),
            step_navs: this.getMetaContent('stepnavs'),
            taxonomy_level1: this.getMetaContent('themes'),
            taxonomy_main: this.getMetaContent('taxon-slug'),
            taxonomy_main_id: this.getMetaContent('taxon-id'),
            taxonomy_all: this.splitLongMetaContent('taxon-slugs'),
            taxonomy_all_ids: this.splitLongMetaContent('taxon-ids'),

            language: this.getLanguage(),
            history: this.getHistory(),
            withdrawn: this.getWithDrawn(),
            first_published_at: this.stripTimeFrom(this.getMetaContent('first-published-at')),
            updated_at: this.stripTimeFrom(this.getMetaContent('updated-at')),
            public_updated_at: this.stripTimeFrom(this.getMetaContent('public-updated-at')),
            publishing_government: this.getMetaContent('publishing-government'),
            political_status: this.getMetaContent('political-status'),
            primary_publishing_organisation: this.getMetaContent('primary-publishing-organisation'),
            organisations: this.getMetaContent('analytics:organisations'),
            world_locations: this.getMetaContent('analytics:world-locations'),

            /* The existence of a referrer parameter indicates that the page has been dynamically updated via an AJAX request
            and therefore we can use it to set the dynamic property appropriately. This value is used by PA's to differentiate
            between fresh page loads and dynamic page updates. */
            dynamic: referrer ? 'true' : 'false',
            emergency_banner: document.querySelector('[data-ga4-emergency-banner]') ? 'true' : undefined,
            phase_banner: this.getElementAttribute('data-ga4-phase-banner') || undefined,
            devolved_nations_banner: this.getElementAttribute('data-ga4-devolved-nations-banner') || undefined
          }
        }
        window.GOVUK.analyticsGa4.core.sendData(data)
      }
    },

    getLocation: function () {
      return this.PIIRemover.stripPII(document.location.href)
    },

    getReferrer: function () {
      return this.PIIRemover.stripPIIWithOverride(document.referrer, true, true)
    },

    getTitle: function () {
      return this.PIIRemover.stripPII(document.title)
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

    getMetaContent: function (name) {
      var tag = document.querySelector('meta[name="govuk:' + name + '"]')
      if (tag) {
        return tag.getAttribute('content')
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
      if (content) {
        return content.getAttribute('lang') || this.nullValue
      } else {
        return this.nullValue
      }
    },

    getHistory: function () {
      var history = this.getMetaContent('content-has-history')
      return (history === 'true') ? 'true' : 'false'
    },

    getWithDrawn: function () {
      var withdrawn = this.getMetaContent('withdrawn')
      return (withdrawn === 'withdrawn') ? 'true' : 'false'
    },

    splitLongMetaContent: function (metatag) {
      var tag = this.getMetaContent(metatag)
      if (tag) {
        return window.GOVUK.analyticsGa4.core.trackFunctions.splitStringIntoParts(tag)
      }
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
