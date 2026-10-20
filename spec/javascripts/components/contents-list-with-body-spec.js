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
    $stickyElement =$element.querySelector('[data-sticky-element]')

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
})
