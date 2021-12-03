/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An accessible autocomplete component', function () {
  var fixture, select

  function loadAutocompleteComponent () {
    fixture = document.createElement('div')
    document.body.appendChild(fixture)
    fixture.innerHTML = html
    select = fixture.querySelector('select')
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete(fixture.querySelector('.gem-c-accessible-autocomplete'))
    autocomplete.init()
  }

  var html =
    '<div class="gem-c-accessible-autocomplete">' +
      '<select id="test" class="govuk-select">' +
        '<option value=""></option>' +
        '<option value="mo">Moose</option>' +
        '<option value="de">Deer</option>' +
      '</select>' +
    '</div>'

  // the autocomplete onConfirm function fires after the tests run unless we put
  // in a timeout like this - makes the tests a bit verbose unfortunately
  function testAsyncWithDeferredReturnValue () {
    var deferred = $.Deferred()

    setTimeout(function () {
      deferred.resolve()
    }, 1)

    return deferred.promise()
  }

  afterEach(function () {
    fixture.remove()
  })

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent()
      var input = fixture.querySelector('.autocomplete__input')
      input.value = 'Moose'

      // the autocomplete is complex enough that all of these
      // events are necessary to simulate user input
      // need to use triggerEvent as direct e.g. .click() doesn't work headless
      window.GOVUK.triggerEvent(input, 'focus')
      window.GOVUK.triggerEvent(input, 'keyup')
      window.GOVUK.triggerEvent(input, 'click')
      window.GOVUK.triggerEvent(input, 'blur')

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('an option is selected', function () {
      expect(select.value).toEqual('mo')
    })
  })

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent()

      var input = fixture.querySelector('.autocomplete__input')
      input.value = 'Deer'
      select.value = 'de'
      window.GOVUK.triggerEvent(select, 'change')

      input.value = ''
      window.GOVUK.triggerEvent(input, 'focus')
      window.GOVUK.triggerEvent(input, 'keyup')
      window.GOVUK.triggerEvent(input, 'click')
      window.GOVUK.triggerEvent(input, 'blur')

      testAsyncWithDeferredReturnValue().done(function () {
        done()
      })
    })

    it('the input is cleared', function () {
      expect(select.value).toEqual('')
    })
  })
})
