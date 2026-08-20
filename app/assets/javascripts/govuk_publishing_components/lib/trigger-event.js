// see https://github.com/alphagov/govuk_publishing_components/blob/main/docs/lib/trigger_event.md
(function () {
  'use strict'

  window.GOVUK = window.GOVUK || {}

  window.GOVUK.triggerEvent = function (element, eventName, parameters) {
    const params = parameters || {}
    const keyCode = params.keyCode
    const key = params.key

    if (!Object.prototype.hasOwnProperty.call(params, 'bubbles')) {
      params.bubbles = true
    }

    if (!Object.prototype.hasOwnProperty.call(params, 'cancelable')) {
      params.cancelable = true
    }

    const event = new window.CustomEvent(eventName, params)

    if (key) {
      event.key = key
    }

    if (keyCode) {
      event.keyCode = keyCode
    }

    if (params.shiftKey) {
      event.shiftKey = true
    }

    if (element && typeof element.dispatchEvent === 'function') {
      element.dispatchEvent(event)
    }
  }
}())
