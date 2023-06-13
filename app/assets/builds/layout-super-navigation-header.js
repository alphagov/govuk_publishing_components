
  var LayoutSuperNavigationHeader = (function () {
  'use strict';

  var SETTINGS = {
    breakpoint: {
      desktop: 769
    },
    label: {
      hide: 'data-text-for-hide',
      show: 'data-text-for-show'
    }
  };

  var setLabel = function ($button, showOrHide) {
    var newLabel = $button.getAttribute(SETTINGS.label[showOrHide]);

    if (newLabel) {
      $button.setAttribute('aria-label', newLabel);
    }
  };

  // Wrapper functions to contain all of the mechanisms needed for hiding and
  // toggling the menus.
  var hide = function ($button, $menu) {
    $button.setAttribute('aria-expanded', false);
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
    $menu.setAttribute('hidden', 'hidden');
    setLabel($button, 'show');
  };
  var show = function ($button, $menu) {
    $button.setAttribute('aria-expanded', true);
    $button.classList.add('gem-c-layout-super-navigation-header__open-button');
    $menu.removeAttribute('hidden');
    setLabel($button, 'hide');
    console.log('showing, module');
  };

  var toggle = function ($button, $menu) {
    var isOpen = $button.getAttribute('aria-expanded') === 'true';
    var trackingLabel = $button.getAttribute('data-tracking-key');
    if (isOpen) {
      hide($button, $menu);
    } else {
      show($button, $menu);
    }

    // Fire analytics if analytics are available
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent && trackingLabel) {
      window.GOVUK.analytics.trackEvent('headerClicked', trackingLabel + (isOpen ? 'Closed' : 'Opened'), { label: 'none' });
    }
  };

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
  };

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
    var previousElement = $element.previousElementSibling || $element.previousSibling;

    return closestPrevious(previousElement, elementType)
  };

  var LayoutSuperNavigationHeader = function LayoutSuperNavigationHeader($module) {
    this.$module = $module;
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle');
    this.$searchMenu = this.$module.querySelector('#super-search-menu');

    // The menu toggler buttons need three attributes for this to work:
    //- `aria-controls` contains the id of the menu to be toggled
    //- `data-toggle-mobile-group` is the group that the menu belongs to on
    //  smaller screens
    //- `data-toggle-desktop-group` is the group that the menu belongs to on
    //  larger screens
    this.$buttons = this.$module.querySelectorAll(
      'button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'
    );

    this.hiddenButtons = this.$module.querySelectorAll('button[hidden]');    
  };

  LayoutSuperNavigationHeader.prototype.updateStates = function updateStates () {
    // Check whether any of the dropdown menus are open.
    var $openButton = this.$module.querySelector('[aria-expanded="true"][data-toggle-desktop-group="top"]');
    // Gets the open dropdown menu
    var $openMenu = $openButton ? this.$module.querySelector('#' + $openButton.getAttribute('aria-controls')) : null;
    // If there is an open dropdown menu, get the height of the dropdown menu.
    var margin = $openMenu ? $openMenu.offsetHeight : 0;

    // Make space for the dropdown menu.
    this.$module.style.marginBottom = margin + 'px';
  };

  LayoutSuperNavigationHeader.prototype.buttonHandler = function buttonHandler (event) {
    var $target = closestParentIncluding(event.target, 'button');
    var $targetMenu = this.$module.querySelector('#' + $target.getAttribute('aria-controls'));

    var toggleGroupAttribute = 'data-toggle-desktop-group';
    var toggleGroupName = $target.getAttribute(toggleGroupAttribute);
    var toggleGroupList = this.$module.querySelectorAll('[' + toggleGroupAttribute + '="' + toggleGroupName + '"]');

    for (var k = 0; k < toggleGroupList.length; k++) {
      var $element = toggleGroupList[k];
      if ($element !== $target) {
        var $menu = this.$module.querySelector('#' + $element.getAttribute('aria-controls'));
        hide($element, $menu);
      }
    }

    toggle($target, $targetMenu);

    this.$module.style.marginBottom = $targetMenu.offsetHeight + 'px';
  };

  LayoutSuperNavigationHeader.prototype.init = function init () {
    for (var j = 0; j < this.$buttons.length; j++) {
      var $button = this.$buttons[j];
      $button.addEventListener('click', this.buttonHandler.bind(this), true);
    }

    // The toggle buttons are hardcoded to be hidden in the markup - this means
    // that people without JavaScript turned on won't have buttons present that
    // don't do anything.
    //   Since JavaScript is enabled we can remove the hidden attribute from
    // the buttons so that they're perceivable by users.
    //   As the toggle buttons are now selectable, we should prevent the links
    // from being selectable to avoid confusion.
    for (var i = 0; i < this.hiddenButtons.length; i++) {
      var $element = this.hiddenButtons[i];
      $element.removeAttribute('hidden');

      var closestSiblingLink = closestPrevious($element, 'a');

      if (closestSiblingLink) {
        closestSiblingLink.setAttribute('hidden', 'hidden');
      }
    }

    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link')
      .setAttribute('hidden', 'hidden');

    // Navigation menu and search menu are hardcoded to be open in the markup -
    // this means that the menu still makes sense with CSS and JavaScript turned
    // off.
    //   The menus now need to be hidden as part of the JavaScript
    // initialisation.
    // - On both mobile and desktop, this means hiding the search menu
    // - On mobile, this means hiding the navigation
    // - On desktop, this means hiding the navigation button, showing the
    //   second level navigation menu
    hide(this.$searchToggle, this.$searchMenu);
    this.updateStates();

    // The menu needs to be updated when the window is resized to make sure that
    // the space needed for the dropdown menu is correct.
    window.addEventListener('resize', this.updateStates.bind(this), { passive: true });

    this.$module.classList.add('js-module-initialised');
  };

  return LayoutSuperNavigationHeader;

})();
//# sourceMappingURL=layout-super-navigation-header.js.map

  document.querySelectorAll('[data-module*="layout-super-navigation-header"]').forEach((el) => {
    var instance = new LayoutSuperNavigationHeader(el);
    instance.init();
  })
