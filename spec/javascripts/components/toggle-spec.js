describe('A toggle module', function () {
  'use strict'

  var toggle,
    element

  beforeEach(function () {
    toggle = new GOVUK.Modules.GemToggle()
  })

  describe('when starting', function () {
    var element = $('\
      <div>\
        <a href="#" class="my-toggle" data-expanded="false" data-controls="target">Toggle</a>\
        <div id="target">Target</div>\
      </div>')

    it('adds aria attributes to toggles', function () {
      toggle.start(element)

      var $toggle = element.find('.my-toggle')
      expect($toggle.attr('role')).toBe('button')
      expect($toggle.attr('aria-expanded')).toBe('false')
      expect($toggle.attr('aria-controls')).toBe('target')
    })
  })

  describe('when clicking a toggle', function () {
    var element

    beforeEach(function () {
      element = $('\
        <div>\
          <a href="#" class="my-toggle" data-expanded="false" data-controls="target" data-toggled-text="Show fewer">Toggle</a>\
          <div id="target" class="js-hidden">Target</div>\
        </div>')

      toggle.start(element)
      element.find('.my-toggle').trigger('click')
    })

    it('toggles the display of a target', function () {
      expect(element.find('#target').is('.js-hidden')).toBe(false)
      element.find('.my-toggle').trigger('click')
      expect(element.find('#target').is('.js-hidden')).toBe(true)
    })

    it('updates the aria-expanded attribute on the toggle', function () {
      expect(element.find('.my-toggle').attr('aria-expanded')).toBe('true')

      element.find('.my-toggle').trigger('click')
      expect(element.find('.my-toggle').attr('aria-expanded')).toBe('false')
    })

    it('updates the text shown in the toggle link when expanded if such text is supplied', function () {
      expect(element.find('.my-toggle').data('toggled-text')).toBe('Toggle')
      expect(element.find('.my-toggle').text()).toBe('Show fewer')
      element.find('.my-toggle').trigger('click')
      expect(element.find('.my-toggle').data('toggled-text')).toBe('Show fewer')
      expect(element.find('.my-toggle').text()).toBe('Toggle')
    })
  })

  describe('when clicking a toggle that controls multiple targets', function () {
    it('toggles the display of each target', function () {
      var element = $('\
        <div>\
          <a href="#" class="my-toggle" data-expanded="false" data-controls="target another-target">Toggle</a>\
          <div id="target" class="js-hidden">Target</div>\
          <div id="another-target" class="js-hidden">Another target</div>\
        </div>')

      toggle.start(element)
      expect(element.find('#target').is('.js-hidden')).toBe(true)
      expect(element.find('#another-target').is('.js-hidden')).toBe(true)

      element.find('.my-toggle').trigger('click')
      expect(element.find('#target').is('.js-hidden')).toBe(false)
      expect(element.find('#another-target').is('.js-hidden')).toBe(false)

      element.find('.my-toggle').trigger('click')
      expect(element.find('#target').is('.js-hidden')).toBe(true)
      expect(element.find('#another-target').is('.js-hidden')).toBe(true)
    })
  })
})
