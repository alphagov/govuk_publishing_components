/* global describe afterEach beforeEach it expect */

var $ = window.jQuery

function isFocused (element) {
  return $(element)[0] === $(element)[0].ownerDocument.activeElement
}

describe('An error summary component', function () {
  'use strict'

  var GOVUK = window.GOVUK
  var module
  var element

  beforeEach(function () {
    element = $(
      '<div ' +
        'class="gem-c-error-summary" ' +
        'data-module="error-summary" ' +
        'aria-labelledby="error-summary-title-id" ' +
        'role="alert" ' +
        'tabindex="-1" ' +
      '> ' +
        '<h2 class="gem-c-error-summary__title" id="error-summary-title-id"> ' +
          'Message to alert the user to a problem goes here ' +
        '</h2> ' +
        '<div class="gem-c-error-summary__body"> ' +
          '<p class="gem-c-error-summary__text"> ' +
            'Optional description of the errors and how to correct them ' +
          '</p> ' +
          '<ul class="gem-c-error-summary__list"> ' +
            '<li class="gem-c-error-summary__list__item"> ' +
              '<a ' +
                'class="js-error-summary__link gem-c-error-summary__link" ' +
                'href="#example-error-1" ' +
              '>Descriptive link to the question with an error</a> ' +
            '</li> ' +
          '</ul> ' +
        '</div> ' +
      '</div>'
    )
    $(document.body).append(element)
    document.body.focus()
    module = new GOVUK.Modules.ErrorSummary()
  })

  afterEach(function () {
    // clean up the test element after each test
    element.remove()
    element = undefined
  })

  it('is focused on load', function () {
    module.start(element)

    expect(isFocused(element)).toBe(true)
  })

  it('focuses inputs with no location change when clicking error links', function () {
    var originalHref = window.location.href
    var inputElement = $('<input type="text" id="example-error-1" name="example-error-1" />')
    $(document.body).append(inputElement)

    module.start(element)

    element.find('.js-error-summary__link').trigger('click')

    expect(isFocused(inputElement)).toBe(true)
    expect(originalHref).toBe(window.location.href)
  })
})
