//= require govuk/vendor/polyfills/Element/prototype/classList.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperNavigationToggle ($module) {
    this.$module = $module

    this.showMenuText = $module.getAttribute('data-text-for-show-menu')
    this.hideMenuText = $module.getAttribute('data-text-for-hide-menu')
    this.buttonText = $module.getAttribute('data-text-for-button')

    this.$button = this.setupButton($module)

    this.$menu = document.getElementById(this.$button.getAttribute('aria-controls'))

    this.syncStatus()
  }

  SuperNavigationToggle.prototype.setupButton = function (target) {
    var menuHeading = target.getAttribute('aria-labelledby')
    var adjacentTo = target.querySelector('#' + menuHeading)
    var buttonText = document.createTextNode(this.buttonText)

    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'govuk-header__menu-button gem-c-layout-super-navigation-header__menu-button'
    button.setAttribute('aria-controls', 'super-navigation-menu')
    button.setAttribute('aria-label', this.showMenuText)
    button.setAttribute('aria-expanded', false)

    button.appendChild(buttonText)
    adjacentTo.insertAdjacentElement('beforebegin', button)

    return button
  }

  SuperNavigationToggle.prototype.syncStatus = function () {
    this.status = this.$button.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed'
  }

  SuperNavigationToggle.prototype.closeMenu = function () {
    this.$menu.classList.remove('gem-c-layout-super-navigation-header__items--open')

    this.$button.classList.remove('govuk-header__menu-button--open')
    this.$button.setAttribute('aria-expanded', false)
    this.$button.setAttribute('aria-label', this.showMenuText)
  }

  SuperNavigationToggle.prototype.openMenu = function () {
    this.$menu.classList.add('gem-c-layout-super-navigation-header__items--open')

    this.$button.classList.add('govuk-header__menu-button--open')
    this.$button.setAttribute('aria-expanded', true)
    this.$button.setAttribute('aria-label', this.hideMenuText)
  }

  SuperNavigationToggle.prototype.handleToggle = function () {
    if (this.status === 'open') this.closeMenu()
    if (this.status === 'closed') this.openMenu()

    this.syncStatus()
  }

  SuperNavigationToggle.prototype.init = function () {
    this.$button.addEventListener('click', this.handleToggle.bind(this))
  }

  Modules.SuperNavigationToggle = SuperNavigationToggle
})(window.GOVUK.Modules)
