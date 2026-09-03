(function (Modules) {
  const SETTINGS = {
    label: {
      hide: 'data-text-for-hide',
      show: 'data-text-for-show'
    }
  }

  // Small helpers that update the label when the state of the button has changed:
  const setLabel = function (button, showOrHide) {
    const newLabel = button.getAttribute(SETTINGS.label[showOrHide])

    if (newLabel) {
      button.setAttribute('aria-label', newLabel)
    }
  }

  // Wrapper functions to contain all of the mechanisms needed for hiding and
  // toggling the menus.
  const hide = function (button, menu) {
    button.setAttribute('aria-expanded', false)
    button.classList.remove('gem-c-layout-super-navigation-header__open-button')
    menu.setAttribute('hidden', 'hidden')
    setLabel(button, 'show')
  }

  const show = function (button, menu) {
    button.setAttribute('aria-expanded', true)
    button.classList.add('gem-c-layout-super-navigation-header__open-button')
    menu.removeAttribute('hidden')
    setLabel(button, 'hide')
  }

  const toggle = function (button, menu) {
    const isOpen = button.getAttribute('aria-expanded') === 'true'
    if (isOpen) {
      hide(button, menu)
    } else {
      show(button, menu)
    }
  }

  function SuperNavigationMegaMenu (module) {
    this.module = module
    this.searchToggle = this.module.querySelector('#super-search-menu-toggle')
    this.searchMenu = this.module.querySelector('#super-search-menu')
    this.navToggle = this.module.querySelector('#super-navigation-menu-toggle')
    this.navMenu = this.module.querySelector('#super-navigation-menu')

    // The menu toggler buttons need three attributes for this to work:
    //  - `aria-controls` contains the id of the menu to be toggled
    //  - `data-toggle-mobile-group` is the group that the menu belongs to on
    //    smaller screens
    //  - `data-toggle-desktop-group` is the group that the menu belongs to on
    //    larger screens
    this.buttons = this.module.querySelectorAll(
      'button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'
    )

    this.hiddenButtons = this.module.querySelectorAll('button[hidden]')
  }

  SuperNavigationMegaMenu.prototype.buttonHandler = function (event) {
    const target = event.target.closest('button')
    const targetMenu = this.module.querySelector('#' + target.getAttribute('aria-controls'))

    const toggleGroupAttribute = 'data-toggle-desktop-group'
    const toggleGroupName = target.getAttribute(toggleGroupAttribute)
    const toggleGroupList = this.module.querySelectorAll('[' + toggleGroupAttribute + '="' + toggleGroupName + '"]')

    for (const element of toggleGroupList) {
      if (element !== target) {
        const menu = this.module.querySelector('#' + element.getAttribute('aria-controls'))
        hide(element, menu)
      }
    }

    toggle(target, targetMenu)
  }

  SuperNavigationMegaMenu.prototype.handleKeyDown = function (event) {
    if (event.key !== 'Tab' && event.key !== 'Escape') {
      return
    }

    const navMenuLinks = this.navMenu.querySelectorAll('li a')
    const firstNavLink = navMenuLinks[0]
    const lastNavLink = navMenuLinks[navMenuLinks.length - 1]
    const searchMenuTabbable = this.searchMenu.querySelectorAll('li a, input, button')
    const lastSearchMenuTabbable = searchMenuTabbable[searchMenuTabbable.length - 1]

    if (event.key === 'Tab') {
      if (!this.navMenu.hasAttribute('hidden')) {
        switch (document.activeElement) {
          case this.navToggle:
            if (!event.shiftKey) {
              event.preventDefault()
              firstNavLink.focus()
            }
            break
          case lastNavLink:
            if (!event.shiftKey) {
              event.preventDefault()
              this.searchToggle.focus()
              hide(this.navToggle, this.navMenu)
            }
            break
          case firstNavLink:
            if (event.shiftKey) {
              event.preventDefault()
              this.navToggle.focus()
            }
            break
          case this.searchToggle:
            if (event.shiftKey) {
              event.preventDefault()
              lastNavLink.focus()
            }
            break
          default:
            break
        }
      } else if (!this.searchMenu.hasAttribute('hidden')) {
        if (document.activeElement === lastSearchMenuTabbable) {
          if (!event.shiftKey) {
            hide(this.searchToggle, this.searchMenu)
          }
        }
      }
    } else if (event.key === 'Escape') {
      if (!this.navMenu.hasAttribute('hidden')) {
        hide(this.navToggle, this.navMenu)
        this.navToggle.focus()
      } else if (!this.searchMenu.hasAttribute('hidden')) {
        hide(this.searchToggle, this.searchMenu)
        this.searchToggle.focus()
      }
    }
  }

  SuperNavigationMegaMenu.prototype.init = function () {
    // Handle key events for tab and escape keys
    this.module.addEventListener('keydown', this.handleKeyDown.bind(this))

    for (const button of this.buttons) {
      button.addEventListener('click', this.buttonHandler.bind(this), true)
    }

    // Reveal toggle buttons hidden by default in HTML for non-JavaScript users
    // and hide the fallback links now that JavaScript is available.
    for (const element of this.hiddenButtons) {
      element.removeAttribute('hidden')

      let sibling = element.previousElementSibling

      // Find and hide the preceding no JavaScript fallback links
      while (sibling) {
        if (sibling.matches('a')) {
          sibling.setAttribute('hidden', 'hidden')
          break
        }
        sibling = sibling.previousElementSibling
      }
    }

    this.module.querySelector('.gem-c-layout-super-navigation-header__search-item-link')
      .setAttribute('hidden', 'hidden')

    // Navigation menu and search menu are hardcoded to be open in the markup -
    // this means that the menu still makes sense with CSS and JavaScript turned off.
    // The menus now need to be hidden as part of the JavaScript initialisation:
    //  - On both mobile and desktop, this means hiding the search menu
    //  - On mobile, this means hiding the navigation
    //  - On desktop, this means hiding the navigation button, showing the
    //    second level navigation menu
    hide(this.searchToggle, this.searchMenu)

    this.module.classList.add('js-module-initialised')
  }

  Modules.SuperNavigationMegaMenu = SuperNavigationMegaMenu
})(window.GOVUK.Modules)
