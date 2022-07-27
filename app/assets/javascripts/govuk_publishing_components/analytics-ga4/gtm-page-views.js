;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  GOVUK.Gtm = {
    PIIRemover: new GOVUK.analyticsGA4.PIIRemover(), // imported in analytics-ga4.js

    sendPageView: function () {
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
            first_published_at: this.getMetaContent('first-published-at'),
            updated_at: this.getMetaContent('updated-at'),
            public_updated_at: this.getMetaContent('public-updated-at'),
            publishing_government: this.getMetaContent('publishing-government'),
            political_status: this.getMetaContent('political-status'),
            primary_publishing_organisation: this.getMetaContent('primary-publishing-organisation'),
            organisations: this.getMetaContent('analytics:organisations'),
            world_locations: this.getMetaContent('analytics:world-locations')
          }
        }
        window.dataLayer.push(data)
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
    // https://github.com/alphagov/static/blob/main/app/views/root/_error_page.html.erb#L32
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
        return 'n/a'
      }
    },

    getLanguage: function () {
      var html = document.querySelector('html')
      return html.getAttribute('lang') || 'n/a'
    },

    getHistory: function () {
      var history = this.getMetaContent('content-has-history')
      return (history === 'true') ? 'true' : 'false'
    },

    getWithDrawn: function () {
      var withdrawn = this.getMetaContent('withdrawn')
      return (withdrawn === 'withdrawn') ? 'true' : 'false'
    }
  }

  global.GOVUK = GOVUK
})(window)
