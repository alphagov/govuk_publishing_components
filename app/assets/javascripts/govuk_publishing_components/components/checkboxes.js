// = require govuk/vendor/polyfills/Element/prototype/closest.js
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

    for (var i = 0; i < this.$nestedCheckboxes.length; i++) {
      this.$nestedCheckboxes[i].addEventListener('change', this.handleNestedCheckboxChange.bind(this))
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
