/* eslint-env jasmine */
/* global GOVUK */

function keyPress (element, key) {
  var event = document.createEvent('Event')
  event.keyCode = key // Deprecated, prefer .key instead
  event.key = key
  event.initEvent('keydown', true, false)
  element.dispatchEvent(event)
}

describe('Modal dialogue component', function () {
  'use strict'

  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
    '<button class="govuk-button" data-toggle="modal" data-target="my-modal">Launch modal dialogue</button>' +
    '<div class="gem-c-modal-dialogue" data-module="modal-dialogue" id="my-modal">' +
      '<dialog class="gem-c-modal-dialogue__box" aria-modal="true" role="dialogue" aria-labelledby="my-modal-title">' +
        '<div class="gem-c-modal-dialogue__container">' +
          '<div class="gem-c-modal-dialogue__content">' +
            '<h2 id="my-modal-title">Modal title</h2>' +
          '</div>' +
          '<button class="gem-c-modal-dialogue__close-button" aria-label="Close modal dialogue">&times;</button>' +
        '</div>' +
      '</dialog>' +
      '<div class="gem-c-modal-dialogue__overlay"></div>' +
    '</div>' +

    document.body.appendChild(container)
    var element = document.querySelector('[data-module="modal-dialogue"]')
    new GOVUK.Modules.ModalDialogue(element).init()
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('open button', function () {
    beforeEach(function () {
      document.querySelector('.govuk-button').click()
    })

    afterEach(function () {
      document.querySelector('.gem-c-modal-dialogue__close-button').click()
    })

    it('should show the modal dialogue', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      expect(modal.checkVisibility()).toBe(true)
    })
  })

  describe('esc key', function () {
    it('should close the modal', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.open()

      keyPress(modal, 27)
      expect(modal.checkVisibility()).toBe(false)
    })
  })

  describe('close button', function () {
    it('should hide the modal dialogue', function () {
      document.querySelector('.govuk-button').dispatchEvent(new window.Event('focus'))
      document.querySelector('.govuk-button').click()
      document.querySelector('.gem-c-modal-dialogue__close-button').click()

      var modal = document.querySelector('.gem-c-modal-dialogue')
      document.querySelector('.gem-c-modal-dialogue__close-button').click()
      expect(modal.checkVisibility()).toBe(false)
    })
  })

  describe('resize', function () {
    it('should resize the modal to full width', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.resize('wide')

      var dialogBox = modal.querySelector('.gem-c-modal-dialogue__box')
      expect(dialogBox).toHaveClass('gem-c-modal-dialogue__box--wide')
    })

    it('should resize the modal to narrow width', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.resize('wide')
      modal.resize('narrow')

      var dialogBox = modal.querySelector('.gem-c-modal-dialogue__box')
      expect(dialogBox).not.toHaveClass('gem-c-modal-dialogue__box--wide')
    })
  })

  describe('open', function () {
    beforeEach(function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.open()
    })

    afterEach(function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.close()
    })

    it('should show the modal dialogue', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      expect(modal.checkVisibility()).toBe(true)
    })

    it('should focus the modal dialogue', function () {
      var modalFocused = document.querySelector('.gem-c-modal-dialogue__box')
      expect(modalFocused).toBeTruthy()
    })
  })

  describe('close', function () {
    it('should hide the modal dialogue', function () {
      var modal = document.querySelector('.gem-c-modal-dialogue')
      modal.open()
      modal.close()
      expect(modal.checkVisibility()).toBe(false)
    })
  })
})
