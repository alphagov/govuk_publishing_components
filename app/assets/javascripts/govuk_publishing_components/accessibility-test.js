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

    axe.run(selector, axeOptions, function (err, results) {
      if (err) {
        callback('aXe Error: ' + err)
      }

      var violations = (typeof results === 'undefined') ? [] : results.violations
      var incompleteWarnings = (typeof results === 'undefined') ? [] : results.incomplete

      if (violations.length === 0 && incompleteWarnings.length === 0) {
        return callback('No accessibility issues found')
      }

      // We don't want to display incomplete warnings on preview pages
      if ($(selector).closest('[data-type="preview"]').data('type') !== 'preview') {
        var incompleteWarningsObj = _processIncompleteWarnings(incompleteWarnings)
      }
      var errorText = _processViolations(violations, results.url)

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
    }
    else {
      console.info("aXe: No accessibility errors found")
    }
  }

  var _processIncompleteWarnings = function(incompleteWarnings) {
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

  var _renderIncompleteWarnings = function (incompleteWarnings) {
    incompleteWarnings.forEach(function (warning) {
      warning.selectors.forEach(function (selectorObj) {
        var warningWrapper = window.$(selectorObj.selector.toString()).closest('[data-module="test-a11y"]').next('[data-module="test-a11y-warning"]')[0]

        // Add warning to warnings box
        var warningsHTML = '<h3>' + warning.summary + ' <a href="' + warning.url + '">(see guidance)</a></h3>' +
                        '<p>Reason: ' + selectorObj.reason + '</p>' +
                        '<p>Element can be found using the following CSS selector: <span class="selector">' +
                        selectorObj.selector +
                        '</span></p>'

        warningWrapper.insertAdjacentHTML('beforeend', warningsHTML)
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
          return
        }
        if (incompleteWarnings) _renderIncompleteWarnings(incompleteWarnings)
        if (violations) _throwUncaughtError(violations)
      })
    })
  }
})(window, document, window.axe)
