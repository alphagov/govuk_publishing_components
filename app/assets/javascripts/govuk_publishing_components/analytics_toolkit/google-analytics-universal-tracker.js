;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  var GoogleAnalyticsUniversalTracker = function (trackingId, fieldsObject) {
    function configureProfile () {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#create
      sendToGa('create', trackingId, fieldsObject)
    }

    function anonymizeIp () {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#anonymizeip
      sendToGa('set', 'anonymizeIp', true)
    }

    function disableAdTracking () {
      // https://support.google.com/analytics/answer/2444872?hl=en
      sendToGa('set', 'displayFeaturesTask', null)
    }

    function stripLocationPII () {
      sendToGa('set', 'location', stripEmailAddressesFromString(window.location.href))
    }

    // Support legacy cookieDomain param
    if (typeof fieldsObject === 'string') {
      fieldsObject = { cookieDomain: fieldsObject }
    }

    configureProfile()
    anonymizeIp()
    disableAdTracking()
    stripLocationPII()
  }

  GoogleAnalyticsUniversalTracker.load = function () {
    /* eslint-disable */
    (function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o),
                             m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(global, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')
    /* eslint-enable */
  }

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  GoogleAnalyticsUniversalTracker.prototype.trackPageview = function (path, title, options) {
    var pageviewObject

    if (typeof path === 'string') {
      pageviewObject = { page: path }
    }

    if (typeof title === 'string') {
      pageviewObject = pageviewObject || {}
      pageviewObject.title = title
    }

    // Set an options object for the pageview (e.g. transport, sessionControl)
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#transport
    if (typeof options === 'object') {
      pageviewObject = $.extend(pageviewObject || {}, options)
    }

    if (!$.isEmptyObject(pageviewObject)) {
      sendToGa('send', 'pageview', pageviewObject)
    } else {
      sendToGa('send', 'pageview')
    }
  }

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  GoogleAnalyticsUniversalTracker.prototype.trackEvent = function (category, action, options) {
    options = options || {}
    var value
    var trackerName = ''
    var evt = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action
    }

    // Label is optional
    if (typeof options.label === 'string') {
      evt.eventLabel = options.label
      delete options.label
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (options.value || options.value === 0) {
      value = parseInt(options.value, 10)
      if (typeof value === 'number' && !isNaN(value)) {
        options.eventValue = value
      }
      delete options.value
    }

    // trackerName is optional
    if (typeof options.trackerName === 'string') {
      trackerName = options.trackerName + '.'
      delete options.trackerName
    }

    // Prevents an event from affecting bounce rate
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation
    if (options.nonInteraction) {
      options.nonInteraction = 1
    }

    if (typeof options === 'object') {
      $.extend(evt, options)
    }

    sendToGa(trackerName + 'send', evt)
  }

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions
    network – The network on which the action occurs (e.g. Facebook, Twitter)
    action – The type of action that happens (e.g. Like, Send, Tweet)
    target – Specifies the target of a social interaction.
             This value is typically a URL but can be any text.
  */
  GoogleAnalyticsUniversalTracker.prototype.trackSocial = function (network, action, target, options) {
    var trackingOptions = {
      'hitType': 'social',
      'socialNetwork': network,
      'socialAction': action,
      'socialTarget': target
    }

    $.extend(trackingOptions, options)

    sendToGa('send', trackingOptions)
  }

  /*
   https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain
   trackerId    - the UA account code to track the domain against
   name         - name for the tracker
   domain       - the domain to track
   sendPageView - optional argument which controls the legacy behaviour of sending a pageview
                  on creation of the linked domain.
  */
  GoogleAnalyticsUniversalTracker.prototype.addLinkedTrackerDomain = function (trackerId, name, domain, sendPageView) {
    sendToGa('create',
             trackerId,
             'auto',
             {'name': name})
    // Load the plugin.
    sendToGa('require', 'linker')
    sendToGa(name + '.require', 'linker')

    // Define which domains to autoLink.
    sendToGa('linker:autoLink', [domain])
    sendToGa(name + '.linker:autoLink', [domain])

    sendToGa(name + '.set', 'anonymizeIp', true)
    sendToGa(name + '.set', 'displayFeaturesTask', null)

    if (typeof sendPageView === 'undefined' || sendPageView === true) {
      sendToGa(name + '.send', 'pageview')
    }
  }

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
  GoogleAnalyticsUniversalTracker.prototype.setDimension = function (index, value) {
    sendToGa('set', 'dimension' + index, String(value))
  }

  function sendToGa () {
    if (typeof global.ga === 'function') {
      global.ga.apply(global, arguments)
    }
  }

  function stripEmailAddressesFromString (string) {
    var stripped = string.replace(/[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g, '[email]')
    return stripped
  }

  GOVUK.GoogleAnalyticsUniversalTracker = GoogleAnalyticsUniversalTracker

  global.GOVUK = GOVUK
})(window)
