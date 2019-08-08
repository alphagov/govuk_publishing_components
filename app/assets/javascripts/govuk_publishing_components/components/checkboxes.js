/* eslint-env jquery */
// = require govuk/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.Checkboxes = function () {
    this.start = function (scope) {
      var _this = this
      this.applyAriaControlsAttributes(scope)

      $(scope).on('change', '[data-nested=true] input[type=checkbox]', function (e) {
        var checkbox = e.target
        var isNested = $(checkbox).closest('.govuk-checkboxes--nested')
        var hasNested = $('.govuk-checkboxes--nested[data-parent=' + checkbox.id + ']')

        if (hasNested.length) {
          _this.toggleNestedCheckboxes(hasNested, checkbox)
        } else if (isNested.length) {
          _this.toggleParentCheckbox(isNested, checkbox)
        }
      })

      $(scope).on('change', 'input[type=checkbox]', function (e) {
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
              options['value'] = $checkbox.data('track-value')
              options['label'] = $checkbox.data('track-label')
              window.GOVUK.analytics.trackEvent(category, action, options)
            }
          }
        }
      })
    }

    this.toggleNestedCheckboxes = function (scope, checkbox) {
      if (checkbox.checked) {
        scope.find('input[type=checkbox]').prop('checked', true)
      } else {
        scope.find('input[type=checkbox]').prop('checked', false)
      }
    }

    this.toggleParentCheckbox = function (scope, checkbox) {
      var siblings = $(checkbox).closest('.govuk-checkboxes__item').siblings()
      var parentId = scope.data('parent')

      if (checkbox.checked && siblings.length === siblings.find(':checked').length) {
        $('#' + parentId).prop('checked', true)
      } else {
        $('#' + parentId).prop('checked', false)
      }
    }

    this.applyAriaControlsAttributes = function (scope) {
      $(scope).find('[data-controls]').each(function () {
        $(this).attr('aria-controls', $(this).attr('data-controls'))
      })
    }
  }
})(window.GOVUK.Modules)
