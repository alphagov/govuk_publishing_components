/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Initial focus script', function () {
  'use strict'

  var FIXTURE

  function loadInitialFocusScript () {
    var initialFocus = new GOVUK.Modules.InitialFocus($('[data-module=initial-focus]')[0])
    initialFocus.init()
  }

  beforeEach(function () {
    FIXTURE =
      '<div class="gem-c-success-alert" data-module="initial-focus">' +
        '<h2 class="gem-c-success-summary__title">Message title</h2>' +
        '<div class="gem-c-success-summary__body">A further description</div>' +
      '</div>'

    window.specHelpers.setFixtures(FIXTURE)
  })

  afterEach(function () {
    window.specHelpers.removeFixtures()
  })

  it('focus', function () {
    loadInitialFocusScript()

    expect($('[data-module=initial-focus]:focus')).toBeTruthy()
  })
})
