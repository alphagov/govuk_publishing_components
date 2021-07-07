/* eslint-env jasmine, jquery */

describe('The trigger event code', function () {
  var element

  var obj = {
    calledFunction: function (event) {
      if (typeof event.cancelable !== 'boolean' || event.cancelable === true) {
        event.preventDefault()
      }
      if (event.defaultPrevented) {
        obj.secondCalledFunction()
      }
      if (((event || {}).detail || {}).test === true) {
        obj.secondCalledFunction()
      }
      if (event.keyCode === 13) {
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
  })

  it('creates and triggers a custom event with parameters', function () {
    element[0].addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'click', { detail: { test: true } })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates and triggers a custom event with a keyCode', function () {
    element[0].addEventListener('keyup', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'keyup', { keyCode: 13 })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that bubbles by default', function () {
    element = $('<div/>')
    var child = $('<div/>')
    element.append(child)
    $('body').append(element)
    element[0].addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(child[0], 'click')
    expect(obj.calledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that does not bubble', function () {
    element = $('<div/>')
    var child = $('<div/>')
    element.append(child)
    $('body').append(element)
    element[0].addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(child[0], 'click', { bubbles: false })
    expect(obj.calledFunction).not.toHaveBeenCalled()
  })

  it('creates a custom event that can be cancelled', function () {
    element = $('<input type="text"/>')
    $('body').append(element)
    element[0].addEventListener('keypress', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'keypress')
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that cannot be cancelled', function () {
    element = $('<input type="text"/>')
    $('body').append(element)
    element[0].addEventListener('keypress', obj.calledFunction)
    window.GOVUK.triggerEvent(element[0], 'keypress', { cancelable: false })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).not.toHaveBeenCalled()
  })
})
