(function (Modules) {
  function CookieConsentLinkDecoration ($module) {
    this.$module = $module
  }

  CookieConsentLinkDecoration.prototype.init = function () {
    this.checkCookieConsentLinkDecoration(window.location)
  }

  CookieConsentLinkDecoration.prototype.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return

    var params = new URLSearchParams(location.search)
    var cookieConsent = params.get('cookies[analytics]')

    if (cookieConsent) {
      if (cookieConsent === 'yes') {
        window.GOVUK.approveAllCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent === 'no') {
        window.GOVUK.declineNonEssentialCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    }
  }

  Modules.CookieConsentLinkDecoration = CookieConsentLinkDecoration
})(window.GOVUK.Modules)
