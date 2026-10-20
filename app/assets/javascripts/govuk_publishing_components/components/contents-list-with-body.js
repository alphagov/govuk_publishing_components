(function (Modules) {
  class ContentsListWithBody {
    constructor ($module) {
      this.$module =$module
      this.stickyElement = this.$module.querySelector('[data-sticky-element]')
      this.listContainer = this.$module.querySelector('.gem-c-contents-list-with-body__list-container')

      this.topSentinel = null
      this.bottomSentinel = null
      this.topObserver = null
      this.bottomObserver = null

      this.enabledClass = 'gem-c-contents-list-with-body__sticky-element--enabled'
      this.stuckToWindowClass = 'gem-c-contents-list-with-body__sticky-element--stuck-to-window'
      this.hiddenClass = 'gem-c-contents-list-with-body__sticky-element--hidden'
    }

    init () {
      if (!this.stickyElement) return

      if (!('IntersectionObserver' in window)) {
        return
      }

      this.stickyElement.classList.add(this.enabledClass)
      this.createSentinels()
      this.setupObservers()
    }

    createSentinel (className) {
      const sentinel = document.createElement('div')
      sentinel.className = className
      sentinel.setAttribute('aria-hidden', 'true')
      sentinel.style.cssText = 'height: 1px; width: 100%; pointer-events: none; visibility: hidden;'
      return sentinel
    }

    createSentinels () {
      this.topSentinel = this.createSentinel('gem-c-contents-list-with-body__top-sentinel')
      this.$module.insertBefore(this.topSentinel, this.listContainer)

      this.bottomSentinel = this.createSentinel('gem-c-contents-list-with-body__bottom-sentinel')
      this.$module.insertBefore(this.bottomSentinel, this.stickyElement)
    }

    setupObservers () {
      this.topObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top < 0) {
            this.show()
          } else {
            this.hide()
          }
        })
      })

      this.bottomObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top <= window.innerHeight) {
            this.stickToParent()
          } else {
            this.stickToWindow()
          }
        })
      })

      this.topObserver.observe(this.topSentinel)
      this.bottomObserver.observe(this.bottomSentinel)
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
