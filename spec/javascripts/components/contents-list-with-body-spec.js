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

    it('remains hidden and does not create sentinels or enable sticky behavior', () => {
      instance.init()

      const topSentinel = $element.querySelector('.gem-c-contents-list-with-body__top-sentinel')
      const bottomSentinel = $element.querySelector('.gem-c-contents-list-with-body__bottom-sentinel')

      expect(topSentinel).toBeNull()
      expect(bottomSentinel).toBeNull()
      expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--enabled')
    })
  })

  describe('when IntersectionObserver is supported', () => {
    let topObserverCallback
    let bottomObserverCallback

    beforeEach(() => {
      topObserverCallback = null
      bottomObserverCallback = null

      spyOn(window, 'IntersectionObserver').and.callFake(function (callback) {
        if (!topObserverCallback) {
          topObserverCallback = callback
        } else {
          bottomObserverCallback = callback
        }

        return {
          observe: jasmine.createSpy('observe'),
          unobserve: jasmine.createSpy('unobserve'),
          disconnect: jasmine.createSpy('disconnect')
        }
      })
    })

    describe('initialisation', () => {
      it('creates top and bottom sentinels and starts observing them', () => {
        instance.init()

        const topSentinel = $element.querySelector('.gem-c-contents-list-with-body__top-sentinel')
        const bottomSentinel = $element.querySelector('.gem-c-contents-list-with-body__bottom-sentinel')

        expect(topSentinel).not.toBeNull()
        expect(bottomSentinel).not.toBeNull()
        expect(window.IntersectionObserver).toHaveBeenCalledTimes(2)
        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--enabled')
        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('exits quietly if required elements are missing', () => {
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

      it('hides the contents bar when the top sentinel is intersecting (user at top of page)', () => {
        topObserverCallback([{
          isIntersecting: true,
          boundingClientRect: { top: 50 }
        }])

        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('hides the contents bar when the top sentinel is below the viewport', () => {
        topObserverCallback([{
          isIntersecting: false,
          boundingClientRect: { top: 500 }
        }])

        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
      })

      it('shows the contents bar and sticks to window when scrolled into body text', () => {
        topObserverCallback([{
          isIntersecting: false,
          boundingClientRect: { top: -200 }
        }])

        bottomObserverCallback([{
          isIntersecting: false,
          boundingClientRect: { top: window.innerHeight + 1000 }
        }])

        expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--hidden')
        expect($stickyElement).toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
      })

      it('docks the contents bar to the body when scrolled to the bottom of the content', () => {
        bottomObserverCallback([{
          isIntersecting: true,
          boundingClientRect: { top: window.innerHeight - 50 }
        }])

        expect($stickyElement).not.toHaveClass('gem-c-contents-list-with-body__sticky-element--stuck-to-window')
      })
    })
  })
})
