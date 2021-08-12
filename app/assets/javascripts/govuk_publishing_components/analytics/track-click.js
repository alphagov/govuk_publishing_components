//= require ../vendor/polyfills/closest.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GemTrackClick () { }

  GemTrackClick.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.handleClick = this.handleClick.bind(this)
    var trackLinksOnly = this.$module.hasAttribute('data-track-links-only')

    var that = this
    // add a listener to the whole element
    this.$module.addEventListener('click', function (e) {
      if (!trackLinksOnly) {
        that.$module.handleClick(e.target)
      } else if (trackLinksOnly && e.target.tagName === 'A') {
        that.$module.handleClick(e.target)
      }
    })
  }

  GemTrackClick.prototype.handleClick = function (target) {
    var options = { transport: 'beacon' }
    var linkUrl

    // if clicked element hasn't got the right attributes, look for a parent that matches
    if (!target.hasAttribute('data-track-category') && !target.hasAttribute('data-track-action')) {
      linkUrl = target.getAttribute('href')
      target = target.closest('[data-track-category][data-track-action]')
    }

    if (target) {
      var category = target.getAttribute('data-track-category')
      var action = target.getAttribute('data-track-action')
      var label = target.getAttribute('data-track-label') || linkUrl
      var value = target.getAttribute('data-track-value')
      var dimension = target.getAttribute('data-track-dimension')
      var dimensionIndex = target.getAttribute('data-track-dimension-index')
      var extraOptions = target.getAttribute('data-track-options')

      if (label) {
        options.label = label
      }

      if (value) {
        options.value = value
      }

      if (dimension && dimensionIndex) {
        options['dimension' + dimensionIndex] = dimension
      }

      if (extraOptions) {
        extraOptions = JSON.parse(extraOptions)
        for (var k in extraOptions) options[k] = extraOptions[k]
      }

      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        window.GOVUK.analytics.trackEvent(category, action, options)
      }
    }
  }

  Modules.GemTrackClick = GemTrackClick
})(window.GOVUK.Modules)
