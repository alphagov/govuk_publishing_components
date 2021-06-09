/* eslint-env jasmine, jquery */

describe('The trigger event code', function () {
  var element

  var obj = {
    calledFunction: function (event) {
      if (((event || {}).detail || {}).test === true) {
        obj.secondCalledFunction()
      }
    },
    secondCalledFunction: function () {}
  }

  beforeEach(function () {
    element = $('<div/>')
    $('body').append(element)
    spyOn(obj, 'calledFunction').and.callThrough()
    spyOn(obj, 'secondCalledFunction').and.callThrough()
  })

  afterEach(function () {
    element.remove()
  })

  it('creates and triggers a custom event', function () {
    element[0].addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'click')
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).not.toHaveBeenCalled()
  })

  it('creates and triggers a custom event with parameters', function () {
    element[0].addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'click', { detail: { test: true } })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })
})
