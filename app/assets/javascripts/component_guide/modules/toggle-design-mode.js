window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  GOVUK.Modules.ToggleDesignMode = function () {
    this.start = function (element) {
      this.initButtonListener(element)
    }

    this.initButtonListener = function (element) {
      element.on('click', function(){
        var designModeOn = document.designMode == "on"
        var banner = document.getElementById('design-mode-banner')
        var downloadButton = document.getElementById('take-screenshot-download')

        if (designModeOn) {
          document.designMode = "off"
          element.text('Turn on design mode')
          banner.style.display = "none"

          downloadButton.innerText = "Generate screenshot"
          downloadButton.setAttribute("href", '')
          downloadButton.setAttribute("data-generated", '')
          downloadButton.style.display = "inline-block"
          downloadButton.classList.remove("gem-c-button--secondary")
          downloadButton.classList.add("gem-c-button--secondary-quiet")
        } else {
          document.designMode = "on"
          element.text('Turn off design mode')
          banner.style.display = "block"
          downloadButton.style.display = "none"
        }
      })
    }
  }
})(window, window.GOVUK)
