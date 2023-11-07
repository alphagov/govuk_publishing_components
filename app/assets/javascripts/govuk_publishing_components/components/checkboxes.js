// = require govuk/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukCheckboxes = window.GOVUKFrontend.Checkboxes;

(function (Modules) {
  function GemCheckboxes ($module) {
    this.$module = $module
    this.$checkboxes = this.$module.querySelectorAll('input[type=checkbox]')
    this.$nestedCheckboxes = this.$module.querySelectorAll('[data-nested=true] input[type=checkbox]')
  }

  GemCheckboxes.prototype.init = function () {
    this.applyAriaControlsAttributes(this.$module)

    for (var i = 0; i < this.$checkboxes.length; i++) {
      this.$checkboxes[i].addEventListener('change', this.handleCheckboxChange)
    }

    for (i = 0; i < this.$nestedCheckboxes.length; i++) {
      this.$nestedCheckboxes[i].addEventListener('change', this.handleNestedCheckboxChange.bind(this))
    }
  }

  GemCheckboxes.prototype.handleCheckboxChange = function (event) {
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      // Where checkboxes are manipulated externally in finders, `suppressAnalytics`
      // is passed to prevent duplicate GA events.
      // use Oliver Steele's Nested Object Access Pattern https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
      var allowAnalytics = ((event || {}).detail || {}).suppressAnalytics !== true
      if (allowAnalytics) {
        var $checkbox = event.target
        var category = $checkbox.getAttribute('data-track-category')
        if (category) {
          var uncheckTrackCategory = $checkbox.getAttribute('data-uncheck-track-category')
          if (!$checkbox.checked && uncheckTrackCategory) {
            category = uncheckTrackCategory
          }
          var action = $checkbox.getAttribute('data-track-action')
          var options = $checkbox.getAttribute('data-track-options')
          if (options) {
            options = JSON.parse(options)
          } else {
            options = {}
          }
          options.value = $checkbox.getAttribute('data-track-value')
          options.label = $checkbox.getAttribute('data-track-label')
          window.GOVUK.analytics.trackEvent(category, action, options)
        }
      }
    }
  }

  GemCheckboxes.prototype.handleNestedCheckboxChange = function (event) {
    var $checkbox = event.target
    var $isNested = $checkbox.closest('.govuk-checkboxes--nested')
    var $hasNested = this.$module.querySelector('.govuk-checkboxes--nested[data-parent=' + $checkbox.id + ']')

    if ($hasNested) {
      this.toggleNestedCheckboxes($hasNested, $checkbox)
    } else if ($isNested) {
      this.toggleParentCheckbox($isNested, $checkbox)
    }
  }

  GemCheckboxes.prototype.toggleNestedCheckboxes = function ($scope, $checkbox) {
    var $nestedCheckboxes = $scope.querySelectorAll('input[type=checkbox]')
    if ($checkbox.checked) {
      for (var i = 0; i < $nestedCheckboxes.length; i++) {
        $nestedCheckboxes[i].checked = true
      }
    } else {
      for (i = 0; i < $nestedCheckboxes.length; i++) {
        $nestedCheckboxes[i].checked = false
      }
    }
  }

  GemCheckboxes.prototype.toggleParentCheckbox = function ($scope, $checkbox) {
    var $inputs = $scope.querySelectorAll('input')
    var $checkedInputs = $scope.querySelectorAll('input:checked')
    var parentId = $scope.getAttribute('data-parent')
    var $parent = document.getElementById(parentId)

    if ($checkbox.checked && $inputs.length === $checkedInputs.length) {
      $parent.checked = true
    } else {
      $parent.checked = false
    }
  }

  GemCheckboxes.prototype.applyAriaControlsAttributes = function ($scope) {
    var $inputs = $scope.querySelectorAll('[data-controls]')

    for (var i = 0; i < $inputs.length; i++) {
      $inputs[i].setAttribute('aria-controls', $inputs[i].getAttribute('data-controls'))
    }
  }

  Modules.GemCheckboxes = GemCheckboxes
})(window.GOVUK.Modules)
