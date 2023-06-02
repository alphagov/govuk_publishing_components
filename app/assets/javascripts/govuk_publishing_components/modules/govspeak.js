class Govspeak {
  constructor($module, YoutubeLinkEnhancement) {
    this.$module = $module
    this.youtubeLinkEnhancement = YoutubeLinkEnhancement
  }

  init() {
    if (this.$module.className.indexOf('disable-youtube') === -1) {
      this.embedYoutube()
    }

    // this.createBarcharts()    
  }

  embedYoutube() {
    var enhancement = new this.youtubeLinkEnhancement(this.$module)
    enhancement.init()
  }

  // createBarcharts() {
  //   var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
  //   enhancement.init()
  // }
}

export default Govspeak;