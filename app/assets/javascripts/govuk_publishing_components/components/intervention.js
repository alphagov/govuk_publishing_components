'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Intervention ($module) {
    this.$module = $module
    this.$closeLink = this.$module.querySelector('.js-dismiss-link')
    this.$campaignName = this.$module.getAttribute('data-intervention-name')
    this.$campaignCookie = window.GOVUK.cookie('intervention_campaign') || ''

    this.init()
  }

  Intervention.prototype.init = function () {
    this.$cookieHasCampaign = this.cookieHasCampaign()

    if (this.$closeLink) {
      this.$module.close = this.handleClose.bind(this)
      this.$closeLink.addEventListener('click', this.$module.close)
    }

    if (this.$cookieHasCampaign) {
      this.hideBanner()
    }
  }

  Intervention.prototype.handleClose = function (event) {
    event.preventDefault()

    if (this.$cookieHasCampaign) {
      this.setCookies()
    }
    this.hideBanner()
  }

  Intervention.prototype.cookieHasCampaign = function () {
    if (this.$campaignCookie) {
      return this.cookieValues().includes(this.$campaignName)
    }
    return false
  }

  Intervention.prototype.cookieValues = function () {
    if (this.$campaignCookie !== null && this.$campaignCookie.length > 0) {
      return this.$campaignCookie.split(',')
    }
  }

  Intervention.prototype.appendCookieValues = function () {
    return this.$campaignCookie + ',' + this.$campaignName
  }

  Intervention.prototype.setCookies = function () {
    if (this.$campaignCookie) {
      window.GOVUK.setCookie('intervention_campaign', this.appendCookieValues(), { days: 30 })
    } else {
      window.GOVUK.setCookie('intervention_campaign', this.$campaignName, { days: 30 })
    }
  }

  Intervention.prototype.hideBanner = function () {
    if (!this.$cookieHasCampaign) {
      this.setCookies()
    }

    this.$module.hidden = true
    this.$module.style.display = 'none'
  }

  Modules.Intervention = Intervention
})(window.GOVUK.Modules)
