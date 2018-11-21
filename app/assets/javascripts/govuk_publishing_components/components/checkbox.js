window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict';

   Modules.Checkbox = function () {
    this.start = function ($element) {
      var controls = $element.attr('data-aria-controls');

      if (controls) {
        $element.find('.govuk-checkboxes__input').attr('aria-controls', controls);
      }
    };

  };
})(window.GOVUK.Modules);
