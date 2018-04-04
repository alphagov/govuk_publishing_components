/*
  Toggle the class 'focus' on input boxes on element focus/blur
  Used by the search component but generic enough for reuse
*/
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.GemToggleInputClassOnFocus = function () {
    this.start = function ($el) {
      var $toggleTarget = $el.find('.js-class-toggle');

      if(!inputIsEmpty()) {
        addFocusClass();
      }

      $toggleTarget.on('focus', addFocusClass);
      $toggleTarget.on('blur', removeFocusClassFromEmptyInput);

      function inputIsEmpty() {
        return $toggleTarget.val() === '';
      }

      function addFocusClass() {
        $toggleTarget.addClass('focus');
      }

      function removeFocusClassFromEmptyInput() {
        if(inputIsEmpty()) {
          $toggleTarget.removeClass('focus');
        }
      }
    }
  }
})(window.GOVUK.Modules)
