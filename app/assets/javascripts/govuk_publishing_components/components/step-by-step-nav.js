// Most of this is originally from the service manual but has changed considerably since then

(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  Modules.Gemstepnav = function () {

    var actions = {
      showLinkText: "Show",
      hideLinkText: "Hide"
    };

    var bulkActions = {
      showAll: {
        buttonText: "Show all",
        eventLabel: "Show All",
        linkText: "Show"
      },
      hideAll: {
        buttonText: "Hide all",
        eventLabel: "Hide All",
        linkText: "Hide"
      }
    };

    var rememberShownStep = false;
    var stepNavSize;
    var sessionStoreLink = 'govuk-step-nav-active-link';
    var activeLinkClass = 'gem-c-step-nav__link--active';
    var activeLinkHref = '#content';

    this.start = function ($element) {

      $(window).unload(storeScrollPosition);

      // Indicate that js has worked
      $element.addClass('gem-c-step-nav--active');

      // Prevent FOUC, remove class hiding content
      $element.removeClass('js-hidden');

      rememberShownStep = !!$element.filter('[data-remember]').length;
      stepNavSize = $element.hasClass('gem-c-step-nav--large') ? 'Big' : 'Small';
      var $steps = $element.find('.js-step');
      var $stepHeaders = $element.find('.js-toggle-panel');
      var totalSteps = $element.find('.js-panel').length;
      var totalLinks = $element.find('.gem-c-step-nav__link-item').length;

      var $showOrHideAllButton;

      var uniqueId = $element.data('id') || false;
      var stepNavTracker = new StepNavTracker(totalSteps, totalLinks, uniqueId);

      addButtonstoSteps();
      addShowHideAllButton();
      addShowHideToggle();
      addAriaControlsAttrForShowHideAllButton();

      hideAllSteps();
      showLinkedStep();
      ensureOnlyOneActiveLink();

      bindToggleForSteps(stepNavTracker);
      bindToggleShowHideAllButton(stepNavTracker);
      bindComponentLinkClicks(stepNavTracker);

      // When navigating back in browser history to the step nav, the browser will try to be "clever" and return
      // the user to their previous scroll position. However, since we collapse all but the currently-anchored
      // step, the content length changes and the user is returned to the wrong position (often the footer).
      // In order to correct this behaviour, as the user leaves the page, we anticipate the correct height we wish the
      // user to return to by forcibly scrolling them to that height, which becomes the height the browser will return
      // them to.
      // If we can't find an element to return them to, then reset the scroll to the top of the page. This handles
      // the case where the user has expanded all steps, so they are not returned to a particular step, but
      // still could have scrolled a long way down the page.
      function storeScrollPosition() {
        hideAllSteps();
        var $step = getStepForAnchor();

        document.body.scrollTop = $step && $step.length
          ? $step.offset().top
          : 0;
      }

      function addShowHideAllButton() {
        $element.prepend('<div class="gem-c-step-nav__controls"><button aria-expanded="false" class="gem-c-step-nav__button gem-c-step-nav__button--controls js-step-controls-button">' + bulkActions.showAll.buttonText + '</button></div>');
      }

      function addShowHideToggle() {
        $stepHeaders.each(function() {
          var linkText = actions.showLinkText;

          if (headerIsOpen($(this))) {
            linkText = actions.hideLinkText;
          }
          if (!$(this).find('.js-toggle-link').length) {
            $(this).find('.js-step-title-button').append('<span class="gem-c-step-nav__toggle-link js-toggle-link" aria-hidden="true">' + linkText + '</span>');
          }
        });
      }

      function headerIsOpen($stepHeader) {
        return (typeof $stepHeader.closest('.js-step').data('show') !== 'undefined');
      }

      function addAriaControlsAttrForShowHideAllButton() {
        var ariaControlsValue = $element.find('.js-panel').first().attr('id');

        $showOrHideAllButton = $element.find('.js-step-controls-button');
        $showOrHideAllButton.attr('aria-controls', ariaControlsValue);
      }

      function hideAllSteps() {
        setAllStepsShownState(false);
      }

      function setAllStepsShownState(isShown) {
        $.each($steps, function () {
          var stepView = new StepView($(this));
          stepView.preventHashUpdate();
          stepView.setIsShown(isShown);
        });
      }

      function showLinkedStep() {
        var $step;
        if (rememberShownStep) {
          $step = getStepForAnchor();
        } else {
          $step = $steps.filter('[data-show]');
        }

        if ($step && $step.length) {
          var stepView = new StepView($step);
          stepView.show();
        }
      }

      function getStepForAnchor() {
        var anchor = getActiveAnchor();

        return anchor.length
          ? $element.find('#' + escapeSelector(anchor.substr(1)))
          : null;
      }

      function getActiveAnchor() {
        return GOVUK.getCurrentLocation().hash;
      }

      function addButtonstoSteps() {
        $.each($steps, function () {
          var $step = $(this);
          var $title = $step.find('.js-step-title');
          var contentId = $step.find('.js-panel').first().attr('id');

          $title.wrapInner(
            '<span class="js-step-title-text"></span>'
            );

          $title.wrapInner(
            '<button ' +
            'class="gem-c-step-nav__button gem-c-step-nav__button--title js-step-title-button" ' +
            'aria-expanded="false" aria-controls="' + contentId + '">' +
            '</button>' );
        });
      }

      function bindToggleForSteps(stepNavTracker) {
        $element.find('.js-toggle-panel').click(function (event) {
          preventLinkFollowingForCurrentTab(event);

          var stepView = new StepView($(this).closest('.js-step'));
          stepView.toggle();

          var toggleClick = new StepToggleClick(event, stepView, $steps, stepNavTracker);
          toggleClick.track();

          setShowHideAllText();
        });
      }

      // tracking click events on links in step content
      function bindComponentLinkClicks(stepNavTracker) {
        $element.find('.js-link').click(function (event) {
          var linkClick = new componentLinkClick(event, stepNavTracker, $(this).attr('data-position'));
          linkClick.track();
          var thisLinkHref = $(this).attr('href');

          if ($(this).attr('rel') !== 'external') {
            saveToSessionStorage(sessionStoreLink, $(this).data('position'));
          }

          if (thisLinkHref == activeLinkHref) {
            setOnlyThisLinkActive($(this));
          }
        });
      }

      function saveToSessionStorage(key, value) {
        sessionStorage.setItem(key, value);
      }

      function loadFromSessionStorage(key) {
        return sessionStorage.getItem(key);
      }

      function removeFromSessionStorage(key) {
        sessionStorage.removeItem(key);
      }

      function setOnlyThisLinkActive(clicked) {
        $element.find('.' + activeLinkClass).removeClass(activeLinkClass);
        clicked.parent().addClass(activeLinkClass);
      }

      function ensureOnlyOneActiveLink() {
        var $activeLinks = $element.find('.js-list-item.' + activeLinkClass);

        if ($activeLinks.length <= 1) {
          return;
        }

        var lastClicked = loadFromSessionStorage(sessionStoreLink);

        if (lastClicked) {
          removeActiveStateFromAllButCurrent($activeLinks, lastClicked);
          removeFromSessionStorage(sessionStoreLink);
        } else {
          var activeLinkInActiveStep = $element.find('.gem-c-step-nav__step--active').find('.' + activeLinkClass).first();

          if (activeLinkInActiveStep.length) {
            $activeLinks.removeClass(activeLinkClass);
            activeLinkInActiveStep.addClass(activeLinkClass);
          } else {
            $activeLinks.slice(1).removeClass(activeLinkClass);
          }
        }
      }

      function removeActiveStateFromAllButCurrent($links, current) {
        $links.each(function() {
          if ($(this).find('.js-link').data('position').toString() !== current.toString()) {
            $(this).removeClass(activeLinkClass);
          }
        });
      }

      function preventLinkFollowingForCurrentTab(event) {
        // If the user is holding the ⌘ or Ctrl key, they're trying
        // to open the link in a new window, so let the click happen
        if (event.metaKey || event.ctrlKey) {
          return;
        }

        event.preventDefault();
      }

      function bindToggleShowHideAllButton(stepNavTracker) {
        $showOrHideAllButton = $element.find('.js-step-controls-button');
        $showOrHideAllButton.on('click', function () {
          var shouldshowAll;

          if ($showOrHideAllButton.text() == bulkActions.showAll.buttonText) {
            $showOrHideAllButton.text(bulkActions.hideAll.buttonText);
            $element.find('.js-toggle-link').text(actions.hideLinkText)
            shouldshowAll = true;

            stepNavTracker.track('pageElementInteraction', 'stepNavAllShown', {
              label: bulkActions.showAll.eventLabel + ": " + stepNavSize
            });
          } else {
            $showOrHideAllButton.text(bulkActions.showAll.buttonText);
            $element.find('.js-toggle-link').text(actions.showLinkText);
            shouldshowAll = false;

            stepNavTracker.track('pageElementInteraction', 'stepNavAllHidden', {
              label: bulkActions.hideAll.eventLabel + ": " + stepNavSize
            });
          }

          setAllStepsShownState(shouldshowAll);
          $showOrHideAllButton.attr('aria-expanded', shouldshowAll);
          setShowHideAllText();
          setHash(null);

          return false;
        });
      }

      function setShowHideAllText() {
        var shownSteps = $element.find('.step-is-shown').length;
        // Find out if the number of is-opens == total number of steps
        if (shownSteps === totalSteps) {
          $showOrHideAllButton.text(bulkActions.hideAll.buttonText);
        } else {
          $showOrHideAllButton.text(bulkActions.showAll.buttonText);
        }
      }

      // Ideally we'd use jQuery.escapeSelector, but this is only available from v3
      // See https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/selector-native.js#L46
      function escapeSelector(s) {
        var cssMatcher = /([\x00-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        return s.replace(cssMatcher, "\\$&");
      }
    };

    function StepView($stepElement) {
      var $titleLink = $stepElement.find('.js-step-title-button');
      var $stepContent = $stepElement.find('.js-panel');
      var shouldUpdateHash = rememberShownStep;

      this.title = $stepElement.find('.js-step-title-text').text().trim();
      this.element = $stepElement;

      this.show = show;
      this.hide = hide;
      this.toggle = toggle;
      this.setIsShown = setIsShown;
      this.isShown = isShown;
      this.isHidden = isHidden;
      this.preventHashUpdate = preventHashUpdate;
      this.numberOfContentItems = numberOfContentItems;

      function show() {
        setIsShown(true);
      }

      function hide() {
        setIsShown(false);
      }

      function toggle() {
        setIsShown(isHidden());
      }

      function setIsShown(isShown) {
        $stepElement.toggleClass('step-is-shown', isShown);
        $stepContent.toggleClass('js-hidden', !isShown);
        $titleLink.attr("aria-expanded", isShown);
        $stepElement.find('.js-toggle-link').text(isShown ? actions.hideLinkText : actions.showLinkText);

        if (shouldUpdateHash) {
          updateHash($stepElement);
        }
      }

      function isShown() {
        return $stepElement.hasClass('step-is-shown');
      }

      function isHidden() {
        return !isShown();
      }

      function preventHashUpdate() {
        shouldUpdateHash = false;
      }

      function numberOfContentItems() {
        return $stepContent.find('.js-link').length;
      }
    }

    function updateHash($stepElement) {
      var stepView = new StepView($stepElement);
      var hash = stepView.isShown() && '#' + $stepElement.attr('id');
      setHash(hash)
    }

    // Sets the hash for the page. If a falsy value is provided, the hash is cleared.
    function setHash(hash) {
      if (!GOVUK.support.history()) {
        return;
      }

      var newLocation = hash || GOVUK.getCurrentLocation().pathname;
      history.replaceState({}, '', newLocation);
    }

    function StepToggleClick(event, stepView, $steps, stepNavTracker) {
      this.track = trackClick;
      var $target = $(event.target);

      function trackClick() {
        var tracking_options = {label: trackingLabel(), dimension28: stepView.numberOfContentItems().toString()}
        stepNavTracker.track('pageElementInteraction', trackingAction(), tracking_options);
      }

      function trackingLabel() {
        return $target.closest('.js-toggle-panel').attr('data-position') + ' - ' + stepView.title + ' - ' + locateClickElement() + ": " + stepNavSize;
      }

      // returns index of the clicked step in the overall number of steps
      function stepIndex() {
        return $steps.index(stepView.element) + 1;
      }

      function trackingAction() {
        return (stepView.isHidden() ? 'stepNavHidden' : 'stepNavShown');
      }

      function locateClickElement() {
        if (clickedOnIcon()) {
          return iconType() + ' click';
        } else if (clickedOnHeading()) {
          return 'Heading click';
        } else {
          return 'Elsewhere click';
        }
      }

      function clickedOnIcon() {
        return $target.hasClass('js-toggle-link');
      }

      function clickedOnHeading() {
        return $target.hasClass('js-step-title-text');
      }

      function iconType() {
        return (stepView.isHidden() ? 'Minus' : 'Plus');
      }
    }

    function componentLinkClick(event, stepNavTracker, linkPosition) {
      this.track = trackClick;

      function trackClick() {
        var tracking_options = {label: $(event.target).attr('href') + " : " + stepNavSize};
        var dimension28 = $(event.target).closest('.gem-c-step-nav__links').attr('data-length');

        if (dimension28) {
          tracking_options['dimension28'] = dimension28;
        }

        stepNavTracker.track('stepNavLinkClicked', linkPosition, tracking_options);
      }
    }

    // A helper that sends a custom event request to Google Analytics if
    // the GOVUK module is setup
    function StepNavTracker(totalSteps, totalLinks, uniqueId) {
      this.track = function(category, action, options) {
        // dimension26 records the total number of expand/collapse steps in this step nav
        // dimension27 records the total number of links in this step nav
        // dimension28 records the number of links in the step that was shown/hidden (handled in click event)
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          options = options || {};
          options["dimension26"] = options["dimension26"] || totalSteps.toString();
          options["dimension27"] = options["dimension27"] || totalLinks.toString();
          options["dimension96"] = options["dimension96"] || uniqueId;
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    }
  };
})(window.GOVUK.Modules);
