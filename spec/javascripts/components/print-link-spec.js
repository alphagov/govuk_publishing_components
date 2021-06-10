/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Print link', function () {
  'use strict'

  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = '<button class="gem-c-print-link__button govuk-link" data-module="print-link">Print this page</button>'

    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('calls the DOM print API when clicked', function () {
    spyOn(window, 'print')

    var element = document.querySelector('[data-module="print-link"]')
    new GOVUK.Modules.PrintLink(element).init()

    element.dispatchEvent(new window.Event('click'))

    expect(window.print).toHaveBeenCalled()
  })
})
