window.GOVUK = window.GOVUK || {};

(function (GOVUK) {
  'use strict'

  var TableEnhancement = function (element) {
    this.element = element
    this.modalId = 'modal-for-tables'
    this.modalComponent = document.getElementById(this.modalId)
  }

  TableEnhancement.prototype.init = function () {
    window.GOVUK.vars = window.GOVUK.vars || {}
    if (window.GOVUK.vars.govspeakTableEnhancement || !this.modalComponent || !window.GOVUK.Modules.ModalDialogue) {
      return
    }
    this.allTables = document.querySelectorAll('.gem-c-govspeak table')
    var triggerElements = []

    for (var j = 0; j < this.allTables.length; j++) {
      const table = this.allTables[j]
      // don't apply this functionality to tables already handled by charts
      if (table.classList.contains('js-barchart-table')) {
        continue
      }
      const caption = table.querySelector('caption')
      const tableCaption = caption ? caption.textContent : 'table'

      var tableControls = document.createElement('div')
      tableControls.innerHTML = `
        <button class="js-toggle-modal govuk-button govuk-button--secondary gem-c-govspeak__table-button" data-toggle="modal" data-button="${j}">Open ${tableCaption} in a popup</button>
      `
      const parent = table.parentNode
      parent.insertBefore(tableControls, table)
      triggerElements.push(tableControls.querySelector('.js-toggle-modal'))
    }

    const modalContent = document.getElementById('modal-content')
    var module = new GOVUK.Modules.ModalDialogue(this.modalComponent)
    module.init()

    triggerElements.forEach((button) => {
      button.addEventListener('click', (e) => {
        const table = this.allTables[button.getAttribute('data-button')]
        modalContent.innerHTML = `<div class="gem-c-govspeak gem-c-govspeak__modal-table"><table>${table.innerHTML}</table></div>`
        module.handleOpen(e)
      })
    })
    window.GOVUK.vars.govspeakTableEnhancement = true
  }

  GOVUK.GovspeakTableEnhancement = TableEnhancement
}(window.GOVUK))
