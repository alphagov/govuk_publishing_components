(function (Modules) {
  function Govspeak ($module) {
    this.$module = $module
  }

  Govspeak.prototype.init = function () {
    if (this.$module.className.indexOf('js-disable-youtube') === -1) {
      this.embedYoutube()
    }

    this.createBarcharts()

    if (this.$module.querySelectorAll('table').length) {
      this.tableScroll()
    }
  }

  Govspeak.prototype.embedYoutube = function () {
    var enhancement = new window.GOVUK.GovspeakYoutubeLinkEnhancement(this.$module)
    enhancement.init()
  }

  Govspeak.prototype.createBarcharts = function () {
    var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
    enhancement.init()
  }

  Govspeak.prototype.tableScroll = function () {
    var enhancement = new window.GOVUK.GovspeakTableScroll(this.$module)
    enhancement.init()
  }

  Modules.Govspeak = Govspeak
})(window.GOVUK.Modules)
