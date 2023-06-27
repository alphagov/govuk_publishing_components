window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Ga4ScrollTracker ($module) {
    this.$module = $module
    this.pageHeight = document.querySelector('body').clientHeight
    this.trackedNodes = []
    this.config = {
      allowHeadingsInside: ['main'],
      percentages: [20, 40, 60, 80, 100],
      scrollTimeoutDelay: 20,
      resizeTimeoutDelay: 100,
      pageHeightTimeoutDelay: 500
    }
  }

  Ga4ScrollTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.settings) {
      this.startModule()
    } else {
      this.startModule = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.startModule)
    }
  }

  Ga4ScrollTracker.prototype.startModule = function () {
    if (window.GOVUK.analyticsGa4.vars.scrollTrackerStarted) {
      return
    }

    this.trackType = this.$module.getAttribute('data-ga4-track-type')
    var trackHeadings = this.$module.getAttribute('data-ga4-track-headings')
    if (trackHeadings) {
      try {
        this.config.trackHeadings = JSON.parse(trackHeadings)
      } catch (e) {
        // if there's a problem with the config, don't start the tracker
        console.error('GA4 scroll tracker configuration error: ' + e.message, window.location)
        window.GOVUK.analyticsGa4.vars.scrollTrackerStarted = false
        return
      }
    }

    window.GOVUK.analyticsGa4.vars.scrollTrackerStarted = true

    if (this.trackType === 'headings') {
      this.track = new Ga4ScrollTracker.Heading(this.config)
    } else {
      this.track = new Ga4ScrollTracker.Percentage(this.config)
    }

    this.getWindowDetails()
    // if the URL has a hash we want to prevent tracking on initial page load
    // until the browser jumps down the page, at which point a scroll event
    // will happen and tracking will continue normally
    var windowHash = window.location.hash
    var dontTrackOnLoad = windowHash && document.getElementById(windowHash.substring(1))
    if (!dontTrackOnLoad) {
      this.trackVisibleNodes()
    }

    if (this.trackedNodes.length) {
      // store event listener functions as variables so they can be removed if needed
      this.scrollEvent = this.onScroll.bind(this)
      window.addEventListener('scroll', this.scrollEvent)
      this.resizeEvent = this.onResize.bind(this)
      window.addEventListener('resize', this.resizeEvent)

      // check if the page height changes e.g. accordion opened
      this.interval = window.setInterval(function () {
        var pageHeight = document.querySelector('body').clientHeight
        if (pageHeight !== this.pageHeight) {
          this.pageHeight = pageHeight
          this.getWindowDetails()
          this.trackVisibleNodes()
        }
      }.bind(this), this.config.pageHeightTimeoutDelay)
    }
  }

  Ga4ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(function () {
      this.trackVisibleNodes()
    }.bind(this), this.config.scrollTimeoutDelay)
  }

  Ga4ScrollTracker.prototype.onResize = function () {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(function () {
      this.getWindowDetails()
      this.trackVisibleNodes()
    }.bind(this), this.config.resizeTimeoutDelay)
  }

  Ga4ScrollTracker.prototype.getWindowDetails = function () {
    this.pageHeight = document.querySelector('body').clientHeight
    this.windowHeight = window.innerHeight
    this.trackedNodes = this.track.getTrackingNodes(this.trackedNodes)
  }

  Ga4ScrollTracker.prototype.trackVisibleNodes = function () {
    var data = {
      event_name: 'scroll',
      action: 'scroll',
      type: this.config.type
    }
    for (var i = 0; i < this.trackedNodes.length; i++) {
      var node = this.trackedNodes[i]
      if (this.isVisible(node.top, node.bottom) && !node.alreadySeen) {
        node.alreadySeen = true
        // we store whether a heading has been tracked or not on the heading
        // because if headings appear/disappear (e.g. inside an accordion)
        // the order changes, so we can't refer to the previous trackedNodes
        // as we do with percentages
        if (node.node) {
          node.node.setAttribute('data-ga4-scrolltracker-already-seen', true)
        }

        data.type = node.eventData.type
        data.text = node.eventData.text // will be undefined if tracking percent
        data.percent_scrolled = node.eventData.percent_scrolled // will be undefined if tracking headings

        var schemas = new window.GOVUK.analyticsGa4.Schemas()
        var schema = schemas.mergeProperties(data, 'event_data')
        window.GOVUK.analyticsGa4.core.sendData(schema)
      }
    }
  }

  Ga4ScrollTracker.prototype.isVisible = function (top, bottom) {
    var scroll = window.scrollY || document.documentElement.scrollTop // IE fallback
    return scroll <= top && (scroll + this.windowHeight) >= bottom
  }

  Ga4ScrollTracker.Heading = function (config) {
    this.config = config
  }

  Ga4ScrollTracker.Heading.prototype.getTrackingNodes = function () {
    var headingsDetails = []
    var headingsFound = this.findAllowedHeadings()

    for (var i = 0; i < headingsFound.length; i++) {
      var heading = headingsFound[i]
      // only track headings that are visible i.e. not inside display: none
      if (this.visible(heading)) {
        var pos = heading.getBoundingClientRect()
        headingsDetails.push({
          node: heading,
          alreadySeen: heading.getAttribute('data-ga4-scrolltracker-already-seen'),
          top: pos.top + document.documentElement.scrollTop,
          bottom: pos.bottom + document.documentElement.scrollTop,
          eventData: { type: 'heading', text: heading.textContent.replace(/\s+/g, ' ').trim() }
        })
      }
    }
    return headingsDetails
  }

  // check heading is inside allowed elements, generally ignores everything outside of page content
  Ga4ScrollTracker.Heading.prototype.findAllowedHeadings = function () {
    var headingsFound = []
    var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    var trackHeadings = this.config.trackHeadings

    // this is a loop that only happens once as we currently only have one
    // allowed element for headings to be in - 'main'
    for (var h = 0; h < this.config.allowHeadingsInside.length; h++) {
      var insideElements = document.querySelectorAll(this.config.allowHeadingsInside[h])
      for (var e = 0; e < insideElements.length; e++) {
        var found = insideElements[e].querySelectorAll(headings)
        for (var f = 0; f < found.length; f++) {
          if (trackHeadings) {
            if (trackHeadings.includes(found[f].textContent.trim())) {
              headingsFound.push(found[f])
            }
          } else {
            headingsFound.push(found[f])
          }
        }
      }
    }
    return headingsFound
  }

  // this is bit more verbose than checking offsetParent !== null but more reliable for IE10+
  Ga4ScrollTracker.Heading.prototype.visible = function (el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  }

  Ga4ScrollTracker.Percentage = function (config) {
    this.config = config
  }

  Ga4ScrollTracker.Percentage.prototype.getTrackingNodes = function (trackedNodes) {
    var body = document.body
    var html = document.documentElement
    var pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

    var percentDetails = []

    for (var i = 0; i < this.config.percentages.length; i++) {
      var percent = this.config.percentages[i]
      // subtract 1 pixel to solve a bug where 100% can't be reached in some cases
      var pos = ((pageHeight / 100) * percent) - 1
      var alreadySeen = false
      if (trackedNodes.length) {
        alreadySeen = trackedNodes[i].alreadySeen
      }
      percentDetails.push({
        alreadySeen: alreadySeen,
        top: pos,
        bottom: pos,
        eventData: { type: 'percent', percent_scrolled: String(percent) }
      })
    }
    return percentDetails
  }

  Modules.Ga4ScrollTracker = Ga4ScrollTracker
})(window.GOVUK.Modules)
