window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}; // if this ; is omitted, none of this JS runs :(

(function (Modules) {
  /* This JavaScript provides two functional enhancements to the expander component:
    1) A count that shows how many items have been used in the expander container
    2) Open/closing of the content
  */
  function Expander ($module) {
    this.$module = $module
    this.$toggle = this.$module.querySelector('.js-toggle')
    this.$content = this.$module.querySelector('.js-content')
    this.$allInteractiveElements = this.$content.querySelectorAll('select, input[type=text]')
  }

  Expander.prototype.init = function () {
    this.selectedElements = []
    var openOnLoad = this.$module.getAttribute('data-open-on-load') === 'true'

    this.replaceHeadingSpanWithButton(openOnLoad)

    this.$module.toggleContent = this.toggleContent.bind(this)
    this.$toggleButton = this.$module.querySelector('.js-button')
    this.$toggleButton.addEventListener('click', this.$module.toggleContent)

    var selectedString = this.selectedString()
    if (selectedString) {
      this.attachSelectedCounter(selectedString)
      // expand the content
      this.$toggleButton.click()
    }

    // Attach listener function to update selected count
    var boundChangeEvents = this.bindChangeEvents.bind(this)
    boundChangeEvents()
  }

  Expander.prototype.bindChangeEvents = function (e) {
    for (var i = 0; i < this.$allInteractiveElements.length; i++) {
      var $el = this.$allInteractiveElements[i]
      if ($el.tagName === 'SELECT') {
        $el.addEventListener('change', this.updateSelectedCount.bind(this))
      }

      // but for inputs we need both change and enter key event
      if ($el.tagName === 'INPUT') {
        $el.addEventListener('change', this.handleInputEvent.bind(this))
        $el.addEventListener('keyup', this.handleInputEvent.bind(this))
      }
    }
  }

  Expander.prototype.handleInputEvent = function (e) {
    var ENTER_KEY = 13
    // we only want to fire when ENTER key is pressed or
    // user selected a different element
    if (e.keyCode === ENTER_KEY || e.type === 'change') {
      this.updateSelectedCount()
    }
  }

  Expander.prototype.replaceHeadingSpanWithButton = function (expanded) {
    var toggleHtml = this.$toggle.innerHTML
    var $button = document.createElement('button')

    $button.classList.add('app-c-expander__button')
    $button.classList.add('js-button')
    $button.setAttribute('type', 'button')
    $button.setAttribute('aria-expanded', expanded)
    $button.setAttribute('aria-controls', this.$content.getAttribute('id'))

    // GA4 Accordion tracking. Relies on the ga4-finder-tracker setting the index first, so we wrap this in a custom event.
    window.addEventListener('ga4-filter-indexes-added', function () {
      if (window.GOVUK.analyticsGa4) {
        if (window.GOVUK.analyticsGa4.Ga4FinderTracker) {
          window.GOVUK.analyticsGa4.Ga4FinderTracker.addFilterButtonTracking($button, this.$toggle.innerHTML)
        }
      }
    }.bind(this))

    $button.innerHTML = toggleHtml

    this.$toggle.parentNode.replaceChild($button, this.$toggle)
  }

  Expander.prototype.toggleContent = function (e) {
    if (this.$toggleButton.getAttribute('aria-expanded') === 'false') {
      this.$toggleButton.setAttribute('aria-expanded', true)
      this.$content.classList.add('app-c-expander__content--visible')
    } else {
      this.$toggleButton.setAttribute('aria-expanded', false)
      this.$content.classList.remove('app-c-expander__content--visible')
    }
  }

  Expander.prototype.attachSelectedCounter = function attachSelectedCounter (selectedString) {
    var $selectedCounter = document.createElement('span')
    $selectedCounter.classList.add('app-c-expander__selected-counter')
    $selectedCounter.classList.add('js-selected-counter')
    $selectedCounter.innerHTML = selectedString
    this.$toggleButton.parentNode.insertBefore($selectedCounter, this.$toggleButton.nextSibling)
  }

  Expander.prototype.updateSelectedCount = function updateSelectedCount () {
    var selectedString = this.selectedString()
    var selectedStringElement = this.$module.querySelector('.js-selected-counter')
    if (selectedString) {
      if (selectedStringElement) {
        selectedStringElement.innerHTML = selectedString
      } else {
        this.attachSelectedCounter(selectedString)
      }
    } else if (selectedStringElement) {
      selectedStringElement.parentNode.removeChild(selectedStringElement)
    }
  }

  Expander.prototype.selectedString = function selectedString () {
    this.getAllSelectedElements()
    var count = this.selectedElements.length
    var selectedString = false
    if (count > 0) {
      selectedString = count + ' selected'
    }

    return selectedString
  }

  Expander.prototype.getAllSelectedElements = function getAllSelectedElements () {
    this.selectedElements = []
    var that = this
    for (var i = 0; i < this.$allInteractiveElements.length; i++) {
      if (this.$allInteractiveElements[i].value.length > 0) {
        that.selectedElements.push(i)
      }
    }
  }

  Modules.Expander = Expander
})(window.GOVUK.Modules)
