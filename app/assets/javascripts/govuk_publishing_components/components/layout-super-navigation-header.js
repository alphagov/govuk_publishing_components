//= require govuk/vendor/polyfills/Element/prototype/classList.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  var SETTINGS = {
    breakpoint: {
      desktop: 769
    },
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
    if (isOpen) {
      hide($button, $menu)
    } else {
      show($button, $menu)
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

  // When moving from one screen size to another (eg mobile to desktop) we need
  // to find out whether a submenu is open so the parent menu can be kept open.
  var hasSubMenusOpen = function ($menu) {
    return $menu.querySelectorAll('button[aria-expanded="true"]').length > 0
  }

  // Returns what screen size the window is currently. Returns a string of
  // either `desktop` or `mobile` so it can be interpolated to access the
  // `data-toggle-{desktop|mobile}-group` attribute.
  var windowSize = function () {
    return window.innerWidth >= SETTINGS.breakpoint.desktop ? 'desktop' : 'mobile'
  }

  function SuperNavigationMegaMenu ($module) {
    this.$module = $module
    this.$navigationToggle = this.$module.querySelector('#super-navigation-menu-toggle')
    this.$navigationMenu = this.$module.querySelector('#super-navigation-menu')
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle')
    this.$searchMenu = this.$module.querySelector('#super-search-menu')

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

    this.lastWindowSize = undefined
  }

  SuperNavigationMegaMenu.prototype.windowSize = windowSize

  // Resizes the space needed for the dropdown menu so that it doesn't overlap
  // with the page content. As this is an event that needs to be added and
  // removed it can't be be bound to `this` because that changes the fingerprint
  // of the function, and makes it unable to be removed with
  // `removeEventListener`.
  SuperNavigationMegaMenu.prototype.resizeHandler = function () {
    var $module = document.querySelector('[data-module="super-navigation-mega-menu"]')
    var $openButton = $module.querySelector('[aria-expanded="true"][data-toggle-desktop-group="top"]')
    var $openMenu = $openButton ? $module.querySelector('#' + $openButton.getAttribute('aria-controls')) : null
    var margin = $openMenu && windowSize() === 'desktop' ? $openMenu.offsetHeight : 0

    $module.style.marginBottom = margin + 'px'
  }

  SuperNavigationMegaMenu.prototype.updateStates = function () {
    if (this.windowSize() === 'mobile' && this.lastWindowSize !== 'mobile') {
      this.$navigationToggle.removeAttribute('hidden')

      // Hides navigation menu unless a submenu is open - this could be common
      // as the desktop view has the navigation submenu as top level in the
      // menu.
      if (!hasSubMenusOpen(this.$navigationMenu)) {
        hide(this.$navigationToggle, this.$navigationMenu)
      }

      this.$module.style.marginBottom = '0'

      window.removeEventListener('resize', this.resizeHandler, { passive: true })

      this.lastWindowSize = this.windowSize()
    }

    // Hide the navigation toggle button and show the navigation submenu:
    if (this.windowSize() === 'desktop' && this.lastWindowSize !== 'desktop') {
      this.$navigationToggle.setAttribute('hidden', 'hidden')
      this.$navigationMenu.removeAttribute('hidden')

      window.addEventListener('resize', this.resizeHandler, { passive: true })

      this.lastWindowSize = this.windowSize()
    }
  }

  SuperNavigationMegaMenu.prototype.buttonHandler = function (event) {
    var $target = closestParentIncluding(event.target, 'button')
    var $targetMenu = this.$module.querySelector('#' + $target.getAttribute('aria-controls'))

    var toggleGroupAttribute = 'data-toggle-' + this.windowSize() + '-group'
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

    if (this.windowSize() === 'desktop') {
      this.$module.style.marginBottom = $targetMenu.offsetHeight + 'px'
    }
  }

  SuperNavigationMegaMenu.prototype.init = function () {
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
    this.updateStates()

    this.lastWindowSize = this.windowSize()

    // The menu needs to be updated when the window is resized - specifically,
    // the top level navigation toggle needs to be shown or hidden.
    //     Using `matchMedia` to listen for both resize events means that this
    // will only fire when the media query is matched so is more efficient. The
    // fallback is the `window.resize` event with a check to make sure that it
    // only does things when moving from mobile to desktop view.
    var setupResizeListener = function () {
      window.addEventListener('resize', this.updateStates.bind(this), { passive: true })
    }.bind(this)

    if (typeof window.matchMedia === 'function') {
      // Internet Explorer 11 supports `matchMedia`, but doesn't support
      // the `change` event[1] - so we try it, and then fail back to using
      // `window.resize`.
      // [1]: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/onchange
      try {
        window.matchMedia('screen and (min-width:' + SETTINGS.breakpoint.desktop + 'px)')
          .addEventListener('change', this.updateStates.bind(this))
      } catch (error) {
        setupResizeListener()
      }
    } else {
      setupResizeListener()
    }
  }

  Modules.SuperNavigationMegaMenu = SuperNavigationMegaMenu
})(window.GOVUK.Modules)
