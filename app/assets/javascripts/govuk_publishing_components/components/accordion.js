/* global nodeListForEach */
//  = require ../vendor/polyfills/closest.js
//  = require ../vendor/polyfills/indexOf.js
//  = require ../vendor/polyfills/common.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GemCAccordion () { }

  GemCAccordion.prototype.start = function ($module) {
    this.$module = $module[0]
    this.moduleId = this.$module.getAttribute('id')
    this.sections = this.$module.querySelectorAll('.gem-c-accordion__section')
    this.openAllButton = ''
    this.browserSupportsSessionStorage = helper.checkForSessionStorage()
    this.controlsClass = 'gem-c-accordion__controls'
    this.openAllClass = 'gem-c-accordion__open-all'
    this.openAllExpandedClass = 'gem-c-accordion__open-all--expanded'
    this.sectionHeaderClass = 'gem-c-accordion__section-header'
    this.sectionHeaderFocusedClass = 'gem-c-accordion__section-header--focused'
    this.sectionHeadingClass = 'gem-c-accordion__section-heading'
    this.sectionSummaryClass = 'gem-c-accordion__section-summary'
    this.sectionButtonClass = 'gem-c-accordion__section-button'
    this.sectionExpandedClass = 'gem-c-accordion__section--expanded'
    this.sectionShowHideIconClass = 'gem-c-accordion__toggle-link'
    this.toggleLinkClass = 'js-toggle-link'

    // SVG Arrow icons
    this.upChevronSvg = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="gem-c-accordion-nav__chevron gem-c-accordion-nav__chevron--up">' +
      '<path class="gem-c-accordion-nav__chevron--stroke" d="M19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.499997 15.2467 0.499998 10C0.499999 4.7533 4.7533 0.500001 10 0.500002C15.2467 0.500003 19.5 4.7533 19.5 10Z" stroke="#1D70B8"/>' +
      '<path class="gem-c-accordion-nav__chevron--stroke" d="M6.32617 12.3262L10 8.65234L13.6738 12.3262" stroke="#1D70B8" stroke-width="2"/>' +
      '</svg>'
    this.downChevronSvg = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="gem-c-accordion-nav__chevron gem-c-accordion-nav__chevron--down">' +
      '<path class="gem-c-accordion-nav__chevron--stroke" d="M0.499997 10C0.499998 4.75329 4.75329 0.499999 10 0.499999C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.499997 15.2467 0.499997 10Z" stroke="#1D70B8"/>' +
      '<path class="gem-c-accordion-nav__chevron--stroke" d="M13.6738 8.67383L10 12.3477L6.32617 8.67383" stroke="#1D70B8" stroke-width="2"/>' +
      '</svg>'

    // Indicate that js has worked
    this.$module.classList.add('gem-c-accordion--active')

    this.initControls()
    this.initSectionHeaders()

    // See if "Show all" button text should be updated
    var areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateOpenAllButton(areAllSectionsOpen)
  }

  // Initialise controls and set attributes
  GemCAccordion.prototype.initControls = function () {
    // Create "Show all" button and set attributes
    this.openAllButton = document.createElement('button')
    this.openAllButton.setAttribute('type', 'button')
    this.openAllButton.setAttribute('class', this.openAllClass)
    this.openAllButton.setAttribute('aria-expanded', 'false')
    this.openAllButton.setAttribute('type', 'button')

    // Create control wrapper and add controls to it
    var accordionControls = document.createElement('div')
    accordionControls.setAttribute('class', this.controlsClass)
    accordionControls.appendChild(this.openAllButton)
    this.$module.insertBefore(accordionControls, this.$module.firstChild)

    // Handle events for the controls
    this.openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this))
  }

  // Initialise section headers
  GemCAccordion.prototype.initSectionHeaders = function () {
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
  GemCAccordion.prototype.initHeaderAttributes = function (headerWrapper, index) {
    var module = this
    var span = headerWrapper.querySelector('.' + this.sectionButtonClass)
    var heading = headerWrapper.querySelector('.' + this.sectionHeadingClass)
    var summary = headerWrapper.querySelector('.' + this.sectionSummaryClass)

    // Copy existing span element to an actual button element, for improved accessibility.
    var button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('id', this.moduleId + '-heading-' + (index + 1))
    button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1))

    // Create show / hide arrow icons with text.
    var showIcons = document.createElement('span')
    showIcons.classList.add(this.sectionShowHideIconClass, this.toggleLinkClass)

    // Add pause after heading for assistive technology.
    var srPause = document.createElement('span')
    srPause.setAttribute('class', 'govuk-visually-hidden')
    srPause.innerHTML = ', '

    // Build addtional copy for assistive tech
    var srAddtionalCopy = document.createElement('span')
    srAddtionalCopy.setAttribute('class', 'govuk-visually-hidden')
    srAddtionalCopy.innerHTML = ' this section'

    // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from span to button
    for (var i = 0; i < span.attributes.length; i++) {
      var attr = span.attributes.item(i)
      button.setAttribute(attr.nodeName, attr.nodeValue)
    }

    button.addEventListener('focusin', function (e) {
      if (!headerWrapper.classList.contains(module.sectionHeaderFocusedClass)) {
        headerWrapper.className += ' ' + module.sectionHeaderFocusedClass
      }
    })

    button.addEventListener('blur', function (e) {
      headerWrapper.classList.remove(module.sectionHeaderFocusedClass)
    })

    if (typeof (summary) !== 'undefined' && summary !== null) {
      button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1))
    }

    // span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
    button.innerHTML = span.innerHTML
    heading.removeChild(span)
    heading.appendChild(button)
    button.appendChild(srPause)
    button.appendChild(showIcons)
    button.appendChild(srAddtionalCopy)
  }

  // When section toggled, set and store state
  GemCAccordion.prototype.onSectionToggle = function (section) {
    var expanded = this.isExpanded(section)
    this.setExpanded(!expanded, section)

    // Store the state in sessionStorage when a change is triggered
    this.storeState(section)
  }

  // When Open/Close All toggled, set and store state
  GemCAccordion.prototype.onOpenOrCloseAllToggle = function () {
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
  GemCAccordion.prototype.setExpanded = function (expanded, section) {
    var showHideIcon = section.querySelector('.' + this.sectionShowHideIconClass)

    var button = section.querySelector('.' + this.sectionButtonClass)

    button.setAttribute('aria-expanded', expanded)
    button.classList.add(this.toggleLinkClass)

    if (expanded) {
      section.classList.add(this.sectionExpandedClass)
      showHideIcon.innerHTML = this.upChevronSvg + 'Hide'
    } else {
      section.classList.remove(this.sectionExpandedClass)
      showHideIcon.innerHTML = this.downChevronSvg + 'Show'
    }

    // See if "Show all" button text should be updated
    var areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateOpenAllButton(areAllSectionsOpen)
  }

  // Get state of section
  GemCAccordion.prototype.isExpanded = function (section) {
    return section.classList.contains(this.sectionExpandedClass)
  }

  // Check if all sections are open
  GemCAccordion.prototype.checkIfAllSectionsOpen = function () {
    // Get a count of all the Accordion sections
    var sectionsCount = this.sections.length
    // Get a count of all Accordion sections that are expanded
    var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length
    var areAllSectionsOpen = sectionsCount === expandedSectionCount

    return areAllSectionsOpen
  }

  // Update "Show all sections" button
  GemCAccordion.prototype.updateOpenAllButton = function (expanded) {
    var newButtonText = expanded ? this.upChevronSvg + 'Close all sections' : this.downChevronSvg + 'Show all sections'
    this.openAllButton.setAttribute('aria-expanded', expanded)
    this.openAllButton.innerHTML = newButtonText

    if (expanded) {
      this.openAllButton.classList.add(this.openAllExpandedClass)
    } else {
      this.openAllButton.classList.remove(this.openAllExpandedClass)
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
  GemCAccordion.prototype.storeState = function (section) {
    if (this.browserSupportsSessionStorage) {
      // We need a unique way of identifying each content in the GemCAccordion. Since
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
  GemCAccordion.prototype.setInitialState = function (section) {
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

  Modules.GemCAccordion = GemCAccordion
})(window.GOVUK.Modules)
