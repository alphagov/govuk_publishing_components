//= require ../vendor/polyfills-govuk-frontend-v4/Element/prototype/classList.js
//= require ../vendor/polyfills/closest.js
//= require ../vendor/polyfills/indexOf.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Gemstepnav ($module) {
    this.$module = $module
    this.$module.actions = {} // stores text for JS appended elements 'show' and 'hide' on steps, and 'show/hide all' button
    this.$module.rememberShownStep = false
    this.$module.stepNavSize = false
    this.$module.sessionStoreLink = 'govuk-step-nav-active-link'
    this.$module.activeLinkClass = 'gem-c-step-nav__list-item--active'
    this.$module.activeStepClass = 'gem-c-step-nav__step--active'
    this.$module.activeLinkHref = '#content'
    this.$module.uniqueId = false
  }

  Gemstepnav.prototype.init = function () {
    // Indicate that js has worked
    this.$module.classList.add('gem-c-step-nav--active')

    // Prevent FOUC, remove class hiding content
    this.$module.classList.remove('js-hidden')

    this.$module.stepNavSize = this.$module.classList.contains('gem-c-step-nav--large') ? 'Big' : 'Small'
    this.$module.rememberShownStep = !!this.$module.hasAttribute('data-remember') && this.$module.stepNavSize === 'Big'

    this.$module.steps = this.$module.querySelectorAll('.js-step')
    this.$module.stepHeaders = this.$module.querySelectorAll('.js-toggle-panel')
    this.$module.totalSteps = this.$module.querySelectorAll('.js-panel').length
    this.$module.totalLinks = this.$module.querySelectorAll('.gem-c-step-nav__link').length
    this.$module.showOrHideAllButton = false

    this.$module.uniqueId = this.$module.getAttribute('data-id') || false

    this.$module.dataModule = this.$module.getAttribute('data-module')
    this.$module.isGa4Enabled = this.$module.dataModule ? this.$module.dataModule.indexOf('ga4-event-tracker') !== -1 : false

    if (this.$module.uniqueId) {
      this.$module.sessionStoreLink = this.$module.sessionStoreLink + '_' + this.$module.uniqueId
    }

    this.getTextForInsertedElements()
    this.addButtonstoSteps()
    this.addShowHideAllButton()
    this.addShowHideToggle()
    this.addAriaControlsAttrForShowHideAllButton()

    this.ensureOnlyOneActiveLink()
    this.showPreviouslyOpenedSteps()

    this.bindToggleForSteps()
    this.bindToggleShowHideAllButton()
    this.bindComponentLinkClicks()
  }

  Gemstepnav.prototype.getTextForInsertedElements = function () {
    this.$module.actions.showText = this.$module.getAttribute('data-show-text')
    this.$module.actions.hideText = this.$module.getAttribute('data-hide-text')
    this.$module.actions.showAllText = this.$module.getAttribute('data-show-all-text')
    this.$module.actions.hideAllText = this.$module.getAttribute('data-hide-all-text')
  }

  Gemstepnav.prototype.addShowHideAllButton = function () {
    var showAll = document.createElement('div')
    var steps = this.$module.querySelectorAll('.gem-c-step-nav__steps')[0]

    showAll.className = 'gem-c-step-nav__controls govuk-!-display-none-print'
    showAll.innerHTML =
      '<button aria-expanded="false" class="gem-c-step-nav__button gem-c-step-nav__button--controls js-step-controls-button">' +
        '<span class="gem-c-step-nav__chevron gem-c-step-nav__chevron--down js-step-controls-button-icon"></span>' +
          '<span class="gem-c-step-nav__button-text gem-c-step-nav__button-text--all js-step-controls-button-text">' +
            this.$module.actions.showAllText +
          '</span>' +
      '</button>'

    this.$module.insertBefore(showAll, steps)
    this.$module.showOrHideAllButton = this.$module.querySelectorAll('.js-step-controls-button')[0]

    // if GA4 is enabled, set attributes on 'show all sections' for tracking using ga4-event-tracker
    if (this.$module.isGa4Enabled) {
      var showAllAttributesGa4 = { event_name: 'select_content', type: 'step by step', index_section: 0, index_section_count: this.$module.totalSteps }
      this.$module.showOrHideAllButton.setAttribute('data-ga4-event', JSON.stringify(showAllAttributesGa4))
    }
  }

  Gemstepnav.prototype.addShowHideToggle = function () {
    for (var i = 0; i < this.$module.stepHeaders.length; i++) {
      var thisel = this.$module.stepHeaders[i]

      if (!thisel.querySelectorAll('.js-toggle-link').length) {
        var showHideSpan = document.createElement('span')
        var showHideSpanText = document.createElement('span')
        var showHideSpanIcon = document.createElement('span')
        var showHideSpanFocus = document.createElement('span')
        var thisSectionSpan = document.createElement('span')

        showHideSpan.className = 'gem-c-step-nav__toggle-link js-toggle-link govuk-!-display-none-print'
        showHideSpanText.className = 'gem-c-step-nav__button-text js-toggle-link-text'
        showHideSpanIcon.className = 'gem-c-step-nav__chevron js-toggle-link-icon'
        showHideSpanFocus.className = 'gem-c-step-nav__toggle-link-focus'
        thisSectionSpan.className = 'govuk-visually-hidden'

        showHideSpan.appendChild(showHideSpanFocus)
        showHideSpanFocus.appendChild(showHideSpanIcon)
        showHideSpanFocus.appendChild(showHideSpanText)

        thisSectionSpan.innerHTML = ' this section'
        showHideSpan.appendChild(thisSectionSpan)

        thisel.querySelectorAll('.js-step-title-button')[0].appendChild(showHideSpan)
      }
    }
  }

  Gemstepnav.prototype.headerIsOpen = function (stepHeader) {
    return (typeof stepHeader.parentNode.getAttribute('show') !== 'undefined')
  }

  Gemstepnav.prototype.addAriaControlsAttrForShowHideAllButton = function () {
    var ariaControlsValue = this.$module.querySelectorAll('.js-panel')[0].getAttribute('id')

    this.$module.showOrHideAllButton.setAttribute('aria-controls', ariaControlsValue)
  }

  // called by show all/hide all, sets all steps accordingly
  Gemstepnav.prototype.setAllStepsShownState = function (isShown) {
    var data = []

    for (var i = 0; i < this.$module.steps.length; i++) {
      var stepView = new this.StepView(this.$module.steps[i], this.$module)
      stepView.setIsShown(isShown)

      if (isShown) {
        data.push(this.$module.steps[i].getAttribute('id'))
      }
    }

    if (isShown) {
      this.saveToSessionStorage(this.$module.uniqueId, JSON.stringify(data))
    } else {
      this.removeFromSessionStorage(this.$module.uniqueId)
    }
  }

  // called on load, determines whether each step should be open or closed
  Gemstepnav.prototype.showPreviouslyOpenedSteps = function () {
    var data = this.loadFromSessionStorage(this.$module.uniqueId) || []

    for (var i = 0; i < this.$module.steps.length; i++) {
      var thisel = this.$module.steps[i]
      var id = thisel.getAttribute('id')
      var stepView = new this.StepView(thisel, this.$module)
      var shouldBeShown = thisel.hasAttribute('data-show')

      // show the step if it has been remembered or if it has the 'data-show' attribute
      if ((this.$module.rememberShownStep && data.indexOf(id) > -1) || (shouldBeShown && shouldBeShown !== 'undefined')) {
        stepView.setIsShown(true)
      } else {
        stepView.setIsShown(false)
      }
    }

    if (data.length > 0) {
      this.$module.showOrHideAllButton.setAttribute('aria-expanded', true)
      this.setShowHideAllText()
    }
  }

  Gemstepnav.prototype.addButtonstoSteps = function () {
    for (var i = 0; i < this.$module.steps.length; i++) {
      var thisel = this.$module.steps[i]
      var title = thisel.querySelectorAll('.js-step-title')[0]
      var contentId = thisel.querySelectorAll('.js-panel')[0].getAttribute('id')
      var titleText = title.textContent || title.innerText // IE8 fallback

      title.outerHTML =
        '<span class="js-step-title">' +
          '<button ' +
            'class="gem-c-step-nav__button gem-c-step-nav__button--title js-step-title-button" ' +
            'aria-expanded="false" aria-controls="' + contentId + '"' + '>' +
              '<span class="gem-c-step-nav____title-text-focus">' +
                  '<span class="gem-c-step-nav__title-text js-step-title-text">' + titleText + '</span>' +
                  '<span class="govuk-visually-hidden gem-c-step-nav__section-heading-divider">, </span>' +
              '</span>' +
          '</button>' +
        '</span>'

      if (this.$module.isGa4Enabled) {
        var ga4JSON = {
          event_name: 'select_content',
          type: 'step by step',
          text: titleText.trim(),
          index_section: i + 1,
          index_section_count: this.$module.totalSteps,
          index_total: thisel.querySelectorAll('a').length
        }

        var button = thisel.querySelector('.js-step-title-button')
        button.setAttribute('data-ga4-event', JSON.stringify(ga4JSON))
      }
    }
  }

  Gemstepnav.prototype.bindToggleForSteps = function () {
    var that = this
    var togglePanels = this.$module.querySelectorAll('.js-toggle-panel')

    for (var i = 0; i < togglePanels.length; i++) {
      togglePanels[i].addEventListener('click', function () {
        var stepView = new that.StepView(this.parentNode, that.$module)
        stepView.toggle()
        that.setShowHideAllText()
        that.rememberStepState(this.parentNode)
      })
    }
  }

  // if the step is open, store its id in session store
  // if the step is closed, remove its id from session store
  Gemstepnav.prototype.rememberStepState = function (step) {
    if (this.$module.rememberShownStep) {
      var data = JSON.parse(this.loadFromSessionStorage(this.$module.uniqueId)) || []
      var thisstep = step.getAttribute('id')
      var shown = step.classList.contains('step-is-shown')

      if (shown) {
        data.push(thisstep)
      } else {
        var i = data.indexOf(thisstep)
        if (i > -1) {
          data.splice(i, 1)
        }
      }
      this.saveToSessionStorage(this.$module.uniqueId, JSON.stringify(data))
    }
  }

  Gemstepnav.prototype.bindComponentLinkClicks = function () {
    var jsLinks = this.$module.querySelectorAll('.js-link')
    var that = this

    for (var i = 0; i < jsLinks.length; i++) {
      jsLinks[i].addEventListener('click', function (event) {
        var dataPosition = this.getAttribute('data-position')

        if (this.getAttribute('rel') !== 'external') {
          that.saveToSessionStorage(that.$module.sessionStoreLink, dataPosition)
        }

        if (this.getAttribute('href') === that.$module.activeLinkHref) {
          that.setOnlyThisLinkActive(this)
          that.setActiveStepClass()
        }
      })
    }
  }

  Gemstepnav.prototype.saveToSessionStorage = function (key, value) {
    window.sessionStorage.setItem(key, value)
  }

  Gemstepnav.prototype.loadFromSessionStorage = function (key, value) {
    return window.sessionStorage.getItem(key)
  }

  Gemstepnav.prototype.removeFromSessionStorage = function (key) {
    window.sessionStorage.removeItem(key)
  }

  Gemstepnav.prototype.setOnlyThisLinkActive = function (clicked) {
    var allActiveLinks = this.$module.querySelectorAll('.' + this.$module.activeLinkClass)
    for (var i = 0; i < allActiveLinks.length; i++) {
      allActiveLinks[i].classList.remove(this.$module.activeLinkClass)
    }
    clicked.parentNode.classList.add(this.$module.activeLinkClass)
  }

  // if a link occurs more than once in a step nav, the backend doesn't know which one to highlight
  // so it gives all those links the 'active' attribute and highlights the last step containing that link
  // if the user clicked on one of those links previously, it will be in the session store
  // this code ensures only that link and its corresponding step have the highlighting
  // otherwise it accepts what the backend has already passed to the component
  Gemstepnav.prototype.ensureOnlyOneActiveLink = function () {
    var activeLinks = this.$module.querySelectorAll('.js-list-item.' + this.$module.activeLinkClass)

    if (activeLinks.length <= 1) {
      return
    }

    var loaded = this.loadFromSessionStorage(this.$module.sessionStoreLink)
    var activeParent = this.$module.querySelectorAll('.' + this.$module.activeLinkClass)[0]
    var activeChild = activeParent.firstChild
    var foundLink = activeChild.getAttribute('data-position')
    var lastClicked = loaded || foundLink // the value saved has priority

    // it's possible for the saved link position value to not match any of the currently duplicate highlighted links
    // so check this otherwise it'll take the highlighting off all of them
    var checkLink = this.$module.querySelectorAll('[data-position="' + lastClicked + '"]')[0]

    if (checkLink) {
      if (!checkLink.parentNode.classList.contains(this.$module.activeLinkClass)) {
        lastClicked = checkLink
      }
    } else {
      lastClicked = foundLink
    }

    this.removeActiveStateFromAllButCurrent(activeLinks, lastClicked)
    this.setActiveStepClass()
  }

  Gemstepnav.prototype.removeActiveStateFromAllButCurrent = function (activeLinks, current) {
    for (var i = 0; i < activeLinks.length; i++) {
      var thisel = activeLinks[i]
      if (thisel.querySelectorAll('.js-link')[0].getAttribute('data-position').toString() !== current.toString()) {
        thisel.classList.remove(this.$module.activeLinkClass)
        var visuallyHidden = thisel.querySelectorAll('.visuallyhidden')
        if (visuallyHidden.length) {
          visuallyHidden[0].parentNode.removeChild(visuallyHidden[0])
        }
      }
    }
  }

  Gemstepnav.prototype.setActiveStepClass = function () {
    // remove the 'active/open' state from all steps
    var allActiveSteps = this.$module.querySelectorAll('.' + this.$module.activeStepClass)
    for (var i = 0; i < allActiveSteps.length; i++) {
      allActiveSteps[i].classList.remove(this.$module.activeStepClass)
      allActiveSteps[i].removeAttribute('data-show')
    }

    // find the current page link and apply 'active/open' state to parent step
    var activeLink = this.$module.querySelectorAll('.' + this.$module.activeLinkClass)[0]
    if (activeLink) {
      var activeStep = activeLink.closest('.gem-c-step-nav__step')
      activeStep.classList.add(this.$module.activeStepClass)
      activeStep.setAttribute('data-show', '')
    }
  }

  Gemstepnav.prototype.bindToggleShowHideAllButton = function () {
    var that = this

    this.$module.showOrHideAllButton.addEventListener('click', function (event) {
      var textContent = this.textContent || this.innerText
      var shouldShowAll = textContent === that.$module.actions.showAllText

      that.setAllStepsShownState(shouldShowAll)
      that.$module.showOrHideAllButton.setAttribute('aria-expanded', shouldShowAll)
      that.setShowHideAllText()

      return false
    })
  }

  Gemstepnav.prototype.setShowHideAllText = function () {
    var shownSteps = this.$module.querySelectorAll('.step-is-shown').length
    var showAllChevon = this.$module.showOrHideAllButton.querySelector('.js-step-controls-button-icon')
    var showAllButtonText = this.$module.showOrHideAllButton.querySelector('.js-step-controls-button-text')
    // Find out if the number of is-opens == total number of steps
    var shownStepsIsTotalSteps = shownSteps === this.$module.totalSteps

    if (shownStepsIsTotalSteps) {
      showAllButtonText.innerHTML = this.$module.actions.hideAllText
      showAllChevon.classList.remove('gem-c-step-nav__chevron--down')
    } else {
      showAllButtonText.innerHTML = this.$module.actions.showAllText
      showAllChevon.classList.add('gem-c-step-nav__chevron--down')
    }
  }

  Gemstepnav.prototype.StepView = function (stepElement, $module) {
    this.stepElement = stepElement
    this.stepContent = this.stepElement.querySelectorAll('.js-panel')[0]
    this.titleButton = this.stepElement.querySelectorAll('.js-step-title-button')[0]
    var textElement = this.stepElement.querySelectorAll('.js-step-title-text')[0]
    this.title = textElement.textContent || textElement.innerText
    this.title = this.title.replace(/^\s+|\s+$/g, '') // this is 'trim' but supporting IE8
    this.showText = $module.actions.showText
    this.hideText = $module.actions.hideText
    this.upChevronSvg = $module.upChevronSvg
    this.downChevronSvg = $module.downChevronSvg

    this.show = function () {
      this.setIsShown(true)
    }

    this.hide = function () {
      this.setIsShown(false)
    }

    this.toggle = function () {
      this.setIsShown(this.isHidden())
    }

    this.setIsShown = function (isShown) {
      var toggleLink = this.stepElement.querySelectorAll('.js-toggle-link')[0]
      var toggleLinkText = toggleLink.querySelector('.js-toggle-link-text')
      var stepChevron = toggleLink.querySelector('.js-toggle-link-icon')

      if (isShown) {
        this.stepElement.classList.add('step-is-shown')
        this.stepContent.classList.remove('js-hidden')
        toggleLinkText.innerHTML = this.hideText
        stepChevron.classList.remove('gem-c-step-nav__chevron--down')
      } else {
        this.stepElement.classList.remove('step-is-shown')
        this.stepContent.classList.add('js-hidden')
        toggleLinkText.innerHTML = this.showText
        stepChevron.classList.add('gem-c-step-nav__chevron--down')
      }
      this.titleButton.setAttribute('aria-expanded', isShown)
    }

    this.isShown = function () {
      return this.stepElement.classList.contains('step-is-shown')
    }

    this.isHidden = function () {
      return !this.isShown()
    }

    this.numberOfContentItems = function () {
      return this.stepContent.querySelectorAll('.js-link').length
    }
  }

  Gemstepnav.prototype.StepToggleClick = function (event, stepView, stepIsOptional, stepNavSize) {
    this.target = event.target
    this.stepIsOptional = stepIsOptional
    this.stepNavSize = stepNavSize

    // returns index of the clicked step in the overall number of steps
    this.stepIndex = function () { // eslint-disable-line no-unused-vars
      return this.$module.steps.index(stepView.element) + 1
    }

    this.locateClickElement = function () {
      if (this.clickedOnIcon()) {
        return this.iconType() + ' click'
      } else if (this.clickedOnHeading()) {
        return 'Heading click'
      } else {
        return 'Elsewhere click'
      }
    }

    this.clickedOnIcon = function () {
      return this.target.classList.contains('js-toggle-link')
    }

    this.clickedOnHeading = function () {
      return this.target.classList.contains('js-step-title-text')
    }

    this.iconType = function () {
      return (stepView.isHidden() ? 'Minus' : 'Plus')
    }

    this.isOptional = function () {
      return (this.stepIsOptional ? ' ; optional' : '')
    }
  }

  Modules.Gemstepnav = Gemstepnav
})(window.GOVUK.Modules)
