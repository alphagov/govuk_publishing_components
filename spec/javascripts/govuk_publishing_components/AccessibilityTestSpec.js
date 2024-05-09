/* eslint-env jasmine */

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
    'Problem: ' + option.problem + ' (' + option.id + ')' + '\n' +
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
    document.body.className = ''
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

  it('should add a class to the body when it finishes', function (done) {
    addToDom('<div>text</div>')

    AccessibilityTest(TEST_SELECTOR, function () {
      expect(document.body.classList.contains('js-test-a11y-finished')).toBe(true)
      done()
    })
  })

  it('should add a class to the body when it finds no violations', function (done) {
    addToDom('<div>text</div>')

    AccessibilityTest(TEST_SELECTOR, function () {
      expect(document.body.classList.contains('js-test-a11y-success')).toBe(true)
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
        id: 'color-contrast',
        problem: 'Elements must meet minimum color contrast ratio thresholds',
        html: '<a href="#">Low contrast</a>',
        selector: 'a[href="#"]',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/color-contrast?application=axeAPI'
      })

      expect(violations).toBe(errorMessage)
      expect(document.body.classList.contains('js-test-a11y-finished')).toBe(true)
      expect(document.body.classList.contains('js-test-a11y-failed')).toBe(true)
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
        id: 'image-alt',
        problem: 'Images must have alternate text',
        html: '<img src="">',
        selector: 'img',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/image-alt?application=axeAPI'
      })

      expect(violations).toBe(errorMessage)

      done()
    })
  })

  it('process incomplete warnings into object for rendering in guide', function (done) {
    addToDom('<a href="#">Link</a>', 'a { background-image: url("/"); }')

    AccessibilityTest(TEST_SELECTOR, function (_err, _violations, pageResults) {
      expect(pageResults.incompleteWarnings[0].summary).toBe('Elements must meet minimum color contrast ratio thresholds')
      expect(pageResults.incompleteWarnings[0].url).toBe('https://dequeuniversity.com/rules/axe/4.9/color-contrast?application=axeAPI')
      expect(pageResults.incompleteWarnings[0].selectors[0].selector[0]).toBe('a[href="#"]')
      expect(pageResults.incompleteWarnings[0].selectors[0].reasons[0]).toBe('Element\'s background color could not be determined due to a background image')
      done()
    })
  })

  it('process violations into object for rendering in guide', function (done) {
    addToDom('<img src=""><a href="#">Low contrast</a>', 'a { background: white; color: #ddd }')

    AccessibilityTest(TEST_SELECTOR, function (_err, _violations, pageResults) {
      expect(pageResults.violations[0].summary).toBe('Elements must meet minimum color contrast ratio thresholds')
      expect(pageResults.violations[0].url).toBe('https://dequeuniversity.com/rules/axe/4.9/color-contrast?application=axeAPI')
      expect(pageResults.violations[0].selectors[0].selector[0]).toBe('a[href="#"]')
      expect(pageResults.violations[0].selectors[0].reasons[0]).toBe('Element has insufficient color contrast of 1.35 (foreground color: #dddddd, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1')
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
          id: 'color-contrast',
          problem: 'Elements must meet minimum color contrast ratio thresholds',
          html: '<a href="#">Low contrast</a>',
          selector: 'a[href="#"]',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/color-contrast?application=axeAPI'
        }) +
        '\n\n- - -\n\n' +
        renderErrorMessage({
          id: 'image-alt',
          skipHeader: true,
          problem: 'Images must have alternate text',
          html: '<img src="">',
          selector: 'img',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/image-alt?application=axeAPI'
        })
      )

      expect(violations).toBe(errorMessage)

      done()
    })
  })
})
