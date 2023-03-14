// if we want to dispense entirely with the window object
// i think we might have to use js-bundling? unless i can do

class Govspeak {
  constructor($module) {
    this.$module = $module
  }

  init() {
    if (this.$module.className.indexOf('disable-youtube') === -1) {
      this.embedYoutube()
    }

    this.createBarcharts()    
  }

  embedYoutube() {
    var enhancement = new window.GOVUK.GovspeakYoutubeLinkEnhancement(this.$module)
    enhancement.init()
  }

  createBarcharts() {
    var enhancement = new window.GOVUK.GovspeakBarchartEnhancement(this.$module)
    enhancement.init()
  }
}

export default Govspeak;