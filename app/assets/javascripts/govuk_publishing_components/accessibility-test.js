(function (window, document, axe) {
  window.GOVUK = window.GOVUK || {}

  function AccessibilityTest (selector, callback) {
    if (typeof callback !== 'function') {
      return
    }

    if (!document.querySelector(selector)) {
      return callback('No selector "' + selector + '" found')
    }

    var axeOptions = {
      restoreScroll: true,
      include: [selector]
    }

    axe.run(axeOptions, function (err, results) {
      if (err) {
        callback('aXe Error: ' + err)
      }

      var violations = (typeof results === 'undefined') ? [] : results.violations

      if (violations.length === 0) {
        return callback('No accessibility issues found')
      }

      var errorText = (
        '\n' + 'Accessibility issues at ' +
        results.url + '\n\n' +
        violations.map(function (violation) {
          var help = 'Problem: ' + violation.help
          var helpUrl = 'Try fixing it with this help: ' + violation.helpUrl
          var htmlAndTarget = violation.nodes.map(_renderNode).join('\n\n')

          return [
            help,
            htmlAndTarget,
            helpUrl
          ].join('\n\n\n')
        }).join('\n\n- - -\n\n')
      )
      callback(undefined, errorText)
    })
  }

  var _renderNode = function (node) {
    return (
      ' Check the HTML:\n' +
      ' `' + node.html + '`\n' +
      ' found with the selector:\n' +
      ' "' + node.target.join(', ') + '"'
    )
  }

  var _throwUncaughtError = function (error) {
    // aXe swallows throw errors so we pass it through a setTimeout
    // so that it's not in aXe's context
    setTimeout(function () {
      throw new Error(error)
    }, 0)
  }

  window.GOVUK.AccessibilityTest = AccessibilityTest

  // Cut the mustard at IE9+ since aXe only works with those browsers.
  // http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      AccessibilityTest('[data-module="test-a11y"]', function (err, results) {
        if (err) {
          return
        }
        _throwUncaughtError(results)
      })
    })
  }
})(window, document, window.axe)
