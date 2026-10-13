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
      this.windowResized(true)
    }, 10)

    window.onresize = () => {
      if (this.windowResizeTimeout) {
        clearTimeout(this.windowResizeTimeout)
      }

      this.windowResizeTimeout = setTimeout(function () {
        this.windowResized()
      }.bind(this), 500)
    }
  }

  TableScroll.prototype.windowResized = function (createWrapper) {
    this.destroyElements()
    this.setupElements(createWrapper)
  }

  TableScroll.prototype.setupElements = function (createWrapper) {
    this.tables.forEach(table => {
      if (!(table.scrollWidth > table.clientWidth)) {
        return
      }

      // wrap the table in a div, but only the first time
      if (createWrapper) {
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
        table.scrollLeft = scrollBar.scrollLeft
      }

      table.onscroll = () => {
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
