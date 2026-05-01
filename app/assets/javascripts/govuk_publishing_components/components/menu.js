/* istanbul ignore next */
window.GOVUK = window.GOVUK || {}
/* istanbul ignore next */
window.GOVUK.Modules = window.GOVUK.Modules || {};
/* istanbul ignore next */
(function (Modules) {
  'use strict'

  function MainNavigation (module) {
    this.module = module
    this.module.button = this.module.querySelector('button')
    this.module.navContainer = this.module.querySelector('.js-main-nav__nav-container')
    this.module.buttonContainer = this.module.querySelector('.js-main-nav__button-container')
    this.module.button.classList.remove('main-nav__button--no-js')
  }

  MainNavigation.prototype.init = function () {
    this.module.button.addEventListener('click', this.toggleMenu.bind(this))
  }

  MainNavigation.prototype.toggleMenu = function () {
    var ariaExpanded = this.module.button.getAttribute('aria-expanded') === 'true'
    this.module.navContainer.classList.toggle('main-nav__nav-container--js-hidden')
    this.module.button.setAttribute('aria-expanded', `${!ariaExpanded}`)
    this.module.buttonContainer.classList.toggle('main-nav__button-container--collapsed')
  }

  Modules.MainNavigation = MainNavigation
})(window.GOVUK.Modules)
