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

    this.windowResized()

    window.onresize = () => {
      if (this.windowResizeTimeout) {
        clearTimeout(this.windowResizeTimeout)
      }

      this.windowResizeTimeout = setTimeout(function () {
        this.windowResized()
      }.bind(this), 500)
    }
  }

  TableScroll.prototype.windowResized = function () {
    this.destroyElements()

    if (window.innerWidth < 769) {
      return
    }

    this.setupElements()
  }

  TableScroll.prototype.setupElements = function () {
    this.tables.forEach(table => {
      if (!(table.scrollWidth > table.clientWidth)) {
        return
      }

      const scrollBar = document.createElement('div')
      scrollBar.classList.add('govspeak-table-scrollbar')

      const scrollBarChild = document.createElement('div')
      scrollBarChild.classList.add('govspeak-table-scrollbar__child')
      scrollBarChild.style.width = `${table.scrollWidth}px`

      scrollBar.append(scrollBarChild)
      table.before(scrollBar)

      scrollBar.onscroll = (event) => {
        table.scrollLeft = scrollBar.scrollLeft
      }

      table.onscroll = (event) => {
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
