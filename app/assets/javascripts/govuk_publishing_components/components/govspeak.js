window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Govspeak () { }

  Govspeak.prototype.start = function ($module) {
    this.$module = $module[0]

    if (this.$module.className.indexOf('disable-youtube') === -1) {
      this.embedYoutube()
    }

    if (this.$module.getAttribute('data-track-links-category')) {
      this.trackLinks($module)
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

  Govspeak.prototype.trackLinks = function ($module) {
    var tracking = new window.GOVUK.Modules.GovspeakTrackLinks()
    tracking.start($module)
  }

  Modules.Govspeak = Govspeak
})(window.GOVUK.Modules)
