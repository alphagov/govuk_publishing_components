/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('A toggle module', function () {
  'use strict'

  var element

  describe('when starting', function () {
    beforeEach(function () {
      var html =
        '<div>' +
          '<a href="#" class="my-toggle" data-expanded="false" data-controls="target">Toggle</a>' +
          '<div id="target">Target</div>' +
        '</div>'
      element = $(html)
      var toggle = new GOVUK.Modules.GemToggle(element[0])
      toggle.init()
    })

    it('adds aria attributes to toggles', function () {
      var trigger = element.find('.my-toggle')
      expect(trigger.attr('role')).toBe('button')
      expect(trigger.attr('aria-expanded')).toBe('false')
      expect(trigger.attr('aria-controls')).toBe('target')
    })
  })

  describe('when clicking a toggle', function () {
    beforeEach(function () {
      var html =
        '<div>' +
          '<a href="#" class="my-toggle" data-expanded="false" data-controls="target" data-toggled-text="Show fewer">Toggle</a>' +
          '<div id="target" class="js-hidden">Target</div>' +
        '</div>'
      element = $(html)
      var toggle = new GOVUK.Modules.GemToggle(element[0])
      toggle.init()
      element.find('.my-toggle')[0].click()
    })

    it('toggles the display of a target', function () {
      expect(element.find('#target').is('.js-hidden')).toBe(false)
      element.find('.my-toggle')[0].click()
      expect(element.find('#target').is('.js-hidden')).toBe(true)
    })

    it('updates the aria-expanded attribute on the toggle', function () {
      expect(element.find('.my-toggle').attr('aria-expanded')).toBe('true')

      element.find('.my-toggle')[0].click()
      expect(element.find('.my-toggle').attr('aria-expanded')).toBe('false')
    })

    it('updates the text shown in the toggle link when expanded if such text is supplied', function () {
      expect(element.find('.my-toggle').attr('data-toggled-text')).toBe('Toggle')
      expect(element.find('.my-toggle').text()).toBe('Show fewer')
      element.find('.my-toggle')[0].click()
      expect(element.find('.my-toggle').attr('data-toggled-text')).toBe('Show fewer')
      expect(element.find('.my-toggle').text()).toBe('Toggle')
    })
  })

  describe('when clicking a toggle that controls multiple targets', function () {
    it('toggles the display of each target', function () {
      var html =
        '<div>' +
          '<a href="#" class="my-toggle" data-expanded="false" data-controls="target another-target">Toggle</a>' +
          '<div id="target" class="js-hidden">Target</div>' +
          '<div id="another-target" class="js-hidden">Another target</div>' +
        '</div>'
      element = $(html)
      var toggle = new GOVUK.Modules.GemToggle(element[0])
      toggle.init()

      expect(element.find('#target').is('.js-hidden')).toBe(true)
      expect(element.find('#another-target').is('.js-hidden')).toBe(true)

      element.find('.my-toggle')[0].click()
      expect(element.find('#target').is('.js-hidden')).toBe(false)
      expect(element.find('#another-target').is('.js-hidden')).toBe(false)

      element.find('.my-toggle')[0].click()
      expect(element.find('#target').is('.js-hidden')).toBe(true)
      expect(element.find('#another-target').is('.js-hidden')).toBe(true)
    })
  })

  describe('when a custom class is given', function () {
    it('toggles the given class', function () {
      var html =
        '<div data-toggle-class="myclass">' +
          '<a href="#" class="my-toggle" data-expanded="true" data-controls="target">Toggle</a>' +
          '<div id="target">Target</div>' +
        '</div>'
      element = $(html)
      var toggle = new GOVUK.Modules.GemToggle(element[0])
      toggle.init()

      expect(element.find('#target').is('.myclass')).toBe(false)
      element.find('.my-toggle')[0].click()
      expect(element.find('#target').is('.myclass')).toBe(true)
    })
  })
})
