//= require govuk/vendor/polyfills/Element/prototype/classList.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

/*

↳ Navigation menu (top level: small screens only, top level, always exclusive)
  ↳ Topics (second level: accordion and non-exclusive on small screens, dropdown and exclusive on large screens)
    → Benefits
    → Births, death, marriages and care
    → Brexit
    → Business and self-employed
    → Childcare and parenting
    → Citizenship and living in the UK
    → Coronavirus (COVID‑19)
    → Crime, justice and the law
    → Disabled people
    → Driving and transport
    → Education and learning
    → Employing people
    → Environment and countryside
    → Housing and local services
    → Money and tax
    → Passports, travel and living abroad
    → Visas and immigration
    → Working, jobs and pensions
  → Departments (always a link)
  ↳ Government activity (second level: accordion and non-exclusive on small screens, dropdown and exclusive on large screens)
    → News
    → Guidance and regulation
    → Research and statistics
    → Policy papers and consultation
    → Transparency
    → How government works
    → Get involved

↳ Search and popular pages (top level: all screens, top level, always exclusive)
  ↳ Search form
    Popular pages

*/

(function (Modules) {
  var parentMenu = function (element) {
    if (element.getAttribute('data-toggle-group') === 'top') {
      return element
    }
    return parentMenu(element.parentElement)
  }

  var exclusive = function (group) {
    return !(group === 'second' && window.innerWidth < 769)
  }

  function SuperNavigationMegaMenu ($module) {
    this.$module = $module

    this.genericToggle = {
      buttonText: $module.getAttribute('data-text-for-generic-button'),
      showText: $module.getAttribute('data-text-for-show-generic'),
      hideText: $module.getAttribute('data-text-for-hide-generic')
    }

    var $menus = $module.querySelectorAll('[data-toggle-group]')

    this.lastUpdate

    for (var i = 0; i < $menus.length; i++) {
      var element = $menus[i]
      var uniqueID = element.getAttribute('data-toggle-modifier')

      this[uniqueID + 'Toggle'] = {
        showText: element.getAttribute('data-text-for-show'),
        hideText: element.getAttribute('data-text-for-hide')
      }

      this[uniqueID + 'Toggle'].$button = this.setUpToggleButton({
        controls: element.id,
        target: element.previousElementSibling,
        modifier: uniqueID,
        icon: element.cloneNode(true).querySelector('svg'),
        toggleGroup: element.getAttribute('data-toggle-group'),
        buttonText: element.getAttribute('data-text-for-button')
      })
    }
  }

  SuperNavigationMegaMenu.prototype.setUpToggleButton = function (config) {
    var controls = config.controls
    var target = config.target
    var icon = config.icon
    var toggleGroup = config.toggleGroup
    var modifier = config.modifier

    var buttonText = config.buttonText
    var showText = this[modifier + 'Toggle'].showText

    var button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-controls', controls)
    button.setAttribute('aria-label', showText)
    button.setAttribute('aria-expanded', false)
    button.setAttribute('data-toggle-group', toggleGroup)
    button.className = 'gem-c-layout-super-navigation-header__button-' + toggleGroup +
      ' gem-c-layout-super-navigation-header__button--' + modifier

    if (icon) {
      var textWrapper = document.createElement('span')
      textWrapper.className = 'govuk-visually-hidden'
      textWrapper.appendChild(document.createTextNode(buttonText))
      button.appendChild(textWrapper)

      // Need to use `setAttribute` to update the class as `className` works
      // differently on SVGs.
      icon.setAttribute('class', 'gem-c-layout-super-navigation-header__button-icon')
      button.appendChild(icon)
    } else {
      button.appendChild(document.createTextNode(buttonText))
    }

    target.insertAdjacentElement('afterend', button)
    return button
  }

  SuperNavigationMegaMenu.prototype.toggle = function ($triggeredButton) {
    var group = $triggeredButton.getAttribute('data-toggle-group')
    var $triggeredMenu = this.$module.querySelector('#' + $triggeredButton.getAttribute('aria-controls'))

    var groupSelector = (window.innerWidth < 769) ? '[aria-controls][data-toggle-group="' + group + '"]' : '[aria-controls]'

    var $thisGroupsButtons = this.$module.querySelectorAll(groupSelector)

    // Filter out the menu that should be opened:
    var $thisGroupsButtonsExcludingTriggeredButton = []
    if (exclusive(group)) {
      for (var i = 0; i < $thisGroupsButtons.length; i++) {
        var thisElement = $thisGroupsButtons[i]
        if (thisElement !== $triggeredButton) {
          $thisGroupsButtonsExcludingTriggeredButton.push(thisElement)
        }
      }
    }

    // Close everything else:
    for (var j = 0; j < $thisGroupsButtonsExcludingTriggeredButton.length; j++) {
      var $button = $thisGroupsButtonsExcludingTriggeredButton[j]
      var $menu = this.$module.querySelector('#' + $button.getAttribute('aria-controls'))

      $button.classList.remove('gem-c-layout-super-navigation-header__button--open')
      $menu.classList.remove('gem-c-layout-super-navigation-header__items--open')
    }

    // And then toggle the trigger button and menu:
    $triggeredButton.classList.toggle('gem-c-layout-super-navigation-header__button--open')
    $triggeredMenu.classList.toggle('gem-c-layout-super-navigation-header__items--open')

    var menuHeightOffset = window.innerWidth < 769 ? 0 : $triggeredMenu.offsetHeight

    this.$module.style.borderBottom = menuHeightOffset + 'px solid red'

    // When in desktop view, the second level menu appears visually as a
    // top level menu - so we need to open the top menu if the second level
    // menu is opened. This will ensure that the state of the menu is kept
    // when switching between desktop and mobile view.
    if (group !== 'top') {
      var $topMenu = parentMenu($triggeredMenu)
      var $topMenuButton = this.$module.querySelector('#' + $topMenu.id)

      $topMenuButton.classList.add('gem-c-layout-super-navigation-header__button--open')
      $topMenu.classList.add('gem-c-layout-super-navigation-header__items--open')
    }

    this.lastUpdate = $triggeredButton
  }

  SuperNavigationMegaMenu.prototype.init = function () {
    // can we make this only init on a small screen? Then re-add when going back to a small screen when a button is clicekd?
    window.addEventListener('resize', function() {
      var $openButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__button--open[data-toggle-group="second"]')
      if (window.innerWidth > 768 && $openButtons.length > 1) {
        // store the state of the lastUpdate
        var lastUpdateButtonStatus = this.lastUpdate.className
        var $lastUpdateMenu = this.$module.querySelector('#' + this.lastUpdate.getAttribute('aria-controls'))
        var lastUpdateMenuStatus = $lastUpdateMenu.className

        // Close all sub menus:
        for (var i = 0; i < $openButtons.length; i++) {
          var $thisButton = $openButtons[i]
          $thisButton.classList.remove('gem-c-layout-super-navigation-header__button--open')
          var $thisMenu = this.$module.querySelector('#' + $thisButton.getAttribute('aria-controls'))
          $thisMenu.classList.remove('gem-c-layout-super-navigation-header__items--open')
        }

        // revert state of lastUpdate menu (could be opened or closed)
        this.lastUpdate.className = lastUpdateButtonStatus
        $lastUpdateMenu.className = lastUpdateMenuStatus
      }
    }.bind(this))

    var $togglers = this.$module.querySelectorAll('[aria-controls]')
    for (var index = 0; index < $togglers.length; index++) {
      var $button = $togglers[index]

      // add an event listener to the button to toggle the menu
      $button.addEventListener('click', function (ev) {
        var $triggeredButton = ev.target
        this.toggle($triggeredButton)
      }.bind(this))
    }
  }

  Modules.SuperNavigationMegaMenu = SuperNavigationMegaMenu
})(window.GOVUK.Modules)
