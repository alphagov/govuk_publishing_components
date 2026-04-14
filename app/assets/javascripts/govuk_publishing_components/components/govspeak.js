window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Govspeak ($module) {
    this.$module = $module
  }

  Govspeak.prototype.init = function () {
    console.log('govspeak')
    if (this.$module.className.indexOf('js-disable-youtube') === -1) {
      this.embedYoutube()
    }

    this.createBarcharts()
    this.enhanceTables()
  }

  Govspeak.prototype.embedYoutube = function () {
    var enhancement = new window.GOVUK.GovspeakYoutubeLinkEnhancement(this.$module)
    enhancement.init()
  }

  Govspeak.prototype.createBarcharts = function () {
    var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
    enhancement.init()
  }

  Govspeak.prototype.enhanceTables = function () {
    var enhancement = new window.GOVUK.GovspeakTableEnhancement(this.$module)
    enhancement.init()
  }

  Modules.Govspeak = Govspeak
})(window.GOVUK.Modules)
