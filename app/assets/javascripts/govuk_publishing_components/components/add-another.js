//= require sortablejs/Sortable.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AddAnother (module) {
    this.module = module
    this.disableGa4 = this.module.dataset.disableGa4
    this.addAnotherButton = undefined
    this.startIndex = Number(this.module.dataset.ga4StartIndex) || 1
    this.indexSectionCount = Number(this.module.dataset.ga4IndexSectionCount)
  }

  function createButton (textContent, additionalClass = '', dataAttributes = {}) {
    var button = document.createElement('button')
    button.className = 'gem-c-button govuk-button ' + additionalClass
    button.type = 'button'
    button.textContent = textContent

    Object.keys(dataAttributes).forEach(dataAttribute => {
      button.dataset[dataAttribute] = dataAttributes[dataAttribute]
    })

    return button
  }

  AddAnother.prototype.init = function () {
    this.createAddAnotherButton()
    this.createRemoveButtons()
    this.removeEmptyFieldset()
    this.updateFieldsetsAndButtons()
    if (this.module.dataset.sortable === 'true') {
      this.makeSortable()
    }
  }

  AddAnother.prototype.createEventData = function (data) {
    var eventData = Object.assign({
      event_name: 'select_content',
      type: 'add another'
    }, data)

    var sectionElement = this.module.closest('[data-ga4-section]')

    if (sectionElement) {
      eventData.section = sectionElement.dataset.ga4Section
    }

    return JSON.stringify(eventData)
  }

  AddAnother.prototype.createAddAnotherButton = function () {
    var dataAttributes = {}

    if (!this.disableGa4) {
      dataAttributes.ga4Event = this.createEventData({ action: 'added' })
    }

    this.addAnotherButton =
      createButton(
        this.module.dataset.addButtonText,
        'js-add-another__add-button govuk-button--secondary',
        dataAttributes
      )
    this.addAnotherButton.addEventListener('click', this.addNewFieldset.bind(this))
    this.module.appendChild(this.addAnotherButton)
  }

  AddAnother.prototype.createRemoveButton = function (fieldset, removeFunction) {
    var dataAttributes = {}

    if (!this.disableGa4) {
      dataAttributes.ga4Event = this.createEventData({ action: 'deleted' })
    }

    var removeButton =
      createButton(
        'Delete',
        'js-add-another__remove-button gem-c-add-another__remove-button govuk-button--warning',
        dataAttributes
      )
    removeButton.addEventListener('click', function (event) {
      removeFunction(event)
      this.updateFieldsetsAndButtons()
      this.addAnotherButton.focus()
    }.bind(this))
    fieldset.appendChild(removeButton)
  }

  AddAnother.prototype.createRemoveButtons = function () {
    var fieldsets =
      this.module.querySelectorAll('.js-add-another__fieldset')
    fieldsets.forEach(function (fieldset) {
      this.createRemoveButton(fieldset, this.removeExistingFieldset.bind(this))
      fieldset.querySelector('.js-add-another__destroy-checkbox').hidden = true
    }.bind(this))
  }

  AddAnother.prototype.removeEmptyFieldset = function () {
    this.module.querySelector('.js-add-another__empty').remove()
  }

  AddAnother.prototype.updateFieldsetsAndButtons = function () {
    var visibleFields = this.module.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

    visibleFields.forEach(function (field, index) {
      field.querySelector('legend').textContent = this.module.dataset.fieldsetLegend + ' ' + (index + 1)

      var trackedRemoveButton = field.parentNode.querySelector('.js-add-another__remove-button[data-ga4-event]')

      if (trackedRemoveButton) {
        trackedRemoveButton.dataset.indexSection = this.startIndex + index
        trackedRemoveButton.dataset.indexSectionCount = this.indexSectionCount || visibleFields.length
      }
    }.bind(this))

    if (this.module.dataset.emptyFields === 'false') {
      this.module.querySelector('.js-add-another__remove-button').classList.toggle(
        'js-add-another__remove-button--hidden',
        this.module.querySelectorAll('.js-add-another__fieldset:not([hidden])').length === 1
      )
    }

    var trackedAddAnotherButton = this.module.querySelector('.js-add-another__add-button[data-ga4-event]')

    if (trackedAddAnotherButton) {
      trackedAddAnotherButton.dataset.indexSection = this.indexSectionCount || visibleFields.length
      trackedAddAnotherButton.dataset.indexSectionCount = this.indexSectionCount || visibleFields.length
    }
  }

  AddAnother.prototype.addNewFieldset = function (event) {
    var newFieldsetTemplate = this.module.querySelector('.js-add-another__empty-template')
    var newFieldset = newFieldsetTemplate.content.cloneNode(true).children[0]
    newFieldset.classList.add('js-add-another__fieldset')
    this.createRemoveButton(newFieldset, this.removeNewFieldset.bind(this))
    newFieldsetTemplate.before(newFieldset)

    this.updateAttributes(newFieldsetTemplate.content)
    this.updateFieldsetsAndButtons()

    // Initialise any modules included in new fieldset
    window.GOVUK.modules.start(newFieldset)

    // Move focus to first visible field in new set
    newFieldset
      .querySelector('input:not([type="hidden"]), select, textarea')
      .focus()

    if (this.module.dataset.sortable === 'true') {
      this.makeSortable()
    }
  }

  AddAnother.prototype.removeExistingFieldset = function (event) {
    var fieldset = event.target.parentNode
    var destroyCheckbox =
      fieldset.querySelector('.js-add-another__destroy-checkbox input')

    destroyCheckbox.checked = true
    fieldset.hidden = true
  }

  AddAnother.prototype.removeNewFieldset = function (event) {
    var fieldset = event.target.parentNode
    fieldset.remove()
  }

  // Set attribute values for id, for and name of supplied fieldset
  AddAnother.prototype.updateAttributes = function (fieldset, newIndex = null) {
    var matcher = /(.*[_[])([0-9]+)([_\]].*?)$/
    fieldset
      .querySelectorAll('label, input, select, textarea')
      .forEach(function (element) {
        ['name', 'id', 'for'].forEach(function (attribute) {
          var value = element.getAttribute(attribute)
          var matched = matcher.exec(value)
          if (!matched) return
          var index = newIndex == null ? (parseInt(matched[2], 10) + 1) : newIndex
          element.setAttribute(attribute, matched[1] + index + matched[3])
        })
      })
  }

  AddAnother.prototype.makeSortable = function () {
    this.removeMoveButtons()
    this.addMoveButtons()
    this.sortableList = window.Sortable.create(this.module, {
      dataIdAttr: 'data-sortable-id',
      disabled: true
    })
  }

  AddAnother.prototype.addMoveButtons = function () {
    var visibleFields = this.module.querySelectorAll('.js-add-another__fieldset:not([hidden])')
    visibleFields.forEach(function (field, index) {
      field.dataset.sortableId = 'js-add-another__sortable-' + index + '-fieldset'
      var wrapper = document.createElement('div')
      wrapper.className = 'gem-c-add-another__move-button-wrapper'
      this.addButton(wrapper, 'move-up')
      this.addButton(wrapper, 'move-down')
      field.prepend(wrapper)
    }.bind(this))
  }

  AddAnother.prototype.addButton = function (wrapper, action) {
    var button = document.createElement('button')
    button.className = 'govuk-button gem-c-button--secondary-quiet gem-c-add-another__move-button'
    button.innerText = action === 'move-up' ? 'Move up' : 'Move down'
    button.dataset.action = action
    button.addEventListener('click', this.moveFieldset.bind(this))
    wrapper.prepend(button)
  }

  AddAnother.prototype.moveFieldset = function (event) {
    event.preventDefault()

    var button = event.currentTarget
    var action = button.dataset.action
    var fieldset = button.closest('.js-add-another__fieldset')

    var sortableId = fieldset.dataset.sortableId

    var order = this.sortableList.toArray()
    var index = order.indexOf(sortableId)

    // pull the item we're moving out of the order
    order.splice(index, 1)

    // put it back in at the correct position
    if (action === 'move-down') {
      order.splice(index + 1, 0, sortableId)
    } else if (action === 'move-up') {
      order.splice(index - 1, 0, sortableId)
    }

    this.sortableList.sort(order, true)
    this.updateFieldsetsAndButtons()

    var visibleFields = this.module.querySelectorAll('.js-add-another__fieldset:not([hidden])')
    visibleFields.forEach(function (field, index) {
      this.updateAttributes(field, index)
    }.bind(this))
  }

  AddAnother.prototype.removeMoveButtons = function () {
    var wrappers = this.module.querySelectorAll('.gem-c-add-another__move-button-wrapper')
    wrappers.forEach((button) => {
      button.remove()
    })
  }

  Modules.AddAnother = AddAnother
})(window.GOVUK.Modules)
