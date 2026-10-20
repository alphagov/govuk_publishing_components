(function (Modules) {
  class ContentsListWithBody {
    constructor ($module) {
      this.$module =$module
      this.stickyElement = this.$module.querySelector('[data-sticky-element]')

      this.enabledClass = 'gem-c-contents-list-with-body__sticky-element--enabled'
      this.stuckToWindowClass = 'gem-c-contents-list-with-body__sticky-element--stuck-to-window'
      this.hiddenClass = 'gem-c-contents-list-with-body__sticky-element--hidden'
    }

    init () {
      if (!this.stickyElement) return

      this.stickyElement.classList.add(this.enabledClass)
    }

    stickToWindow () {
      this.stickyElement.classList.add(this.stuckToWindowClass)
    }

    stickToParent () {
      this.stickyElement.classList.remove(this.stuckToWindowClass)
    }

    show () {
      this.stickyElement.classList.remove(this.hiddenClass)
    }

    hide () {
      this.stickyElement.classList.add(this.hiddenClass)
    }
  }

  Modules.ContentsListWithBody = ContentsListWithBody
})(window.GOVUK.Modules)
