window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ShowPassword ($module) {
    this.$module = $module
    this.input = this.$module.querySelector('.gem-c-input')
  }

  ShowPassword.prototype.init = function () {
    this.$module.togglePassword = this.togglePassword.bind(this)
    this.$module.revertToPasswordOnFormSubmit = this.revertToPasswordOnFormSubmit.bind(this)
    this.input.classList.add('gem-c-input--with-password')

    this.showPasswordText = this.$module.getAttribute('data-show-text')
    this.hidePasswordText = this.$module.getAttribute('data-hide-text')
    this.showPasswordFullText = this.$module.getAttribute('data-show-full-text')
    this.hidePasswordFullText = this.$module.getAttribute('data-hide-full-text')
    this.shownPassword = this.$module.getAttribute('data-announce-show')
    this.hiddenPassword = this.$module.getAttribute('data-announce-hide')

    // wrap the input in a new div
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('gem-c-show-password__input-wrapper')
    this.input.parentNode.insertBefore(this.wrapper, this.input)
    this.wrapper.appendChild(this.input)

    // create and append the button
    this.showHide = document.createElement('button')
    this.showHide.className = 'gem-c-show-password__toggle'
    this.showHide.setAttribute('aria-controls', this.input.getAttribute('id'))
    this.showHide.setAttribute('type', 'button')
    this.showHide.setAttribute('aria-label', this.showPasswordFullText)
    this.showHide.innerHTML = this.showPasswordText
    this.wrapper.insertBefore(this.showHide, this.input.nextSibling)

    // create and append the status text for screen readers
    this.statusText = document.createElement('span')
    this.statusText.classList.add('govuk-visually-hidden')
    this.statusText.innerHTML = this.hiddenPassword
    this.statusText.setAttribute('aria-live', 'polite')
    this.wrapper.insertBefore(this.statusText, this.showHide.nextSibling)

    this.showHide.addEventListener('click', this.$module.togglePassword)
    this.moveDataAttributesToButton()

    this.parentForm = this.input.form
    var disableFormSubmitCheck = this.$module.getAttribute('data-disable-form-submit-check')

    if (this.parentForm && !disableFormSubmitCheck) {
      this.parentForm.addEventListener('submit', this.$module.revertToPasswordOnFormSubmit)
    }
  }

  ShowPassword.prototype.togglePassword = function (event) {
    event.preventDefault()
    this.showHide.innerHTML = this.showHide.innerHTML === this.showPasswordText ? this.hidePasswordText : this.showPasswordText
    this.showHide.setAttribute('aria-label', this.showHide.getAttribute('aria-label') === this.showPasswordFullText ? this.hidePasswordFullText : this.showPasswordFullText)
    this.statusText.innerHTML = this.statusText.innerHTML === this.shownPassword ? this.hiddenPassword : this.shownPassword
    this.input.setAttribute('type', this.input.getAttribute('type') === 'text' ? 'password' : 'text')
  }

  ShowPassword.prototype.revertToPasswordOnFormSubmit = function (event) {
    this.showHide.innerHTML = this.showPasswordText
    this.showHide.setAttribute('aria-label', this.showPasswordFullText)
    this.statusText.innerHTML = this.hiddenPassword
    this.input.setAttribute('type', 'password')
  }

  ShowPassword.prototype.moveDataAttributesToButton = function () {
    var attrs = this.input.attributes
    for (var i = attrs.length; i >= 0; i--) {
      var attr = attrs[i]
      if (attr && /^data-button/.test(attr.name)) {
        this.showHide.setAttribute(attr.name.replace('-button', ''), attr.value)
        this.input.removeAttribute(attr.name)
      }
    }
  }

  Modules.ShowPassword = ShowPassword
})(window.GOVUK.Modules)
