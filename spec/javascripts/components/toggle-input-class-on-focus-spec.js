/* eslint-env jasmine */
/* global GOVUK */

describe('A toggle class module', function () {
  'use strict'

  var container

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('when the search box is interacted with', function () {
    beforeEach(function () {
      container = document.createElement('div')
      container.innerHTML = `
        <div data-module="gem-toggle-input-class-on-focus">
          <input type="search" class="js-class-toggle"/>
        </div>
      `

      document.body.appendChild(container)
      new GOVUK.Modules.GemToggleInputClassOnFocus(container).init()
    })

    it('applies the focus style on focus and removes it on blur', function () {
      var searchInput = document.querySelector('.js-class-toggle')
      expect(searchInput).not.toHaveClass('focus')
      searchInput.dispatchEvent(new window.Event('focus'))
      expect(searchInput).toHaveClass('focus')
      searchInput.dispatchEvent(new window.Event('blur'))
      expect(searchInput).not.toHaveClass('focus')
    })
  })

  describe('when the search box has a value', function () {
    beforeEach(function () {
      container = document.createElement('div')
      container.innerHTML = `
        <div data-module="gem-toggle-input-class-on-focus">
          <input type="search" value="My search query" class="js-class-toggle">
        </div>
      `
      document.body.appendChild(container)
      new GOVUK.Modules.GemToggleInputClassOnFocus(container).init()
    })

    it('applies the focus style on load if the search box already has a value', function () {
      var searchInput = container.querySelector('.js-class-toggle')
      expect(searchInput).toHaveClass('focus')
    })

    it('does not remove the focus style on blur if the search box already has a value', function () {
      var searchInput = container.querySelector('.js-class-toggle')
      searchInput.focus()
      expect(searchInput).toHaveClass('focus')
      searchInput.blur()
      expect(searchInput).toHaveClass('focus')
    })
  })
})
