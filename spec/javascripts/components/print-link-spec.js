/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Print link', function () {
  it('calls the DOM print API when clicked', function () {
    spyOn(window, 'print')
    var element = $('<button class="gem-c-print-link__button govuk-link">Print this page</button>')

    new GOVUK.Modules.PrintLink().start(element)

    element.trigger('click')

    expect(window.print).toHaveBeenCalled()
  })
})
