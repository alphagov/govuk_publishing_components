(function (Modules) {
  class SubNavigationMenu {
    constructor (module) {
      this.module = module
      this.module.button = this.module.querySelector('button')
      this.module.navContainer = this.module.querySelector('.js-menu__nav-container')
      this.module.buttonContainer = this.module.querySelector('.js-menu__button-container')
      this.module.button.classList.remove('gem-c-sub-navigation-menu__button--no-js')
    }

    init () {
      this.module.button.addEventListener('click', this.toggleMenu.bind(this))
    }

    toggleMenu () {
      var ariaExpanded = this.module.button.getAttribute('aria-expanded') === 'true'
      this.module.navContainer.classList.toggle('gem-c-sub-navigation-menu__nav-container--js-hidden')
      this.module.button.setAttribute('aria-expanded', `${!ariaExpanded}`)
      this.module.buttonContainer.classList.toggle('gem-c-sub-navigation-menu__button-container--collapsed')
    }
  }
  Modules.SubNavigationMenu = SubNavigationMenu
})(window.GOVUK.Modules)
