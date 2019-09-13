//= require html2canvas/dist/html2canvas.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  GOVUK.Modules.TakeScreenshot = function () {
    this.start = function (element) {
      this.initButtonListener(element)
    }

    this.initButtonListener = function (element) {
      element.on('click', function(e){
        if (element.attr('data-generated') == "true") return;

        e.preventDefault();

        element.text('Generating screenshot. Please wait.')
        html2canvas(document.querySelector("#component-preview")).then(canvas => {
          canvas.id = "govuk-c-download-screenshot__result-image"

          element.text('Download screenshot')
          document.getElementById('govuk-c-download-screenshot__result').innerHTML = ''
          document.getElementById('govuk-c-download-screenshot__result').appendChild(canvas)

          var image = document
            .getElementById("govuk-c-download-screenshot__result-image")
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

          element.attr("href", image)
          element.attr("data-generated", "true")

          element.removeClass("gem-c-button--secondary-quiet")
          element.addClass("gem-c-button")
        })
      })
    }
  }
})(window, window.GOVUK)
