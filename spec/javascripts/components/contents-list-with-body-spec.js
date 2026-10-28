/* eslint-env jasmine */

describe('ContentsListWithBody module', () => {
  let $element
  let $stickyElement
  let instance
  let container

  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `
      <div data-module="contents-list-with-body">
        <div class="gem-c-contents-list-with-body__list-container">
          <h2>Contents</h2>
        </div>
        <div class="gem-c-contents-list-with-body__body">
          <p>Body content</p>
        </div>
        <div data-sticky-element>
          <span>Up to contents</span>
        </div>
      </div>
    `

    document.body.appendChild(container)
    $element = document.querySelector('[data-module="contents-list-with-body"]')
    $stickyElement = $element.querySelector('[data-sticky-element]')

    instance = new window.GOVUK.Modules.ContentsListWithBody($element)
  })

  afterEach(() => {
    container.remove()
  })

  describe('when IntersectionObserver is not supported', () => {
    let originalIntersectionObserver

    beforeEach(() => {
      originalIntersectionObserver = window.IntersectionObserver
      delete window.IntersectionObserver
    })

    afterEach(() => {
      window.IntersectionObserver = originalIntersectionObserver
    })

    it('remains hidden and does not create the bottom sentinel or enable sticky behavior', () => {
      instance.init()

      const bottomSentinel = $element.querySelector('.gem-c-contents-list-with-body__bottom-sentinel')

      expect(bottomSentinel).toBeNull()
      expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--enabled')
    })
  })

  describe('when IntersectionObserver is supported', () => {
    let topObserverCallback
    let bottomObserverCallback
    let topObserverInstance
    let bottomObserverInstance

    beforeEach(() => {
      topObserverCallback = null
      bottomObserverCallback = null
      topObserverInstance = null
      bottomObserverInstance = null

      spyOn(window, 'IntersectionObserver').and.callFake(function (callback) {
        const observerMock = {
          observe: jasmine.createSpy('observe'),
          unobserve: jasmine.createSpy('unobserve'),
          disconnect: jasmine.createSpy('disconnect')
        }

        if (!topObserverCallback) {
          topObserverCallback = callback
          topObserverInstance = observerMock
        } else {
          bottomObserverCallback = callback
          bottomObserverInstance = observerMock
        }

        return observerMock
      })
    })

    describe('initialisation', () => {
      it('creates the bottom sentinel and starts observing both boundaries', () => {
        instance.init()

        const bottomSentinel = $element.querySelector('.gem-c-contents-list-with-body__bottom-sentinel')
        const listContainer = $element.querySelector('.gem-c-contents-list-with-body__list-container')

        expect(bottomSentinel).not.toBeNull()
        expect(window.IntersectionObserver).toHaveBeenCalledTimes(2)
        expect(topObserverInstance.observe).toHaveBeenCalledWith(listContainer)
        expect(bottomObserverInstance.observe).toHaveBeenCalledWith(bottomSentinel)
        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--enabled')
        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('exits quietly if the sticky element is missing', () => {
        $stickyElement.remove()
        const brokenInstance = new window.GOVUK.Modules.ContentsListWithBody($element)

        brokenInstance.init()

        expect(window.IntersectionObserver).not.toHaveBeenCalled()
      })

      it('exits quietly if the contents list container is missing', () => {
        $element.querySelector('.gem-c-contents-list-with-body__list-container').remove()
        const brokenInstance = new window.GOVUK.Modules.ContentsListWithBody($element)

        brokenInstance.init()

        expect(window.IntersectionObserver).not.toHaveBeenCalled()
      })
    })

    describe('visibility and positioning with the observers', () => {
      beforeEach(() => {
        instance.init()
      })

      it('hides the contents bar when the contents container is in view (user near top of page)', () => {
        topObserverCallback([{
          isIntersecting: true,
          boundingClientRect: { top: 50 }
        }])

        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('hides the contents bar when the contents container is below the viewport (initial load on mobile)', () => {
        topObserverCallback([{
          isIntersecting: false,
          boundingClientRect: { top: 500 }
        }])

        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('shows the contents bar when the contents container has scrolled past the top of the viewport', () => {
        topObserverCallback([{
          isIntersecting: false,
          boundingClientRect: { top: -200 }
        }])

        expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('sticks the contents bar to the window when reading body content above the bottom sentinel', () => {
        bottomObserverCallback([{
          boundingClientRect: { top: window.innerHeight + 500 }
        }])

        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
      })

      it('docks the contents bar to the parent container when the bottom sentinel reaches the viewport bottom', () => {
        bottomObserverCallback([{
          boundingClientRect: { top: window.innerHeight - 50 }
        }])

        expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
      })

      it('remains docked to the parent container when the user scrolls deep into the footer', () => {
        // Sentinel has completely left the top of the viewport
        bottomObserverCallback([{
          boundingClientRect: { top: -300 }
        }])

        expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
      })
    })
  })
})
