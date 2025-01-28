window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AddAnother (module) {
    this.module = module
    this.emptyFieldset = undefined
    this.addAnotherButton = undefined
  }

  function createButton (textContent, additionalClass = '') {
    var button = document.createElement('button')
    button.className = 'gem-c-button govuk-button ' + additionalClass
    button.type = 'button'
    button.textContent = textContent
    return button
  }

  AddAnother.prototype.init = function () {
    this.createAddAnotherButton()
    this.createRemoveButtons()
    this.removeEmptyFieldset()
    this.updateFieldsetsAndButtons()
  }

  AddAnother.prototype.createAddAnotherButton = function () {
    this.addAnotherButton =
      createButton(
        this.module.dataset.addButtonText,
        'js-add-another__add-button govuk-button--secondary'
      )
    this.addAnotherButton.addEventListener('click', this.addNewFieldset.bind(this))
    this.module.appendChild(this.addAnotherButton)
  }

  AddAnother.prototype.createRemoveButton = function (fieldset, removeFunction) {
    var removeButton =
      createButton(
        'Delete',
        'js-add-another__remove-button gem-c-add-another__remove-button govuk-button--warning'
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
    this.emptyFieldset = this.module.querySelector('.js-add-another__empty')
    this.emptyFieldset.remove()
  }

  AddAnother.prototype.updateFieldsetsAndButtons = function () {
    this.module.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset > legend')
      .forEach(function (legend, index) {
        legend.textContent = this.module.dataset.fieldsetLegend + ' ' + (index + 1)
      }.bind(this))

    if (this.module.dataset.emptyFields === 'false') {
      this.module.querySelector('.js-add-another__remove-button').classList.toggle(
        'js-add-another__remove-button--hidden',
        this.module.querySelectorAll('.js-add-another__fieldset:not([hidden])').length === 1
      )
    }
  }

  AddAnother.prototype.addNewFieldset = function (event) {
    var button = event.target
    var newFieldset = this.emptyFieldset.cloneNode(true)
    newFieldset.classList.remove('js-add-another__empty')
    newFieldset.classList.add('js-add-another__fieldset')
    this.createRemoveButton(newFieldset, this.removeNewFieldset.bind(this))
    button.before(newFieldset)

    this.incrementAttributes(this.emptyFieldset)
    this.updateFieldsetsAndButtons()

    // Move focus to first visible field in new set
    newFieldset
      .querySelector('input:not([type="hidden"]), select, textarea')
      .focus()
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
  AddAnother.prototype.incrementAttributes = function (fieldset) {
    var matcher = /(.*[_[])([0-9]+)([_\]].*?)$/
    fieldset
      .querySelectorAll('label, input, select, textarea')
      .forEach(function (element) {
        ['name', 'id', 'for'].forEach(function (attribute) {
          var value = element.getAttribute(attribute)
          var matched = matcher.exec(value)
          if (!matched) return
          var index = parseInt(matched[2], 10) + 1
          element.setAttribute(attribute, matched[1] + index + matched[3])
        })
      })
  }

  Modules.AddAnother = AddAnother
})(window.GOVUK.Modules)
