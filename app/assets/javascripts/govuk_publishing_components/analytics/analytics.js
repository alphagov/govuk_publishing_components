;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics/analytics.md

  var Analytics = function (config) {
    this.pii = new GOVUK.Pii()
    this.trackers = []
    if (typeof config.universalId !== 'undefined') {
      var universalId = config.universalId
      delete config.universalId
      this.trackers.push(new GOVUK.GoogleAnalyticsUniversalTracker(universalId, config))
    }
  }

  var PIISafe = function (value) {
    this.value = value
  }
  Analytics.PIISafe = PIISafe

  Analytics.prototype.sendToTrackers = function (method, args) {
    // Allows us to stop sending tracking at the moment a user sets their usage cookies to "false" on the cookie settings page.
    if (window.GOVUK.stopSendingAnalytics) {
      return false
    }

    for (var i = 0, l = this.trackers.length; i < l; i++) {
      var tracker = this.trackers[i]
      var fn = tracker[method]

      if (typeof fn === 'function') {
        fn.apply(tracker, args)
      }
    }
  }

  Analytics.load = function () {
    GOVUK.GoogleAnalyticsUniversalTracker.load()
  }

  Analytics.prototype.defaultPathForTrackPageview = function (location) {
    // Get the page path including querystring, but ignoring the anchor
    // as per default behaviour of GA (see: https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#overview)
    // we ignore the possibility of there being campaign variables in the
    // anchor because we wouldn't know how to detect and parse them if they
    // were present
    // IE can't access window.location.origin, so we have to do this slightly complex thing
    var root = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
    return this.pii.stripPIIFromString(location.href.substring(root.length).split('#')[0])
  }

  Analytics.prototype.trackPageview = function (path, title, options) {
    arguments[0] = arguments[0] || this.defaultPathForTrackPageview(window.location)
    if (arguments.length === 0) { arguments.length = 1 }
    return this.sendToTrackers('trackPageview', this.pii.stripPII(arguments))
  }

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Analytics.prototype.trackEvent = function (category, action, options) {
    return this.sendToTrackers('trackEvent', this.pii.stripPII(arguments))
  }

  Analytics.prototype.trackShare = function (network, options) {
    return this.sendToTrackers('trackSocial', this.pii.stripPII([network, 'share', global.location.pathname, options]))
  }

  /*
    The custom dimension index must be configured within the
    Universal Analytics profile
   */
  Analytics.prototype.setDimension = function (index, value) {
    return this.sendToTrackers('setDimension', this.pii.stripPII(arguments))
  }

  /*
   Add a beacon to track a page in another GA account on another domain.
   */
  Analytics.prototype.addLinkedTrackerDomain = function (trackerId, name, domain) {
    return this.sendToTrackers('addLinkedTrackerDomain', arguments)
  }

  GOVUK.Analytics = Analytics

  global.GOVUK = GOVUK
})(window)
