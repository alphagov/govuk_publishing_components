/* eslint-env jasmine */
/* global GOVUK */

describe('Right to left example toggle', function () {
  var container
  var html

  function initialise () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    new GOVUK.Modules.RtlToggle(container).init()
  }

  afterEach(function () {
    container.remove()
  })

  describe('without the required elements', function () {
    beforeEach(function () {
      html = '<div></div>'
      initialise()
    })

    it('does not initialise', function () {
      expect(container.innerHTML).toEqual(html)
    })
  })

  describe('when the example is already right to left', function () {
    it('does not initialise for "right to left"', function () {
      html = '<h2 class="js-toggle-heading">Right to left example</h2><div class="component-guide-preview">preview</div>'
      initialise()
      expect(container.innerHTML).toEqual(html)
    })

    it('does not initialise for "rtl"', function () {
      html = '<h2 class="js-toggle-heading">Example RTL</h2><div class="component-guide-preview">preview</div>'
      initialise()
      expect(container.innerHTML).toEqual(html)
    })
  })

  describe('with the required elements', function () {
    beforeEach(function () {
      html = '<h2 class="js-toggle-heading">Heading</h2><div class="component-guide-preview">preview</div>'
      initialise()
    })

    it('adds the required elements', function () {
      const heading = container.querySelector('.js-toggle-heading')
      expect(heading.innerHTML).toEqual('Heading<small class="rtl-trigger"><a class="govuk-link" href="#">show right to left</a></small>')
    })

    it('toggles correctly', function () {
      const toggle = container.querySelector('.js-toggle-heading a')
      const preview = container.querySelector('.component-guide-preview')
      expect(preview.getAttribute('class')).toEqual('component-guide-preview')
      toggle.click()
      expect(preview.getAttribute('class')).toEqual('component-guide-preview direction-rtl')
    })
  })
})
