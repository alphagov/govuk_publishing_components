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
      pageHeightTimeoutDelay: 500,
      markerAttribute: 'data-ga4-scroll-marker'
    }
  }

  Ga4ScrollTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.usage) {
      this.startModule()
    } else {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
    }
  }

  Ga4ScrollTracker.prototype.startModule = function () {
    window.removeEventListener('cookie-consent', this.start)
    if (window.GOVUK.analyticsGa4.vars.scrollTrackerStarted) {
      return
    }

    this.trackType = this.$module.getAttribute('data-ga4-track-type')
    window.GOVUK.analyticsGa4.vars.scrollTrackerStarted = true

    if (this.trackType === 'headings') {
      this.track = new Ga4ScrollTracker.Heading(this.config)
    } else if (this.trackType === 'markers') {
      this.config.trackMarkers = true
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
      this.resetEvent = this.onReset.bind(this)
      window.addEventListener('dynamic-page-update', this.resetEvent)

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
        if (node.element) {
          node.element.setAttribute('data-ga4-scrolltracker-already-seen', true)
        }

        data.type = node.eventData.type
        // following will be undefined if tracking percentages
        data.text = node.eventData.text
        data.section = node.eventData.text
        data.index_section = node.eventData.index_section
        data.index_section_count = node.eventData.index_section_count
        // following will be undefined if tracking headings
        data.percent_scrolled = node.eventData.percent_scrolled

        window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
      }
    }
  }

  Ga4ScrollTracker.prototype.isVisible = function (top, bottom) {
    var scroll = window.scrollY || document.documentElement.scrollTop // IE fallback
    return scroll <= top && (scroll + this.windowHeight) >= bottom
  }

  // if reset, we set all nodes 'alreadySeen' to false
  // used when the page content is dynamically updated e.g. search
  Ga4ScrollTracker.prototype.onReset = function () {
    for (var i = 0; i < this.trackedNodes.length; i++) {
      this.trackedNodes[i].alreadySeen = false
    }
  }

  Ga4ScrollTracker.Heading = function (config) {
    this.config = config
  }

  Ga4ScrollTracker.Heading.prototype.getTrackingNodes = function () {
    var headingsDetails = []
    var headingsFound = this.findAllowedHeadings()
    var totalHeadings = headingsFound.length

    for (var i = 0; i < totalHeadings; i++) {
      var heading = headingsFound[i]
      var type = this.config.trackMarkers ? 'marker' : 'heading'
      // only track headings that are visible i.e. not inside display: none
      if (this.visible(heading)) {
        var pos = heading.getBoundingClientRect()
        headingsDetails.push({
          element: heading,
          alreadySeen: heading.getAttribute('data-ga4-scrolltracker-already-seen'),
          top: pos.top + document.documentElement.scrollTop,
          bottom: pos.bottom + document.documentElement.scrollTop,
          eventData: {
            type: type,
            text: heading.getAttribute('data-ga4-text') || heading.textContent.replace(/\s+/g, ' ').trim(),
            index_section: i + 1,
            index_section_count: totalHeadings
          }
        })
      }
    }
    return headingsDetails
  }

  // check heading is inside allowed elements, generally ignores everything outside of page content
  Ga4ScrollTracker.Heading.prototype.findAllowedHeadings = function () {
    var headingsFound = []
    var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    if (this.config.trackMarkers) {
      headings = ['[' + this.config.markerAttribute + ']']
    }

    // this is a loop that only happens once as we currently only have one
    // allowed element for headings to be in - 'main'
    for (var h = 0; h < this.config.allowHeadingsInside.length; h++) {
      var insideElements = document.querySelectorAll(this.config.allowHeadingsInside[h])
      for (var e = 0; e < insideElements.length; e++) {
        var found = insideElements[e].querySelectorAll(headings)
        for (var f = 0; f < found.length; f++) {
          headingsFound.push(found[f])
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
    // remove 20px from the calculated page height to allow for a possible horizontal scrollbar
    var pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 20

    var percentDetails = []

    for (var i = 0; i < this.config.percentages.length; i++) {
      var percent = this.config.percentages[i]
      var pos = ((pageHeight / 100) * percent)
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
