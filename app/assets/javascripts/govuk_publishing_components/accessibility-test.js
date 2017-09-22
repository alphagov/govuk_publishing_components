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
      include: [selector],
      rules: {
        "duplicate-id": {
          enabled: false
        }
      }
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

      var consoleErrorText = _consoleErrorText(results.violations, results.url)
      var bodyClass = results.violations.length === 0 ? "js-test-a11y-success" : "js-test-a11y-failed"
      document.body.classList.add(bodyClass);
      document.body.classList.add("js-test-a11y-finished");

      callback(undefined, consoleErrorText, _processAxeResultsForPage(results))
    })
  }

  var _consoleErrorText = function(violations, url) {
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

  var _processAxeResultsForPage = function(results) {
    return {
      violations: _mapSummaryAndCause(results.violations),
      incompleteWarnings: _mapSummaryAndCause(results.incomplete)
    }
  }

  var _mapSummaryAndCause = function(resultsArray) {
    return resultsArray.map(function (result) {
      var cssSelector = result.nodes.map(function (node) {
                          return {
                            'selector': node.target,
                            'reasons': node.any.map(function(item) {
                              return item.message
                            })
                          }
                        })
      return {
        'summary': result.help,
        'selectors': cssSelector,
        'url': _formatHelpUrl(result.helpUrl)
      }
    })
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

  var _renderAxeResultsInGuide = function (resultsGroup, resultContainerSelector) {
    resultsGroup.forEach(function (result) {
      result.selectors.forEach(function (selectorObj) {
        var activeEl = document.querySelector(selectorObj.selector)
        var activeElParent = _findParent(activeEl, '[data-module="test-a11y"]')
        var wrapper = activeElParent.querySelector(resultContainerSelector)

        if (wrapper) {
          var resultHTML = '<h3>' + result.summary + ' <a href="' + result.url + '">(see guidance)</a></h3>' +
          '<p>' + selectorObj.reasons.join('<br />') + '</p>' +
          '<p>Element can be found using the selector:<br /><span class="selector">' +
          selectorObj.selector +
          '</span></p>'

          wrapper.insertAdjacentHTML('beforeend', resultHTML)
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
      AccessibilityTest('[data-module="test-a11y"]', function (axeError, consoleErrorText, pageResults) {
        if (axeError) {
          _throwUncaughtError(axeError)
        }

        if (pageResults) {
          _renderAxeResultsInGuide(pageResults.incompleteWarnings, '[data-module="test-a11y-warning"]')
          _renderAxeResultsInGuide(pageResults.violations, '[data-module="test-a11y-violation"]')
        }

        if (consoleErrorText) {
          _throwUncaughtError(consoleErrorText)
        }
      })
    })
  }
})(window, document, window.axe)
