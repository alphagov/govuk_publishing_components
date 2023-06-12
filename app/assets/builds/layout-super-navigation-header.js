(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/layout-super-navigation-header.js
  var SETTINGS = {
    breakpoint: {
      desktop: 769
    },
    label: {
      hide: "data-text-for-hide",
      show: "data-text-for-show"
    }
  };
  var setLabel = function($button, showOrHide) {
    var newLabel = $button.getAttribute(SETTINGS.label[showOrHide]);
    if (newLabel) {
      $button.setAttribute("aria-label", newLabel);
    }
  };
  var hide = function($button, $menu) {
    $button.setAttribute("aria-expanded", false);
    $button.classList.remove("gem-c-layout-super-navigation-header__open-button");
    $menu.setAttribute("hidden", "hidden");
    setLabel($button, "show");
  };
  var show = function($button, $menu) {
    $button.setAttribute("aria-expanded", true);
    $button.classList.add("gem-c-layout-super-navigation-header__open-button");
    $menu.removeAttribute("hidden");
    setLabel($button, "hide");
    console.log("showing, module");
  };
  var toggle = function($button, $menu) {
    var isOpen = $button.getAttribute("aria-expanded") === "true";
    var trackingLabel = $button.getAttribute("data-tracking-key");
    if (isOpen) {
      hide($button, $menu);
    } else {
      show($button, $menu);
    }
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent && trackingLabel) {
      window.GOVUK.analytics.trackEvent("headerClicked", trackingLabel + (isOpen ? "Closed" : "Opened"), { label: "none" });
    }
  };
  var closestParentIncluding = function($element, elementType) {
    if ($element.tagName.toLowerCase() === elementType.toLowerCase()) {
      return $element;
    }
    return closestParentIncluding($element.parentNode, elementType);
  };
  var closestPrevious = function($element, elementType) {
    if ($element === null) {
      return null;
    }
    if ($element.nodeType === 1 && $element.tagName.toLowerCase() === elementType.toLowerCase()) {
      return $element;
    }
    var previousElement = $element.previousElementSibling || $element.previousSibling;
    return closestPrevious(previousElement, elementType);
  };
  var LayoutSuperNavigationHeader = class {
    constructor($module) {
      this.$module = $module;
      this.$searchToggle = this.$module.querySelector("#super-search-menu-toggle");
      this.$searchMenu = this.$module.querySelector("#super-search-menu");
      this.$buttons = this.$module.querySelectorAll(
        "button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]"
      );
      this.hiddenButtons = this.$module.querySelectorAll("button[hidden]");
    }
    updateStates() {
      var $openButton = this.$module.querySelector('[aria-expanded="true"][data-toggle-desktop-group="top"]');
      var $openMenu = $openButton ? this.$module.querySelector("#" + $openButton.getAttribute("aria-controls")) : null;
      var margin = $openMenu ? $openMenu.offsetHeight : 0;
      this.$module.style.marginBottom = margin + "px";
    }
    buttonHandler(event) {
      var $target = closestParentIncluding(event.target, "button");
      var $targetMenu = this.$module.querySelector("#" + $target.getAttribute("aria-controls"));
      var toggleGroupAttribute = "data-toggle-desktop-group";
      var toggleGroupName = $target.getAttribute(toggleGroupAttribute);
      var toggleGroupList = this.$module.querySelectorAll("[" + toggleGroupAttribute + '="' + toggleGroupName + '"]');
      for (var k = 0; k < toggleGroupList.length; k++) {
        var $element = toggleGroupList[k];
        if ($element !== $target) {
          var $menu = this.$module.querySelector("#" + $element.getAttribute("aria-controls"));
          hide($element, $menu);
        }
      }
      toggle($target, $targetMenu);
      this.$module.style.marginBottom = $targetMenu.offsetHeight + "px";
    }
    init() {
      for (var j = 0; j < this.$buttons.length; j++) {
        var $button = this.$buttons[j];
        $button.addEventListener("click", this.buttonHandler.bind(this), true);
      }
      for (var i = 0; i < this.hiddenButtons.length; i++) {
        var $element = this.hiddenButtons[i];
        $element.removeAttribute("hidden");
        var closestSiblingLink = closestPrevious($element, "a");
        if (closestSiblingLink) {
          closestSiblingLink.setAttribute("hidden", "hidden");
        }
      }
      this.$module.querySelector(".gem-c-layout-super-navigation-header__search-item-link").setAttribute("hidden", "hidden");
      hide(this.$searchToggle, this.$searchMenu);
      this.updateStates();
      window.addEventListener("resize", this.updateStates.bind(this), { passive: true });
      this.$module.classList.add("js-module-initialised");
    }
  };
  var layout_super_navigation_header_default = LayoutSuperNavigationHeader;
})();
//# sourceMappingURL=assets/layout-super-navigation-header.js.map
