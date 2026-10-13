/* eslint-env jasmine */
/* global GOVUK, Event */

describe('Table scrolling enhancement', function () {
  var container

  beforeEach(function () {
    jasmine.clock().install()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(function () {
    jasmine.clock().uninstall()
    document.body.removeChild(container)
  })

  it('does nothing without any tables', function () {
    container.innerHTML = '<p>No tables here, sorry.</p>'

    var enhancement = new GOVUK.GovspeakTableScroll(container)
    spyOn(enhancement, 'windowResized')
    enhancement.init()

    jasmine.clock().tick(1000)
    expect(enhancement.windowResized).not.toHaveBeenCalled()
  })

  it('initialises when there are tables', function () {
    container.innerHTML = '<table></table>'

    var enhancement = new GOVUK.GovspeakTableScroll(container)
    spyOn(enhancement, 'windowResized')
    enhancement.init()

    jasmine.clock().tick(1000)
    expect(enhancement.windowResized).toHaveBeenCalled()
  })

  describe('initialises correctly', function () {
    beforeEach(function () {
      container.innerHTML = `
        <div class="gem-c-govspeak" style="width: 100px;">
          <table></table>
          <table>
            <tr>
              <td>Thisisaverylongwordthatshouldforceoverflow</td>
            </tr>
          </table>
        </div>
      `
      var enhancement = new GOVUK.GovspeakTableScroll(container)
      enhancement.init()
      jasmine.clock().tick(1000)
    })

    it('only on tables too wide for the space', function () {
      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)
      expect(document.querySelectorAll('.govspeak-table-scrollbar').length).toEqual(1)
      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)
    })

    it('has the right width of dummy scrollbar', function () {
      const tables = document.querySelectorAll('.gem-c-govspeak table')
      const dummyScrollBarWrapper = document.querySelector('.govspeak-table-scrollbar')
      const dummyScrollBar = document.querySelector('.govspeak-table-scrollbar__child')

      expect(dummyScrollBarWrapper.offsetWidth).toEqual(100)
      expect(dummyScrollBar.scrollWidth).toEqual(tables[1].scrollWidth)
      expect(dummyScrollBar.offsetWidth).toEqual(tables[1].scrollWidth)
    })

    it('mirrors the scroll within the dummy scrollbar', function () {
      const tables = document.querySelectorAll('.gem-c-govspeak table')
      const dummyScrollBarWrapper = document.querySelector('.govspeak-table-scrollbar')

      tables[1].scrollLeft += 40
      tables[1].dispatchEvent(new Event('scroll'))
      dummyScrollBarWrapper.dispatchEvent(new Event('scroll'))
      expect(dummyScrollBarWrapper.scrollLeft).toEqual(tables[1].scrollLeft)

      dummyScrollBarWrapper.scrollLeft -= 14
      dummyScrollBarWrapper.dispatchEvent(new Event('scroll'))
      tables[1].dispatchEvent(new Event('scroll'))
      expect(dummyScrollBarWrapper.scrollLeft).toEqual(tables[1].scrollLeft)
    })
  })

  describe('on resize', function () {
    it('removes the existing elements and recreates them', function () {
      container.innerHTML = `
        <div class="gem-c-govspeak" style="width: 100px;">
          <table>
            <tr>
              <td>Thisisaverylongwordthatshouldforceoverflow</td>
            </tr>
          </table>
        </div>
      `
      var enhancement = new GOVUK.GovspeakTableScroll(container)
      spyOn(enhancement, 'windowResized').and.callThrough()
      spyOn(enhancement, 'destroyElements').and.callThrough()
      spyOn(enhancement, 'setupElements').and.callThrough()
      enhancement.init()
      jasmine.clock().tick(1000)

      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)
      expect(document.querySelectorAll('.govspeak-table-scrollbar').length).toEqual(1)
      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)

      window.dispatchEvent(new Event('resize'))
      jasmine.clock().tick(1000)
      expect(enhancement.windowResized).toHaveBeenCalled()
      expect(enhancement.destroyElements).toHaveBeenCalled()
      expect(enhancement.setupElements).toHaveBeenCalled()
      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)
      expect(document.querySelectorAll('.govspeak-table-scrollbar').length).toEqual(1)
      expect(document.querySelectorAll('.tablewrapper').length).toEqual(1)
    })
  })
})
