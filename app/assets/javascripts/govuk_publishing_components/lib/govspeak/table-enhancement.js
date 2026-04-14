window.GOVUK = window.GOVUK || {};

(function (GOVUK) {
  'use strict'

  var TableEnhancement = function (element) {
    this.element = element
  }

  TableEnhancement.prototype.init = function () {
    console.log('init tables')
    var allTables = this.element.querySelectorAll('table')

    for (var j = 0; j < allTables.length; j++) {
      const table = allTables[j]
      // don't apply this functionality to tables already handled by charts
      if (table.classList.contains('js-barchart-table')) {
        continue
      }
      const parent = table.parentNode

      // wrap the table in a div to make it easier to style
      const wrapperId = `govspeak-table-${j}`
      var tableWrapper = document.createElement('div')
      tableWrapper.setAttribute('id', wrapperId)
      tableWrapper.classList.add('js-container')
      parent.insertBefore(tableWrapper, table)
      tableWrapper.appendChild(table)

      var tableControls = document.createElement('div')
      tableControls.innerHTML = `
        <button class="js-toggle-container govuk-button govuk-button--secondary" data-controls="${wrapperId}">Toggle table in popup</button>
      `
      parent.insertBefore(tableControls, tableWrapper)

      tableControls.querySelector('.js-toggle-container').addEventListener('click', () => {
        const target = document.getElementById(wrapperId)
        target.classList.toggle('gem-c-govspeak-table--container')
        if (target.classList.contains('gem-c-govspeak-table--container')) {
          this.setMargins(target)
        } else {
          this.resetMargins(target)
        }
      })
    }

    this.resizeEvent = this.onResize.bind(this)
    window.addEventListener('resize', this.resizeEvent)
  }

  TableEnhancement.prototype.onResize = function () {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(function () {
      var containers = document.querySelectorAll('.gem-c-govspeak-table--container')
      for (var j = 0; j < containers.length; j++) {
        this.resetMargins(containers[j])
        this.setMargins(containers[j])
      }
    }.bind(this), 100)
  }

  TableEnhancement.prototype.setMargins = function (el) {
    const bounds = el.getBoundingClientRect()
    const docWidth = document.documentElement.clientWidth || document.body.clientWidth

    el.style.marginLeft = `-${bounds.left - 1}px`
    el.style.marginRight = `-${docWidth - bounds.left - bounds.width - 1}px`
  }

  TableEnhancement.prototype.resetMargins = function (el) {
    el.style.marginLeft = 'auto'
    el.style.marginRight = 'auto'
  }

  GOVUK.GovspeakTableEnhancement = TableEnhancement
}(window.GOVUK))
