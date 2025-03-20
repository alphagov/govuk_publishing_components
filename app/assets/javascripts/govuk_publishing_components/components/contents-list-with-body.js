/*
  This module will cause a child in the target element to:
  - hide when the top of the target element is visible;
  - stick to the bottom of the window while the parent element is in view;
  - stick to the bottom of the target when the user scrolls past the bottom.

  Use 'data-module="contents-list-with-body"' to instantiate, and add
  `[data-sticky-element]` to the child you want to position.
*/

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ContentsListWithBody (element) {
    this.wrapper = element
    this.stickyElement = this.wrapper.querySelector('[data-sticky-element]')
    this.hasResized = true
    this.hasScrolled = true
    this.interval = 50
    this.windowVerticalPosition = 1
    this.startPosition = 0
    this.stopPosition = 0
  }

  ContentsListWithBody.prototype.init = function () {
    if (!this.stickyElement) return

    window.onresize = this.onResize.bind(this)
    window.onscroll = this.onScroll.bind(this)
    setInterval(this.checkResize.bind(this), this.interval)
    setInterval(this.checkScroll.bind(this), this.interval)
    this.checkResize()
    this.checkScroll()
    this.stickyElement.classList.add('gem-c-contents-list-with-body__sticky-element--enabled')
  }

  ContentsListWithBody.prototype.getWindowDimensions = function () {
    return {
      height: window.innerHeight,
      width: window.innerWidth
    }
  }

  ContentsListWithBody.prototype.getWindowPositions = function () {
    return {
      scrollTop: window.scrollY
    }
  }

  ContentsListWithBody.prototype.onResize = function () {
    this.hasResized = true
  }

  ContentsListWithBody.prototype.onScroll = function () {
    this.hasScrolled = true
  }

  ContentsListWithBody.prototype.checkResize = function () {
    if (this.hasResized) {
      this.hasResized = false
      this.hasScrolled = true

      var windowDimensions = this.getWindowDimensions()
      var elementHeight = this.wrapper.offsetHeight || parseFloat(this.wrapper.style.height.replace('px', ''))
      this.startPosition = this.wrapper.offsetTop
      this.stopPosition = this.wrapper.offsetTop + elementHeight - windowDimensions.height
    }
  }

  ContentsListWithBody.prototype.checkScroll = function () {
    if (this.hasScrolled) {
      this.hasScrolled = false

      this.windowVerticalPosition = this.getWindowPositions().scrollTop

      this.updateVisibility()
      this.updatePosition()
    }
  }

  ContentsListWithBody.prototype.updateVisibility = function () {
    var isPastStart = this.startPosition < this.windowVerticalPosition
    if (isPastStart) {
      this.show()
    } else {
      this.hide()
    }
  }

  ContentsListWithBody.prototype.updatePosition = function () {
    var isPastEnd = this.stopPosition < this.windowVerticalPosition
    if (isPastEnd) {
      this.stickToParent()
    } else {
      this.stickToWindow()
    }
  }

  ContentsListWithBody.prototype.stickToWindow = function () {
    this.stickyElement.classList.add('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
  }

  ContentsListWithBody.prototype.stickToParent = function () {
    this.stickyElement.classList.remove('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
  }

  ContentsListWithBody.prototype.show = function () {
    this.stickyElement.classList.remove('gem-c-contents-list-with-body__sticky-element--hidden')
  }

  ContentsListWithBody.prototype.hide = function () {
    this.stickyElement.classList.add('gem-c-contents-list-with-body__sticky-element--hidden')
  }

  Modules.ContentsListWithBody = ContentsListWithBody
})(window.GOVUK.Modules)
