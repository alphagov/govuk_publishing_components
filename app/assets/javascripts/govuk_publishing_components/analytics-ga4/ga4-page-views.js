window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var PageViewTracker = {
    PIIRemover: new window.GOVUK.analyticsGa4.PIIRemover(), // imported in analytics-ga4.js
    nullValue: undefined,

    init: function () {
      if (window.dataLayer) {
        var data = {
          event: 'page_view',
          page_view: {
            location: this.getLocation(),
            referrer: this.getReferrer(),
            title: this.getTitle(),
            status_code: this.getStatusCode(),

            document_type: this.getMetaContent('format'),
            publishing_app: this.getMetaContent('publishing-app'),
            rendering_app: this.getMetaContent('rendering-app'),
            schema_name: this.getMetaContent('schema-name'),
            content_id: this.getMetaContent('content-id'),

            section: this.getMetaContent('section'),
            taxon_slug: this.getMetaContent('taxon-slug'),
            taxon_id: this.getMetaContent('taxon-id'),
            themes: this.getMetaContent('themes'),
            taxon_slugs: this.getMetaContent('taxon-slugs'),
            taxon_ids: this.getMetaContent('taxon-ids'),

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
            world_locations: this.getMetaContent('analytics:world-locations')
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
