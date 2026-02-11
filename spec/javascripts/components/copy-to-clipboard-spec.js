/* eslint-env jasmine */
/* global GOVUK */

describe('Copy to clipboard component', function () {
  'use strict'

  var container

  function loadCopyToClipboard () {
    var element = document.querySelector('[data-module=copy-to-clipboard]')
    new GOVUK.Modules.CopyToClipboard(element).init()
  }

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
      '<div class="gem-c-copy-to-clipboard" data-module="copy-to-clipboard">' +
        '<input value="https://www.gov.uk" class="gem-c-input govuk-input" type="text" readonly="readonly">' +
        '<button class="gem-c-button govuk-button" type="submit">Copy link</button>' +
      '</div>'
    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('calls the Web API when clicked', function () {
    spyOn(document, 'execCommand')

    loadCopyToClipboard()

    var copyButton = document.querySelector('button')
    window.GOVUK.triggerEvent(copyButton, 'click')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })
})
