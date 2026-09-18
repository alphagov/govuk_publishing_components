/* eslint-env jasmine */
/* global GOVUK */

describe('Table enhancement', function () {
  'use strict'

  var element
  var modalElement
  var modal = `
    <div id="modal-for-tables" class="gem-c-modal-dialogue gem-c-modal-dialogue--scroll-within">
      <div class="gem-c-modal-dialogue__overlay"></div>
      <dialog class="gem-c-modal-dialogue__box gem-c-modal-dialogue__box--full-width" aria-modal="true">
        <div class="gem-c-modal-dialogue__header"></div>
        <div class="gem-c-modal-dialogue__content">
          <div id="modal-content"></div>
        </div>
        <button class="gem-c-modal-dialogue__close-button" aria-label="Close modal dialogue">×</button>
      </dialog>
    </div>
  `
  var simpleTable = `
    <table>
      <tr>
        <th>Fruit</th>
        <th>Veg</th>
      </tr>
      <tr>
        <td>Strawberry</td>
        <td>Carrot</td>
      </tr>
    </table>
  `

  var tableWithCaption = `
    <table>
      <caption>Random names</caption>
      <tr>
        <th>First name</th>
        <th>Surname</th>
      </tr>
      <tr>
        <td>Jeff</td>
        <td>Neck</td>
      </tr>
    </table>
  `

  function addTable (table) {
    element = document.createElement('div')
    element.classList.add('gem-c-govspeak')
    element.innerHTML = table
    document.body.appendChild(element)
    new GOVUK.GovspeakTableEnhancement(element).init()
  }

  function addModal () {
    modalElement = document.createElement('div')
    modalElement.innerHTML = modal
    document.body.appendChild(modalElement)
  }

  afterEach(function () {
    window.GOVUK.vars.govspeakTableEnhancement = false
    element.remove()
    if (modalElement) {
      modalElement.remove()
    }
  })

  describe('when the modal is not present', function () {
    beforeEach(function () {
      addTable(simpleTable)
    })

    it('does not initialise', function () {
      const buttons = element.querySelectorAll('.js-toggle-modal')
      expect(buttons.length).toBe(0)
    })
  })

  describe('when the code should initialise', function () {
    beforeEach(function () {
      addModal()
      addTable(simpleTable)
    })

    it('adds a button to open the modal', function () {
      const buttons = element.querySelectorAll('.js-toggle-modal')
      expect(buttons.length).toBe(1)
      expect(buttons[0].textContent).toBe('Open table in a popup')
    })

    describe('when the button is clicked', function () {
      beforeEach(function () {
        const button = element.querySelector('.js-toggle-modal')
        button.click()
      })

      it('adds the table into the modal', function () {
        const modalContents = document.getElementById('modal-content')
        expect(modalContents.textContent).toContain('Strawberry')
      })

      it('opens the modal', function () {
        expect(document.querySelector('.gem-c-modal-dialogue').style.display).toEqual('block')
      })
    })
  })

  describe('when the table has a caption', function () {
    beforeEach(function () {
      addModal()
      addTable(tableWithCaption)
    })

    it('includes the table caption in the button', function () {
      const buttons = element.querySelectorAll('.js-toggle-modal')
      expect(buttons.length).toBe(1)
      expect(buttons[0].textContent).toBe('Open Random names in a popup')
    })
  })

  describe('when there are multiple tables', function () {
    beforeEach(function () {
      addModal()
      addTable(`${simpleTable} ${tableWithCaption}`)
    })

    it('adds buttons to open the modal', function () {
      const buttons = element.querySelectorAll('.js-toggle-modal')
      expect(buttons.length).toBe(2)
      expect(buttons[0].textContent).toBe('Open table in a popup')
      expect(buttons[1].textContent).toBe('Open Random names in a popup')
    })

    it('opens the right modal with each button', function () {
      const modalContents = document.getElementById('modal-content')
      const modalClose = document.querySelector('.gem-c-modal-dialogue__close-button')
      const buttons = element.querySelectorAll('.js-toggle-modal')

      buttons[0].click()
      expect(modalContents.textContent).toContain('Strawberry')
      expect(document.querySelector('.gem-c-modal-dialogue').style.display).toEqual('block')

      modalClose.click()
      expect(document.activeElement).toEqual(buttons[0])
      expect(document.querySelector('.gem-c-modal-dialogue').style.display).toEqual('none')

      buttons[1].click()
      expect(modalContents.textContent).toContain('Neck')
      expect(document.querySelector('.gem-c-modal-dialogue').style.display).toEqual('block')

      modalClose.click()
      expect(document.activeElement).toEqual(buttons[1])
    })
  })
})
