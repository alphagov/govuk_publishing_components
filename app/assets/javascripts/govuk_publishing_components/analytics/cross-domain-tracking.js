window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CrossDomainTracking ($module) {
    this.$module = $module
    Modules.crossDomainLinkedTrackers = Modules.crossDomainLinkedTrackers || []

    this.init()
  }

  CrossDomainTracking.prototype.init = function () {
    if (this.isTrackable(this.$module)) {
      this.addLinkedTrackerDomain(this.$module)
    } else {
      this.findTrackableElements()
    }
  }

  CrossDomainTracking.prototype.isTrackable = function (element) {
    if (element.getAttribute('href') && element.getAttribute('data-tracking-code') && element.getAttribute('data-tracking-name')) {
      return true
    }
  }

  CrossDomainTracking.prototype.findTrackableElements = function () {
    var links = this.$module.querySelectorAll('a')
    for (var i = 0; i < links.length; i++) {
      if (this.isTrackable(links[i])) {
        this.addLinkedTrackerDomain(links[i])
      }
    }
  }

  CrossDomainTracking.prototype.addLinkedTrackerDomain = function (element) {
    var name = element.getAttribute('data-tracking-name')
    var code = element.getAttribute('data-tracking-code')
    var trackEvent = (element.getAttribute('data-tracking-track-event') === 'true')

    if (window.GOVUK.analytics !== 'undefined') {
      if (Modules.crossDomainLinkedTrackers.indexOf(name) === -1) {
        var hostname = element.hostname
        window.GOVUK.analytics.addLinkedTrackerDomain(code, name, hostname)
        Modules.crossDomainLinkedTrackers.push(name)
      }

      if (trackEvent) {
        element.addEventListener('click', function (e) {
          var target = e.target
          window.GOVUK.analytics.trackEvent('External Link Clicked', target.textContent, { trackerName: name })
        })
      }
    }
  }

  Modules.CrossDomainTracking = CrossDomainTracking
})(window.GOVUK.Modules)
