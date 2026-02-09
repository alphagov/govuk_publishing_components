/* eslint-env jasmine */

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
    element = document.createElement('div')
    document.body.appendChild(element)
    spyOn(obj, 'calledFunction').and.callThrough()
    spyOn(obj, 'secondCalledFunction').and.callThrough()
  })

  afterEach(function () {
    element.remove()
  })

  it('creates and triggers a custom event', function () {
    element.addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(element, 'click')
    expect(obj.calledFunction).toHaveBeenCalled()
  })

  it('creates and triggers a custom event with parameters', function () {
    element.addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(element, 'click', { detail: { test: true } })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates and triggers a custom event with a keyCode', function () {
    element.addEventListener('keyup', obj.calledFunction)
    window.GOVUK.triggerEvent(element, 'keyup', { keyCode: 13 })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that bubbles by default', function () {
    element = document.createElement('div')
    var child = document.createElement('div')
    element.appendChild(child)
    document.body.appendChild(element)
    element.addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(child, 'click')
    expect(obj.calledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that does not bubble', function () {
    element = document.createElement('div')
    var child = document.createElement('div')
    element.appendChild(child)
    document.body.appendChild(element)
    element.addEventListener('click', obj.calledFunction)
    window.GOVUK.triggerEvent(child, 'click', { bubbles: false })
    expect(obj.calledFunction).not.toHaveBeenCalled()
  })

  it('creates a custom event that can be cancelled', function () {
    element = document.createElement('input')
    element.setAttribute('type', 'text')
    document.body.appendChild(element)
    element.addEventListener('keypress', obj.calledFunction)
    window.GOVUK.triggerEvent(element, 'keypress')
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).toHaveBeenCalled()
  })

  it('creates a custom event that cannot be cancelled', function () {
    element = document.createElement('input')
    element.setAttribute('type', 'text')
    document.body.appendChild(element)
    element.addEventListener('keypress', obj.calledFunction)
    window.GOVUK.triggerEvent(element, 'keypress', { cancelable: false })
    expect(obj.calledFunction).toHaveBeenCalled()
    expect(obj.secondCalledFunction).not.toHaveBeenCalled()
  })
})
