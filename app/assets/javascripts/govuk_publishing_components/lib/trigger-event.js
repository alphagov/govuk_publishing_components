(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.triggerEvent = function (element, eventName) {
    var params = { bubbles: true, cancelable: true }
    var event

    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, params)
    } else {
      event = document.createEvent('CustomEvent')
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, null)
    }

    element.dispatchEvent(event)
  }
}(window))
