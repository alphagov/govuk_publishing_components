(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.triggerEvent = function (element, eventName, parameters) {
    var params = parameters || {}
    params.bubbles = true
    params.cancelable = true
    var event

    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, params)
    } else {
      event = document.createEvent('CustomEvent')
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail)
    }

    element.dispatchEvent(event)
  }
}(window))
