/* eslint-env jasmine */

describe('A contents list with body module', function () {
  'use strict'

  describe('on desktop', function () {
    var $element
    var $footer
    var instance
    var container

    beforeEach(function () {
      container = document.createElement('div')
      container.innerHTML = `
        <div data-module="contents-list-with-body" style="height: 9001px; margin-bottom: 1000px">
          <div data-sticky-element>
            <span>Content</span>
          </div>
        </div>
      `

      document.body.appendChild(container)
      $element = document.querySelector('[data-module="contents-list-with-body"]')

      instance = new window.GOVUK.Modules.ContentsListWithBody($element)
      $footer = $element.querySelector('[data-sticky-element]')

      instance.getWindowDimensions = function () {
        return {
          height: 768,
          width: 1024
        }
      }
    })

    afterEach(function () {
      document.body.removeChild(container)
    })

    it('hides the element, when scrolled at the top', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 0
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      expect($footer).toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
    })

    it('shows the element, stuck to the window, when scrolled in the middle', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 5000
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      expect($footer).toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
    })

    it('shows the element, stuck to the parent, when scrolled at the bottom', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 9800
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      expect($footer).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
    })
  })
})
