(function (window, document, axe) {
  window.GOVUK = window.GOVUK || {}

  function AccessibilityTest (selector, callback) {
    if (typeof callback !== 'function') {
      return
    }

    if (!document.querySelector(selector)) {
      return callback()
    }

    var axeOptions = {
      restoreScroll: true,
      include: [selector]
    }

    // TODO: Remove when aXe core patched
    // https://github.com/dequelabs/axe-core/issues/525
    if (document.querySelector('svg') && !(document.querySelector('svg').children instanceof HTMLCollection)) {
      delete axeOptions['restoreScroll']
    }

    axe.run(selector, axeOptions, function (err, results) {
      if (err) {
        return callback('aXe Error: ' + err)
      }

      if (typeof results === "undefined") {
        return callback('aXe Error: Expected results but none returned')
      }

      var errorText = _processViolations(results.violations, results.url)
      var incompleteWarningsObj = _processIncompleteWarnings(results.incomplete)

      var bodyClass = results.violations.length === 0 ? "test-a11y-success" : "test-a11y-failed"
      document.body.classList.add(bodyClass);
      document.body.classList.add("test-a11y-finished");

      callback(undefined, errorText, incompleteWarningsObj)
    })
  }

  var _processViolations = function(violations, url) {
    if (violations.length !== 0) {
      return (
        '\n' + 'Accessibility issues at ' +
        url + '\n\n' +
        violations.map(function (violation) {
          var help = 'Problem: ' + violation.help
          var helpUrl = 'Try fixing it with this help: ' + _formatHelpUrl(violation.helpUrl)
          var htmlAndTarget = violation.nodes.map(_renderNode).join('\n\n')

          return [
            help,
            htmlAndTarget,
            helpUrl
          ].join('\n\n\n')
        }).join('\n\n- - -\n\n')
      )
    } else {
      return false
    }
  }

  var _processIncompleteWarnings = function(incompleteWarnings) {
    if (incompleteWarnings.length !== 0) {
      return (
        incompleteWarnings.map(function (incomplete) {
          var help = incomplete.help
          var helpUrl = _formatHelpUrl(incomplete.helpUrl)
          var cssSelector = incomplete.nodes.map(function (node) {
            return {
              'selector': node.target,
              'reason': node.any.map(function(item) {
                return item.message
              })
            }
          })

          return {
            'summary': help,
            'selectors': cssSelector,
            'url': helpUrl
          }
        })
      )
    } else {
      return false
    }
  }

  var _formatHelpUrl = function (helpUrl) {
    if (axe.version.indexOf('alpha') === -1) {
      console.warn('Deprecation warning: helpUrl formatting is no longer needed so can be deleted')
      return helpUrl
    }
    return helpUrl.replace('3.0.0-alpha', '2.3')
  }

  var _renderNode = function (node) {
    return (
      ' Check the HTML:\n' +
      ' `' + node.html + '`\n' +
      ' found with the selector:\n' +
      ' "' + node.target.join(', ') + '"'
    )
  }

  var _findParent = function (element, selector) {
    while (element.tagName !== 'HTML') {
      if (element.matches(selector)) {
        return element
      }
      element = element.parentNode
    }
  }

  var _renderIncompleteWarnings = function (incompleteWarnings) {
    incompleteWarnings.forEach(function (warning) {
      warning.selectors.forEach(function (selectorObj) {
        var activeEl = document.querySelector(selectorObj.selector)
        var activeElParent = _findParent(activeEl, '[data-module="test-a11y"]')
        var warningWrapper = activeElParent.querySelector('[data-module="test-a11y-warning"]')

        if (warningWrapper) {
          // Add warning to warnings box
          var warningsHTML = '<h3>' + warning.summary + ' <a href="' + warning.url + '">(see guidance)</a></h3>' +
          '<p>Reason: ' + selectorObj.reason + '</p>' +
          '<p>Element can be found using the following CSS selector: <span class="selector">' +
          selectorObj.selector +
          '</span></p>'

          warningWrapper.insertAdjacentHTML('beforeend', warningsHTML)
        }
      })
    })
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
      AccessibilityTest('[data-module="test-a11y"]', function (err, violations, incompleteWarnings) {
        if (err) {
          _throwUncaughtError(err)
        }
        if (incompleteWarnings) _renderIncompleteWarnings(incompleteWarnings)
        if (violations) _throwUncaughtError(violations)
      })
    })
  }
})(window, document, window.axe)
