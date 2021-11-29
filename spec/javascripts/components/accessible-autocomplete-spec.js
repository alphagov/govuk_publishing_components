/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An accessible autocomplete component', function () {
  'use strict'

  function loadAutocompleteComponent () {
    window.setFixtures(html)
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete($('.gem-c-accessible-autocomplete')[0])
    autocomplete.init()
  }

  var html =
    '<div class="gem-c-accessible-autocomplete">' +
      '<select id="test" class="govuk-select">' +
        '<option value=""></option>' +
        '<option value="mo">Moose</option>' +
        '<option value="de">Deer</option>' +
      '</select>' +
    '</div>'

  // the autocomplete onConfirm function fires after the tests run unless we put
  // in a timeout like this - makes the tests a bit verbose unfortunately
  function testAsyncWithDeferredReturnValue () {
    var deferred = $.Deferred()

    setTimeout(function () {
      deferred.resolve()
    }, 500)

    return deferred.promise()
  }

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent()

      // the autocomplete is complex enough that all of these
      // events are necessary to simulate user input
      $('.autocomplete__input').val('Moose').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur()

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('an option is selected', function () {
      expect($('select').val()).toEqual('mo')
    })
  })

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent()

      $('select').val('de').change()
      $('.autocomplete__input').val('Deer')

      $('.autocomplete__input').val('').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur()

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('the input is cleared', function () {
      expect($('select').val()).toEqual('')
    })
  })
})
