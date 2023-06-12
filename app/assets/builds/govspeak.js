(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/govspeak.js
  var Govspeak = class {
    constructor($module, YoutubeLinkEnhancement) {
      this.$module = $module;
      this.youtubeLinkEnhancement = YoutubeLinkEnhancement;
    }
    init() {
      if (this.$module.className.indexOf("disable-youtube") === -1) {
        this.embedYoutube();
      }
    }
    embedYoutube() {
      var enhancement = new this.youtubeLinkEnhancement(this.$module);
      enhancement.init();
    }
    // createBarcharts() {
    //   var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
    //   enhancement.init()
    // }
  };
  var govspeak_default = Govspeak;
})();
//# sourceMappingURL=assets/govspeak.js.map
