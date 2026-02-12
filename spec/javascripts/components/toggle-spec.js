/* eslint-env jasmine */
/* global GOVUK */

describe('A toggle module', function () {
  'use strict'

  var container

  describe('when starting', function () {
    beforeEach(function () {
      container = document.createElement('div')
      container.innerHTML = `
        <a href="#" class="my-toggle" data-expanded="false" data-controls="target">Toggle</a>
        <div id="target">Target</div>
      `
      document.body.appendChild(container)
      new GOVUK.Modules.GemToggle(container).init()
    })

    afterEach(function () {
      document.body.removeChild(container)
    })

    it('adds aria attributes to toggles', function () {
      var trigger = container.querySelector('.my-toggle')
      expect(trigger.getAttribute('role')).toBe('button')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.getAttribute('aria-controls')).toBe('target')
    })
  })

  describe('when clicking a toggle', function () {
    beforeEach(function () {
      container = document.createElement('div')
      container.innerHTML = `
        <a href="#" class="my-toggle" data-expanded="false" data-controls="target" data-toggled-text="Show fewer">Toggle</a>
        <div id="target" class="js-hidden">Target</div>
      `
      document.body.appendChild(container)
      new GOVUK.Modules.GemToggle(container).init()
      container.querySelector('.my-toggle').click()
    })

    afterEach(function () {
      document.body.removeChild(container)
    })

    it('toggles the display of a target', function () {
      expect(container.querySelector('#target')).not.toHaveClass('js-hidden')
      container.querySelector('.my-toggle').click()
      expect(container.querySelector('#target')).toHaveClass('js-hidden')
    })

    it('updates the aria-expanded attribute on the toggle', function () {
      expect(container.querySelector('.my-toggle').getAttribute('aria-expanded')).toBe('true')

      container.querySelector('.my-toggle').click()
      expect(container.querySelector('.my-toggle').getAttribute('aria-expanded')).toBe('false')
    })

    it('updates the text shown in the toggle link when expanded if such text is supplied', function () {
      expect(container.querySelector('.my-toggle').getAttribute('data-toggled-text')).toBe('Toggle')
      expect(container.querySelector('.my-toggle').textContent).toBe('Show fewer')
      container.querySelector('.my-toggle').click()
      expect(container.querySelector('.my-toggle').getAttribute('data-toggled-text')).toBe('Show fewer')
      expect(container.querySelector('.my-toggle').textContent).toBe('Toggle')
    })
  })

  describe('when clicking a toggle that controls multiple targets', function () {
    it('toggles the display of each target', function () {
      container = document.createElement('div')
      container.innerHTML = `
        <a href="#" class="my-toggle" data-expanded="false" data-controls="target another-target">Toggle</a>
        <div id="target" class="js-hidden">Target</div>
        <div id="another-target" class="js-hidden">Another target</div>
      `
      document.body.appendChild(container)
      new GOVUK.Modules.GemToggle(container).init()

      expect(container.querySelector('#target')).toHaveClass('js-hidden')
      expect(container.querySelector('#another-target')).toHaveClass('js-hidden')

      container.querySelector('.my-toggle').click()
      expect(container.querySelector('#target')).not.toHaveClass('js-hidden')
      expect(container.querySelector('#another-target')).not.toHaveClass('js-hidden')

      container.querySelector('.my-toggle').click()
      expect(container.querySelector('#target')).toHaveClass('js-hidden')
      expect(container.querySelector('#another-target')).toHaveClass('js-hidden')

      document.body.removeChild(container)
    })
  })

  describe('when a custom class is given', function () {
    it('toggles the given class', function () {
      container = document.createElement('div')
      container.dataset.toggleClass = 'myclass'
      container.innerHTML = `
        <a href="#" class="my-toggle" data-expanded="true" data-controls="target">Toggle</a>
        <div id="target">Target</div>
      `
      document.body.appendChild(container)
      new GOVUK.Modules.GemToggle(container).init()

      expect(container.querySelector('#target')).not.toHaveClass('myclass')
      container.querySelector('.my-toggle').click()
      expect(container.querySelector('#target')).toHaveClass('myclass')

      document.body.removeChild(container)
    })
  })
})
