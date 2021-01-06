window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GovspeakTrackLinks () { }

  GovspeakTrackLinks.prototype.start = function ($module) {
    $module = $module[0]
    var category = $module.getAttribute('data-track-links-category')
    var links = $module.querySelectorAll('a')

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (event) {
        this.sendLinkClickEvent(event, category)
      }.bind(this))
    }
  }

  GovspeakTrackLinks.prototype.sendLinkClickEvent = function (event, category) {
    window.GOVUK.analytics.trackEvent(
      category,
      event.target.innerText,
      {
        transport: 'beacon',
        label: event.target.getAttribute('href')
      }
    )
  }

  Modules.GovspeakTrackLinks = GovspeakTrackLinks
})(window.GOVUK.Modules)
