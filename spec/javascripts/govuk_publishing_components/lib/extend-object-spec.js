/* eslint-env jasmine, jquery */

describe('The extend object code', function () {
  it('returns the original object if no further arguments', function () {
    var obj = { test1: 1 }
    var test = window.GOVUK.extendObject(obj)

    expect(test).toEqual({ test1: 1 })
  })

  it('extends an object', function () {
    var obj = { test1: 1 }
    var args = { test2: 2 }
    var test = window.GOVUK.extendObject(obj, args)

    expect(test).toEqual({ test1: 1, test2: 2 })
  })

  it('extends multiple objects', function () {
    var obj = { test1: 1 }
    var args1 = { test2: 2 }
    var args2 = { test3: 3 }
    var args3 = { test4: 4 }
    var test = window.GOVUK.extendObject(obj, args1, args2, args3)

    expect(test).toEqual({ test1: 1, test2: 2, test3: 3, test4: 4 })
  })
})
