/* global nodeListForEach */
//  = require ../vendor/polyfills/closest.js
//  = require ../vendor/polyfills/indexOf.js
//  = require ../vendor/polyfills/common.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GemAccordion ($module) {
    this.$module = $module
    this.sectionClass = 'gem-c-accordion__section'
    this.moduleId = this.$module.getAttribute('id')
    this.sections = this.$module.querySelectorAll('.' + this.sectionClass)
    this.openAllButton = ''
    this.controlsClass = 'gem-c-accordion__controls'
    this.openAllClass = 'gem-c-accordion__open-all'
    this.openAllTextClass = 'gem-c-accordion__open-all-text'
    this.sectionHeaderClass = 'gem-c-accordion__section-header'
    this.sectionHeadingClass = 'gem-c-accordion__section-heading'
    this.sectionSummaryClass = 'gem-c-accordion__section-summary'
    this.sectionButtonClass = 'gem-c-accordion__section-button'
    this.sectionExpandedClass = 'gem-c-accordion__section--expanded'
    this.sectionInnerContent = 'gem-c-accordion__section-content'
    this.toggleLinkClass = 'js-toggle-link'
    this.sectionShowHideIconClass = 'gem-c-accordion__toggle-link'
    this.sectionShowHideTextClass = 'gem-c-accordion__toggle-text'
    this.upChevonIconClass = 'gem-c-accordion-nav__chevron'
    this.downChevonIconClass = 'gem-c-accordion-nav__chevron--down'

    // Translated component content and language attribute pulled from data attributes
    this.$module.actions = {}
    this.$module.actions.locale = this.$module.getAttribute('data-locale')
    this.$module.actions.showText = this.$module.getAttribute('data-show-text')
    this.$module.actions.hideText = this.$module.getAttribute('data-hide-text')
    this.$module.actions.showAllText = this.$module.getAttribute('data-show-all-text')
    this.$module.actions.hideAllText = this.$module.getAttribute('data-hide-all-text')
    this.$module.actions.thisSectionVisuallyHidden = this.$module.getAttribute('data-this-section-visually-hidden')
  }

  GemAccordion.prototype.init = function () {
    this.browserSupportsSessionStorage = helper.checkForSessionStorage()

    // Indicate that JavaScript has worked
    this.$module.classList.add('gem-c-accordion--active')

    this.initControls()
    this.initSectionHeaders()

    // Feature flag for anchor tag navigation used on manuals
    if (this.$module.getAttribute('data-anchor-navigation') === 'true') {
      this.openByAnchorOnLoad()
      this.addEventListenersForAnchors()
    }

    // See if "Show all sections" button text should be updated
    var areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateOpenAllButton(areAllSectionsOpen)
  }

  // Initialise controls and set attributes
  GemAccordion.prototype.initControls = function () {
    // Create "Show all" button and set attributes
    this.openAllButton = document.createElement('button')
    this.openAllButton.setAttribute('class', this.openAllClass)
    this.openAllButton.setAttribute('aria-expanded', 'false')

    // Create icon, add to element
    var icon = document.createElement('span')
    icon.classList.add(this.upChevonIconClass)
    this.openAllButton.appendChild(icon)

    // Create control wrapper and add controls to it
    var accordionControls = document.createElement('div')
    accordionControls.setAttribute('class', this.controlsClass)
    accordionControls.appendChild(this.openAllButton)
    this.$module.insertBefore(accordionControls, this.$module.firstChild)

    // Build additional wrapper for open all toggle text, place icon after wrapped text.
    var wrapperOpenAllText = document.createElement('span')
    wrapperOpenAllText.classList.add(this.openAllTextClass)
    this.openAllButton.insertBefore(wrapperOpenAllText, this.openAllButton.childNodes[0] || null)

    // Handle events for the controls
    this.openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this))
  }

  // Initialise section headers
  GemAccordion.prototype.initSectionHeaders = function () {
    // Loop through section headers
    nodeListForEach(this.sections, function (section, i) {
      // Set header attributes
      var header = section.querySelector('.' + this.sectionHeaderClass)

      this.initHeaderAttributes(header, i)
      this.setExpanded(this.isExpanded(section), section)

      // Handle events
      header.addEventListener('click', this.onSectionToggle.bind(this, section))

      // See if there is any state stored in sessionStorage and set the sections to
      // open or closed.
      this.setInitialState(section)
    }.bind(this))
  }

  // Set individual header attributes
  GemAccordion.prototype.initHeaderAttributes = function (headerWrapper, index) {
    var span = headerWrapper.querySelector('.' + this.sectionButtonClass)
    var heading = headerWrapper.querySelector('.' + this.sectionHeadingClass)
    var summary = headerWrapper.querySelector('.' + this.sectionSummaryClass)

    // Copy existing span element to an actual button element, for improved accessibility.
    var button = document.createElement('button')
    button.setAttribute('id', this.moduleId + '-heading-' + (index + 1))
    button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1))

    // Create show / hide arrow icons with text.
    var showIcons = document.createElement('span')
    showIcons.classList.add(this.sectionShowHideIconClass, this.toggleLinkClass)

    // Add pause after heading for assistive technology.
    var srPause = document.createElement('span')
    srPause.classList.add('govuk-visually-hidden')
    srPause.innerHTML = ', '

    // Build additional copy for assistive technology
    var srAdditionalCopy = document.createElement('span')
    srAdditionalCopy.classList.add('govuk-visually-hidden')
    srAdditionalCopy.innerHTML = this.$module.actions.thisSectionVisuallyHidden

    if (this.$module.actions.locale) {
      srAdditionalCopy.lang = this.filterLocale('this_section_visually_hidden')
    }

    // Build additional wrapper for toggle text, place icon after wrapped text.
    var wrapperShowHideIcon = document.createElement('span')
    var icon = document.createElement('span')
    icon.classList.add(this.upChevonIconClass)
    showIcons.appendChild(icon)
    wrapperShowHideIcon.classList.add(this.sectionShowHideTextClass)
    showIcons.insertBefore(wrapperShowHideIcon, showIcons.childNodes[0] || null)

    // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from span to button
    for (var i = 0; i < span.attributes.length; i++) {
      var attr = span.attributes.item(i)
      button.setAttribute(attr.nodeName, attr.nodeValue)
    }

    // span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
    button.innerHTML = span.innerHTML
    heading.removeChild(span)
    heading.appendChild(button)
    button.appendChild(srPause)

    // If summary content exists add to DOM in correct order
    if (typeof (summary) !== 'undefined' && summary !== null) {
      button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1))
      button.appendChild(summary)
    }

    button.appendChild(showIcons)
    button.appendChild(srAdditionalCopy)
  }

  // When section toggled, set and store state
  GemAccordion.prototype.onSectionToggle = function (section) {
    var expanded = this.isExpanded(section)
    this.setExpanded(!expanded, section)

    // Store the state in sessionStorage when a change is triggered
    this.storeState(section)
  }

  // When Open/Close All toggled, set and store state
  GemAccordion.prototype.onOpenOrCloseAllToggle = function () {
    var module = this
    var sections = this.sections
    var nowExpanded = !this.checkIfAllSectionsOpen()

    nodeListForEach(sections, function (section) {
      module.setExpanded(nowExpanded, section)
      // Store the state in sessionStorage when a change is triggered
      module.storeState(section)
    })

    module.updateOpenAllButton(nowExpanded)
  }

  // Set section attributes when opened/closed
  GemAccordion.prototype.setExpanded = function (expanded, section) {
    var icon = section.querySelector('.' + this.upChevonIconClass)
    var showHideText = section.querySelector('.' + this.sectionShowHideTextClass)
    var button = section.querySelector('.' + this.sectionButtonClass)
    var newButtonText = expanded ? this.$module.actions.hideText : this.$module.actions.showText

    showHideText.innerHTML = newButtonText
    button.setAttribute('aria-expanded', expanded)
    button.classList.add(this.toggleLinkClass)

    if (this.$module.actions.locale) {
      showHideText.lang = this.filterLocale(expanded ? 'hide_text' : 'show_text')
    }

    // Swap icon, change class
    if (expanded) {
      section.classList.add(this.sectionExpandedClass)
      icon.classList.remove(this.downChevonIconClass)
    } else {
      section.classList.remove(this.sectionExpandedClass)
      icon.classList.add(this.downChevonIconClass)
    }

    // See if "Show all sections" button text should be updated
    var areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateOpenAllButton(areAllSectionsOpen)
  }

  // Get state of section
  GemAccordion.prototype.isExpanded = function (section) {
    return section.classList.contains(this.sectionExpandedClass)
  }

  // Check if all sections are open
  GemAccordion.prototype.checkIfAllSectionsOpen = function () {
    // Get a count of all the Accordion sections
    var sectionsCount = this.sections.length
    // Get a count of all Accordion sections that are expanded
    var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length
    var areAllSectionsOpen = sectionsCount === expandedSectionCount

    return areAllSectionsOpen
  }

  // Update "Show all sections" button
  GemAccordion.prototype.updateOpenAllButton = function (expanded) {
    var icon = this.openAllButton.querySelector('.' + this.upChevonIconClass)
    var openAllCopy = this.openAllButton.querySelector('.' + this.openAllTextClass)
    var newButtonText = expanded ? this.$module.actions.hideAllText : this.$module.actions.showAllText

    this.openAllButton.setAttribute('aria-expanded', expanded)
    openAllCopy.innerHTML = newButtonText

    if (this.$module.actions.locale) {
      openAllCopy.lang = this.filterLocale(expanded ? 'hide_all_text' : 'show_all_text')
    }

    // Swap icon, toggle class
    if (expanded) {
      icon.classList.remove(this.downChevonIconClass)
    } else {
      icon.classList.add(this.downChevonIconClass)
    }
  }

  var helper = {
    checkForSessionStorage: function () {
      var testString = 'this is the test string'
      var result
      try {
        window.sessionStorage.setItem(testString, testString)
        result = window.sessionStorage.getItem(testString) === testString.toString()
        window.sessionStorage.removeItem(testString)
        return result
      } catch (exception) {
        if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
          console.log('Notice: sessionStorage not available.')
        }
      }
    }
  }

  // Set the state of the accordions in sessionStorage
  GemAccordion.prototype.storeState = function (section) {
    if (this.browserSupportsSessionStorage) {
      // We need a unique way of identifying each content in the GemAccordion. Since
      // an `#id` should be unique and an `id` is required for `aria-` attributes
      // `id` can be safely used.
      var button = section.querySelector('.' + this.sectionButtonClass)

      if (button) {
        var contentId = button.getAttribute('aria-controls')
        var contentState = button.getAttribute('aria-expanded')

        if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
          console.error(new Error('No aria controls present in accordion section heading.'))
        }

        if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
          console.error(new Error('No aria expanded present in accordion section heading.'))
        }

        // Only set the state when both `contentId` and `contentState` are taken from the DOM.
        if (contentId && contentState) {
          window.sessionStorage.setItem(contentId, contentState)
        }
      }
    }
  }

  // Read the state of the accordions from sessionStorage
  GemAccordion.prototype.setInitialState = function (section) {
    if (this.browserSupportsSessionStorage) {
      var button = section.querySelector('.' + this.sectionButtonClass)

      if (button) {
        var contentId = button.getAttribute('aria-controls')
        var contentState = contentId ? window.sessionStorage.getItem(contentId) : null

        if (contentState !== null) {
          this.setExpanded(contentState === 'true', section)
        }
      }
    }
  }

  // Navigate to and open accordions with anchored content on page load if a hash is present
  GemAccordion.prototype.openByAnchorOnLoad = function () {
    var splitHash = window.location.hash.split('#')[1]

    if (window.location.hash && document.getElementById(splitHash)) {
      this.openForAnchor(splitHash)
    }
  }

  // Add event listeners for links to open accordion sections when navigated to using said anchor links on the page
  // Adding an event listener to all anchor link a tags in an accordion is risky but we circumvent this risk partially by only being a layer of accordion behaviour instead of any sort of change to link behaviour
  GemAccordion.prototype.addEventListenersForAnchors = function () {
    var links = this.$module.querySelectorAll('.' + this.sectionInnerContent + ' a[href*="#"]')
    nodeListForEach(links, function (link) {
      if (link.pathname === window.location.pathname) {
        link.addEventListener('click', this.openForAnchor.bind(this, link.hash.split('#')[1]))
      }
    }.bind(this))
  }

  // Find the parent accordion section for the given id and open it
  GemAccordion.prototype.openForAnchor = function (hash) {
    var target = document.getElementById(hash)
    var section = this.getContainingSection(target)

    this.setExpanded(true, section)
  }

  // Loop through the given id's ancestors until the parent section class is found
  GemAccordion.prototype.getContainingSection = function (target) {
    while (!target.classList.contains(this.sectionClass)) {
      target = target.parentElement
    }

    return target
  }

  GemAccordion.prototype.filterLocale = function (key) {
    if (this.$module.actions.locale && this.$module.actions.locale.indexOf('{') !== -1) {
      var locales = JSON.parse(this.$module.actions.locale)
      return locales[key]
    } else if (this.$module.actions.locale) {
      return this.$module.actions.locale
    }
  }

  Modules.GemAccordion = GemAccordion
})(window.GOVUK.Modules)
