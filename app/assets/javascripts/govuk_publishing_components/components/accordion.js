/* global nodeListForEach */
//  = require ../vendor/polyfills/common.js
// This component relies on JavaScript from GOV.UK Frontend
// = require govuk/components/accordion/accordion.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukAccordion = window.GOVUKFrontend.Accordion;

(function (Modules) {
  function GemAccordion ($module) {
    this.$module = $module
    this.sectionClass = 'govuk-accordion__section'
    this.sectionClassExpanded = 'govuk-accordion__section--expanded'
    this.sectionHeaderClass = 'govuk-accordion__section-header'
    this.sectionInnerContent = 'govuk-accordion__section-content'
    this.showAllControls = 'govuk-accordion__show-all'
    this.sectionButton = 'govuk-accordion__section-button'
    this.headingText = 'govuk-accordion__section-heading-text'

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
    // Indicate that JavaScript has worked
    this.$module.classList.add('gem-c-accordion--active')
    this.$module.querySelector('.' + this.showAllControls).classList.add('gem-c-accordion__show-all')

    // Feature flag for anchor tag navigation used on manuals
    if (this.$module.getAttribute('data-anchor-navigation') === 'true') {
      this.openByAnchorOnLoad()
      this.addEventListenersForAnchors()
    }
    // Feature flag for "Show all sections" GA click event tracking
    if (this.$module.getAttribute('data-track-show-all-clicks') === 'true') {
      this.addAccordionOpenAllTracking()
    }
    // Feature flag for each section GA click event tracking
    if (this.$module.getAttribute('data-track-sections') === 'true') {
      this.addEventListenerSections()
    }

    // look for data attributes to put onto the 'show/hide all' link
    var showAllAttributes = this.$module.getAttribute('data-show-all-attributes')
    if (showAllAttributes) {
      try {
        var showAll = this.$module.querySelector('.' + this.showAllControls)
        var values = JSON.parse(showAllAttributes)
        var keys = Object.keys(values)
        for (var i = 0; i < keys.length; i++) {
          showAll.setAttribute('data-' + keys[i], values[keys[i]])
        }
      } catch (e) {
        console.error('Could not read accordion data attributes error: ' + e.message, window.location)
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
    var $section = this.getContainingSection(target)
    var $header = $section.querySelector('.' + this.sectionHeaderClass)
    var $expanded = this.getContainingSection($section)
    var $parent = $header.parentElement

    // government-frontend features (inherited from manuals-frontend):
    // Should the target anchor link be within the same page, open section - navigate normally
    // Should the target anchor link be within a different, closed section, open this section
    // Should the target anchor link be within a different page and different, closed section open this section
    if ($expanded && (!$parent.classList.contains(this.sectionClassExpanded))) {
      $header.click()
    }
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

  // To track the Accordion's "Show all sections" / "Hide all sections" button click events and pass them to the GA event tracking
  GemAccordion.prototype.addAccordionOpenAllTracking = function () {
    this.$module.querySelector('.' + this.showAllControls).addEventListener('click', function (event) {
      var expanded = event.target.getAttribute('aria-expanded') === 'true'
      var label = expanded ? 'Show all sections' : 'Hide all sections'
      var action = expanded ? 'accordionOpened' : 'accordionClosed'
      var options = { transport: 'beacon', label: label }

      var extraOptions = event.target && event.target.getAttribute('data-track-options')

      // this uses the same logic as track-click.js handleClick
      // means we can add a custom dimensions on click
      if (extraOptions) {
        extraOptions = JSON.parse(extraOptions)
        for (var k in extraOptions) options[k] = extraOptions[k]
      }

      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        window.GOVUK.analytics.trackEvent('pageElementInteraction', action, options)
      }
    })
  }

  GemAccordion.prototype.addEventListenerSections = function () {
    var sections = this.$module.querySelectorAll('.' + this.sectionButton)
    nodeListForEach(sections, function (section) {
      section.addEventListener('click', this.addAccordionSectionTracking.bind(this, section))
    }.bind(this))
  }

  // If the Accordion's sections are opened on click, then pass them to the GA event tracking
  GemAccordion.prototype.addAccordionSectionTracking = function (section) {
    var expanded = section.getAttribute('aria-expanded') === 'false'
    var label = section.querySelector('.' + this.headingText).textContent
    var action = expanded ? 'accordionOpened' : 'accordionClosed'
    var options = { transport: 'beacon', label: label }

    // optional parameters are added to the parent
    // heading not the button that is clicked
    var extraOptions = section.parentElement && section.parentElement.getAttribute('data-track-options')

    // this uses the same logic as track-click.js handleClick
    // means we can add a custom dimensions on click
    // (such as the index of the accordion on the page)
    if (extraOptions) {
      extraOptions = JSON.parse(extraOptions)
      for (var k in extraOptions) options[k] = extraOptions[k]
    }

    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent('pageElementInteraction', action, options)
    }
  }

  Modules.GemAccordion = GemAccordion
})(window.GOVUK.Modules)
