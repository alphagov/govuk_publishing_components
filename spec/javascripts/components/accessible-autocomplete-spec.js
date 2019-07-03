/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An accessible autocomplete component', function () {
  'use strict'

  function loadAutocompleteComponent () {
    window.setFixtures(html)
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete()
    autocomplete.start($('.gem-c-accessible-autocomplete'))
  }

  function loadAutocompleteMultiple () {
    window.setFixtures(html)
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete()
    $('.gem-c-accessible-autocomplete').find('select').attr('multiple', 'multiple').find('option:first-child').remove()
    autocomplete.start($('.gem-c-accessible-autocomplete'))
  }

  var html =
    '<div class="gem-c-accessible-autocomplete" data-module="accessible-autocomplete">' +
      '<select id="test" class="govuk-select" data-track-category="category" data-track-action="action">' +
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

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      }
      spyOn(GOVUK.analytics, 'trackEvent')

      loadAutocompleteComponent()

      $('.autocomplete__input').val('Moose').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur()

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('when a valid option is chosen', function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', Object({ label: 'Moose' }))
    })
  })

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      }
      spyOn(GOVUK.analytics, 'trackEvent')

      loadAutocompleteComponent()

      $('.autocomplete__input').val('Deer').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur()

      $('.autocomplete__input').val('').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur()

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('when an input is cleared', function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', Object({ label: '' }))
    })
  })

  describe('in multiple mode', function () {
    beforeEach(function (done) {
      loadAutocompleteMultiple()
      // use the component api for this test
      // as methods in previous tests don't seem to
      // work in multiple mode
      var onConfirm = $('select').data('onconfirm')

      $('.autocomplete__input').val('Deer')
      onConfirm('Deer', 'de')

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('selects one option in the select', function () {
      expect($('select').val()).toEqual(['de'])
    })
  })

  describe('in multiple mode', function () {
    beforeEach(function (done) {
      loadAutocompleteMultiple()
      var onConfirm = $('select').data('onconfirm')

      $('.autocomplete__input').val('Moose')
      onConfirm('Moose', 'mo')

      $('.autocomplete__input').val('Deer')
      onConfirm('Deer', 'de')

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('selects multiple options in the select', function () {
      expect($('select').val()).toEqual(['mo', 'de'])
    })
  })
})
