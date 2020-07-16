(function (window, document) {
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.VisualDiffTool = function (currentWindowLocation) {
    var visualDiffSelector = 'visual-diff'
    var existingIframe = document.getElementById(visualDiffSelector)
    var windowLocation = currentWindowLocation || window.location

    if (existingIframe) {
      existingIframe.parentNode.removeChild(existingIframe)
      document.body.style.filter = null
    } else {
      var iframe = document.createElement('iframe')
      iframe.id = visualDiffSelector
      iframe.setAttribute('scrolling', 'no')
      _setElementStyles(iframe, {
        width: '100%',
        height: document.body.scrollHeight + 'px',
        position: 'absolute',
        top: '0',
        'pointer-events': 'none',
        border: '0'
      })
      iframe.style.setProperty('z-index', '999', 'important')

      // For browsers that support it, do mix-blend-mode diff
      if ('mix-blend-mode' in document.body.style) {
        _setElementStyles(iframe, { 'mix-blend-mode': 'difference' })
        document.body.style.filter = 'invert(100%)'
      } else {
        // Else do a simple overlay of the live page for comparison (IE and Edge)
        _setElementStyles(iframe, { opacity: '0.7' })
      }

      iframe.src = _processComparisonURL(windowLocation)

      if (iframe.src) {
        document.body.appendChild(iframe)
        console.log('comparing to ' + iframe.src)
      }
    }
  }

  var _processComparisonURL = function (url) {
    var href = url.href
    var host = url.host

    if (href.includes('dev.gov.uk/component-guide')) {
      var appName = host.split('.')[0]
      return _forceHTTPS(href.replace(host, appName + '.herokuapp.com'))
    } else if (href.includes('dev.gov.uk')) {
      return _forceHTTPS(href.replace(host, 'www.gov.uk'))
    } else if (href.includes('-pr-')) {
      var appName = host.split('-pr')[0]
      return _forceHTTPS(href.replace(host, appName + '.herokuapp.com'))
    } else {
      throw new Error('Visual Diff Tool: You need to run this tool against a page running on your local dev environment')
    }
  }

  var _forceHTTPS = function (href) {
    return href.replace('http://', 'https://')
  }

  var _setElementStyles = function (element, styles) {
    for (var style in styles) {
      element.style[style] = styles[style]
    }
  }
})(window, document)
