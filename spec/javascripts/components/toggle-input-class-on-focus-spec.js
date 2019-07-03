/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('A toggle class module', function () {
  'use strict'

  var element, toggle

  afterEach(function () {
    element.remove()
  })

  describe('when the search box is interacted with', function () {
    beforeEach(function () {
      element = $(
        '<div data-module="gem-toggle-input-class-on-focus">' +
            '<input type="search" class="js-class-toggle"/>' +
        '</div>')
      $('body').append(element)
      toggle = new GOVUK.Modules.GemToggleInputClassOnFocus()
      toggle.start(element)
    })

    it('applies the focus style on focus and removes it on blur', function () {
      var searchInput = element.find('.js-class-toggle')
      expect(searchInput.is('.focus')).toBe(false)
      searchInput.trigger('focus')
      expect(searchInput.is('.focus')).toBe(true)
      searchInput.trigger('blur')
      expect(searchInput.is('.focus')).toBe(false)
    })
  })

  describe('when the search box has a value', function () {
    beforeEach(function () {
      element = $(
        '<div data-module="gem-toggle-input-class-on-focus">' +
          '<input type="search" value="My search query" class="js-class-toggle">' +
        '</div>')
      $('body').append(element)
      toggle = new GOVUK.Modules.GemToggleInputClassOnFocus()
      toggle.start(element)
    })

    it('applies the focus style on load if the search box already has a value', function () {
      var searchInput = element.find('.js-class-toggle')
      expect(searchInput.is('.focus')).toBe(true)
    })

    it('does not remove the focus style on blur if the search box already has a value', function () {
      var searchInput = element.find('.js-class-toggle')
      searchInput.trigger('focus')
      expect(searchInput.is('.focus')).toBe(true)
      searchInput.trigger('blur')
      expect(searchInput.is('.focus')).toBe(true)
    })
  })
})
