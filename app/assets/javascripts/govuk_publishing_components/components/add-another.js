window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AddAnother (module) {
    this.module = module
  }

  AddAnother.prototype.init = function () {
    this.initialiseClickEvent()
    this.preventFormSubmissions()
  }

  AddAnother.prototype.initialiseClickEvent = function () {
    this.module.addEventListener(
      'click',
      function (e) {
        if (e.target.classList.contains('js-add-another__remove-button')) {
          this.removeFields(e.target)
        } else if (e.target.classList.contains('js-add-another__add-button')) {
          this.addFields(e.target)
        }
      }.bind(this)
    )
  }

  AddAnother.prototype.preventFormSubmissions = function () {
    var addButton = this.module.querySelector('.js-add-another__add-button')
    var removeButtons = this.module.querySelectorAll('.js-add-another__remove-button')
    addButton.setAttribute('type', 'button')
    removeButtons.forEach(function (removeButton) {
      removeButton.setAttribute('type', 'button')
    })
  }

  AddAnother.prototype.addFields = function (button) {
    var allFields = button.parentNode.querySelectorAll(
      '.js-add-another__repeated-fields'
    )
    var fields = allFields[allFields.length - 1]

    // Show hidden "Remove" button
    if (fields.querySelector('.js-add-another__remove-button')) {
      fields.querySelector('.js-add-another__remove-button').style.display =
                'inline-block'
    }

    // Clone the markup of the previous set of fields
    var newFields = fields.cloneNode(true)

    // Reset values of cloned fields
    newFields
      .querySelectorAll('input, textarea, select')
      .forEach(function (element) {
        element.value = ''
      })

    // Increment values for id, for and name of cloned fields
    this.setValues(newFields, null)

    // Add cloned fields to the DOM
    button.before(newFields)

    // Move focus to first visible field in new set
    newFields
      .querySelectorAll('input:not([type="hidden"]), select, textarea')[0]
      .focus()
  }

  AddAnother.prototype.removeFields = function (button) {
    var set = button.parentNode
    var input = set.querySelectorAll(
      'input:not([type="hidden"]), select, textarea'
    )[0]
    var baseId = input.id
    var baseName = input.name

    set.remove()

    var sets = this.module.querySelectorAll('.js-add-another__repeated-fields')

    // Add hidden field for removed set
    var hiddenField = document.createElement('input')
    hiddenField.type = 'hidden'
    hiddenField.classList.add('js-hidden-destroy')
    hiddenField.id = baseId.replace(/_[a-zA-Z]+$/, '__destroy')
    hiddenField.name = baseName.replace(/\[[_a-zA-Z]+\]$/, '[_destroy]')
    hiddenField.setAttribute('value', 'true')
    this.module.append(hiddenField)

    // Hide "Remove" button if only first set displayed
    if (sets.length === 1) {
      sets[0].querySelector('.js-add-another__remove-button').style.display =
                'none'
    }

    // Move focus to first visible field
    sets[0]
      .querySelectorAll('input:not([type="hidden"]), select, textarea')[0]
      .focus()
  }

  // Set values for index, for and name of supplied fields
  AddAnother.prototype.setValues = function (set, index) {
    var num = 0

    set
      .querySelectorAll('label, input, select, textarea')
      .forEach(function (element) {
        var currentName = element.getAttribute('name') || null
        var currentId = element.getAttribute('id') || null
        var currentFor = element.getAttribute('for') || null
        var arrayMatcher = /(.*)\[([0-9]+)\](.*?)$/
        var underscoreMatcher = /(.*)_([0-9]+)_(.*?)$/
        var matched

        if (currentName && arrayMatcher.exec(currentName)) {
          matched = arrayMatcher.exec(currentName)

          if (index === null) {
            num = parseInt(matched[2], 10) + 1
          } else {
            num = index
          }

          element.setAttribute(
            'name',
            matched[1] + '[' + num + ']' + matched[3]
          )
        }

        if (currentId && underscoreMatcher.exec(currentId)) {
          matched = underscoreMatcher.exec(currentId)

          if (index === null) {
            num = parseInt(matched[2], 10) + 1
          } else {
            num = index
          }

          element.setAttribute('id', matched[1] + '_' + num + '_' + matched[3])
        }

        if (currentFor && underscoreMatcher.exec(currentFor)) {
          matched = underscoreMatcher.exec(currentFor)

          if (index === null) {
            num = parseInt(matched[2], 10) + 1
          } else {
            num = index
          }

          element.setAttribute('for', matched[1] + '_' + num + '_' + matched[3])
        }
      })
  }

  Modules.AddAnother = AddAnother
})(window.GOVUK.Modules)
