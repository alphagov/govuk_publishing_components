window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Govspeak () { }

  Govspeak.prototype.start = function ($module) {
    this.$module = $module[0]

    if (this.$module.className.indexOf('disable-youtube') === -1) {
      this.embedYoutube()
    }

    this.createBarcharts()
  }

  Govspeak.prototype.embedYoutube = function () {
    var enhancement = new window.GOVUK.GovspeakYoutubeLinkEnhancement(this.$module)
    enhancement.init()
  }

  Govspeak.prototype.createBarcharts = function () {
    var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
    enhancement.init()
  }

  Modules.Govspeak = Govspeak
})(window.GOVUK.Modules)
