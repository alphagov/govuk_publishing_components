//= require ../vendor/polyfills-govuk-frontend-v4/Element/prototype/classList.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  var SETTINGS = {
    label: {
      hide: 'data-text-for-hide',
      show: 'data-text-for-show'
    }
  }

  // Small helpers that update the label when the state of the button has
  // changed:
  var setLabel = function ($button, showOrHide) {
    var newLabel = $button.getAttribute(SETTINGS.label[showOrHide])

    if (newLabel) {
      $button.setAttribute('aria-label', newLabel)
    }
  }

  // Wrapper functions to contain all of the mechanisms needed for hiding and
  // toggling the menus.
  var hide = function ($button, $menu) {
    $button.setAttribute('aria-expanded', false)
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button')
    $menu.setAttribute('hidden', 'hidden')
    setLabel($button, 'show')
  }
  var show = function ($button, $menu) {
    $button.setAttribute('aria-expanded', true)
    $button.classList.add('gem-c-layout-super-navigation-header__open-button')
    $menu.removeAttribute('hidden')
    setLabel($button, 'hide')
  }

  var toggle = function ($button, $menu) {
    var isOpen = $button.getAttribute('aria-expanded') === 'true'
    var trackingLabel = $button.getAttribute('data-tracking-key')
    if (isOpen) {
      hide($button, $menu)
    } else {
      show($button, $menu)
    }

    // Fire analytics if analytics are available
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent && trackingLabel) {
      window.GOVUK.analytics.trackEvent('headerClicked', trackingLabel + (isOpen ? 'Closed' : 'Opened'), { label: 'none' })
    }
  }

  // Clicking an element inside a `button` element causes the `event.target` to
  // be the inside element, not the button. This can be taken care of by setting
  // the CSS pointer-events to be none, but that doesn't work for older
  // browsers, won't work for people with CSS turned off, or for people who are
  // using CSS overrides.
  //    This checks if the $element is the `elementType`; if it is, it gets
  // returned; if not it recursively checks to see if the parent element is a
  // `elementType`. This means that it can be used with `pointer-events: none`.
  var closestParentIncluding = function ($element, elementType) {
    if ($element.tagName.toLowerCase() === elementType.toLowerCase()) {
      return $element
    }
    return closestParentIncluding($element.parentNode, elementType)
  }

  // Searched the previous elements to find one with the same tag as set in
  // `elementType` . If it's found the element is returned; if not, it returns
  // null.
  var closestPrevious = function ($element, elementType) {
    if ($element === null) {
      return null
    }

    // Using `previousSibling` means that there is a possibility that the
    // $element could be a text node or a comment node - checking the `nodeType`
    // of the element will ensure that it's a real element.
    if ($element.nodeType === 1 && $element.tagName.toLowerCase() === elementType.toLowerCase()) {
      return $element
    }

    // If `previousElementSibling` can be used then let's use it as it'll be
    // slightly faster since it skips things that aren't elements. If not,
    // `previousSibling` can still be used as there's a `nodeType` check.
    var previousElement = $element.previousElementSibling || $element.previousSibling

    return closestPrevious(previousElement, elementType)
  }

  function SuperNavigationMegaMenu ($module) {
    this.$module = $module
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle')
    this.$searchMenu = this.$module.querySelector('#super-search-menu')
    this.$navToggle = this.$module.querySelector('#super-navigation-menu-toggle')
    this.$navMenu = this.$module.querySelector('#super-navigation-menu')

    // The menu toggler buttons need three attributes for this to work:
    //  - `aria-controls` contains the id of the menu to be toggled
    //  - `data-toggle-mobile-group` is the group that the menu belongs to on
    //    smaller screens
    //  - `data-toggle-desktop-group` is the group that the menu belongs to on
    //    larger screens
    this.$buttons = this.$module.querySelectorAll(
      'button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'
    )

    this.hiddenButtons = this.$module.querySelectorAll('button[hidden]')
  }

  SuperNavigationMegaMenu.prototype.buttonHandler = function (event) {
    var $target = closestParentIncluding(event.target, 'button')
    var $targetMenu = this.$module.querySelector('#' + $target.getAttribute('aria-controls'))

    var toggleGroupAttribute = 'data-toggle-desktop-group'
    var toggleGroupName = $target.getAttribute(toggleGroupAttribute)
    var toggleGroupList = this.$module.querySelectorAll('[' + toggleGroupAttribute + '="' + toggleGroupName + '"]')

    for (var k = 0; k < toggleGroupList.length; k++) {
      var $element = toggleGroupList[k]
      if ($element !== $target) {
        var $menu = this.$module.querySelector('#' + $element.getAttribute('aria-controls'))
        hide($element, $menu)
      }
    }

    toggle($target, $targetMenu)
  }

  SuperNavigationMegaMenu.prototype.handleKeyDown = function (event) {
    var KEY_TAB = 9
    var KEY_ESC = 27
    var $navMenuLinks = this.$navMenu.querySelectorAll('li a')
    var $firstNavLink = $navMenuLinks[0]
    var $lastNavLink = $navMenuLinks[$navMenuLinks.length - 1]
    var $searchMenuTabbable = this.$searchMenu.querySelectorAll('li a, input, button')
    var $lastSearchMenuTabbable = $searchMenuTabbable[$searchMenuTabbable.length - 1]

    if (event.keyCode === KEY_TAB) {
      if (!this.$navMenu.hasAttribute('hidden')) {
        switch (document.activeElement) {
          case this.$navToggle:
            if (!event.shiftKey) {
              event.preventDefault()
              $firstNavLink.focus()
            }
            break
          case $lastNavLink:
            if (!event.shiftKey) {
              event.preventDefault()
              this.$searchToggle.focus()
              hide(this.$navToggle, this.$navMenu)
            }
            break
          case $firstNavLink:
            if (event.shiftKey) {
              event.preventDefault()
              this.$navToggle.focus()
            }
            break
          case this.$searchToggle:
            if (event.shiftKey) {
              event.preventDefault()
              $lastNavLink.focus()
            }
            break
          default:
            break
        }
      } else if (!this.$searchMenu.hasAttribute('hidden')) {
        if (document.activeElement === $lastSearchMenuTabbable) {
          if (!event.shiftKey) {
            hide(this.$searchToggle, this.$searchMenu)
          }
        }
      }
    } else if (event.keyCode === KEY_ESC) {
      if (!this.$navMenu.hasAttribute('hidden')) {
        hide(this.$navToggle, this.$navMenu)
        this.$navToggle.focus()
      } else if (!this.$searchMenu.hasAttribute('hidden')) {
        hide(this.$searchToggle, this.$searchMenu)
        this.$searchToggle.focus()
      }
    }
  }

  SuperNavigationMegaMenu.prototype.init = function () {
    // Handle key events for tab and escape keys
    this.$module.addEventListener('keydown', this.handleKeyDown.bind(this))

    for (var j = 0; j < this.$buttons.length; j++) {
      var $button = this.$buttons[j]
      $button.addEventListener('click', this.buttonHandler.bind(this), true)
    }

    // The toggle buttons are hardcoded to be hidden in the markup - this means
    // that people without JavaScript turned on won't have buttons present that
    // don't do anything.
    //     Since JavaScript is enabled we can remove the hidden attribute from
    // the buttons so that they're perceivable by users.
    //     As the toggle buttons are now selectable, we should prevent the links
    // from being selectable to avoid confusion.
    for (var i = 0; i < this.hiddenButtons.length; i++) {
      var $element = this.hiddenButtons[i]
      $element.removeAttribute('hidden')

      var closestSiblingLink = closestPrevious($element, 'a')

      if (closestSiblingLink) {
        closestSiblingLink.setAttribute('hidden', 'hidden')
      }
    }

    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link')
      .setAttribute('hidden', 'hidden')

    // Navigation menu and search menu are hardcoded to be open in the markup -
    // this means that the menu still makes sense with CSS and JavaScript turned
    // off.
    //     The menus now need to be hidden as part of the JavaScript
    // initialisation.
    //   - On both mobile and desktop, this means hiding the search menu
    //   - On mobile, this means hiding the navigation
    //   - On desktop, this means hiding the navigation button, showing the
    //     second level navigation menu
    hide(this.$searchToggle, this.$searchMenu)

    this.$module.classList.add('js-module-initialised')
  }

  Modules.SuperNavigationMegaMenu = SuperNavigationMegaMenu
})(window.GOVUK.Modules)
