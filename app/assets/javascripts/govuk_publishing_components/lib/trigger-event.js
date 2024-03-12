// see https://github.com/alphagov/govuk_publishing_components/blob/main/docs/lib/trigger_event.md
(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.triggerEvent = function (element, eventName, parameters) {
    var params = parameters || {}
    var event
    var keyCode = params.keyCode

    if (!Object.prototype.hasOwnProperty.call(params, 'bubbles')) {
      params.bubbles = true
    }

    if (!Object.prototype.hasOwnProperty.call(params, 'cancelable')) {
      params.cancelable = true
    }

    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, params)
    } else {
      event = document.createEvent('CustomEvent')
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail)
    }

    if (keyCode) {
      event.keyCode = keyCode
    }

    if (params.shiftKey) {
      event.shiftKey = true
    }

    element.dispatchEvent(event)
  }
}(window))
