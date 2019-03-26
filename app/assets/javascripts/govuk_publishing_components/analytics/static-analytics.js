(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  var StaticAnalytics = function (config) {

    if (typeof config.stripDatePII === 'undefined') {
      // Look for a meta tag with name govuk:static-analytics:strip-dates and if it's there we'll strip dates from GA
      config.stripDatePII = ($('meta[name="govuk:static-analytics:strip-dates"]').length > 0);
    }

    if (typeof config.stripPostcodePII === 'undefined') {
      // Look for a meta tag with name govuk:static-analytics:strip-postcodes and if it's there we'll strip postcodes from GA
      config.stripPostcodePII = ($('meta[name="govuk:static-analytics:strip-postcodes"]').length > 0);
    }

    // Create universal tracker
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/analytics/analytics.js
    this.analytics = new GOVUK.Analytics(config);

    var trackingOptions = getOptionsFromCookie();

    // We're setting the client ID inside a callback function because
    // we don't have access to the client ID until GA returns a tracker object.
    ga(function (tracker) {
      this.gaClientId = tracker.get('clientId');

      $(window).trigger('gaClientSet');

      // Track initial pageview
      this.trackPageview(null, null, trackingOptions);

      // Begin error and print tracking
      GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});
      GOVUK.analyticsPlugins.printIntent();
      GOVUK.analyticsPlugins.mailtoLinkTracker();
      GOVUK.analyticsPlugins.externalLinkTracker({
        externalLinkUploadCustomDimension: 36
      });
      GOVUK.analyticsPlugins.downloadLinkTracker({
        selector: 'a[href*="/government/uploads"], a[href*="assets.publishing.service.gov.uk"]'
      });
    }.bind(this));
  };

  StaticAnalytics.load = function () {
    GOVUK.Analytics.load();
  };

  StaticAnalytics.prototype.trackPageview = function (path, title, options) {
    GOVUK.Ecommerce.start();
    var trackingOptions = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(options);
    this.analytics.trackPageview(path, title, trackingOptions);
  };

  StaticAnalytics.prototype.trackEvent = function (category, action, options) {
    var trackingOptions = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(options);
    this.analytics.trackEvent(category, action, trackingOptions);
  };

  StaticAnalytics.prototype.setDimension = function (index, value, name, scope) {
    if (typeof value === "undefined") {
      return;
    }
    this.analytics.setDimension(index, value, name, scope);
  };

  StaticAnalytics.prototype.trackShare = function (network) {
    var trackingOptions = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions();
    this.analytics.trackShare(network, trackingOptions);
  };

  StaticAnalytics.prototype.addLinkedTrackerDomain = function (trackerId, name, domain, sendPageView) {
    this.analytics.addLinkedTrackerDomain(trackerId, name, domain, sendPageView);
  };

  StaticAnalytics.prototype.setOptionsForNextPageview = function (options) {
    if (typeof options !== 'object') {
      return;
    }

    var cookieOptions = getOptionsFromCookie();
    $.extend(cookieOptions, options);

    this.setCookie('analytics_next_page_call', cookieOptions);
  };

  StaticAnalytics.prototype.setCookie = function (cookieName, object) {
    if (!GOVUK.cookie) {
      return;
    }

    if (!object) {
      GOVUK.cookie(cookieName, null);
    } else {
      // Singly-stringified JSON sometimes gets escaped when put into a cookie, but inconsistently. The command-line
      // tests will escape, but browser tests will not. Double-stringify in order to get consistently-escaped strings.
      GOVUK.cookie(cookieName, JSON.stringify(JSON.stringify(object)));
    }
  };

  StaticAnalytics.prototype.getCookie = function (cookieName) {
    if (!GOVUK.cookie) {
      return;
    }

    try {
      return JSON.parse(JSON.parse(GOVUK.cookie(cookieName)));
    } catch (error) {
      return null;
    }
  };

  StaticAnalytics.prototype.stripPII = function (value) {
    return this.analytics.stripPII(value);
  };

  function getOptionsFromCookie() {
    try {
      var cookie = StaticAnalytics.prototype.getCookie('analytics_next_page_call');
      StaticAnalytics.prototype.setCookie('analytics_next_page_call', null);
      return cookie || {};
    } catch (e) {
      return {};
    }
  }

  GOVUK.StaticAnalytics = StaticAnalytics;
})();
