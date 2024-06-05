'use strict'

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ModalDialogue ($module) {
    this.$module = $module
    this.$dialogBox = this.$module.querySelector('.gem-c-modal-dialogue__box')
    this.$closeButton = this.$module.querySelector('.gem-c-modal-dialogue__close-button')
    this.$html = document.querySelector('html')
    this.$body = document.querySelector('body')

    this.init()
  }

  ModalDialogue.prototype.init = function () {
    if (!this.$dialogBox || !this.$closeButton) return

    this.$module.resize = this.handleResize.bind(this)
    this.$module.open = this.handleOpen.bind(this)
    this.$module.close = this.handleClose.bind(this)
    this.$module.focusDialog = this.handleFocusDialog.bind(this)
    this.$module.boundKeyDown = this.handleKeyDown.bind(this)

    var $triggerElement = document.querySelector(
      '[data-toggle="modal"][data-target="' + this.$module.id + '"]'
    )

    if ($triggerElement) {
      $triggerElement.addEventListener('click', this.$module.open)
    }

    if (this.$closeButton) {
      this.$closeButton.addEventListener('click', this.$module.close)
    }
  }

  ModalDialogue.prototype.handleResize = function (size) {
    if (size === 'narrow') {
      this.$dialogBox.classList.remove('gem-c-modal-dialogue__box--wide')
    }

    if (size === 'wide') {
      this.$dialogBox.classList.add('gem-c-modal-dialogue__box--wide')
    }
  }

  ModalDialogue.prototype.handleOpen = function (event) {
    if (event) {
      event.preventDefault()
    }

    this.$html.classList.add('gem-o-template--modal')
    this.$body.classList.add('gem-o-template__body--modal')
    this.$body.classList.add('gem-o-template__body--blur')
    this.$focusedElementBeforeOpen = document.activeElement
    this.$module.style.display = 'block'
    this.$dialogBox.focus()

    document.addEventListener('keydown', this.$module.boundKeyDown, true)
  }

  ModalDialogue.prototype.handleClose = function (event) {
    if (event) {
      event.preventDefault()
    }

    this.$html.classList.remove('gem-o-template--modal')
    this.$body.classList.remove('gem-o-template__body--modal')
    this.$body.classList.remove('gem-o-template__body--blur')
    this.$module.style.display = 'none'
    this.$focusedElementBeforeOpen.focus()

    document.removeEventListener('keydown', this.$module.boundKeyDown, true)
  }

  ModalDialogue.prototype.handleFocusDialog = function () {
    this.$dialogBox.focus()
  }

  // while open, prevent tabbing to outside the dialogue
  // and listen for ESC key to close the dialogue
  ModalDialogue.prototype.handleKeyDown = function (event) {
    var KEY_TAB = 9
    var KEY_ESC = 27

    switch (event.keyCode) {
      case KEY_TAB:
        if (event.shiftKey) {
          if (document.activeElement === this.$dialogBox) {
            event.preventDefault()
            this.$closeButton.focus()
          }
        } else {
          if (document.activeElement === this.$closeButton) {
            event.preventDefault()
            this.$dialogBox.focus()
          }
        }

        break
      case KEY_ESC:
        this.$module.close()
        break
      default:
        break
    }
  }

  Modules.ModalDialogue = ModalDialogue
})(window.GOVUK.Modules)
