window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperNavigationToggle ($module) {
    this.$module = $module
    this.$button = _setupButton($module)
    this.$menu = document.getElementById(this.$button.getAttribute('aria-controls'))
    this.status = this.$button.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed'
  }

  function _removeClass (classes, classToRemove) {
    var arrayOfClasses = classes.split(' ')
    var classPosition = arrayOfClasses.indexOf(classToRemove)
    arrayOfClasses.splice(classPosition, 1)
    return arrayOfClasses.join(' ')
  }

  function _setupButton (target) {
    var menuText = 'Menu'
    var adjacentTo = target.querySelector('#navigation')
    var buttonText = document.createTextNode(menuText)

    var button = document.createElement('button')
    button.className = 'govuk-header__menu-button gem-c-super-navigation-header__menu-button'
    button.setAttribute('aria-controls', 'navigation')
    button.setAttribute('aria-label', 'Show navigation menu')
    button.setAttribute('aria-expanded', false)

    button.appendChild(buttonText)
    adjacentTo.insertAdjacentElement('beforebegin', button)

    return button
  }

  SuperNavigationToggle.prototype.syncStatus = function () {
    this.status = this.$button.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed'
  }

  SuperNavigationToggle.prototype.handleOpen = function () {
    this.$menu.className = _removeClass(this.$menu.className, 'gem-c-super-navigation-header__items--open')

    this.$button.className = _removeClass(this.$button.className, 'govuk-header__menu-button--open')
    this.$button.setAttribute('aria-expanded', false)
    this.$button.setAttribute('aria-label', 'Show navigation menu')
  }

  SuperNavigationToggle.prototype.handleClose = function () {
    this.$menu.className += ' gem-c-super-navigation-header__items--open'

    this.$button.setAttribute('aria-expanded', true)
    this.$button.setAttribute('aria-label', 'Hide navigation menu')
    this.$button.className += ' govuk-header__menu-button--open'
  }

  SuperNavigationToggle.prototype.handleToggle = function (event) {
    if (event) event.preventDefault()

    if (this.status === 'open') this.handleOpen()
    if (this.status === 'closed') this.handleClose()

    this.syncStatus()
  }

  SuperNavigationToggle.prototype.init = function () {
    this.$button.addEventListener('click', this.handleToggle.bind(this))
  }

  Modules.SuperNavigationToggle = SuperNavigationToggle
})(window.GOVUK.Modules)
