window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class AppPromoBanner {
    constructor ($module) {
      this.$module = $module
      /** @type {HTMLButtonElement | null} */
      this.$closeButton = this.$module.querySelector('.js-close-app-promo-banner')
      this.APP_PROMO_BANNER_COOKIE = 'app_promo_banner'
    }

    /**
     * Initialise the app promo banner
     *
     */
    init () {
      // Only display the banner on Android devices
      if (!this.isAndroidDevice()) return

      // Do not display the app promo banner if the cookie banner is visible
      if (this.isCookieBannerVisible()) return

      // Do not display the banner if it was previously closed
      const cookieContents = this.getAppPromoBannerCookieContent()
      if (cookieContents && cookieContents.closed === true) return

      // Do not display the banner if the close button is not found
      if (!this.$closeButton) return

      this.$closeButton.addEventListener('click', (event) => this.handleClick(event))
      this.showBanner()
    }

    /**
     * Checks if the current device is an Android device
     *
     * @returns Boolean
     */
    isAndroidDevice () {
      return (/Android/i.test(navigator.userAgent))
    }

    /**
     * Checks if the user has accepted cookies and the cookie
     * category the app promo banner is in
     *
     * @returns Boolean
     */
    isCookiesAndCategoryPermitted () {
      const cookieConsent = window.GOVUK.getConsentCookie()
      const cookieCategory = window.GOVUK.getCookieCategory(this.APP_PROMO_BANNER_COOKIE)
      return (cookieConsent && cookieConsent[cookieCategory])
    }

    /**
     * Checks if the cookie banner is visible
     *
     * @returns Boolean - Cookie banner visible
     */
    isCookieBannerVisible () {
      /** @type {HTMLDivElement | null} */
      const cookieBanner = document.querySelector('#global-cookie-message')
      return cookieBanner && !cookieBanner.hidden
    }

    /**
     * Sets the cookie for the app promo banner, including if the
     * the banner should be in the closed state
     *
     * @param {Boolean} isAppBannerClosed
     */
    setAppBannerCookie (isAppBannerClosed) {
      // Do not set the cookie if cookies and category are not permitted
      if (!this.isCookiesAndCategoryPermitted) return

      /** @type {AppBannerCookie} */
      const appBannerCookie = { closed: isAppBannerClosed }

      // This approach will simply set/overwrite the cookie with new values
      const appBannerCookieValue = JSON.stringify(appBannerCookie)
      window.GOVUK.setCookie(this.APP_PROMO_BANNER_COOKIE, appBannerCookieValue, { days: 84 })
    }

    /**
     * Return the user's cookie settings for the app promo banner,
     * or null if the cookie is not present
     *
     * @returns {AppBannerCookie | null} App promo banner settings
     */
    getAppPromoBannerCookieContent () {
      const appBannerCookie = window.GOVUK.getCookie(this.APP_PROMO_BANNER_COOKIE)
      return appBannerCookie ? JSON.parse(appBannerCookie) : null
    }

    /**
     * Handle the click of the close banner button
     *
     * @param {MouseEvent} event - Click event
     */
    handleClick (event) {
      event.preventDefault()
      this.hideBanner()
    }

    /**
     * Shows the app promo banner
     *
     */
    showBanner () {
      this.$module.hidden = false
      this.$module.classList.add('gem-c-app-promo-banner--visible')
    }

    /**
     * Hides the app promo banner and sets a cookie to store
     * the closed state as true
     *
     */
    hideBanner () {
      this.setAppBannerCookie(true)
      this.$module.hidden = true
      this.$module.classList.remove('gem-c-app-promo-banner--visible')
    }
  }

  Modules.AppPromoBanner = AppPromoBanner
})(window.GOVUK.Modules)

/**
 * @typedef {object} AppBannerCookie
 * @property {boolean} [closed] - Banner closed state
 * @property {number} [version] - Banner version number
 */
