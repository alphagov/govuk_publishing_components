/*
  This module will cause a child in the target element to:
  - hide when the top of the target element is visible;
  - stick to the bottom of the window while the parent element is in view;
  - stick to the bottom of the target when the user scrolls past the bottom.

  Use 'data-module="contents-list-with-body"' to instantiate, and add
  `[data-sticky-element]` to the child you want to position.
*/

(function (Modules) {
  class ContentsListWithBody {
    constructor ($module) {
      this.$module =$module
      this.stickyElement = this.$module.querySelector('[data-sticky-element]')

      this.enabledClass = 'gem-c-contents-list-with-body__sticky-element--enabled'
      this.stuckToWindowClass = 'gem-c-contents-list-with-body__sticky-element--stuck-to-window'
      this.hiddenClass = 'gem-c-contents-list-with-body__sticky-element--hidden'

      this.hasResized = true
      this.hasScrolled = true
      this.interval = 50
      this.windowVerticalPosition = 1
      this.startPosition = 0
      this.stopPosition = 0
    }

    init () {
      if (!this.stickyElement) return

      window.onresize = this.onResize.bind(this)
      window.onscroll = this.onScroll.bind(this)
      setInterval(this.checkResize.bind(this), this.interval)
      setInterval(this.checkScroll.bind(this), this.interval)
      this.checkResize()
      this.checkScroll()
      this.stickyElement.classList.add(this.enabledClass)
    }

    getWindowDimensions () {
      return {
        height: window.innerHeight,
        width: window.innerWidth
      }
    }

    getWindowPositions () {
      return {
        scrollTop: window.scrollY
      }
    }

    onResize () {
      this.hasResized = true
    }

    onScroll () {
      this.hasScrolled = true
    }

    checkResize () {
      if (this.hasResized) {
        this.hasResized = false
        this.hasScrolled = true

        const windowDimensions = this.getWindowDimensions()
        const elementHeight = this.wrapper.offsetHeight || parseFloat(this.wrapper.style.height.replace('px', ''))
        this.startPosition = this.$module.offsetTop
        this.stopPosition = this.$module.offsetTop + elementHeight - windowDimensions.height
      }
    }

    checkScroll () {
      if (this.hasScrolled) {
        this.hasScrolled = false

        this.windowVerticalPosition = this.getWindowPositions().scrollTop

        this.updateVisibility()
        this.updatePosition()
      }
    }

    updateVisibility () {
      const isPastStart = this.startPosition < this.windowVerticalPosition
      if (isPastStart) {
        this.show()
      } else {
        this.hide()
      }
    }

    updatePosition () {
      const isPastEnd = this.stopPosition < this.windowVerticalPosition
      if (isPastEnd) {
        this.stickToParent()
      } else {
        this.stickToWindow()
      }
    }

    stickToWindow () {
      this.stickyElement.classList.add(this.stuckToWindowClass)
    }

    stickToParent () {
      this.stickyElement.classList.remove(this.stuckToWindowClass)
    }

    show () {
      this.stickyElement.classList.remove(this.hiddenClass)
    }

    hide () {
      this.stickyElement.classList.add(this.hiddenClass)
    }
  }

  Modules.ContentsListWithBody = ContentsListWithBody
})(window.GOVUK.Modules)
