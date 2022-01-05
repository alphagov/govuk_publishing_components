/* global GOVUK, $ */

(function () {
  'use strict'

  window.GOVUK = window.GOVUK || {}

  var percentages = [
    ['Percent', 20],
    ['Percent', 40],
    ['Percent', 60],
    ['Percent', 80],
    ['Percent', 100]
  ]

  var CONFIG = {}

  function ScrollTracker (sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig)
    this.SCROLL_TIMEOUT_DELAY = 10

    if (!this.config) {
      this.enabled = false
      return
    }
    this.enabled = true

    this.trackedNodes = this.buildNodes(this.config)

    $(window).scroll($.proxy(this.onScroll, this))
    this.trackVisibleNodes()
  };

  ScrollTracker.prototype.getConfigForCurrentPath = function (sitewideConfig) {
    for (var path in sitewideConfig) {
      if (this.normalisePath(window.location.pathname) === this.normalisePath(path)) {
        return sitewideConfig[path]
      }
    }
  }

  ScrollTracker.prototype.buildNodes = function (config) {
    var nodes = []
    var NodeConstructor, nodeData

    for (var i = 0; i < config.length; i++) {
      NodeConstructor = ScrollTracker[config[i][0] + 'Node']
      nodeData = config[i][1]
      nodes.push(new NodeConstructor(nodeData))
    }

    return nodes
  }

  ScrollTracker.prototype.normalisePath = function (path) {
    return path.split('/').join('')
  }

  ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY)
  }

  ScrollTracker.prototype.trackVisibleNodes = function () {
    for (var i = 0; i < this.trackedNodes.length; i++) {
      if (this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen) {
        this.trackedNodes[i].alreadySeen = true

        var action = this.trackedNodes[i].eventData.action
        var label = this.trackedNodes[i].eventData.label

        GOVUK.analytics.trackEvent('ScrollTo', action, { label: label, nonInteraction: true })
      }
    }
  }

  ScrollTracker.PercentNode = function (percentage) {
    this.percentage = percentage
    this.eventData = { action: 'Percent', label: String(percentage) }
  }

  ScrollTracker.PercentNode.prototype.isVisible = function () {
    return this.currentScrollPercent() >= this.percentage
  }

  ScrollTracker.PercentNode.prototype.currentScrollPercent = function () {
    var $document = $(document)
    var $window = $(window)
    return (($window.scrollTop() / ($document.height() - $window.height())) * 100.0)
  }

  ScrollTracker.HeadingNode = function (headingText) {
    this.$element = getHeadingElement(headingText)
    this.eventData = { action: 'Heading', label: headingText }

    function getHeadingElement (headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6')
      for (var i = 0; i < $headings.length; i++) {
        if ($.trim($headings.eq(i).text()).replace(/\s/g, ' ') === headingText) return $headings.eq(i)
      }
    }
  }

  ScrollTracker.HeadingNode.prototype.isVisible = function () {
    if (!this.$element) return false
    return this.elementIsVisible(this.$element)
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function ($element) {
    var $window = $(window)
    var positionTop = $element.offset().top
    return (positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()))
  }

  $().ready(function () {
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG)
  })

  window.GOVUK.ScrollTracker = ScrollTracker
}())
