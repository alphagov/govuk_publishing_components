/* eslint-env jasmine, jquery */

describe('A contents list with body module', function () {
  'use strict'

  var GOVUK = window.GOVUK

  describe('on desktop', function () {
    var $element
    var $footer
    var instance

    beforeEach(function () {
      $element = $(
        '<div data-module="contents-list-with-body" style="height: 9001px; margin-bottom: 1000px">' +
          '<div data-sticky-element>' +
            '<span>Content</span>' +
          '</div>' +
        '</div>'
      )

      instance = new GOVUK.Modules.ContentsListWithBody($element[0])
      $footer = $element.find('[data-sticky-element]')

      instance.getWindowDimensions = function () {
        return {
          height: 768,
          width: 1024
        }
      }
    })

    it('hides the element, when scrolled at the top', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 0
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--hidden')).toBe(true)
      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')).toBe(true)
    })

    it('shows the element, stuck to the window, when scrolled in the middle', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 5000
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--hidden')).toBe(false)
      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')).toBe(true)
    })

    it('shows the element, stuck to the parent, when scrolled at the bottom', function () {
      instance.getWindowPositions = function () {
        return {
          scrollTop: 9800
        }
      }

      instance.checkResize()
      instance.checkScroll()

      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--hidden')).toBe(false)
      expect($footer.hasClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')).toBe(false)
    })
  })
})
