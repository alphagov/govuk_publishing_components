/* global ResizeObserver */
(function (GOVUK) {
  'use strict'

  var TableScroll = function ($element) {
    this.element = $element
    this.tables = this.element.querySelectorAll('table')
    this.windowResizeTimeout = null
  }

  TableScroll.prototype.init = function () {
    if (this.tables.length === 0) {
      return
    }

    // a small timeout ensures scrollWidth is accurate
    setTimeout(() => {
      this.windowResized()
    }, 10)

    // for all browsers
    window.onresize = () => {
      this.detectSizeChange()
    }

    // for Firefox with 'zoom text only' (does not trigger onresize)
    const resizeObserver = new ResizeObserver(() => {
      this.detectSizeChange()
    })
    resizeObserver.observe(this.tables[0])
  }

  TableScroll.prototype.detectSizeChange = function () {
    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout)
    }

    this.windowResizeTimeout = setTimeout(function () {
      this.windowResized()
    }.bind(this), 300)
  }

  TableScroll.prototype.windowResized = function () {
    this.destroyElements()
    this.setupElements()
  }

  TableScroll.prototype.setupElements = function () {
    this.tables.forEach(table => {
      const tablewrapper = table.closest('.tablewrapper')

      if (!(table.scrollWidth > table.clientWidth)) {
        if (tablewrapper) {
          tablewrapper.className = 'tablewrapper'
        }
        return
      }

      // wrap the table in a div, but only the first time
      if (!tablewrapper) {
        var wrapper = document.createElement('div')
        wrapper.classList.add('tablewrapper')
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }

      const scrollBar = document.createElement('div')
      scrollBar.setAttribute('tabindex', '-1')
      scrollBar.classList.add('govspeak-table-scrollbar')

      const scrollBarChild = document.createElement('div')
      scrollBarChild.classList.add('govspeak-table-scrollbar__child')
      scrollBarChild.style.width = `${table.scrollWidth}px`

      scrollBar.append(scrollBarChild)
      table.before(scrollBar)
      scrollBar.scrollLeft = table.scrollLeft

      scrollBar.onscroll = () => {
        if (this.preventScrolling) {
          this.preventScrolling = false
          return
        }
        this.preventScrolling = true
        table.scrollLeft = scrollBar.scrollLeft
      }

      table.onscroll = () => {
        if (this.preventScrolling) {
          this.preventScrolling = false
          return
        }
        this.preventScrolling = true
        scrollBar.scrollLeft = table.scrollLeft
      }
    })
  }

  TableScroll.prototype.destroyElements = function () {
    const scrollBars = this.element.querySelectorAll('.govspeak-table-scrollbar')
    scrollBars.forEach(bar => {
      bar.remove()
    })
  }

  GOVUK.GovspeakTableScroll = TableScroll
}(window.GOVUK))
