(function () {
  var parsedCookie = (function () {
    try {
      var cookies = document.cookie.split(';')

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].replace(/\s/g, '') // Remove all whitespace.
        var cookieName = 'cookies_policy='

        if (cookie.indexOf(cookieName) === 0) {
          return JSON.parse(cookie.substring(cookieName.length))
        }
      }
    } catch (error) {
      console.error(error)
    }

    return {}
  })()

  var insertScript = function () {
    window.removeEventListener('cookie-consent', insertScript)
    var marker = document.querySelector('script[data-lux-reporter-script]')

    if (!marker) {
      console.error("Failed to configure real-user-monitoring because couldn't the lux-reporter script path wasn't available")
      return
    }

    var script = document.createElement('script')
    script.src = marker.getAttribute('data-lux-reporter-script')
    script.async = true
    script.defer = true

    marker.parentNode.insertBefore(script, marker)
  }

  // TODO: confirm usage condition for speedcurve when "aggregate"
  if (parsedCookie.usage === true) {
    insertScript()
  } else {
    window.addEventListener('cookie-consent', insertScript)
  }
})()
