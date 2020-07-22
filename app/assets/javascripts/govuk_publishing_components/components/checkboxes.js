/* eslint-env jquery */
// = require govuk/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.Checkboxes = window.GOVUKFrontend;

(function (Modules) {
  function GovukCheckboxes () { }

  GovukCheckboxes.prototype.start = function ($module) {
    this.$module = $module
    this.$nestedCheckboxes = this.$module[0].querySelectorAll('[data-nested=true] input[type=checkbox]')

    this.applyAriaControlsAttributes(this.$module[0])

    for (var i = 0; i < this.$nestedCheckboxes.length; i++) {
      this.$nestedCheckboxes[i].addEventListener('change', this.handleNestedCheckboxChange.bind(this))
    }

    $(this.$module).on('change', 'input[type=checkbox]', function (e) {
      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        // where checkboxes are manipulated externally in finders, suppressAnalytics
        // is passed to prevent duplicate GA events
        if (typeof e.suppressAnalytics === 'undefined' || e.suppressAnalytics !== true) {
          var $checkbox = $(e.target)
          var category = $checkbox.data('track-category')
          if (typeof category !== 'undefined') {
            var isChecked = $checkbox.is(':checked')
            var uncheckTrackCategory = $checkbox.data('uncheck-track-category')
            if (!isChecked && typeof uncheckTrackCategory !== 'undefined') {
              category = uncheckTrackCategory
            }
            var action = $checkbox.data('track-action')
            var options = $checkbox.data('track-options')
            if (typeof options !== 'object' || options === null) {
              options = {}
            }
            options.value = $checkbox.data('track-value')
            options.label = $checkbox.data('track-label')
            window.GOVUK.analytics.trackEvent(category, action, options)
          }
        }
      }
    })

    $(this.$module).on('change', '[data-exclusive=true] input[type=checkbox]', function (e) {
      var currentCheckbox = e.target
      var checkboxes = currentCheckbox.closest('.govuk-checkboxes')
      var exclusiveOption = $(checkboxes).find('input[type=checkbox][data-exclusive]')
      var nonExclusiveOptions = $(checkboxes).find('input[type=checkbox]:not([data-exclusive])')

      if (currentCheckbox.dataset.exclusive === 'true' && currentCheckbox.checked === true) {
        nonExclusiveOptions.each(function () {
          $(this).prop('checked', false)
        })
      } else if (currentCheckbox.dataset.exclusive !== 'true' && currentCheckbox.checked === true) {
        exclusiveOption.prop('checked', false)
      }
    })
  }

  GovukCheckboxes.prototype.handleNestedCheckboxChange = function (event) {
    var checkbox = event.target
    var isNested = checkbox.closest('.govuk-checkboxes--nested')
    var hasNested = this.$module[0].querySelector('.govuk-checkboxes--nested[data-parent=' + checkbox.id + ']')

    if (hasNested) {
      this.toggleNestedCheckboxes(hasNested, checkbox)
    } else if (isNested) {
      this.toggleParentCheckbox(isNested, checkbox)
    }
  }

  GovukCheckboxes.prototype.toggleNestedCheckboxes = function (scope, checkbox) {
    var $nestedCheckboxes = scope.querySelectorAll('input[type=checkbox]')
    if (checkbox.checked) {
      for (var i = 0; i < $nestedCheckboxes.length; i++) {
        $nestedCheckboxes[i].checked = true
      }
    } else {
      for (var i = 0; i < $nestedCheckboxes.length; i++) {
        $nestedCheckboxes[i].checked = false
      }
    }
  }

  GovukCheckboxes.prototype.toggleParentCheckbox = function (scope, checkbox) {
    var $inputs = scope.querySelectorAll('input')
    var $checkedInputs = scope.querySelectorAll('input:checked')
    var parentId = scope.dataset.parent
    var $parent = document.getElementById(parentId)

    if (checkbox.checked && $inputs.length === $checkedInputs.length) {
      $parent.checked = true
    } else {
      $parent.checked = false
    }
  }

  GovukCheckboxes.prototype.applyAriaControlsAttributes = function (scope) {
    var $inputs = scope.querySelectorAll('[data-controls]')

    for (var i = 0; i < $inputs.length; i++) {
      $inputs[i].setAttribute('aria-controls', $inputs[i].getAttribute('data-controls'))
    }
  }

  Modules.GovukCheckboxes = GovukCheckboxes
})(window.GOVUK.Modules)
