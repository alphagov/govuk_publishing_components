window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  /* This JavaScript provides two functional enhancements to option-select components:
    1) A count that shows how many results have been checked in the option-container
    2) Open/closing of the list of checkboxes
  */
  function OptionSelect ($module) {
    this.$optionSelect = $module
    this.$options = this.$optionSelect.querySelectorAll("input[type='checkbox']")
    this.$optionsContainer = this.$optionSelect.querySelector('.js-options-container')
    this.$optionList = this.$optionsContainer.querySelector('.js-auto-height-inner')
    this.$allCheckboxes = this.$optionsContainer.querySelectorAll('.govuk-checkboxes__item')
    this.hasFilter = this.$optionSelect.getAttribute('data-filter-element') || ''

    this.checkedCheckboxes = []

    this.mq = window.matchMedia('(min-width: 641px)')
    this.isClosedOnLoad = this.$optionSelect.getAttribute('data-closed-on-load')
    this.isClosedOnLoadMobile = this.$optionSelect.getAttribute('data-closed-on-load-mobile')
  }

  OptionSelect.prototype.init = function () {
    if (this.hasFilter.length) {
      var filterEl = document.createElement('div')
      filterEl.innerHTML = this.hasFilter

      var optionSelectFilter = document.createElement('div')
      optionSelectFilter.classList.add('gem-c-option-select__filter')
      optionSelectFilter.innerHTML = filterEl.childNodes[0].nodeValue

      this.$optionsContainer.parentNode.insertBefore(optionSelectFilter, this.$optionsContainer)

      this.$filter = this.$optionSelect.querySelector('input[name="option-select-filter"]')
      this.$filterCount = document.getElementById(this.$filter.getAttribute('aria-describedby'))
      this.filterTextSingle = ' ' + this.$filterCount.getAttribute('data-single')
      this.filterTextMultiple = ' ' + this.$filterCount.getAttribute('data-multiple')
      this.filterTextSelected = ' ' + this.$filterCount.getAttribute('data-selected')
      this.checkboxLabels = []
      this.filterTimeout = 0

      this.getAllCheckedCheckboxes()
      for (var i = 0; i < this.$allCheckboxes.length; i++) {
        this.checkboxLabels.push(this.cleanString(this.$allCheckboxes[i].textContent))
      }

      this.$filter.addEventListener('keyup', this.typeFilterText.bind(this))
    }

    // Attach listener to update checked count
    this.$optionsContainer.querySelector('.govuk-checkboxes').addEventListener('change', this.updateCheckedCount.bind(this))

    // Replace div.container-head with a button
    this.replaceHeadingSpanWithButton()

    // Add js-collapsible class to parent for CSS
    this.$optionSelect.classList.add('js-collapsible')

    // Add open/close listeners
    var button = this.$optionSelect.querySelector('.js-container-button')
    button.addEventListener('click', this.toggleOptionSelect.bind(this))

    // Toggle option visibility depending on screen size (min-width: 641px) and
    // presence of any 'closed' properties (`data-closed-on-load`, `data-closed-on-load-mobile`).
    // See https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_media-queries.scss#L10-L14
    if (this.mq.matches) {
      this.toggleVisibility(true)
    } else {
      this.toggleVisibility(false)
    }

    var checkedString = this.checkedString()
    if (checkedString) {
      this.attachCheckedCounter(checkedString)
    }
  }

  OptionSelect.prototype.toggleVisibility = function (isTabletOrLarger) {
    if (isTabletOrLarger) {
      if (this.isClosedOnLoad === 'true') {
        this.close()
      } else {
        this.setupHeight()
      }
    } else {
      if (this.isClosedOnLoadMobile === 'true' || this.isClosedOnLoad === 'true') {
        this.close()
      } else {
        this.setContainerHeight(201)
      }
    }
  }

  OptionSelect.prototype.typeFilterText = function (event) {
    event.stopPropagation()
    var ENTER_KEY = 13

    if (event.keyCode !== ENTER_KEY) {
      clearTimeout(this.filterTimeout)
      this.filterTimeout = setTimeout(
        function () { this.doFilter(this) }.bind(this),
        300
      )
    } else {
      event.preventDefault() // prevents finder forms from being submitted when user presses ENTER
    }
  }

  OptionSelect.prototype.cleanString = function cleanString (text) {
    text = text.replace(/&/g, 'and')
    text = text.replace(/[’',:–-]/g, '') // remove punctuation characters
    text = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape special characters
    return text.trim().replace(/\s\s+/g, ' ').toLowerCase() // replace multiple spaces with one
  }

  OptionSelect.prototype.getAllCheckedCheckboxes = function getAllCheckedCheckboxes () {
    this.checkedCheckboxes = []

    for (var i = 0; i < this.$options.length; i++) {
      if (this.$options[i].checked) {
        this.checkedCheckboxes.push(i)
      }
    }
  }

  OptionSelect.prototype.doFilter = function doFilter (obj) {
    var filterBy = obj.cleanString(obj.$filter.value)
    var showCheckboxes = obj.checkedCheckboxes.slice()
    var i = 0

    for (i = 0; i < obj.$allCheckboxes.length; i++) {
      if (showCheckboxes.indexOf(i) === -1 && obj.checkboxLabels[i].search(filterBy) !== -1) {
        showCheckboxes.push(i)
      }
    }

    for (i = 0; i < obj.$allCheckboxes.length; i++) {
      obj.$allCheckboxes[i].style.display = 'none'
    }

    for (i = 0; i < showCheckboxes.length; i++) {
      obj.$allCheckboxes[showCheckboxes[i]].style.display = 'flex'
    }

    var lenChecked = obj.$optionsContainer.querySelectorAll('.govuk-checkboxes__input:checked').length
    var len = showCheckboxes.length + lenChecked
    var html = len + (len === 1 ? obj.filterTextSingle : obj.filterTextMultiple) + ', ' + lenChecked + obj.filterTextSelected
    obj.$filterCount.innerHTML = html
  }

  OptionSelect.prototype.replaceHeadingSpanWithButton = function replaceHeadingSpanWithButton () {
    /* Replace the span within the heading with a button element. This is based on feedback from Léonie Watson.
     * The button has all of the accessibility hooks that are used by screen readers and etc.
     * We do this in the JavaScript because if the JavaScript is not active then the button shouldn't
     * be there as there is no JS to handle the click event.
    */
    var containerHead = this.$optionSelect.querySelector('.js-container-button')
    var jsContainerHeadHTML = containerHead.innerHTML

    // Create button and replace the preexisting html with the button.
    var button = document.createElement('button')
    button.setAttribute('class', 'js-container-button gem-c-option-select__title gem-c-option-select__button')
    // Add type button to override default type submit when this component is used within a form
    button.setAttribute('type', 'button')
    button.setAttribute('aria-expanded', true)
    button.setAttribute('id', containerHead.getAttribute('id'))
    button.setAttribute('aria-controls', this.$optionsContainer.getAttribute('id'))

    var buttonAttributes = this.$optionSelect.getAttribute('data-button-data-attributes')
    if (buttonAttributes) {
      try {
        buttonAttributes = JSON.parse(buttonAttributes)
        for (var rawKey in buttonAttributes) {
          var key = rawKey.replace(/_/g, '-').toLowerCase()
          var rawValue = buttonAttributes[rawKey]
          var value = typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue
          button.setAttribute('data-' + key, value)
        }
      } catch (e) {
        console.error('Error with option select button data attributes, invalid JSON passed' + e.message, window.location)
      }
    }

    button.innerHTML = jsContainerHeadHTML
    containerHead.parentNode.replaceChild(button, containerHead)
  }

  OptionSelect.prototype.attachCheckedCounter = function attachCheckedCounter (checkedString) {
    var element = document.createElement('div')
    element.setAttribute('class', 'gem-c-option-select__selected-counter js-selected-counter')
    element.innerHTML = checkedString
    this.$optionSelect.querySelector('.js-container-toggle').insertAdjacentElement('afterend', element)
  }

  OptionSelect.prototype.updateCheckedCount = function updateCheckedCount () {
    var checkedString = this.checkedString()
    var checkedStringElement = this.$optionSelect.querySelector('.js-selected-counter')

    if (checkedString) {
      if (checkedStringElement === null) {
        this.attachCheckedCounter(checkedString)
      } else {
        checkedStringElement.textContent = checkedString
      }
    } else if (checkedStringElement) {
      checkedStringElement.parentNode.removeChild(checkedStringElement)
    }
  }

  OptionSelect.prototype.checkedString = function checkedString () {
    this.getAllCheckedCheckboxes()
    var count = this.checkedCheckboxes.length
    var checkedString = false
    if (count > 0) {
      checkedString = count + ' selected'
    }

    return checkedString
  }

  OptionSelect.prototype.toggleOptionSelect = function toggleOptionSelect (e) {
    if (this.isClosed()) {
      this.open()
    } else {
      this.close()
    }
    e.preventDefault()
  }

  OptionSelect.prototype.open = function open () {
    if (this.isClosed()) {
      this.$optionSelect.querySelector('.js-container-button').setAttribute('aria-expanded', true)
      this.$optionSelect.classList.remove('js-closed')
      this.$optionSelect.classList.add('js-opened')
      if (!this.$optionsContainer.style.height) {
        this.setupHeight()
      }
    }
  }

  OptionSelect.prototype.close = function close () {
    this.$optionSelect.classList.remove('js-opened')
    this.$optionSelect.classList.add('js-closed')
    this.$optionSelect.querySelector('.js-container-button').setAttribute('aria-expanded', false)
  }

  OptionSelect.prototype.isClosed = function isClosed () {
    return this.$optionSelect.classList.contains('js-closed')
  }

  OptionSelect.prototype.setContainerHeight = function setContainerHeight (height) {
    this.$optionsContainer.style.height = height + 'px'
    this.$optionsContainer.style.maxHeight = height + 'px'
  }

  OptionSelect.prototype.isCheckboxVisible = function isCheckboxVisible (option) {
    var initialOptionContainerHeight = this.$optionsContainer.clientHeight
    var optionListOffsetTop = this.$optionList.getBoundingClientRect().top
    var distanceFromTopOfContainer = option.getBoundingClientRect().top - optionListOffsetTop
    return distanceFromTopOfContainer < initialOptionContainerHeight
  }

  OptionSelect.prototype.getVisibleCheckboxes = function getVisibleCheckboxes () {
    var visibleCheckboxes = []
    for (var i = 0; i < this.$options.length; i++) {
      if (this.isCheckboxVisible(this.$options[i])) {
        visibleCheckboxes.push(this.$options[i])
      }
    }

    // add an extra checkbox, if the label of the first is too long it collapses onto itself
    if (this.$options[visibleCheckboxes.length]) {
      visibleCheckboxes.push(this.$options[visibleCheckboxes.length])
    }
    return visibleCheckboxes
  }

  OptionSelect.prototype.isComponentParentHidden = function isComponentParentHidden () {
    var parentContent = this.$optionSelect.parentElement
    var isparentContentHidden = false
    // check whether this is hidden by progressive disclosure,
    // because height calculations won't work
    // would use offsetParent === null but for IE10+
    if (parentContent) {
      isparentContentHidden = !(parentContent.offsetWidth || parentContent.offsetHeight || parentContent.getClientRects().length)
    }

    return isparentContentHidden
  }

  OptionSelect.prototype.setupHeight = function setupHeight () {
    var initialOptionContainerHeight = this.$optionsContainer.clientHeight
    var height = this.$optionList.offsetHeight

    var isComponentParentHidden = this.isComponentParentHidden()

    if (isComponentParentHidden) {
      initialOptionContainerHeight = 180
      height = 180
    }

    // Resize if the list is only slightly bigger than its container
    // If isComponentParentHidden is true, then 180 < 250
    // And the container height is always set to 201px
    if (height < initialOptionContainerHeight + 50) {
      this.setContainerHeight(height + 1)
      return
    }

    // Resize to cut last item cleanly in half
    var visibleCheckboxes = this.getVisibleCheckboxes()

    var lastVisibleCheckbox = visibleCheckboxes[visibleCheckboxes.length - 1]
    var position = lastVisibleCheckbox.parentNode.offsetTop // parent element is relative
    this.setContainerHeight(position + (lastVisibleCheckbox.clientHeight / 1.5))
  }

  Modules.OptionSelect = OptionSelect
})(window.GOVUK.Modules)
