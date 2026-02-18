/* eslint-env jasmine */
/* global GOVUK */

describe('Initial focus script', function () {
  'use strict'

  var container
  var initialFocusElement

  function loadInitialFocusScript () {
    initialFocusElement = document.querySelector('[data-module=initial-focus]')
    var initialFocus = new GOVUK.Modules.InitialFocus(initialFocusElement)
    initialFocus.init()
  }

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = `
      <div class="govuk-form-group">
        <label class="govuk-label" for="event-name">
          What is the name of the event?
        </label>
        <input data-module="initial-focus" class="govuk-input" id="event-name" name="eventName" type="text">
      </div>
    `

    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('focus', function () {
    loadInitialFocusScript()

    expect(document.activeElement).toEqual(initialFocusElement)
  })
})
