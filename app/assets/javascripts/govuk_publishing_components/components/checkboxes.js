/* eslint-env jquery */
// = require govuk/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.Checkboxes = window.GOVUKFrontend;

(function (Modules) {
  function GovukCheckboxes () { }

  GovukCheckboxes.prototype.start = function ($module) {
    this.$module = $module
    this.applyAriaControlsAttributes(this.$module)

    $(this.$module).on('change', '[data-nested=true] input[type=checkbox]', function (e) {
      var checkbox = e.target
      var isNested = $(checkbox).closest('.govuk-checkboxes--nested')
      var hasNested = $('.govuk-checkboxes--nested[data-parent=' + checkbox.id + ']')

      if (hasNested.length) {
        this.toggleNestedCheckboxes(hasNested, checkbox)
      } else if (isNested.length) {
        this.toggleParentCheckbox(isNested, checkbox)
      }
    }.bind(this))

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

  GovukCheckboxes.prototype.toggleNestedCheckboxes = function (scope, checkbox) {
    if (checkbox.checked) {
      scope.find('input[type=checkbox]').prop('checked', true)
    } else {
      scope.find('input[type=checkbox]').prop('checked', false)
    }
  }

  GovukCheckboxes.prototype.toggleParentCheckbox = function (scope, checkbox) {
    var siblings = $(checkbox).closest('.govuk-checkboxes__item').siblings()
    var parentId = scope.data('parent')

    if (checkbox.checked && siblings.length === siblings.find(':checked').length) {
      $('#' + parentId).prop('checked', true)
    } else {
      $('#' + parentId).prop('checked', false)
    }
  }

  GovukCheckboxes.prototype.applyAriaControlsAttributes = function (scope) {
    $(scope).find('[data-controls]').each(function () {
      $(this).attr('aria-controls', $(this).attr('data-controls'))
    })
  }

  Modules.GovukCheckboxes = GovukCheckboxes
})(window.GOVUK.Modules)
