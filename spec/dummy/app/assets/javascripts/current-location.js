// used by the step by step navigation component

(function(root) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  GOVUK.getCurrentLocation = function(){
    return root.location;
  };
}(window));
