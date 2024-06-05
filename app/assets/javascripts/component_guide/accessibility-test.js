//= require axe-core/axe.js
(function (window, document, axe) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  function AccessibilityTest (selector, callback) {
    if (typeof callback !== 'function') {
      return
    }

    var element = document.querySelector(selector)

    if (!element) {
      return callback()
    }

    var dataDisabledRules = element.getAttribute('data-excluded-rules')
    var disabledRules = dataDisabledRules ? JSON.parse(dataDisabledRules) : []

    var axeRules = {}

    disabledRules.forEach(function (rule) {
      axeRules[rule] = { enabled: false }
    })

    var axeOptions = {
      rules: axeRules
    }

    axe.run(selector, axeOptions, function (err, results) {
      if (err) {
        return callback(new Error('aXe Error: ' + err))
      }

      if (typeof results === 'undefined') {
        return callback(new Error('aXe Error: Expected results but none returned'))
      }

      var consoleErrorText = _consoleErrorText(results.violations, results.url)
      var bodyClass = results.violations.length === 0 ? 'js-test-a11y-success' : 'js-test-a11y-failed'
      document.body.classList.add(bodyClass)
      document.body.classList.add('js-test-a11y-finished')

      callback(undefined, consoleErrorText, _processAxeResultsForPage(results))
    })
  }

  var _consoleErrorText = function (violations, url) {
    if (violations.length !== 0) {
      return (
        '\n' + 'Accessibility issues at ' +
        url + '\n\n' +
        violations.map(function (violation) {
          var help = 'Problem: ' + violation.help + ' (' + violation.id + ')'
          var helpUrl = 'Try fixing it with this help: ' + violation.helpUrl
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

  var _processAxeResultsForPage = function (results) {
    return {
      violations: _mapSummaryAndCause(results.violations),
      incompleteWarnings: _mapSummaryAndCause(results.incomplete)
    }
  }

  var _mapSummaryAndCause = function (resultsArray) {
    return resultsArray.map(function (result) {
      var cssSelector = result.nodes.map(function (node) {
        return {
          selector: node.target,
          reasons: node.any.map(function (item) {
            return item.message
          })
        }
      })
      return {
        id: result.id,
        summary: result.help,
        selectors: cssSelector,
        url: result.helpUrl
      }
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

        if (!wrapper) {
          return
        }

        // Section to announce the overall problem.
        var headerNodeLink = document.createElement('a')
        headerNodeLink.href = result.url
        headerNodeLink.textContent = '(see guidance)'

        var headerNode = document.createElement('h3')
        headerNode.textContent = result.summary + ' (' + result.id + ') '
        headerNode.appendChild(headerNodeLink)

        // Section to explain the reasons
        var reasonsListNode = document.createElement('ul')
        selectorObj.reasons.forEach(function (reason) {
          var listItemNode = document.createElement('li')
          listItemNode.textContent = reason
          reasonsListNode.appendChild(listItemNode)
        })

        var reasonsHeaderNode = document.createElement('h4')
        reasonsHeaderNode.textContent = 'Possible reasons why:'

        var reasonsNode = document.createElement('div')
        reasonsNode.appendChild(reasonsHeaderNode)
        reasonsNode.appendChild(reasonsListNode)

        // Section to help find the element
        var findHeader = document.createElement('h4')
        findHeader.textContent = 'Element can be found using the selector:'

        var findSelectorNode = document.createElement('span')
        findSelectorNode.className = 'selector'
        findSelectorNode.textContent = selectorObj.selector

        var findNode = document.createElement('p')
        findNode.appendChild(findHeader)
        findNode.appendChild(findSelectorNode)

        // Put all the sections together
        var resultHTML = document.createElement('div')
        resultHTML.appendChild(headerNode)
        resultHTML.appendChild(reasonsNode)
        resultHTML.appendChild(findNode)

        wrapper.appendChild(resultHTML)
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
