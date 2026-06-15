var CUSTOM_DEFAULT_COOKIE_CONSENT = {
  essential: true,
  settings: false,
  usage: false,
  campaigns: false,
  custom: true
}

window.addEventListener("cookie-reject", () => {
  window.GOVUK.setConsentCookie(CUSTOM_DEFAULT_COOKIE_CONSENT)
})
