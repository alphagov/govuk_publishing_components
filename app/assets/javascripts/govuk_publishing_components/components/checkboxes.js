// This component relies on JavaScript from GOV.UK Frontend
//= require govuk-frontend/components/checkboxes/checkboxes.js
window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict';

   Modules.Checkboxes = function () {
    this.start = function (scope) {
      var _this = this;
      this.applyAriaControlsAttributes(scope);

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

      $(scope).find('input[type=checkbox]').on('change', function(e) {
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          var $checkbox = $(e.target);
          var category = $checkbox.data("track-category");
          if (typeof category !== "undefined") {
            var isChecked = $checkbox.is(":checked");
            var uncheckTrackCategory = $checkbox.data("uncheck-track-category");
            if (!isChecked && typeof uncheckTrackCategory !== "undefined") {
              category = uncheckTrackCategory;
            }
            var action = $checkbox.data("track-action");
            var options = $checkbox.data("track-options");
            if (typeof options !== 'object' || options === null) {
              options = {};
            }
            options['value'] = $checkbox.data("track-value");
            options['label'] = $checkbox.data("track-label");
            GOVUK.analytics.trackEvent(category, action, options);
          }
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
      var siblings = $(checkbox).closest('.gem-c-checkboxes__list-item').siblings();
      var parent_id = scope.data('parent');

      if (checkbox.checked && siblings.length == siblings.find(':checked').length) {
        $('#' + parent_id).prop("checked", true);
      } else {
        $('#' + parent_id).prop("checked", false);
      }
    };

    this.applyAriaControlsAttributes = function (scope) {
      $(scope).find('[data-controls]').each(function () {
        $(this).attr('aria-controls', $(this).attr('data-controls'));
      });
    };
  };
})(window.GOVUK.Modules);
