// This component relies on JavaScript from GOV.UK Frontend
//= require govuk-frontend/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict';

   Modules.Checkboxes = function () {
    this.start = function (scope) {
      var _this = this;

      $(scope).find('[data-nested=true] input[type=checkbox]').on('change', function(e) {
        var checkbox = e.target;
        var isNested = $(checkbox).closest('.govuk-checkboxes--nested');
        var hasNested = $('.govuk-checkboxes--nested[data-parent=' + checkbox.id + ']');

        if (hasNested.length) {
          _this.toggleNestedCheckboxes(hasNested, checkbox);
        } else if (isNested.length) {
          _this.toggleParentCheckbox(isNested, checkbox);
        }
      });
    };

    this.toggleNestedCheckboxes = function(scope, checkbox) {
      if (checkbox.checked) {
        scope.find('input[type=checkbox]').prop("checked", true);
      } else {
        scope.find('input[type=checkbox]').prop("checked", false);
      }
    };

    this.toggleParentCheckbox = function(scope, checkbox) {
      var siblings = $(checkbox).parent('.govuk-checkboxes__item').siblings();
      var parent_id = scope.data('parent');

      if (checkbox.checked && siblings.length == siblings.find(':checked').length) {
        $('#' + parent_id).prop("checked", true);
      } else {
        $('#' + parent_id).prop("checked", false);
      }
    };
  };
})(window.GOVUK.Modules);
