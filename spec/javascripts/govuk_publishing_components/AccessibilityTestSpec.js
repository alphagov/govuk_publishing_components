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
    document.body.className = '';
  })

  it('should do nothing if no callback is specified', function () {
    AccessibilityTest(TEST_SELECTOR)
  })

  it('should not run axe if no selector is found', function (done) {
    spyOn(window.axe, 'run').and.callThrough()

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      expect(window.axe.run).not.toHaveBeenCalled()
      expect(err).toBe(undefined)
      expect(violations).toBe(undefined)
      expect(incompleteWarnings).toBe(undefined)
      done()
    })
  })

  // TODO: Remove when aXe core patched
  // https://github.com/dequelabs/axe-core/issues/525
  it('should prevent aXe from erroring when SVG is present by disabling restoreScroll', function (done) {
    spyOn(window.axe, 'run').and.callThrough()
    addToDom('<div style="height: 1000px; width: 100px;"></div><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17">\
                <path fill="currentColor" d="M6.5 0L0 6.5 1.4 8l4-4v12.7h2V4l4.3 4L13 6.4z"></path>\
              </svg>')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      expect(err).toBe(undefined)

      // Protect against test failing if PhantomJS updated
      if (!(document.querySelector('svg').children instanceof HTMLCollection)) {
        axeOptions = window.axe.run.calls.argsFor(0)
        expect(axeOptions['restoreScroll']).toBe(undefined)
      }
      done()
    })
  })

  it('should add a class to the body when it finishes', function (done) {
    addToDom('<div>text</div>')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      expect(document.body.classList.contains('test-a11y-finished')).toBe(true)
      done()
    })
  })

  it('should add a class to the body when it finds no violations', function (done) {
    addToDom('<div>text</div>')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      expect(document.body.classList.contains('test-a11y-success')).toBe(true)
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

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      if (err) {
        throw err
      }

      var errorMessage = renderErrorMessage({
        problem: 'Elements must have sufficient color contrast',
        html: '<a href="#" style="">Low contrast</a>',
        selector: TEST_SELECTOR + ' > a',
        helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/color-contrast?application=axeAPI'
      })

      expect(violations).toBe(errorMessage)
      expect(document.body.classList.contains('test-a11y-finished')).toBe(true)
      expect(document.body.classList.contains('test-a11y-failed')).toBe(true)
      done()
    })
  })

  it('should throw if there\'s a alt tag issue', function (done) {
    addToDom('<img src="">')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      if (err) {
        throw err
      }

      var errorMessage = renderErrorMessage({
        problem: 'Images must have alternate text',
        html: '<img src="">',
        selector: TEST_SELECTOR + ' > img',
        helpUrl: 'https://dequeuniversity.com/rules/axe/2.3/image-alt?application=axeAPI'
      })

      expect(violations).toBe(errorMessage)

      done()
    })
  })

  it('process incomplete warnings into object for rendering in guide', function (done) {
    addToDom('<a href="#">Link</a>', 'a { background-image: url("/"); }')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
      if (err) {
        throw err
      }

      expect(incompleteWarnings[0].summary).toBe("Elements must have sufficient color contrast")
      expect(incompleteWarnings[0].url).toBe("https://dequeuniversity.com/rules/axe/2.3/color-contrast?application=axeAPI")
      expect(incompleteWarnings[0].selectors[0].selector[0]).toBe('.js-test-a11y > a')
      done()
    })
  })

  it('should throw on multiple issues', function (done) {
    addToDom('<img src=""><a href="#">Low contrast</a>', 'a { background: white; color: #ddd }')

    AccessibilityTest(TEST_SELECTOR, function (err, violations, incompleteWarnings) {
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

      expect(violations).toBe(errorMessage)

      done()
    })
  })
})
