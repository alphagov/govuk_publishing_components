/* global IntersectionObserver */
(function (Modules) {
  class ContentsListWithBody {
    constructor ($module) {
      /** @type {HTMLElement} */
      this.$module = $module

      /** @type {HTMLElement | null} */
      this.stickyElement = this.$module.querySelector('[data-sticky-element]')

      /** @type {HTMLElement | null} */
      this.listContainer = this.$module.querySelector('.gem-c-contents-list-with-body__list-container')

      /** @type {HTMLDivElement | null} */
      this.topSentinel = null

      /** @type {HTMLDivElement | null} */
      this.bottomSentinel = null

      /** @type {IntersectionObserver | null} */
      this.topObserver = null

      /** @type {IntersectionObserver | null} */
      this.bottomObserver = null

      /** @type {string} */
      this.enabledClass = 'gem-c-contents-list-with-body__sticky-element--enabled'

      /** @type {string} */
      this.stuckToWindowClass = 'gem-c-contents-list-with-body__sticky-element--stuck-to-window'

      /** @type {string} */
      this.hiddenClass = 'gem-c-contents-list-with-body__sticky-element--hidden'
    }

    /**
     * Initialise the contents list with body component
     */
    init () {
      if (!this.stickyElement || !this.listContainer) return

      // Ensure the sticky element starts hidden before we check for intersection observer support
      this.hide()

      if (!('IntersectionObserver' in window)) {
        return
      }

      this.stickyElement.classList.add(this.enabledClass)
      this.createSentinels()
      this.setupObservers()
    }

    /**
     * Create an invisible sentinel element for intersection tracking
     *
     * @param {string} className
     * @returns {HTMLDivElement} The sentinel element
     */
    createSentinel (className) {
      const sentinel = document.createElement('div')
      sentinel.className = className
      sentinel.setAttribute('aria-hidden', 'true')
      sentinel.style.cssText = 'height: 1px; width: 100%; pointer-events: none; visibility: hidden;'
      return sentinel
    }

    /**
     * Create and insert top and bottom sentinels into the page
     * Position topSentinel just before the contents list container and bottomSentinel at the bottom of the content
     */
    createSentinels () {
      this.topSentinel = this.createSentinel('gem-c-contents-list-with-body__top-sentinel')
      this.$module.insertBefore(this.topSentinel, this.listContainer)

      this.bottomSentinel = this.createSentinel('gem-c-contents-list-with-body__bottom-sentinel')
      this.$module.insertBefore(this.bottomSentinel, this.stickyElement)
    }

    /**
     * Set up IntersectionObservers to monitor top and bottom boundaries
     */
    setupObservers () {
      // Top Observer: Show when top sentinel has scrolled off the top, hide when in view or below
      this.topObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.hide()
          } else if (entry.boundingClientRect.top < 0) {
            this.show()
          } else {
            this.hide()
          }
        })
      })

      // Bottom Observer: Switch between sticking to window vs parent container
      this.bottomObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            this.stickToParent()
          } else {
            this.stickToWindow()
          }
        })
      })

      this.topObserver.observe(this.topSentinel)
      this.bottomObserver.observe(this.bottomSentinel)
    }

    /**
     * Stick the element to the bottom of the viewport
     */
    stickToWindow () {
      this.stickyElement.classList.add(this.stuckToWindowClass)
    }

    /**
     * Dock the element to the bottom of the parent container
     */
    stickToParent () {
      this.stickyElement.classList.remove(this.stuckToWindowClass)
    }

    /**
     * Reveal the sticky element
     */
    show () {
      this.stickyElement.classList.remove(this.hiddenClass)
    }

    /**
     * Hide the sticky element
     */
    hide () {
      this.stickyElement.classList.add(this.hiddenClass)
    }
  }

  Modules.ContentsListWithBody = ContentsListWithBody
})(window.GOVUK.Modules)
