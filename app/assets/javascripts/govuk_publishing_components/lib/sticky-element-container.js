/*
  This module will cause a child in the target element to:
  - hide when the top of the target element is visible;
  - stick to the bottom of the window while the parent element is in view;
  - stick to the bottom of the target when the user scrolls past the bottom.

  Use 'data-module="sticky-element-container"' to instantiate, and add
  `[data-sticky-element]` to the child you want to position.
*/

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function StickyElementContainer (element) {
    this.wrapper = element
    this.stickyElement = this.wrapper.querySelector('[data-sticky-element]')
    this.hasResized = true
    this.hasScrolled = true
    this.interval = 50
    this.windowVerticalPosition = 1
    this.startPosition = 0
    this.stopPosition = 0
  }

  StickyElementContainer.prototype.init = function () {
    if (!this.stickyElement) return

    window.onresize = this.onResize.bind(this)
    window.onscroll = this.onScroll.bind(this)
    setInterval(this.checkResize.bind(this), this.interval)
    setInterval(this.checkScroll.bind(this), this.interval)
    this.checkResize()
    this.checkScroll()
    this.stickyElement.classList.add('sticky-element--enabled')
  }

  StickyElementContainer.prototype.getWindowDimensions = function () {
    return {
      height: window.innerHeight,
      width: window.innerWidth
    }
  }

  StickyElementContainer.prototype.getWindowPositions = function () {
    return {
      scrollTop: window.scrollY
    }
  }

  StickyElementContainer.prototype.onResize = function () {
    this.hasResized = true
  }

  StickyElementContainer.prototype.onScroll = function () {
    this.hasScrolled = true
  }

  StickyElementContainer.prototype.checkResize = function () {
    if (this.hasResized) {
      this.hasResized = false
      this.hasScrolled = true

      var windowDimensions = this.getWindowDimensions()
      var elementHeight = this.wrapper.offsetHeight || parseFloat(this.wrapper.style.height.replace('px', ''))
      this.startPosition = this.wrapper.offsetTop
      this.stopPosition = this.wrapper.offsetTop + elementHeight - windowDimensions.height
    }
  }

  StickyElementContainer.prototype.checkScroll = function () {
    if (this.hasScrolled) {
      this.hasScrolled = false

      this.windowVerticalPosition = this.getWindowPositions().scrollTop

      this.updateVisibility()
      this.updatePosition()
    }
  }

  StickyElementContainer.prototype.updateVisibility = function () {
    var isPastStart = this.startPosition < this.windowVerticalPosition
    if (isPastStart) {
      this.show()
    } else {
      this.hide()
    }
  }

  StickyElementContainer.prototype.updatePosition = function () {
    var isPastEnd = this.stopPosition < this.windowVerticalPosition
    if (isPastEnd) {
      this.stickToParent()
    } else {
      this.stickToWindow()
    }
  }

  StickyElementContainer.prototype.stickToWindow = function () {
    this.stickyElement.classList.add('sticky-element--stuck-to-window')
  }

  StickyElementContainer.prototype.stickToParent = function () {
    this.stickyElement.classList.remove('sticky-element--stuck-to-window')
  }

  StickyElementContainer.prototype.show = function () {
    this.stickyElement.classList.remove('sticky-element--hidden')
  }

  StickyElementContainer.prototype.hide = function () {
    this.stickyElement.classList.add('sticky-element--hidden')
  }

  Modules.StickyElementContainer = StickyElementContainer
})(window.GOVUK.Modules)
