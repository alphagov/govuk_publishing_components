window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  "use strict"

  var $ = global.jQuery

  GOVUK.Modules.CopyToClipboard = function () {
    this.start = function (element) {
      element.on("click", "button", function (event) {
        event.preventDefault()
        copyToClipboard(element.find("input").val())
      })
    }

    function copyToClipboard(text) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    }
  }
})(window, window.GOVUK)
