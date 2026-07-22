var initFunction = function () {
  window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)

  window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return
    // this checks for the presence of cookie consent query parameter and updates our consent cookie accordingly
    // This is so that users don't see multiple cookie banners when they move between different domains
    var cookieConsent = /([?&]cookie_consent=)(accept|reject)/.exec(location.search)
    if (cookieConsent) {
      if (cookieConsent[2] === 'accept') {
        window.GOVUK.setConsentCookie({ usage: true })
        // set cookies_preferences_set to true to prevent cookie banner showing
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent[2] === 'reject') {
        window.GOVUK.setConsentCookie({ usage: false })
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    }
  }

  window.GOVUK.analyticsGa4.decorateLinks = function (consent) {
    // Select all anchor tags with an href attribute
    const links = document.querySelectorAll('a[href]')
    const allowedDomains = ['example.service.gov.uk', 'micropigs.campaign.gov.uk']

    links.forEach(link => {
      try {
        // Use the URL constructor to safely parse absolute or relative URLs
        const url = new URL(link.href, window.location.origin)

        if (allowedDomains.includes(url.hostname)) {
          url.searchParams.set('cookies[analytics]', consentValue)
          link.href = url.toString()
        }
      } catch (e) {
        // Silently skip invalid URLs
      }
    })
  }

  window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration(window.location)

  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie) {
    var consentValue = consentCookie.usage ? 'yes' : 'no'
    window.GOVUK.analyticsGa4.decorateLinks(consentValue)

    if (consentCookie.usage) {
      window.GOVUK.analyticsGa4.vars.internalDomains = []
      window.GOVUK.analyticsGa4.vars.internalDomains.push(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
      window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)
      window.GOVUK.analyticsGa4.core.load()

      if (!window.GOVUK.analyticsGa4.analyticsModulesStarted) {
        var analyticsModules = window.GOVUK.analyticsGa4.analyticsModules
        for (var property in analyticsModules) {
          var module = analyticsModules[property]
          if (typeof module.init === 'function') {
            try {
              module.init()
            } catch (e) {
              console.warn('Error starting analytics module ' + property + ': ' + e.message, window.location)
            }
          }
        }
        window.GOVUK.analyticsGa4.analyticsModulesStarted = true
      }
    }
  } else {
    window.addEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  }
}

document.querySelectorAll('a').forEach(function(link) {
  if (link.href) {
    // Check if the link already has a query string to decide between '?' and '&'
    link.href += (link.href.includes('?') ? '&' : '?') + 'b=b';
  }
});

window.GOVUK.analyticsGa4.init = initFunction

// 1. A simple log to prove the file is executing
console.log("init-ga4.js has successfully loaded!");

// 2. Wait for the HTML body to finish loading before looking for links
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM is ready. Decorating links now...");
  
  document.querySelectorAll('a').forEach(function(link) {
    if (link.href) {
      link.href += (link.href.includes('?') ? '&' : '?') + 'a=a';
    }
  });
});
