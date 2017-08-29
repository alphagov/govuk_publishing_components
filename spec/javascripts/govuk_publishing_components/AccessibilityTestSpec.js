/* global describe, afterEach, it, expect */

var TEST_SELECTOR = '.js-test-a11y'

var AccessibilityTest = window.GOVUK.AccessibilityTest

function addToDom (html, style) {
  var div = document.createElement('div')
  var htmlToInject = ''
  htmlToInject += '<div class="' + TEST_SELECTOR.replace('.', '') + '">'
  if (style) {
    htmlToInject += '<style>' + style + '</style>'
  }
  htmlToInject += html + '</div>'
  div.innerHTML = htmlToInject
  document.getElementsByTagName('body')[0].appendChild(div)
}

function removeFromDom (selector) {
  var nodeToRemove = document.querySelector(selector)
  if (nodeToRemove) {
    nodeToRemove.parentNode.removeChild(nodeToRemove)
  }
}

function renderErrorMessage (option) {
  var url = window.location.href
  var message = ''
  if (!option.skipHeader) {
    message += '\nAccessibility issues at ' + url + '\n\n'
  }
  message += (
    'Problem: ' + option.problem + '\n' +
    '\n' +
    '\n' +
    ' Check the HTML:\n' +
    ' `' + option.html + '`\n' +
    ' found with the selector:\n' +
    ' "' + option.selector + '"\n' +
    '\n' +
    '\n' +
    'Try fixing it with this help: ' + option.helpUrl
  )
  return message
}

describe('AccessibilityTest', function () {
  afterEach(function () {
    removeFromDom(TEST_SELECTOR)
  })

  it('should do nothing if no callback is specified', function () {
    AccessibilityTest(TEST_SELECTOR)
  })

  it('should error if no selector is found', function (done) {
    AccessibilityTest(TEST_SELECTOR, function (err, result) {
      expect(result).toBe(undefined)
      expect(err).toBe('No selector "' + TEST_SELECTOR + '" found')
      done()
    })
  })

  it('should not scroll the page', function (done) {
    var bigElement = '<div style="height: 1000px; width: 100px;"></div>'

    addToDom(
      bigElement + '<a href="#">Low contrast</a>' + bigElement,
      'a { background: white; color: #ddd }'
    )

    expect(window.scrollY).toBe(0, 'should start at top of the page')

    AccessibilityTest(TEST_SELECTOR, function () {
      expect(window.scrollY).toBe(0, 'should end at top of the page')
      done()
    })
  })

  it('should throw if there\'s a contrast issue', function (done) {
    addToDom('<a href="#">Low contrast</a>', 'a { background: white; color: #ddd }')

    AccessibilityTest(TEST_SELECTOR, function (err, result) {
      if (err) {
        throw err
      }

      var errorMessage = renderErrorMessage({
        problem: 'Elements must have sufficient color contrast',
        html: '<a href="#" style="">Low contrast</a>',
        selector: TEST_SELECTOR + ' > a',
        helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/color-contrast?application=axeAPI'
      })

      expect(result).toBe(errorMessage)

      done()
    })
  })

  it('should throw if there\'s a alt tag issue', function (done) {
    addToDom('<img src="">')

    AccessibilityTest(TEST_SELECTOR, function (err, result) {
      if (err) {
        throw err
      }

      var errorMessage = renderErrorMessage({
        problem: 'Images must have alternate text',
        html: '<img src="">',
        selector: TEST_SELECTOR + ' > img',
        helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/image-alt?application=axeAPI'
      })

      expect(result).toBe(errorMessage)

      done()
    })
  })

  it('should throw on multiple issues', function (done) {
    addToDom('<img src=""><a href="#">Low contrast</a>', 'a { background: white; color: #ddd }')

    AccessibilityTest(TEST_SELECTOR, function (err, result) {
      if (err) {
        throw err
      }

      var errorMessage = (
        renderErrorMessage({
          problem: 'Elements must have sufficient color contrast',
          html: '<a href="#" style="">Low contrast</a>',
          selector: TEST_SELECTOR + ' > a',
          helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/color-contrast?application=axeAPI'
        }) +
        '\n\n- - -\n\n' +
        renderErrorMessage({
          skipHeader: true,
          problem: 'Images must have alternate text',
          html: '<img src="">',
          selector: TEST_SELECTOR + ' > img',
          helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/image-alt?application=axeAPI'
        })
      )

      expect(result).toBe(errorMessage)

      done()
    })
  })
})
